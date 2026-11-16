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
  const validProps = properties.filter((p) => Boolean(p.latitude && p.longitude));
  const firstProp = validProps[0];
  const defaultCenter: [number, number] = firstProp
    ? [firstProp.latitude, firstProp.longitude]
    : [7.9351, -76.7289];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#E5E1D8] shadow-md" style={{ height }}>
      {/* Coordinate / Region Pill */}
      {firstProp && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-md border border-[#E5E1D8] rounded-xl px-3 py-1.5 shadow-md text-[11px] font-mono text-[#242321] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0" />
          {validProps.length === 1 ? (
            <span>
              <strong className="text-[#1E3A2F]">{firstProp.municipality}, {firstProp.department}</strong>
              {' · '}
              {firstProp.latitude.toFixed(4)}° N, {Math.abs(firstProp.longitude).toFixed(4)}° W
            </span>
          ) : (
            <span>
              <strong className="text-[#1E3A2F]">{validProps.length} activos georreferenciados</strong>
              {' · '}
              Centro aprox. {firstProp.latitude.toFixed(2)}°, {firstProp.longitude.toFixed(2)}°
            </span>
          )}
        </div>
      )}

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
  const lastBoundsKeyRef = useRef<string>('');

  useEffect(() => {
    if (!containerRef.current || !L) return;

    // Create map if not created
    if (!mapInstanceRef.current) {
      const map = L.map(containerRef.current, {
        center: defaultCenter,
        zoom: properties.length === 1 ? 13 : 9,
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

    // Add Tile Layer (100% free, no API key required)
    if (mapTile === 'streets') {
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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

    // Custom Icon Generator with Price Pill Pins (inline styles so Tailwind purge never strips them)
    const createCustomIcon = (code: string, modality: string) => {
      const isCustody = modality === 'Custodia SAE';
      const isRent = modality === 'Arriendo';
      const bgColor = isCustody ? '#6D4C7D' : '#FFFFFF';
      const textColor = isCustody ? '#FFFFFF' : isRent ? '#0F766E' : '#1E3A2F';
      const borderColor = isCustody ? '#6D4C7D' : isRent ? '#0F766E' : '#1E3A2F';
      const dotColor = isCustody ? '#FFFFFF' : '#10B981';

      return L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="background:${bgColor};color:${textColor};border:1.5px solid ${borderColor};font-family:monospace;font-weight:700;font-size:10px;padding:3px 8px;border-radius:9999px;box-shadow:0 3px 8px rgba(0,0,0,0.22);display:inline-flex;align-items:center;gap:5px;white-space:nowrap;">
            <span style="width:7px;height:7px;border-radius:9999px;background:${dotColor};display:inline-block;flex-shrink:0;"></span>
            <span>${code}</span>
          </div>
        `,
        iconSize: [110, 24],
        iconAnchor: [55, 12]
      });
    };

    // Add markers for properties
    properties.forEach((prop) => {
      if (prop.latitude && prop.longitude) {
        const marker = L.marker([prop.latitude, prop.longitude], {
          icon: createCustomIcon(prop.code, prop.modality)
        }).addTo(map);

        const priceText = prop.modality === 'Venta'
          ? formatCurrency(prop.salePriceCop)
          : prop.modality === 'Arriendo'
            ? `${formatCurrency(prop.monthlyRentCop)}/mes`
            : prop.modality === 'Inversión'
              ? formatCurrency(prop.salePriceCop || prop.estimatedValueCop)
              : 'Regulada SAE';
        const areaText = formatArea(prop.landAreaHa, prop.landAreaM2);
        const detailUrl = `/propiedades/${prop.slug || prop.id}`;
        const mainImage = prop.featuredImage || prop.images?.[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef';

        const popupContent = `
          <div style="font-family: inherit; width: 220px; color: #242321; background: #ffffff; padding: 4px; border-radius: 8px;">
            <img src="${mainImage}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 6px;" />
            <div style="margin-top: 8px;">
              <span style="font-size: 10px; font-weight: bold; background: ${prop.modality === 'Custodia SAE' ? '#6D4C7D' : '#1E3A2F'}; color: white; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${prop.code}</span>
              <h4 style="font-size: 13px; font-weight: bold; margin: 4px 0 2px 0; color: #242321;">${prop.title}</h4>
              <p style="font-size: 11px; color: #6B6A63; margin: 0 0 6px 0;">📍 ${prop.municipality}, ${prop.department}</p>
              <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; border-top: 1px solid #E5E1D8; padding-top: 6px;">
                <span style="color: #6B6A63;">${areaText}</span>
                <span style="color: #1E3A2F;">${priceText}</span>
              </div>
              <a href="${detailUrl}" style="display: block; text-align: center; margin-top: 8px; background: #1E3A2F; color: white; padding: 6px; font-size: 11px; font-weight: bold; border-radius: 6px; text-decoration: none;">Ver Ficha 360°</a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('click', () => {
          if (onSelectProperty) onSelectProperty(prop.id);
        });
      }
    });

    // Auto-center / fitBounds whenever the active set of properties changes
    const validCoords = properties
      .filter((p) => Boolean(p.latitude && p.longitude))
      .map((p) => [p.latitude, p.longitude] as [number, number]);
    const boundsKey = properties.map((p) => `${p.id}:${p.latitude}:${p.longitude}`).join('|');

    if (validCoords.length > 0 && boundsKey !== lastBoundsKeyRef.current) {
      lastBoundsKeyRef.current = boundsKey;
      if (validCoords.length === 1) {
        map.setView(validCoords[0], 13, { animate: true });
      } else {
        const bounds = L.latLngBounds(validCoords);
        map.fitBounds(bounds, { padding: [45, 45], maxZoom: 13 });
      }
    }

  }, [L, properties, defaultCenter, mapTile, onSelectProperty]);

  return <div ref={containerRef} className="w-full h-full" />;
};
