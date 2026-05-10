import React from 'react';
import { ArrowRight, Search, ChefHat, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section glass-panel">
        <div className="hero-content">
          <span className="badge">Tu asistente culinario personal</span>
          <h1 className="hero-title">
            Cocina delicioso con lo que tienes <span className="highlight">en casa</span>
          </h1>
          <p className="hero-description">
            NutriChef analiza tus ingredientes disponibles, preferencias dietéticas y metas 
            nutricionales para recomendarte las mejores recetas personalizadas. ¡No más desperdicio de comida!
          </p>
          <div className="hero-actions">
            <Link to="/inventory" className="btn btn-primary btn-large">
              Empezar ahora <ArrowRight size={20} />
            </Link>
            <Link to="/recipes" className="btn btn-outline btn-large">
              Explorar Recetas
            </Link>
          </div>
        </div>
        <div className="hero-image-placeholder">
          {/* A soft gradient placeholder to represent the visual appeal */}
          <div className="floating-card card-1 glass-panel">
            <span className="emoji">🥗</span>
            <div>
              <strong>Ensalada Keto</strong>
              <small>Match: 98%</small>
            </div>
          </div>
          <div className="floating-card card-2 glass-panel">
            <span className="emoji">🥩</span>
            <div>
              <strong>Bowl de Quinoa</strong>
              <small>Match: 85%</small>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">¿Cómo funciona NutriChef?</h2>
        <div className="features-grid">
          
          <div className="feature-card glass-panel">
            <div className="feature-icon bg-blue">
              <Search size={28} />
            </div>
            <h3>1. Ingresa tu Inventario</h3>
            <p>Dinos qué ingredientes tienes en tu refri y despensa. Nosotros haremos la magia para encontrar qué preparar.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon bg-green">
              <ChefHat size={28} />
            </div>
            <h3>2. Recibe Recomendaciones</h3>
            <p>Nuestro motor inteligente busca recetas deliciosas que se ajusten a tus ingredientes y dieta (keto, vegano, etc.).</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon bg-orange">
              <Navigation size={28} />
            </div>
            <h3>3. Descubre Lugares</h3>
            <p>¿No quieres cocinar? Encuentra restaurantes de comida saludable recomendados cerca de tu ubicación actual.</p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;
