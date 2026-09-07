'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Property } from '../../types/property';
import { formatCurrency, formatArea } from '../../lib/formatters';

interface PropertyMapProps {
  properties: Property[];
  selectedPropertyId?: string;
  onSelectProperty?: (id: string) => void;
  height?: string;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  selectedPropertyId,
  onSelectProperty,
  height = '600px'
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [mapTile, setMapTile] = useState<'streets' | 'satellite'>('streets');
  const leafletRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
    // Load Leaflet safely only on client mount
    if (typeof window !== 'undefined') {
      leafletRef.current = require('leaflet');
    }
  }, []);

  if (!isMounted || !leafletRef.current) {
    return (
      <div 
        style={{ height }}
        className="w-full bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center text-slate-500 text-sm font-mono animate-pulse"
      >
        Cargando Mapa Territorial de Urabá & Darién...
      </div>
    );
  }

  const L = leafletRef.current;
  const defaultCenter: [number, number] = [7.9351, -76.7289];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl" style={{ height }}>
      {/* Map Control Tile Switcher */}
      <div className="absolute top-4 right-4 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-1 flex gap-1 shadow-lg text-xs font-mono">
        <button
          onClick={() => setMapTile('streets')}
          className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
            mapTile === 'streets' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Mapa Vías
        </button>
        <button
          onClick={() => setMapTile('satellite')}
          className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
            mapTile === 'satellite' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Satelital
        </button>
      </div>

      {/* Leaflet Map Container */}
      <div className="w-full h-full">
        <LeafletMapInner 
          L={L} 
          properties={properties} 
          defaultCenter={defaultCenter}
          mapTile={mapTile}
          onSelectProperty={onSelectProperty}
        />
      </div>
    </div>
  );
};

// Sub-component for client-side Leaflet instance initialization
const LeafletMapInner: React.FC<{
  L: any;
  properties: Property[];
  defaultCenter: [number, number];
  mapTile: 'streets' | 'satellite';
  onSelectProperty?: (id: string) => void;
}> = ({ L, properties, defaultCenter, mapTile, onSelectProperty }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || !L) return;

    // Create map if not created
    if (!mapInstanceRef.current) {
      const map = L.map(containerRef.current, {
        center: defaultCenter,
        zoom: 9,
        zoomControl: true
      });

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Remove existing tile layers
    map.eachLayer((layer: any) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    // Add Tile Layer
    if (mapTile === 'streets') {
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap',
        maxZoom: 19
      }).addTo(map);
    } else {
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri',
        maxZoom: 18
      }).addTo(map);
    }

    // Clear old markers
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Custom Icon Generator
    const createCustomIcon = (code: string, modality: string) => {
      let bg = 'bg-emerald-600';
      if (modality === 'Arriendo') bg = 'bg-slate-800';
      if (modality === 'Custodia') bg = 'bg-purple-700';

      return L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div className="${bg} text-white font-mono font-bold text-[10px] px-2 py-1 rounded-md shadow-xl border border-white/40 flex items-center gap-1 hover:scale-110 transition-transform">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            ${code}
          </div>
        `,
        iconSize: [80, 24],
        iconAnchor: [40, 12]
      });
    };

    // Add markers for properties
    properties.forEach((prop) => {
      if (prop.latitude && prop.longitude) {
        const marker = L.marker([prop.latitude, prop.longitude], {
          icon: createCustomIcon(prop.code, prop.modality)
        }).addTo(map);

        const priceText = prop.modality === 'Venta'
          ? formatCurrency(prop.price)
          : prop.modality === 'Arriendo'
            ? `${formatCurrency(prop.monthlyRent)}/mes`
            : prop.modality === 'Inversión'
              ? formatCurrency(prop.price || prop.estimatedValue)
              : 'Regulada SAE';
        const areaText = formatArea(prop.areaTotalHa, prop.areaTotalM2);

        const popupContent = `
          <div style="font-family: inherit; width: 220px; color: #0f172a;">
            <img src="${prop.images[0]}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px;" />
            <div style="margin-top: 8px;">
              <span style="font-size: 10px; font-weight: bold; background: #059669; color: white; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${prop.code}</span>
              <h4 style="font-size: 13px; font-weight: bold; margin: 4px 0 2px 0; color: #0f172a;">${prop.title}</h4>
              <p style="font-size: 11px; color: #64748b; margin: 0 0 6px 0;">📍 ${prop.municipality}, ${prop.department}</p>
              <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; border-top: 1px solid #e2e8f0; pt: 4px;">
                <span>${areaText}</span>
                <span style="color: #059669;">${priceText}</span>
              </div>
              <a href="/propiedades/${prop.id}" style="display: block; text-align: center; margin-top: 8px; background: #0f172a; color: white; padding: 6px; font-size: 11px; font-weight: bold; border-radius: 6px; text-decoration: none;">Ver Ficha 360°</a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('click', () => {
          if (onSelectProperty) onSelectProperty(prop.id);
        });
      }
    });

  }, [L, properties, defaultCenter, mapTile, onSelectProperty]);

  return <div ref={containerRef} className="w-full h-full" />;
};
