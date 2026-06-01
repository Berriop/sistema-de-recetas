import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Star, Phone, Loader2, Search } from 'lucide-react';
import './Restaurants.css';

// ─── Clave de Google Maps ────────────────────────────────────────────────────
// IMPORTANTE: reemplaza esta clave con tu API Key de Google Maps.
// La clave necesita los servicios: Maps JavaScript API + Places API.
const GOOGLE_MAPS_API_KEY = 'SECRET_GOOGLE_MAPS_API_KEY';

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
    script.id = 'google-maps-script';
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
  const mapRef = useRef(null);
  const mapObjRef = useRef(null);
  const serviceRef = useRef(null);
  const searchInputRef = useRef(null);
  const markersRef = useRef([]); // Guarda los marcadores para borrarlos
  const userMarkerRef = useRef(null);

  const [places, setPlaces] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [searchCenter, setSearchCenter] = useState(null);
  const [selected, setSelected] = useState(null);

  const { loaded: mapsLoaded, error: mapsError } = useGoogleMaps(GOOGLE_MAPS_API_KEY);

  // 1. Obtener ubicación inicial del usuario
  useEffect(() => {
    if (!navigator.geolocation) {
      setSearchCenter({ lat: 6.2442, lng: -75.5812 }); // Medellín fallback
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setSearchCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setSearchCenter({ lat: 6.2442, lng: -75.5812 })
    );
  }, []);

  // 2. Inicializar Mapa (UNA SOLA VEZ) y Autocomplete
  useEffect(() => {
    if (!mapsLoaded || !searchCenter || !mapRef.current) return;

    if (!mapObjRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: searchCenter,
        zoom: 14,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        styles: [
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        ],
      });
      mapObjRef.current = map;
      serviceRef.current = new window.google.maps.places.PlacesService(map);

      if (searchInputRef.current) {
        const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
          fields: ['geometry', 'name'],
        });
        autocomplete.bindTo('bounds', map);

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place.geometry || !place.geometry.location) return;

          const newCenter = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          setSearchCenter(newCenter);
          map.panTo(newCenter);
          map.setZoom(14);
        });
      }
    }
  }, [mapsLoaded, searchCenter]);

  // 3. Buscar restaurantes cada vez que searchCenter cambie
  useEffect(() => {
    if (!mapsLoaded || !searchCenter || !mapObjRef.current || !serviceRef.current) return;

    setStatus('loading');
    const map = mapObjRef.current;

    // Mover mapa
    map.panTo(searchCenter);

    // Borrar marcadores anteriores
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
    if (userMarkerRef.current) userMarkerRef.current.setMap(null);

    // Marcador del centro
    userMarkerRef.current = new window.google.maps.Marker({
      position: searchCenter,
      map,
      title: 'Centro de búsqueda',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#10b981',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 3,
      },
    });

    serviceRef.current.nearbySearch(
      { location: searchCenter, radius: 5000, keyword: 'restaurante saludable', type: 'restaurant' },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const top = results.slice(0, 8); // Mostrar hasta 8
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
            markersRef.current.push(marker);
          });
        } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          setPlaces([]);
          setStatus('empty'); // Nuevo estado para cuando no hay resultados
        } else {
          console.error("Error de Google Places API:", status);
          setPlaces([]);
          setStatus('api_error'); // Nuevo estado para errores de API (ej. sin facturación)
        }
      }
    );
  }, [searchCenter, mapsLoaded]);

  // 4. Centrar mapa al seleccionar de la lista
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
        <h1 className="page-title">Encuentra Restaurantes</h1>
        <p className="page-subtitle">Lugares saludables cerca de ti o donde prefieras</p>

        {/* ── Buscador de Lugares ── */}
        <div className="places-search-bar">
          <div className="search-input-wrapper glass-panel">
            <Search size={20} className="search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar en otra ciudad o zona..."
              className="places-input"
            />
          </div>
        </div>
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
              {[1, 2, 3].map(i => <div key={i} className="place-skeleton" />)}
            </div>
          )}

          {status === 'empty' && (
            <div className="places-empty glass-panel">
              <p>No se encontraron restaurantes saludables en un radio de 5km de esta área.</p>
            </div>
          )}

          {status === 'api_error' && (
            <div className="places-empty glass-panel" style={{ borderColor: 'red' }}>
              <p style={{ color: 'red', fontWeight: 'bold' }}>Error de la API de Google Places.</p>
              <small>Esto suele suceder si la API Key no tiene permisos para Places API o si no tienes activa la facturación en Google Cloud.</small>
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
