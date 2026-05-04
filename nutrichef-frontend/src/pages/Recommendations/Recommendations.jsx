import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiFetch } from '../../services/api';
import RecipeDetailModal from '../Recipes/RecipeDetailModal';
import '../Recipes/Recipes.css'; 
import './Recommendations.css';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [userInventory, setUserInventory] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem('userId') || 1;
        const [recsData, inventoryData] = await Promise.all([
          apiFetch(`/api/recommendations/${userId}`),
          apiFetch(`/inventory/${userId}`).catch(() => [])
        ]);
        setRecommendations(recsData || []);
        setUserInventory(inventoryData || []);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const inventoryNames = userInventory.map(item => item.ingredient.name).join(', ');

  return (
    <div className="recommendations-container animate-fade-in">
      <header className="page-header">
        <div className="ai-badge">
          <Sparkles size={24} className="sparkle-icon" />
        </div>
        <h1 className="page-title">Para Ti</h1>
        <p className="page-subtitle">
          Basado en tu inventario {inventoryNames ? `(${inventoryNames})` : '(vacio)'}
        </p>
      </header>

      <div className="recommendations-stats glass-panel">
        <div className="stat">
          <span className="stat-value">{recommendations.length}</span>
          <span className="stat-label">Recetas Encontradas</span>
        </div>
        {recommendations.length > 0 && (
          <div className="stat">
            <span className="stat-value text-green">{Math.round(recommendations[0].matchPercentage)}%</span>
            <span className="stat-label">Mejor Coincidencia</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spin-loader"></div>
          <p>La IA está analizando tus ingredientes...</p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="empty-state">
          No encontramos recetas para ti. ¡Prueba agregando más ingredientes a tu inventario!
        </div>
      ) : (
        <div className="recipes-grid">
          {recommendations.map(rec => {
            const recipe = rec.recipe;
            const missingCount = rec.totalIngredientsCount - rec.matchedIngredientsCount;
            const isPerfectMatch = missingCount === 0;

            return (
              <div key={recipe.id} className="recipe-card glass-panel recommendation-card" onClick={() => setSelectedRecipe(recipe)}>
                
                <div className={`match-badge ${rec.matchPercentage >= 90 ? 'high-match' : 'medium-match'}`}>
                  Match: {Math.round(rec.matchPercentage)}%
                </div>

                <div className="recipe-image-placeholder" style={{ backgroundImage: `url(${recipe.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <span className={`recipe-tag ${isPerfectMatch ? 'bg-success' : 'bg-warning'}`}>
                    {isPerfectMatch ? 'Match Perfecto' : `Faltan ${missingCount} Ingredientes`}
                  </span>
                </div>
                
                <div className="recipe-content">
                  <h3>{recipe.name}</h3>
                  <p className="recipe-desc-short">{recipe.description.substring(0, 60)}...</p>
                  
                  <div className="ingredients-status">
                    {isPerfectMatch ? (
                      <div className="status-success">
                        <CheckCircle2 size={16} /> Tienes todos los ingredientes
                      </div>
                    ) : (
                      <div className="status-warning">
                        <AlertCircle size={16} /> Te faltan {missingCount} ingredientes
                        <button className="btn-link" onClick={(e) => { e.stopPropagation(); setSelectedRecipe(recipe); }}>Ver Detalles y Sustitutos</button>
                      </div>
                    )}
                  </div>

                  <div className="recipe-meta" style={{marginTop: 'auto'}}>
                    <span>{recipe.calories} kcal</span>
                    <span>1 pers</span>
                  </div>
                  <button className="btn btn-primary btn-full" style={{marginTop: '1rem'}} onClick={() => setSelectedRecipe(recipe)}>
                    Preparar Ahora
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedRecipe && (
        <RecipeDetailModal 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
          userInventory={userInventory} 
        />
      )}
    </div>
  );
};

export default Recommendations;
