'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, TrendingUp, Coins, ShieldCheck, ArrowRight } from 'lucide-react';
import { INITIAL_PROPERTIES } from '../../data/mockProperties';
import { PropertyCard } from '../../components/catalog/PropertyCard';

export default function InversionPage() {
  const investmentProperties = INITIAL_PROPERTIES.filter((p) => p.isInvestmentOpportunity);

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero */}
      <section className="bg-slate-950 pt-16 pb-16 border-b border-slate-800 text-center space-y-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-mono font-semibold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Portafolio Curado para Inversionistas</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white max-w-3xl mx-auto">
            Oportunidades de Inversión Inmobiliaria & Territorial
          </h1>

          <p className="text-sm text-slate-300 max-w-2xl mx-auto">
            Selección estratégica de predios agrícolas en producción, terrenos portuarios con alta valorización y activos comerciales generadores de renta patrimonial en Urabá y Darién.
          </p>
        </div>
      </section>

      {/* Investment Properties Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono uppercase text-amber-400 font-semibold tracking-wider">
              High-Yield Real Estate
            </span>
            <h2 className="font-serif text-2xl font-bold text-white mt-1">
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
