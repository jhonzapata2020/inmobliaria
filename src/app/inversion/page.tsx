'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { INITIAL_PROPERTIES } from '../../data/mockProperties';
import { PropertyCard } from '../../components/catalog/PropertyCard';

export default function InversionPage() {
  const investmentProperties = INITIAL_PROPERTIES.filter((p) => p.isInvestmentOpportunity);

  return (
    <div className="min-h-screen bg-[#F8F7F2] pb-20 space-y-16">
      
      {/* Hero */}
      <section className="bg-[#F1EFE8] pt-16 pb-16 border-b border-[#E5E1D8] text-center space-y-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E5E1D8] text-[#C6A15B] text-xs font-mono font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-[#C6A15B]" />
            <span>Portafolio Curado para Inversionistas</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#242321] max-w-3xl mx-auto">
            Oportunidades de Inversión Inmobiliaria & Territorial
          </h1>

          <p className="text-sm text-[#6B6A63] max-w-2xl mx-auto">
            Selección estratégica de predios agrícolas en producción, terrenos portuarios con alta valorización y activos comerciales generadores de renta patrimonial en Urabá y Darién.
          </p>
        </div>
      </section>

      {/* Investment Properties Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-center border-b border-[#E5E1D8] pb-4">
          <div>
            <span className="text-xs font-mono uppercase text-[#C6A15B] font-bold tracking-wider">
              High-Yield Real Estate
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#242321] mt-1">
              Oportunidades con Potencial de Rendimiento
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investmentProperties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </section>

    </div>
  );
}
