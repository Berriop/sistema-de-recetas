import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { apiFetch } from '../../services/api';
import './RecipeDetailModal.css';

const RecipeDetailModal = ({ recipe, onClose, userInventory }) => {
  const [substitutions, setSubstitutions] = useState({});
  const [loadingSubs, setLoadingSubs] = useState({});

  if (!recipe) return null;

  const inventoryIds = userInventory ? userInventory.map(item => item.ingredient.id) : [];

  const handleGetSubstitution = async (ingredientId) => {
    setLoadingSubs(prev => ({ ...prev, [ingredientId]: true }));
    try {
      const data = await apiFetch(`/api/substitutions/${ingredientId}`);
      if (data && data.length > 0) {
        setSubstitutions(prev => ({ ...prev, [ingredientId]: data[0].substituteIngredient.name }));
      } else {
        setSubstitutions(prev => ({ ...prev, [ingredientId]: 'No hay sustituto disponible' }));
      }
    } catch (err) {
      console.error(err);
      setSubstitutions(prev => ({ ...prev, [ingredientId]: 'Error al buscar' }));
    } finally {
      setLoadingSubs(prev => ({ ...prev, [ingredientId]: false }));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content recipe-modal glass-panel" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={24} /></button>
        
        <div className="modal-header-image" style={{ backgroundImage: `url(${recipe.imageUrl})` }}>
          <div className="modal-header-overlay">
            <h2>{recipe.name}</h2>
          </div>
        </div>

        <div className="modal-body">
          <p className="recipe-description">{recipe.description}</p>
          
          <div className="nutritional-info">
            <div className="nutrition-item"><span>Calorías</span><strong>{recipe.calories} kcal</strong></div>
            <div className="nutrition-item"><span>Proteínas</span><strong>{recipe.protein}g</strong></div>
            <div className="nutrition-item"><span>Carbohidratos</span><strong>{recipe.carbs}g</strong></div>
            <div className="nutrition-item"><span>Grasas</span><strong>{recipe.fats}g</strong></div>
          </div>

          <div className="ingredients-section">
            <h3>Ingredientes Necesarios</h3>
            <ul className="ingredients-list">
              {recipe.ingredients.map(ri => {
                const hasIngredient = inventoryIds.includes(ri.ingredient.id);
                return (
                  <li key={ri.id} className={`ingredient-item ${hasIngredient ? 'has-it' : 'missing'}`}>
                    <div className="ingredient-main">
                      {hasIngredient ? <CheckCircle size={20} className="text-success" /> : <AlertCircle size={20} className="text-danger" />}
                      <span className="ingredient-name">{ri.quantity} {ri.unit} de {ri.ingredient.name}</span>
                    </div>
                    
                    {!hasIngredient && (
                      <div className="substitution-box">
                        {!substitutions[ri.ingredient.id] ? (
                          <button 
                            className="btn-substitute"
                            onClick={() => handleGetSubstitution(ri.ingredient.id)}
                            disabled={loadingSubs[ri.ingredient.id]}
                          >
                            {loadingSubs[ri.ingredient.id] ? <RefreshCw size={14} className="spin" /> : 'Sugerir sustituto'}
                          </button>
                        ) : (
                          <span className="substitution-result">
                            Sustituto: <strong>{substitutions[ri.ingredient.id]}</strong>
                          </span>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailModal;
