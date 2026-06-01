import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { apiFetch } from '../../services/api';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const validate = () => {
    if (!formData.email.trim()) return 'El email es requerido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return 'Ingresa un email válido';
    if (!formData.password) return 'La contraseña es requerida';
    if (formData.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError(null);
    try {
      // POST /users/login — el backend compara credenciales y devuelve el usuario
      const user = await apiFetch('/users/login', {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      localStorage.setItem('userId',   user.id);
      localStorage.setItem('userName', user.name);
      window.location.href = '/inventory';
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <h2>Bienvenido de nuevo</h2>
          <p>Ingresa a tu cuenta para continuar</p>
        </div>

        {error && (
          <div className="auth-error">{error}</div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="tu@correo.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            <LogIn size={18} />
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
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
