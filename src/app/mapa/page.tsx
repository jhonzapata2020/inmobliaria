'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Layers, MapPin, Building } from 'lucide-react';
import { PropertyMap } from '../../components/map/PropertyMap';
import { PropertyCard } from '../../components/catalog/PropertyCard';
import { Property } from '../../types/property';
import { getPublishedProperties } from '../actions/properties';

export default function MapaPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>();

  useEffect(() => {
    async function loadProperties() {
      try {
        const data = await getPublishedProperties();
        setProperties(data);
      } catch (err) {
        console.error('Failed to load map properties:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, []);

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId);

  return (
    <div className="min-h-screen bg-[#F8F7F2] pb-10">
      
      {/* Top Header Bar */}
      <div className="bg-white border-b border-[#E5E1D8] px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/propiedades"
            className="p-2 rounded-xl bg-[#F8F7F2] border border-[#E5E1D8] text-[#242321] hover:bg-[#E5E1D8] transition-colors"
            title="Volver al catálogo"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] font-mono uppercase text-[#0F766E] font-bold tracking-wider block">
              Visor Georreferenciado 360°
            </span>
            <h1 className="font-serif text-lg font-bold text-[#242321]">
              Mapa Territorial de Activos (Urabá & Darién)
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="bg-[#EEF4EF] text-[#1E3A2F] border border-[#E5E1D8] px-3 py-1.5 rounded-xl font-bold">
            {properties.length} Activos Mapeados
          </span>
          <Link
            href="/propiedades"
            className="px-3.5 py-1.5 bg-[#1E3A2F] text-white rounded-xl font-semibold hover:bg-[#152921] transition-colors"
          >
            Ver en Lista
          </Link>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Full Interactive Map */}
        <div className="lg:col-span-8 bg-white border border-[#E5E1D8] rounded-2xl overflow-hidden shadow-md">
          {loading ? (
            <div className="h-[700px] flex items-center justify-center text-xs font-mono text-[#6B6A63]">
              Cargando mapa interactivo...
            </div>
          ) : (
            <PropertyMap 
              properties={properties} 
              height="720px" 
              selectedPropertyId={selectedPropertyId}
              onSelectProperty={(id) => setSelectedPropertyId(id)}
            />
          )}
        </div>

        {/* Selected Property Preview Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-[#E5E1D8] rounded-2xl p-4 space-y-3 shadow-sm">
            <h3 className="font-serif text-base font-bold text-[#242321] flex items-center justify-between">
              <span>Ficha Técnica Seleccionada</span>
              <span className="text-xs font-mono font-normal text-[#6B6A63]">
                {selectedProperty ? selectedProperty.code : 'Ninguno'}
              </span>
            </h3>

            {selectedProperty ? (
              <PropertyCard property={selectedProperty} />
            ) : (
              <div className="text-center py-16 px-4 bg-[#F8F7F2] rounded-xl border border-dashed border-[#E5E1D8] space-y-2 text-xs">
                <MapPin className="w-8 h-8 text-[#0F766E] mx-auto animate-bounce" />
                <p className="font-semibold text-[#242321]">Selecciona un pin en el mapa</p>
                <p className="text-[#6B6A63]">
                  Haz clic sobre cualquiera de los marcadores en el mapa de Urabá para desplegar su ficha detallada.
                </p>
              </div>
            )}
          </div>

          {/* Quick List of Properties */}
          <div className="bg-white border border-[#E5E1D8] rounded-2xl p-4 space-y-3 max-h-[260px] overflow-y-auto shadow-sm">
            <h4 className="text-xs font-mono font-bold text-[#1E3A2F] uppercase tracking-wider">
              Listado Rápido de Ubicaciones
            </h4>
            <div className="space-y-2">
              {properties.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPropertyId(p.id)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs flex justify-between items-center ${
                    selectedPropertyId === p.id 
                      ? 'bg-[#EEF4EF] border-[#1E3A2F] text-[#1E3A2F] font-bold' 
                      : 'bg-[#F8F7F2] border-[#E5E1D8] text-[#242321] hover:bg-[#F1EFE8]'
                  }`}
                >
                  <div className="truncate pr-2">
                    <span className="font-mono text-[10px] block text-[#6B6A63]">{p.code}</span>
                    <span className="truncate block">{p.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#0F766E] shrink-0">{p.municipality}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
