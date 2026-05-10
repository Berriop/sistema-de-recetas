import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import '../Recipes/Recipes.css'; // Reutilizamos estilos base de tarjetas
import './Recommendations.css';

const MOCK_RECOMMENDATIONS = [
  { 
    id: 1, 
    title: 'Ensalada de Pollo y Tomate', 
    matchScore: 95, 
    missing: 0,
    image: '🥗',
    cals: '320 kcal',
    time: '15 min',
    tag: 'Match Perfecto'
  },
  { 
    id: 2, 
    title: 'Arroz Frito con Vegetales', 
    matchScore: 82, 
    missing: 1,
    missingItems: ['Salsa de Soya'],
    image: '🍚',
    cals: '410 kcal',
    time: '25 min',
    tag: 'Falta 1 Ingrediente'
  },
];

const Recommendations = () => {
  return (
    <div className="recommendations-container animate-fade-in">
      <header className="page-header">
        <div className="ai-badge">
          <Sparkles size={24} className="sparkle-icon" />
        </div>
        <h1 className="page-title">Para Ti</h1>
        <p className="page-subtitle">
          Basado en tu inventario (Tomate, Pechuga de Pollo, Arroz Integral)
        </p>
      </header>

      <div className="recommendations-stats glass-panel">
        <div className="stat">
          <span className="stat-value">2</span>
          <span className="stat-label">Recetas Encontradas</span>
        </div>
        <div className="stat">
          <span className="stat-value text-green">95%</span>
          <span className="stat-label">Mejor Coincidencia</span>
        </div>
        <div className="stat">
          <span className="stat-value">1</span>
          <span className="stat-label">Ingrediente Faltante</span>
        </div>
      </div>

      <div className="recipes-grid">
        {MOCK_RECOMMENDATIONS.map(recipe => (
          <div key={recipe.id} className="recipe-card glass-panel recommendation-card">
            
            <div className={`match-badge ${recipe.matchScore >= 90 ? 'high-match' : 'medium-match'}`}>
              Match: {recipe.matchScore}%
            </div>

            <div className="recipe-image-placeholder">
              <span>{recipe.image}</span>
              <span className={`recipe-tag ${recipe.missing === 0 ? 'bg-success' : 'bg-warning'}`}>
                {recipe.tag}
              </span>
            </div>
            
            <div className="recipe-content">
              <h3>{recipe.title}</h3>
              
              <div className="ingredients-status">
                {recipe.missing === 0 ? (
                  <div className="status-success">
                    <CheckCircle2 size={16} /> Tienes todos los ingredientes
                  </div>
                ) : (
                  <div className="status-warning">
                    <AlertCircle size={16} /> Te falta: {recipe.missingItems.join(', ')}
                    <button className="btn-link">Ver Sustitutos</button>
                  </div>
                )}
              </div>

              <div className="recipe-meta" style={{marginTop: 'auto'}}>
                <span>{recipe.time}</span>
                <span>{recipe.cals}</span>
              </div>
              <button className="btn btn-primary btn-full" style={{marginTop: '1rem'}}>
                Ver Receta
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
