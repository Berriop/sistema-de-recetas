import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChefHat, Home, BookOpen, User, Navigation, Search, LogOut } from 'lucide-react';
import './NavBar.css';

const NavBar = () => {
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    window.location.href = '/login';
  };
  return (
    <header className="navbar glass-panel">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          <div className="brand-icon">
            <ChefHat size={28} color="var(--color-primary)" />
          </div>
          <span className="brand-text">NutriChef</span>
        </NavLink>

        <nav className="navbar-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <Home size={20} />
            <span>Inicio</span>
          </NavLink>
          <NavLink to="/inventory" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <Search size={20} />
            <span>Inventario</span>
          </NavLink>
          <NavLink to="/recipes" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <BookOpen size={20} />
            <span>Recetas</span>
          </NavLink>
          <NavLink to="/restaurants" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <Navigation size={20} />
            <span>Lugares</span>
          </NavLink>
        </nav>

        <div className="navbar-actions">
          {userId ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontWeight: '500', color: 'var(--color-text)' }}>
                Hola, {userName || 'Usuario'}
              </span>
              <button 
                onClick={handleLogout} 
                className="btn btn-outline" 
                style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <LogOut size={16} /> Salir
              </button>
            </div>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-outline">
                Iniciar Sesión
              </NavLink>
              <NavLink to="/register" className="btn btn-primary">
                <User size={18} />
                <span>Registrarse</span>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
