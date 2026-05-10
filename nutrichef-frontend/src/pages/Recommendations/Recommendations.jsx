import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { apiFetch } from '../../services/api';
import RecipeDetailModal from '../Recipes/RecipeDetailModal';
import '../Recipes/Recipes.css';
import './Recommendations.css';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [userInventory, setUserInventory]     = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);
  const [selectedRecipe, setSelectedRecipe]   = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [recs, inv] = await Promise.all([
          apiFetch(`/api/recommendations/${userId}`),
          apiFetch(`/inventory/${userId}`).catch(() => []),
        ]);
        setRecommendations(recs || []);
        setUserInventory(inv   || []);
      } catch (err) {
        setError(err.message || 'Error al cargar recomendaciones');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const inventoryNames = userInventory
    .map(item => item.ingredient?.name)
    .filter(Boolean)
    .join(', ');

  if (loading) return (
    <div className="loading-state">
      <RefreshCw size={32} className="spin" />
      <p>Analizando tus ingredientes…</p>
    </div>
  );

  if (error) return (
    <div className="empty-state">
      <AlertCircle size={32} />
      <p>Error: {error}</p>
    </div>
  );

  return (
    <div className="recommendations-container animate-fade-in">
      <header className="page-header">
        <div className="ai-badge"><Sparkles size={24} className="sparkle-icon" /></div>
        <h1 className="page-title">Para Ti</h1>
        <p className="page-subtitle">
          Basado en tu inventario{inventoryNames ? `: ${inventoryNames}` : ' (vacío)'}
        </p>
      </header>

      <div className="recommendations-stats glass-panel">
        <div className="stat">
          <span className="stat-value">{recommendations.length}</span>
          <span className="stat-label">Recetas Encontradas</span>
        </div>
        {recommendations.length > 0 && (
          <div className="stat">
            <span className="stat-value text-green">
              {Math.round(recommendations[0].matchPercentage)}%
            </span>
            <span className="stat-label">Mejor Coincidencia</span>
          </div>
        )}
      </div>

      {recommendations.length === 0 ? (
        <div className="empty-state">
          No encontramos recetas. ¡Agrega más ingredientes a tu inventario!
        </div>
      ) : (
        <div className="recipes-grid">
          {recommendations.map(rec => {
            const recipe      = rec.recipe;
            const missingCount = rec.totalIngredientsCount - rec.matchedIngredientsCount;
            const isPerfect   = missingCount === 0;

            return (
              <div
                key={recipe.id}
                className="recipe-card glass-panel recommendation-card"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <div className={`match-badge ${rec.matchPercentage >= 90 ? 'high-match' : 'medium-match'}`}>
                  Match: {Math.round(rec.matchPercentage)}%
                </div>

                <div
                  className="recipe-image-placeholder"
                  style={{ backgroundImage: `url(${recipe.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  <span className={`recipe-tag ${isPerfect ? 'bg-success' : 'bg-warning'}`}>
                    {isPerfect ? 'Match Perfecto' : `Faltan ${missingCount} ingredientes`}
                  </span>
                </div>

                <div className="recipe-content">
                  <h3>{recipe.name}</h3>
                  <p className="recipe-desc-short">
                    {(recipe.description || '').substring(0, 60)}…
                  </p>

                  <div className="ingredients-status">
                    {isPerfect ? (
                      <div className="status-success">
                        <CheckCircle2 size={16} /> Tienes todos los ingredientes
                      </div>
                    ) : (
                      <div className="status-warning">
                        <AlertCircle size={16} /> Te faltan {missingCount} ingredientes
                      </div>
                    )}
                  </div>

                  <div className="recipe-meta" style={{ marginTop: 'auto' }}>
                    <span>{recipe.calories} kcal</span>
                    <span>P: {recipe.protein}g · C: {recipe.carbs}g · G: {recipe.fats}g</span>
                  </div>

                  <button
                    className="btn btn-primary btn-full"
                    style={{ marginTop: '1rem' }}
                    onClick={(e) => { e.stopPropagation(); setSelectedRecipe(recipe); }}
                  >
                    Ver Receta
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
