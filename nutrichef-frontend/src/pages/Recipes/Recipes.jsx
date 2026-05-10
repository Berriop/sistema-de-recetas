import React, { useState, useEffect } from 'react';
import { Search, Flame, Heart, AlertCircle } from 'lucide-react';
import { apiFetch } from '../../services/api';
import RecipeDetailModal from './RecipeDetailModal';
import './Recipes.css';

const Recipes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [userInventory, setUserInventory] = useState([]);
  const [favorites, setFavorites] = useState(new Set());

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [recipesData, inventoryData, favoritesData] = await Promise.all([
          apiFetch('/api/recipes'),
          userId ? apiFetch(`/inventory/${userId}`).catch(() => []) : [],
          userId ? apiFetch(`/api/favorites/${userId}`).catch(() => []) : [],
        ]);
        setRecipes(recipesData || []);
        setUserInventory(inventoryData || []);
        if (Array.isArray(favoritesData)) {
          setFavorites(new Set(favoritesData.map(f => f.id)));
        }
      } catch (err) {
        setError(err.message || 'Error cargando recetas');
        console.error('Error fetching recipes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const toggleFavorite = async (recipeId, e) => {
    e.stopPropagation();
    if (!userId) return;
    const isFav = favorites.has(recipeId);
    try {
      await apiFetch(`/api/favorites/${userId}/${recipeId}`, {
        method: isFav ? 'DELETE' : 'POST',
      });
      setFavorites(prev => {
        const next = new Set(prev);
        isFav ? next.delete(recipeId) : next.add(recipeId);
        return next;
      });
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const filtered = recipes.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="recipes-container animate-fade-in">

      <header className="page-header">
        <div>
          <h1 className="page-title">Explorar Recetas</h1>
          <p className="page-subtitle">Descubre platillos saludables para cada ocasión</p>
        </div>
        <div className="search-bar big-search glass-panel">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar recetas o ingredientes…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {loading && (
        <div className="loading-state">
          <div className="spin-loader"></div>
          <p>Cargando recetas…</p>
        </div>
      )}

      {error && (
        <div className="empty-state">
          <AlertCircle size={32} /> <p>Error: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <p className="results-count">{filtered.length} receta{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}</p>
          <div className="recipes-grid">
            {filtered.map(recipe => (
              <div
                key={recipe.id}
                className="recipe-card glass-panel"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <button
                  type="button"
                  className={`like-btn ${favorites.has(recipe.id) ? 'active' : ''}`}
                  onClick={(e) => toggleFavorite(recipe.id, e)}
                  title={favorites.has(recipe.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                >
                  <Heart size={20} fill={favorites.has(recipe.id) ? 'currentColor' : 'none'} />
                </button>

                <div
                  className="recipe-image-placeholder"
                  style={{
                    backgroundImage: `url(${recipe.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />

                <div className="recipe-content">
                  <h3>{recipe.name}</h3>
                  <p className="recipe-desc-short">
                    {(recipe.description || '').substring(0, 70)}…
                  </p>
                  <div className="recipe-meta">
                    <span><Flame size={16} /> {recipe.calories} kcal</span>
                    <span>P: {recipe.protein}g · C: {recipe.carbs}g · G: {recipe.fats}g</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-full"
                    style={{ marginTop: '1rem' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRecipe(recipe);
                    }}
                  >
                    Ver Preparación
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="empty-state">
                No encontramos recetas para &quot;{searchTerm}&quot; 🍽️
              </div>
            )}
          </div>
        </>
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

export default Recipes;
