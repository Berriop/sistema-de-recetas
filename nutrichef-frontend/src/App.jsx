import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Inventory from './pages/Inventory/Inventory';
import Recipes from './pages/Recipes/Recipes';
import RecipeDetail from './pages/Recipes/RecipeDetail';
import Recommendations from './pages/Recommendations/Recommendations';
import Restaurants from './pages/Restaurants/Restaurants';

/** Redirige a /login si el usuario no está autenticado */
const PrivateRoute = ({ children }) => {
  const userId = localStorage.getItem('userId');
  return userId ? children : <Navigate to="/login" replace />;
};

/** Redirige al inventario si ya está logueado (para login/register) */
const PublicOnlyRoute = ({ children }) => {
  const userId = localStorage.getItem('userId');
  return userId ? <Navigate to="/inventory" replace /> : children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

          <Route path="inventory" element={<PrivateRoute><Inventory /></PrivateRoute>} />
          <Route path="recipes" element={<PrivateRoute><Recipes /></PrivateRoute>} />
          <Route path="recipes/:id" element={<PrivateRoute><RecipeDetail /></PrivateRoute>} />
          <Route path="recommendations" element={<PrivateRoute><Recommendations /></PrivateRoute>} />
          <Route path="restaurants" element={<PrivateRoute><Restaurants /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
