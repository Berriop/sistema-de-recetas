import React, { useState } from 'react';
import { Search, Clock, Users, Flame, Heart } from 'lucide-react';
import './Recipes.css';

const MOCK_RECIPES = [
  { id: 1, title: 'Bowl de Quinoa y Vegetales', time: '25 min', cals: '450 kcal', servings: 2, image: '🥗', tag: 'Vegano' },
  { id: 2, title: 'Salmón al Horno con Espárragos', time: '30 min', cals: '520 kcal', servings: 2, image: '🐟', tag: 'Keto' },
  { id: 3, title: 'Tacos de Pollo Saludables', time: '20 min', cals: '380 kcal', servings: 3, image: '🌮', tag: 'Alto en Proteína' },
  { id: 4, title: 'Smoothie Verde Antioxidante', time: '10 min', cals: '210 kcal', servings: 1, image: '🍹', tag: 'Detox' },
  { id: 5, title: 'Pasta Integral al Pesto', time: '35 min', cals: '480 kcal', servings: 4, image: '🍝', tag: 'Vegetariano' },
  { id: 6, title: 'Wrap de Pavo y Aguacate', time: '15 min', cals: '350 kcal', servings: 1, image: '🌯', tag: 'Bajo en Carb' },
];

const Recipes = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = MOCK_RECIPES.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="recipes-container animate-fade-in">
      <header className="page-header">
        <div>
          <h1 className="page-title">Explorar Recetas</h1>
          <p className="page-subtitle">Descubre cientos de platillos saludables para cada ocasión</p>
        </div>
        
        <div className="search-bar big-search glass-panel">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar recetas, ingredientes, dietas..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="recipes-grid">
        {filtered.map(recipe => (
          <div key={recipe.id} className="recipe-card glass-panel">
            <button className="like-btn">
              <Heart size={20} />
            </button>
            <div className="recipe-image-placeholder">
              <span>{recipe.image}</span>
              <span className="recipe-tag">{recipe.tag}</span>
            </div>
            <div className="recipe-content">
              <h3>{recipe.title}</h3>
              <div className="recipe-meta">
                <span><Clock size={16} /> {recipe.time}</span>
                <span><Flame size={16} /> {recipe.cals}</span>
                <span><Users size={16} /> {recipe.servings} pers</span>
              </div>
              <button className="btn btn-primary btn-full" style={{marginTop: '1rem'}}>
                Ver Preparación
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipes;
