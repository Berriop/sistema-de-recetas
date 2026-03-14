import React, { useState } from 'react';
import { Plus, Trash2, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Inventory.css';

const MOCK_CATEGORIES = ['Todos', 'Vegetales', 'Proteínas', 'Lácteos', 'Carbohidratos', 'Especias'];

const Inventory = () => {
  const [ingredients, setIngredients] = useState([
    { id: 1, name: 'Tomate', category: 'Vegetales', amount: '3 unidades' },
    { id: 2, name: 'Pechuga de Pollo', category: 'Proteínas', amount: '500g' },
    { id: 3, name: 'Arroz Integral', category: 'Carbohidratos', amount: '1kg' },
  ]);
  
  const [newItem, setNewItem] = useState({ name: '', amount: '', category: 'Vegetales' });
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;
    
    setIngredients([
      ...ingredients,
      { id: Date.now(), ...newItem }
    ]);
    setNewItem({ name: '', amount: '', category: 'Vegetales' });
  };

  const handleRemove = (id) => {
    setIngredients(ingredients.filter(item => item.id !== id));
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
              placeholder="Cantidad (ej. 1 docena)" 
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
