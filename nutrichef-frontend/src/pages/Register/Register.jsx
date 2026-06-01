import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { apiFetch } from '../../services/api';
import '../Login/Auth.css';

const Register = () => {
  const [formData, setFormData]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError]             = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading]         = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: null });
    }
    if (error) setError(null);
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim())           errs.name     = 'El nombre es requerido';
    if (!formData.email.trim())          errs.email    = 'El email es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
                                         errs.email    = 'Email inválido';
    if (!formData.password)              errs.password = 'La contraseña es requerida';
    else if (formData.password.length < 6) errs.password = 'Mínimo 6 caracteres';
    if (formData.password !== formData.confirm) errs.confirm = 'Las contraseñas no coinciden';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFieldErrors(errs); return; }

    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/users/register', {
        method: 'POST',
        body: JSON.stringify({
          name:     formData.name.trim(),
          email:    formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });
      localStorage.setItem('userId',   data.id);
      localStorage.setItem('userName', data.name);
      window.location.href = '/inventory';
    } catch (err) {
      setError(err.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ id, label, type = 'text', placeholder, icon: Icon }) => (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <div className="input-with-icon">
        <Icon size={18} className="input-icon" />
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={formData[id]}
          onChange={handleChange}
          autoComplete={type === 'password' ? 'new-password' : id}
          className={fieldErrors[id] ? 'input-error' : ''}
        />
      </div>
      {fieldErrors[id] && <span className="field-error">{fieldErrors[id]}</span>}
    </div>
  );

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <h2>Crea tu cuenta</h2>
          <p>Únete a NutriChef y mejora tu alimentación</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <Field id="name"     label="Nombre Completo"     placeholder="Juan Pérez"   icon={User} />
          <Field id="email"    label="Correo Electrónico"  placeholder="tu@correo.com" icon={Mail} type="email" />
          <Field id="password" label="Contraseña"          placeholder="Mínimo 6 caracteres" icon={Lock} type="password" />
          <Field id="confirm"  label="Confirmar Contraseña" placeholder="Repite tu contraseña" icon={Lock} type="password" />

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            <UserPlus size={18} />
            {loading ? 'Registrando...' : 'Registrarse'}
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
