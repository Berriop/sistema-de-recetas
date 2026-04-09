import React from 'react';
import { MapPin, Navigation, Star, Phone } from 'lucide-react';
import './Restaurants.css';

const MOCK_RESTAURANTS = [
  { id: 1, name: 'Vegan Bowl', type: 'Restaurante Vegano', rating: 4.8, distance: '1.2 km', address: 'Av. Siempre Viva 123' },
  { id: 2, title: 'Keto Delight', type: 'Comida Keto & Saludable', rating: 4.5, distance: '2.5 km', address: 'Calle Falsa 456' },
  { id: 3, title: 'Fresh Greens', type: 'Ensaladas', rating: 4.7, distance: '0.8 km', address: 'Plaza Central L-5' },
];

const Restaurants = () => {
  return (
    <div className="restaurants-container animate-fade-in">
      <header className="page-header">
        <h1 className="page-title">Lugares Cercanos</h1>
        <p className="page-subtitle">Encuentra restaurantes de comida saludable recomendados en tu área</p>
      </header>

      <div className="restaurants-layout">
        <div className="map-placeholder glass-panel">
          <div className="map-overlay">
            <MapPin size={48} className="map-marker pulse-marker" />
            <p className="map-text">Cargando mapa (Simulación API Google Maps)</p>
          </div>
        </div>

        <div className="restaurants-list">
          <h2>Recomendados cerca de ti</h2>
          
          <div className="places-list">
            {MOCK_RESTAURANTS.map(place => (
              <div key={place.id} className="place-card glass-panel">
                <div className="place-info">
                  <h3>{place.name || place.title}</h3>
                  <span className="place-type">{place.type}</span>
                  <div className="place-details">
                    <span><Star size={14} className="star-icon"/> {place.rating}</span>
                    <span>•</span>
                    <span><Navigation size={14}/> {place.distance}</span>
                  </div>
                  <p className="place-address">{place.address}</p>
                </div>
                <div className="place-actions">
                  <button className="btn-icon btn-outline" title="Llamar">
                    <Phone size={18} />
                  </button>
                  <button className="btn btn-primary">Cómo llegar</button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Restaurants;
