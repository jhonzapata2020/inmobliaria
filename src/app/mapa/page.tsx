'use client';

import React, { useState } from 'react';
import { INITIAL_PROPERTIES } from '../../data/mockProperties';
import { PropertyMap } from '../../components/map/PropertyMap';
import { MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatArea } from '../../lib/formatters';

export default function MapaPage() {
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [selectedMun, setSelectedMun] = useState<string>('');

  const filteredProperties = selectedMun 
    ? INITIAL_PROPERTIES.filter((p) => p.municipality === selectedMun)
    : INITIAL_PROPERTIES;

  return (
    <div className="min-h-screen bg-[#F8F7F2] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-mono uppercase text-[#1E3A2F] font-bold tracking-wider">
              Georreferenciación & Catastro
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#242321] mt-1">
              Explorador Territorial de Urabá & Darién
            </h1>
            <p className="text-xs text-[#6B6A63] font-mono mt-1">
              Mapa interactivo con marcadores geolocalizados de fincas, terrenos y bodegas.
            </p>
          </div>

          {/* Municipality selector */}
          <div className="flex items-center gap-2 text-xs">
            <label className="text-[#6B6A63] font-mono font-medium">Municipio:</label>
            <select
              value={selectedMun}
              onChange={(e) => setSelectedMun(e.target.value)}
              className="bg-white border border-[#E5E1D8] rounded-xl px-3.5 py-2 text-[#242321] font-semibold focus:outline-none focus:border-[#1E3A2F]"
            >
              <option value="">Todos ({INITIAL_PROPERTIES.length})</option>
              <option value="Necoclí">Necoclí</option>
              <option value="Turbo">Turbo</option>
              <option value="Apartadó">Apartadó</option>
              <option value="Carepa">Carepa</option>
              <option value="Chigorodó">Chigorodó</option>
              <option value="Acandí">Acandí</option>
              <option value="Unguía">Unguía</option>
            </select>
          </div>
        </div>

        {/* Main Map & Side List View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Map Container */}
          <div className="lg:col-span-8 sticky top-24">
            <PropertyMap 
              properties={filteredProperties} 
              selectedPropertyId={selectedId}
              onSelectProperty={(id) => setSelectedId(id)}
              height="720px" 
            />
          </div>

          {/* Lateral Property List View */}
          <div className="lg:col-span-4 space-y-4 max-h-[720px] overflow-y-auto pr-1">
            {filteredProperties.map((prop) => (
              <div
                key={prop.id}
                onClick={() => setSelectedId(prop.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedId === prop.id
                    ? 'bg-white border-[#1E3A2F] shadow-md ring-2 ring-[#1E3A2F]/20'
                    : 'bg-white border-[#E5E1D8] hover:border-[#1E3A2F]/40 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[10px] font-mono font-bold text-white bg-[#1E3A2F] px-2 py-0.5 rounded">
                    {prop.code}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#242321]">
                    {prop.modality === 'Venta' && formatCurrency(prop.price)}
                    {prop.modality === 'Arriendo' && `${formatCurrency(prop.monthlyRent)}/m`}
                    {prop.modality === 'Custodia' && 'Regulada SAE'}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-[#242321] mt-1.5 line-clamp-1">{prop.title}</h4>
                <p className="text-xs text-[#6B6A63] flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
                  {prop.municipality}, {prop.department}
                </p>

                <div className="flex justify-between items-center text-xs pt-3 mt-3 border-t border-[#E5E1D8] text-[#6B6A63] font-mono">
                  <span>{formatArea(prop.areaTotalHa, prop.areaTotalM2)}</span>
                  <Link
                    href={`/propiedades/${prop.id}`}
                    className="text-[#1E3A2F] font-bold hover:underline flex items-center gap-1"
                  >
                    Ver Ficha 360° <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
