import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { apiFetch } from '../../services/api';
import '../Login/Auth.css'; // Reuse auth styles

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const data = await apiFetch('/users/register', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if (data && data.id) {
         localStorage.setItem('userId', data.id);
         localStorage.setItem('userName', data.name);
      }
      window.location.href = '/inventory';
    } catch (err) {
      setError(err.message || 'Error al registrar usuario');
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <h2>Crea tu cuenta</h2>
          <p>Únete a NutriChef y mejora tu alimentación</p>
        </div>

        {error && <div style={{ color: '#ff4d4f', background: '#ffe5e5', padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre Completo</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input 
                type="text" 
                placeholder="Juan Pérez" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
          </div>

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
                minLength={6}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full">
            <UserPlus size={18} /> Registrarse
          </button>
        </form>

        <div className="auth-footer">
          <p>¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
