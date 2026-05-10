import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { apiFetch } from '../../services/api';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      // Prototype Auth: we fetch all users and match credentials
      const users = await apiFetch('/users', { method: 'GET' });
      const user = (users || []).find(u => u.email === formData.email && u.password === formData.password);
      
      if (user) {
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userName', user.name);
        // Force fully reload or event dispatch if we want navbar to catch it instantly, but navigate works if NavBar re-renders
        // A simple window.location.href forces react application to remount with new localStorage state
        window.location.href = '/inventory';
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <h2>Bienvenido de nuevo</h2>
          <p>Ingresa a tu cuenta para continuar</p>
        </div>

        {error && <div style={{ color: '#ff4d4f', background: '#ffe5e5', padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                placeholder="tu@correo.com" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
            <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit" className="btn btn-primary btn-full">
            <LogIn size={18} /> Iniciar Sesión
          </button>
        </form>

        <div className="auth-footer">
          <p>¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
