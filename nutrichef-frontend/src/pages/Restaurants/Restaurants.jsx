import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Star, Phone, Loader2 } from 'lucide-react';
import './Restaurants.css';

// ─── Clave de Google Maps ────────────────────────────────────────────────────
// IMPORTANTE: reemplaza esta clave con tu API Key de Google Maps.
// La clave necesita los servicios: Maps JavaScript API + Places API.
const GOOGLE_MAPS_API_KEY = 'AIzaSyCvJx54_uzlDZWwnLwjMHJ9Acv8b142nlM';

// Categorías que se buscan en Google Places
const SEARCH_QUERY = 'restaurante saludable';

// ─── Hook para cargar el SDK de Google Maps ──────────────────────────────────
function useGoogleMaps(apiKey) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Si ya está cargado
    if (window.google?.maps) { setLoaded(true); return; }

    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => setLoaded(true));
      return;
    }

    const script = document.createElement('script');
    script.id  = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = () => setLoaded(true);
    script.onerror = () => setError('No se pudo cargar Google Maps. Verifica tu API Key.');
    document.head.appendChild(script);
  }, [apiKey]);

  return { loaded, error };
}

// ─── Componente principal ────────────────────────────────────────────────────
const Restaurants = () => {
  const mapRef      = useRef(null);
  const mapObjRef   = useRef(null);
  const serviceRef  = useRef(null);
  const [places, setPlaces]       = useState([]);
  const [status, setStatus]       = useState('loading'); // loading | ready | error
  const [userPos, setUserPos]     = useState(null);
  const [selected, setSelected]   = useState(null);

  const { loaded: mapsLoaded, error: mapsError } = useGoogleMaps(GOOGLE_MAPS_API_KEY);

  // 1. Obtener ubicación del usuario
  useEffect(() => {
    if (!navigator.geolocation) {
      // Fallback: Medellín, Colombia
      setUserPos({ lat: 6.2442, lng: -75.5812 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      ()    => setUserPos({ lat: 6.2442, lng: -75.5812 }) // fallback Medellín
    );
  }, []);

  // 2. Inicializar mapa y buscar lugares cuando Maps esté listo y tengamos posición
  useEffect(() => {
    if (!mapsLoaded || !userPos || !mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: userPos,
      zoom: 14,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      styles: [
        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
      ],
    });
    mapObjRef.current = map;

    // Marcador del usuario
    new window.google.maps.Marker({
      position: userPos,
      map,
      title: 'Tu ubicación',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#10b981',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 3,
      },
    });

    // Places Nearby Search
    const service = new window.google.maps.places.PlacesService(map);
    serviceRef.current = service;

    service.nearbySearch(
      { location: userPos, radius: 2000, keyword: SEARCH_QUERY, type: 'restaurant' },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const top = results.slice(0, 5);
          setPlaces(top);
          setStatus('ready');

          top.forEach((place, i) => {
            const marker = new window.google.maps.Marker({
              position: place.geometry.location,
              map,
              title: place.name,
              label: { text: String(i + 1), color: 'white', fontWeight: 'bold' },
              icon: {
                path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                scale: 7,
                fillColor: '#059669',
                fillOpacity: 1,
                strokeColor: '#fff',
                strokeWeight: 2,
              },
            });
            marker.addListener('click', () => setSelected(place));
          });
        } else {
          setStatus('error');
        }
      }
    );
  }, [mapsLoaded, userPos]);

  // Centrar mapa al seleccionar
  useEffect(() => {
    if (selected && mapObjRef.current) {
      mapObjRef.current.panTo(selected.geometry.location);
      mapObjRef.current.setZoom(16);
    }
  }, [selected]);

  const openInMaps = (place) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}`;
    window.open(url, '_blank');
  };

  if (mapsError) {
    return (
      <div className="restaurants-container animate-fade-in">
        <div className="map-error glass-panel">
          <MapPin size={40} className="map-marker" />
          <p>{mapsError}</p>
          <small>Agrega una API Key válida en Restaurants.jsx</small>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurants-container animate-fade-in">
      <header className="page-header">
        <h1 className="page-title">Lugares Cercanos</h1>
        <p className="page-subtitle">Restaurantes de comida saludable cerca de ti</p>
      </header>

      <div className="restaurants-layout">
        {/* ── Mapa real ── */}
        <div className="map-wrapper glass-panel">
          <div ref={mapRef} className="google-map" />
          {status === 'loading' && (
            <div className="map-loading">
              <Loader2 size={32} className="spin" />
              <p>Cargando mapa…</p>
            </div>
          )}
        </div>

        {/* ── Lista de lugares ── */}
        <div className="restaurants-list">
          <h2>Recomendados cerca de ti</h2>

          {status === 'loading' && (
            <div className="places-loading">
              {[1,2,3].map(i => <div key={i} className="place-skeleton" />)}
            </div>
          )}

          {status === 'error' && (
            <div className="places-empty glass-panel">
              <p>No se encontraron restaurantes saludables en tu área.</p>
            </div>
          )}

          {status === 'ready' && (
            <div className="places-list">
              {places.map((place, i) => (
                <div
                  key={place.place_id}
                  className={`place-card glass-panel ${selected?.place_id === place.place_id ? 'selected' : ''}`}
                  onClick={() => setSelected(place)}
                >
                  <div className="place-number">{i + 1}</div>
                  <div className="place-info">
                    <h3>{place.name}</h3>
                    <span className="place-type">
                      {place.types?.includes('restaurant') ? 'Restaurante' : place.types?.[0] || 'Lugar'}
                    </span>
                    <div className="place-details">
                      {place.rating && (
                        <span><Star size={14} className="star-icon" /> {place.rating}</span>
                      )}
                      {place.opening_hours && (
                        <span className={place.opening_hours.open_now ? 'open-now' : 'closed-now'}>
                          {place.opening_hours.open_now ? '● Abierto' : '● Cerrado'}
                        </span>
                      )}
                    </div>
                    <p className="place-address">{place.vicinity}</p>
                  </div>
                  <div className="place-actions">
                    <button
                      className="btn btn-primary"
                      onClick={(e) => { e.stopPropagation(); openInMaps(place); }}
                    >
                      <Navigation size={16} /> Cómo llegar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restaurants;
