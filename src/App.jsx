import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';

// Mock Pages
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Inventory from './pages/Inventory/Inventory';
import Recipes from './pages/Recipes/Recipes';
import RecipeDetail from "./pages/Recipes/RecipeDetail";
import Recommendations from './pages/Recommendations/Recommendations';
import Restaurants from './pages/Restaurants/Restaurants';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="recipes" element={<Recipes />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="restaurants" element={<Restaurants />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
