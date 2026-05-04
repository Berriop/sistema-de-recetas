import React, { useState } from 'react';
import { Plus, Trash2, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../services/api';
import './Inventory.css';

const MOCK_CATEGORIES = ['Todos', 'Vegetales', 'Proteínas', 'Lácteos', 'Carbohidratos', 'Especias'];

const Inventory = () => {
  const [ingredients, setIngredients] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', amount: '', category: 'Vegetales' });
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  const userId = localStorage.getItem('userId');

  React.useEffect(() => {
    if (userId) {
      apiFetch(`/inventory/${userId}`, { method: 'GET' })
        .then(data => {
          if (Array.isArray(data)) {
            const mapped = data.map(inv => ({ 
              id: inv.id, 
              name: inv.ingredient?.name || 'Desconocido', 
              category: inv.ingredient?.category || 'Otro', 
              amount: `${inv.quantity} ${inv.unit || 'unidades'}` 
            }));
            setIngredients(mapped);
          }
        })
        .catch(err => console.error("Error loading inventory", err));
    }
  }, [userId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.name.trim() || !userId) return;
    
    try {
      // 1. Create or Find Ingredient
      let ingResponse = await apiFetch('/ingredients', { 
        method: 'POST', 
        body: JSON.stringify({ name: newItem.name, category: newItem.category }) 
      }).catch(() => null);
      
      if (!ingResponse || ingResponse.error) {
        const allIngs = await apiFetch('/ingredients', { method: 'GET' });
        ingResponse = (allIngs || []).find(i => i.name.toLowerCase() === newItem.name.toLowerCase());
      }
      
      if (!ingResponse || !ingResponse.id) {
         console.error("Could not fetch or create ingredient");
         return;
      }

      // 2. Link to user inventory
      const parsedQty = parseFloat(newItem.amount);
      const isQtyValid = !isNaN(parsedQty) && parsedQty > 0;
      const unitStr = newItem.amount.replace(/[\d\.]/g, '').trim() || 'unidades';
      
      const invData = await apiFetch('/inventory', {
        method: 'POST',
        body: JSON.stringify({
          user: { id: parseInt(userId, 10) },
          ingredient: { id: ingResponse.id },
          quantity: isQtyValid ? parsedQty : 1.0,
          unit: unitStr
        })
      });

      if (invData) {
        setIngredients([...ingredients, { 
          id: invData.id, 
          name: ingResponse.name, 
          category: ingResponse.category, 
          amount: `${invData.quantity} ${invData.unit || 'unidades'}` 
        }]);
      }
      setNewItem({ name: '', amount: '', category: 'Vegetales' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (id) => {
    try {
      await apiFetch(`/inventory/${id}`, { method: 'DELETE' });
      setIngredients(ingredients.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting inventory item', err);
    }
  };

  const filteredIngredients = ingredients.filter(item => {
    const matchesCategory = activeCategory === 'Todos' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="inventory-container animate-fade-in">
      <header className="inventory-header">
        <div>
          <h1 className="page-title">Mi Inventario</h1>
          <p className="page-subtitle">Gestiona los ingredientes que tienes en casa</p>
        </div>
        
        <Link to="/recommendations" className="btn btn-primary">
          Buscar Recetas <ArrowRight size={18} />
        </Link>
      </header>

      <div className="inventory-content glass-panel">
        
        {/* Adds New Ingredient */}
        <div className="add-section border-b">
          <h3>Agregar Nuevo Ingrediente</h3>
          <form className="add-form" onSubmit={handleAdd}>
            <input 
              type="text" 
              placeholder="Nombre (ej. Huevos)" 
              value={newItem.name}
              onChange={e => setNewItem({...newItem, name: e.target.value})}
              className="form-input"
              required
            />
             <input 
              type="text" 
              placeholder="Cantidad y unidad (ej. 100 g, 1 L, 2 unidades)" 
              value={newItem.amount}
              onChange={e => setNewItem({...newItem, amount: e.target.value})}
              className="form-input"
            />
            <select 
              value={newItem.category}
              onChange={e => setNewItem({...newItem, category: e.target.value})}
              className="form-select"
            >
              {MOCK_CATEGORIES.filter(c => c !== 'Todos').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button type="submit" className="btn btn-primary">
              <Plus size={18} /> Agregar
            </button>
          </form>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="categories">
            {MOCK_CATEGORIES.map(cat => (
              <button 
                key={cat} 
                className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar en inventario..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Ingredient List */}
        <div className="ingredients-grid">
          {filteredIngredients.length > 0 ? (
            filteredIngredients.map(item => (
              <div key={item.id} className="ingredient-card">
                <div className="ingredient-info">
                  <strong>{item.name}</strong>
                  <span className="ingredient-amount">{item.amount || 'Cantidad no especificada'}</span>
                  <span className="badge badge-outline">{item.category}</span>
                </div>
                <button 
                  className="btn-icon btn-danger" 
                  onClick={() => handleRemove(item.id)}
                  title="Eliminar"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No se encontraron ingredientes 🥕</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Inventory;
