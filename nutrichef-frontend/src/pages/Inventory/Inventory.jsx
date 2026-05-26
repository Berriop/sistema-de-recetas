import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Search, ArrowRight, AlertCircle, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../services/api';
import './Inventory.css';

/**
 * Lista de unidades DEBE coincidir exactamente con AllowedUnits.java
 * en el backend (única fuente de verdad; duplicada aquí para el MVP).
 */
const ALLOWED_UNITS = [
  'unidad', 'unidades', 'taza', 'tazas',
  'cda', 'cdta', 'pieza', 'piezas',
  'porcion', 'porciones', 'rebanada', 'rebanadas',
  'manojo', 'diente', 'dientes',
];

const CATEGORIES = ['Todos', 'Proteína', 'Carbohidrato', 'Vegetal', 'Lácteo',
                    'Lácteo/Vegano', 'Grasa', 'Fruta', 'Otro'];

/** Lista predeterminada de ingredientes comunes */
const PRESET_INGREDIENTS = [
  // Proteínas
  { name: 'Pechuga de pollo',   category: 'Proteína' },
  { name: 'Muslo de pollo',     category: 'Proteína' },
  { name: 'Carne molida',       category: 'Proteína' },
  { name: 'Lomo de res',        category: 'Proteína' },
  { name: 'Filete de tilapia',  category: 'Proteína' },
  { name: 'Atún en lata',       category: 'Proteína' },
  { name: 'Salmón',             category: 'Proteína' },
  { name: 'Huevo',              category: 'Proteína' },
  { name: 'Frijoles negros',    category: 'Proteína' },
  { name: 'Lentejas',           category: 'Proteína' },
  { name: 'Garbanzo',           category: 'Proteína' },
  { name: 'Tofu',               category: 'Proteína' },
  // Carbohidratos
  { name: 'Arroz',              category: 'Carbohidrato' },
  { name: 'Pasta',              category: 'Carbohidrato' },
  { name: 'Pan integral',       category: 'Carbohidrato' },
  { name: 'Avena',              category: 'Carbohidrato' },
  { name: 'Papa',               category: 'Carbohidrato' },
  { name: 'Yuca',               category: 'Carbohidrato' },
  { name: 'Plátano maduro',     category: 'Carbohidrato' },
  { name: 'Quinoa',             category: 'Carbohidrato' },
  // Vegetales
  { name: 'Tomate',             category: 'Vegetal' },
  { name: 'Cebolla',            category: 'Vegetal' },
  { name: 'Ajo',                category: 'Vegetal' },
  { name: 'Zanahoria',          category: 'Vegetal' },
  { name: 'Espinaca',           category: 'Vegetal' },
  { name: 'Lechuga',            category: 'Vegetal' },
  { name: 'Brócoli',            category: 'Vegetal' },
  { name: 'Pimentón rojo',      category: 'Vegetal' },
  { name: 'Pimentón verde',     category: 'Vegetal' },
  { name: 'Apio',               category: 'Vegetal' },
  { name: 'Pepino',             category: 'Vegetal' },
  { name: 'Calabacín',          category: 'Vegetal' },
  { name: 'Cebolla larga',      category: 'Vegetal' },
  { name: 'Cilantro',           category: 'Vegetal' },
  // Lácteos
  { name: 'Leche',              category: 'Lácteo' },
  { name: 'Queso blanco',       category: 'Lácteo' },
  { name: 'Yogurt griego',      category: 'Lácteo' },
  { name: 'Crema de leche',     category: 'Lácteo' },
  { name: 'Mantequilla',        category: 'Lácteo' },
  { name: 'Leche de almendras', category: 'Lácteo/Vegano' },
  { name: 'Leche de coco',      category: 'Lácteo/Vegano' },
  // Grasas
  { name: 'Aceite de oliva',    category: 'Grasa' },
  { name: 'Aceite de girasol',  category: 'Grasa' },
  { name: 'Aguacate',           category: 'Grasa' },
  { name: 'Maní',               category: 'Grasa' },
  // Frutas
  { name: 'Banana',             category: 'Fruta' },
  { name: 'Manzana',            category: 'Fruta' },
  { name: 'Naranja',            category: 'Fruta' },
  { name: 'Fresa',              category: 'Fruta' },
  { name: 'Mango',              category: 'Fruta' },
  { name: 'Piña',               category: 'Fruta' },
  { name: 'Papaya',             category: 'Fruta' },
  { name: 'Limón',              category: 'Fruta' },
];

const EMPTY_FORM = { name: '', quantity: '', unit: 'unidades', category: 'Vegetal' };

