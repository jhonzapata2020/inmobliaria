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
        className="w-full bg-[#F8F7F2] rounded-2xl border border-[#E5E1D8] flex items-center justify-center text-[#6B6A63] text-sm font-mono animate-pulse"
      >
        Cargando Mapa Territorial de Urabá & Darién...
      </div>
    );
  }

  const L = leafletRef.current;
  const defaultCenter: [number, number] = [7.9351, -76.7289];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#E5E1D8] shadow-md" style={{ height }}>
      {/* Map Control Tile Switcher */}
      <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-md border border-[#E5E1D8] rounded-xl p-1 flex gap-1 shadow-md text-xs font-mono text-[#242321]">
        <button
          onClick={() => setMapTile('streets')}
          className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
            mapTile === 'streets' ? 'bg-[#1E3A2F] text-white shadow' : 'text-[#6B6A63] hover:text-[#242321]'
          }`}
        >
          Mapa Vías
        </button>
        <button
          onClick={() => setMapTile('satellite')}
          className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
            mapTile === 'satellite' ? 'bg-[#0F766E] text-white shadow' : 'text-[#6B6A63] hover:text-[#242321]'
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

    // Custom Icon Generator with Price Pill Pins
    const createCustomIcon = (code: string, modality: string) => {
      let bg = 'bg-white text-[#1E3A2F] border-[#1E3A2F]';
      if (modality === 'Arriendo') bg = 'bg-white text-[#0F766E] border-[#0F766E]';
      if (modality === 'Custodia') bg = 'bg-[#6D4C7D] text-white border-[#6D4C7D]';

      return L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div className="${bg} font-mono font-bold text-[10px] px-2 py-1 rounded-full shadow-md border flex items-center gap-1 hover:scale-110 transition-transform">
            <span className="w-1.5 h-1.5 rounded-full ${modality === 'Custodia' ? 'bg-white' : 'bg-[#1E3A2F]'} animate-pulse"></span>
            ${code}
          </div>
        `,
        iconSize: [85, 24],
        iconAnchor: [42, 12]
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
          <div style="font-family: inherit; width: 220px; color: #242321; background: #ffffff; padding: 4px; border-radius: 8px;">
            <img src="${prop.images[0]}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 6px;" />
            <div style="margin-top: 8px;">
              <span style="font-size: 10px; font-weight: bold; background: ${prop.modality === 'Custodia' ? '#6D4C7D' : '#1E3A2F'}; color: white; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${prop.code}</span>
              <h4 style="font-size: 13px; font-weight: bold; margin: 4px 0 2px 0; color: #242321;">${prop.title}</h4>
              <p style="font-size: 11px; color: #6B6A63; margin: 0 0 6px 0;">📍 ${prop.municipality}, ${prop.department}</p>
              <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; border-top: 1px solid #E5E1D8; padding-top: 6px;">
                <span style="color: #6B6A63;">${areaText}</span>
                <span style="color: #1E3A2F;">${priceText}</span>
              </div>
              <a href="/propiedades/${prop.id}" style="display: block; text-align: center; margin-top: 8px; background: #1E3A2F; color: white; padding: 6px; font-size: 11px; font-weight: bold; border-radius: 6px; text-decoration: none;">Ver Ficha 360°</a>
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
