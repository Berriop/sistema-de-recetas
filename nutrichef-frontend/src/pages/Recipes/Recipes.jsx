import React, { useState, useEffect } from 'react';
import { Search, Clock, Users, Flame, Heart } from 'lucide-react';
import { apiFetch } from '../../services/api';
import RecipeDetailModal from './RecipeDetailModal';
import './Recipes.css';

const Recipes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [userInventory, setUserInventory] = useState([]);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem('userId') || 1;
        const [recipesData, inventoryData, favoritesData] = await Promise.all([
          apiFetch('/api/recipes'),
          apiFetch(`/inventory/${userId}`).catch(() => []),
          apiFetch(`/api/favorites/${userId}`).catch(() => [])
        ]);
        setRecipes(recipesData || []);
        setUserInventory(inventoryData || []);
        if (favoritesData) {
          setFavorites(new Set(favoritesData.map(f => f.id)));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleFavorite = async (recipeId, e) => {
    e.stopPropagation();
    const userId = localStorage.getItem('userId') || 1;
    const isFavorite = favorites.has(recipeId);
    
    try {
      if (isFavorite) {
        await apiFetch(`/api/favorites/${userId}/${recipeId}`, { method: 'DELETE' });
        setFavorites(prev => {
          const next = new Set(prev);
          next.delete(recipeId);
          return next;
        });
      } else {
        await apiFetch(`/api/favorites/${userId}/${recipeId}`, { method: 'POST' });
        setFavorites(prev => new Set(prev).add(recipeId));
      }
    } catch (err) {
      console.error("Error toggling favorite", err);
    }
  };

  const filtered = recipes.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

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

      {loading ? (
        <div className="loading-state">
          <div className="spin-loader"></div>
          <p>Cargando recetas deliciosas...</p>
        </div>
      ) : (
        <div className="recipes-grid">
          {filtered.map(recipe => (
            <div key={recipe.id} className="recipe-card glass-panel" onClick={() => setSelectedRecipe(recipe)}>
              <button className={`like-btn ${favorites.has(recipe.id) ? 'active' : ''}`} onClick={(e) => toggleFavorite(recipe.id, e)}>
                <Heart size={20} fill={favorites.has(recipe.id) ? "currentColor" : "none"} />
              </button>
              <div className="recipe-image-placeholder" style={{ backgroundImage: `url(${recipe.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              </div>
              <div className="recipe-content">
                <h3>{recipe.name}</h3>
                <p className="recipe-desc-short">{recipe.description.substring(0, 60)}...</p>
                <div className="recipe-meta">
                  <span><Flame size={16} /> {recipe.calories} kcal</span>
                  <span><Users size={16} /> 1 pers</span>
                </div>
                <button className="btn btn-primary btn-full" style={{marginTop: '1rem'}} onClick={(e) => { e.stopPropagation(); setSelectedRecipe(recipe); }}>
                  Ver Preparación
                </button>
              </div>
            </div>
          ))}
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

export default Recipes;
