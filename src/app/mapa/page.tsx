'use client';

import React, { useState } from 'react';
import { INITIAL_PROPERTIES } from '../../data/mockProperties';
import { PropertyMap } from '../../components/map/PropertyMap';
import { MapPin, Search, Building2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatArea } from '../../lib/formatters';

export default function MapaPage() {
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [selectedMun, setSelectedMun] = useState<string>('');

  const filteredProperties = selectedMun 
    ? INITIAL_PROPERTIES.filter((p) => p.municipality === selectedMun)
    : INITIAL_PROPERTIES;

  const activeProp = INITIAL_PROPERTIES.find((p) => p.id === selectedId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-emerald-400 font-semibold tracking-wider">
            Georreferenciación & Catastro
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white mt-1">
            Explorador Territorial de Urabá & Darién
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Mapa interactivo con marcadores geolocalizados de fincas, terrenos y bodegas.
          </p>
        </div>

        {/* Municipality selector */}
        <div className="flex items-center gap-2 text-xs">
          <label className="text-slate-400 font-mono">Municipio:</label>
          <select
            value={selectedMun}
            onChange={(e) => setSelectedMun(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none"
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
                  ? 'bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-950/30'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {prop.code}
                </span>
                <span className="text-xs font-mono font-bold text-slate-200">
                  {prop.modality === 'Venta' && formatCurrency(prop.price)}
                  {prop.modality === 'Arriendo' && `${formatCurrency(prop.monthlyRent)}/m`}
                  {prop.modality === 'Custodia' && 'Regulada SAE'}
                </span>
              </div>

              <h4 className="font-bold text-sm text-white mt-1.5 line-clamp-1">{prop.title}</h4>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                {prop.municipality}, {prop.department}
              </p>

              <div className="flex justify-between items-center text-xs pt-3 mt-3 border-t border-slate-800/80 text-slate-300 font-mono">
                <span>{formatArea(prop.areaTotalHa, prop.areaTotalM2)}</span>
                <Link
                  href={`/propiedades/${prop.id}`}
                  className="text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                >
                  Ver Ficha 360° <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
