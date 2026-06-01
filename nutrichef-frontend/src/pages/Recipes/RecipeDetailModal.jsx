import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { apiFetch } from '../../services/api';
import './RecipeDetailModal.css';

const RecipeDetailModal = ({ recipe, onClose, userInventory = [] }) => {
  const [substitutions, setSubstitutions] = useState({});
  const [loadingSubs, setLoadingSubs]     = useState({});

  if (!recipe) return null;

  // IDs de ingredientes que el usuario TIENE
  const inventoryIds = userInventory
    .map(item => item.ingredient?.id)
    .filter(Boolean);

  const handleGetSubstitution = async (ingredientId) => {
    setLoadingSubs(prev => ({ ...prev, [ingredientId]: true }));
    try {
      const data = await apiFetch(`/api/substitutions/${ingredientId}`);
      const result = data?.length > 0
        ? data[0].substituteIngredient?.name || 'Sin nombre'
        : 'No hay sustituto disponible';
      setSubstitutions(prev => ({ ...prev, [ingredientId]: result }));
    } catch {
      setSubstitutions(prev => ({ ...prev, [ingredientId]: 'Error al buscar sustituto' }));
    } finally {
      setLoadingSubs(prev => ({ ...prev, [ingredientId]: false }));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content recipe-modal glass-panel" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={24} /></button>

        {/* Imagen de cabecera */}
        <div className="modal-header-image" style={{ backgroundImage: `url(${recipe.imageUrl})` }}>
          <div className="modal-header-overlay">
            <h2>{recipe.name}</h2>
          </div>
        </div>

        <div className="modal-body">
          <p className="recipe-description">{recipe.description}</p>

          {/* Info nutricional */}
          <div className="nutritional-info">
            <div className="nutrition-item"><span>Calorías</span><strong>{recipe.calories} kcal</strong></div>
            <div className="nutrition-item"><span>Proteínas</span><strong>{recipe.protein}g</strong></div>
            <div className="nutrition-item"><span>Carbohidratos</span><strong>{recipe.carbs}g</strong></div>
            <div className="nutrition-item"><span>Grasas</span><strong>{recipe.fats}g</strong></div>
          </div>

          {/* Ingredientes */}
          <div className="ingredients-section">
            <h3>Ingredientes Necesarios</h3>
            <ul className="ingredients-list">
              {(recipe.ingredients || []).map(ri => {
                const hasIt = inventoryIds.includes(ri.ingredient?.id);
                const ingId = ri.ingredient?.id;

                return (
                  <li key={ri.id} className={`ingredient-item ${hasIt ? 'has-it' : 'missing'}`}>
                    <div className="ingredient-main">
                      {hasIt
                        ? <CheckCircle size={20} className="text-success" />
                        : <AlertCircle size={20} className="text-danger" />}
                      <span className="ingredient-name">
                        {ri.quantity} {ri.unit} de {ri.ingredient?.name || '?'}
                      </span>
                    </div>

                    {!hasIt && ingId && (
                      <div className="substitution-box">
                        {!substitutions[ingId] ? (
                          <button
                            className="btn-substitute"
                            onClick={() => handleGetSubstitution(ingId)}
                            disabled={loadingSubs[ingId]}
                          >
                            {loadingSubs[ingId]
                              ? <><RefreshCw size={14} className="spin" /> Buscando…</>
                              : 'Sugerir sustituto'}
                          </button>
                        ) : (
                          <span className="substitution-result">
                            Sustituto: <strong>{substitutions[ingId]}</strong>
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
