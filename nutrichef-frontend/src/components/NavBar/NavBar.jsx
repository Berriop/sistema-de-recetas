import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChefHat, Home, BookOpen, User, Navigation, Search, LogOut, Sparkles } from 'lucide-react';
import './NavBar.css';

const NavBar = () => {
  const userId   = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    window.location.href = '/login';
  };

  const navLink = (to, Icon, label) => (
    <NavLink
      to={to}
      className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  );

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
          {navLink('/',               Home,      'Inicio')}
          {navLink('/inventory',      Search,    'Inventario')}
          {navLink('/recipes',        BookOpen,  'Recetas')}
          {navLink('/recommendations',Sparkles,  'Para Ti')}
          {navLink('/restaurants',    Navigation,'Lugares')}
        </nav>

        <div className="navbar-actions">
          {userId ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
              <NavLink to="/login"    className="btn btn-outline">Iniciar Sesión</NavLink>
              <NavLink to="/register" className="btn btn-primary">
                <User size={18} /><span>Registrarse</span>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