// ── Componente de selección de ingrediente con búsqueda ──────────────────────
const IngredientSelector = ({ value, onChange }) => {
  const [query, setQuery]   = useState(value);
  const [open, setOpen]     = useState(false);
  const ref                 = useRef(null);

  const filtered = PRESET_INGREDIENTS.filter(i =>
    i.name.toLowerCase().includes(query.toLowerCase())
  );

  // Cerrar al click fuera
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = (ingredient) => {
    setQuery(ingredient.name);
    setOpen(false);
    onChange(ingredient);
  };

  return (
    <div className="ingredient-selector" ref={ref}>
      <div className="ingredient-selector__input-wrap">
        <Search size={16} className="ingredient-selector__icon" />
        <input
          type="text"
          className="form-input ingredient-selector__input"
          placeholder="Buscar ingrediente…"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); onChange({ name: e.target.value, category: null }); }}
          onFocus={() => setOpen(true)}
          autoComplete="off"
        />
        <ChevronDown size={16} className={`ingredient-selector__chevron ${open ? 'open' : ''}`} onClick={() => setOpen(o => !o)} />
      </div>

      {open && (
        <div className="ingredient-selector__dropdown">
          {filtered.length === 0 ? (
            <div className="ingredient-selector__empty">
              <span>"{query}" — se creará como nuevo ingrediente</span>
            </div>
          ) : (
            filtered.map(ing => (
              <button
                key={ing.name}
                type="button"
                className="ingredient-selector__option"
                onClick={() => select(ing)}
              >
                <span className="ingredient-selector__name">{ing.name}</span>
                <span className="ingredient-selector__cat">{ing.category}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};



const Inventory = () => {
  const [ingredients, setIngredients] = useState([]);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [activeCategory, setActive]   = useState('Todos');
  const [searchQuery, setSearch]      = useState('');
  const [formError, setFormError]     = useState(null);
  const [loading, setLoading]         = useState(false);

  const userId = localStorage.getItem('userId');

  // ── Cargar inventario ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    apiFetch(`/inventory/${userId}`)
      .then(data => {
        if (Array.isArray(data)) {
          setIngredients(data.map(inv => ({
            id:       inv.id,
            name:     inv.ingredient?.name     || 'Desconocido',
            category: inv.ingredient?.category || 'Otro',
            quantity: inv.quantity,
            unit:     inv.unit || 'unidades',
            ingredientId: inv.ingredient?.id,
          })));
        }
      })
      .catch(err => console.error('Error cargando inventario:', err));
  }, [userId]);

  // ── Agregar ingrediente ────────────────────────────────────────────────────
  const handleAdd = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!userId) { setFormError('Debes iniciar sesión'); return; }
    if (!form.name.trim()) { setFormError('El nombre es requerido'); return; }

    const qty = parseFloat(form.quantity);
    if (isNaN(qty) || qty < 1) { setFormError('La cantidad debe ser un número ≥ 1'); return; }

    setLoading(true);
    try {
      // 1. Obtener o crear el ingrediente
      let ingredient = null;
      try {
        ingredient = await apiFetch('/ingredients', {
          method: 'POST',
          body: JSON.stringify({ name: form.name.trim(), category: form.category }),
        });
      } catch (_) {
        // Ya existe — buscar por nombre
        const all = await apiFetch('/ingredients');
        ingredient = (all || []).find(
          i => i.name.toLowerCase() === form.name.trim().toLowerCase()
        );
      }

      if (!ingredient?.id) {
        setFormError('No se pudo obtener el ingrediente');
        return;
      }

      // 2. Agregar al inventario
      const saved = await apiFetch('/inventory', {
        method: 'POST',
        body: JSON.stringify({
          user:       { id: parseInt(userId, 10) },
          ingredient: { id: ingredient.id },
          quantity:   qty,
          unit:       form.unit,
        }),
      });

      // Si ya existía, actualizar en lugar de duplicar en UI
      setIngredients(prev => {
        const idx = prev.findIndex(i => i.ingredientId === ingredient.id);
        const updated = {
          id: saved.id, name: ingredient.name, category: ingredient.category,
          quantity: saved.quantity, unit: saved.unit || form.unit,
          ingredientId: ingredient.id,
        };
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = updated;
          return copy;
        }
        return [...prev, updated];
      });

      setForm(EMPTY_FORM);
    } catch (err) {
      setFormError(err.message || 'Error al agregar ingrediente');
    } finally {
      setLoading(false);
    }
  };

  // ── Eliminar ───────────────────────────────────────────────────────────────
  const handleRemove = async (id) => {
    try {
      await apiFetch(`/inventory/${id}`, { method: 'DELETE' });
      setIngredients(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error('Error eliminando:', err);
    }
  };

  // ── Filtros ────────────────────────────────────────────────────────────────
  const filtered = ingredients.filter(item => {
    const matchCat    = activeCategory === 'Todos' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
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

        {/* ── Formulario ── */}
        <div className="add-section border-b">
          <h3>Agregar Ingrediente</h3>

          {formError && (
            <div className="form-alert">
              <AlertCircle size={16} /> {formError}
            </div>
          )}

          <form className="add-form" onSubmit={handleAdd}>
            {/* Nombre — selector con lista predeterminada */}
            <IngredientSelector
              value={form.name}
              onChange={ing => setForm(prev => ({
                ...prev,
                name: ing.name,
                category: ing.category || prev.category,
              }))}
            />

            {/* Cantidad numérica */}
            <input
              type="number"
              placeholder="Cantidad (ej. 3)"
              min="1"
              step="0.5"
              value={form.quantity}
              onChange={e => setForm({ ...form, quantity: e.target.value })}
              className="form-input form-input--short"
              required
            />

            {/* Unidad — SELECT cerrado */}
            <select
              value={form.unit}
              onChange={e => setForm({ ...form, unit: e.target.value })}
              className="form-select"
            >
              {ALLOWED_UNITS.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>

            {/* Categoría */}
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="form-select"
            >
              {CATEGORIES.filter(c => c !== 'Todos').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Plus size={18} /> {loading ? 'Agregando…' : 'Agregar'}
            </button>
          </form>
        </div>

        {/* ── Filtros ── */}
        <div className="filters-section">
          <div className="categories">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActive(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar en inventario…"
              value={searchQuery}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── Lista ── */}
        <div className="ingredients-grid">
          {filtered.length > 0 ? (
            filtered.map(item => (
              <div key={item.id} className="ingredient-card">
                <div className="ingredient-info">
                  <strong>{item.name}</strong>
                  <span className="ingredient-amount">
                    {item.quantity} {item.unit}
                  </span>
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
