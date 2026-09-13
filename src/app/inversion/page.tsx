'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { PropertyCard } from '../../components/catalog/PropertyCard';
import { Property } from '../../types/property';
import { getPublishedProperties } from '../actions/properties';

export default function InversionPage() {
  const [investmentProperties, setInvestmentProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvestmentProperties() {
      try {
        const allProps = await getPublishedProperties();
        const filtered = allProps.filter((p) => p.isInvestmentOpportunity || p.modality === 'Inversión');
        setInvestmentProperties(filtered.length > 0 ? filtered : allProps.slice(0, 4));
      } catch (err) {
        console.error('Failed to load investment properties:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInvestmentProperties();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F7F2] pb-20 space-y-16">
      
      {/* Hero Inversión */}
      <section className="bg-[#1E3A2F] text-white pt-12 pb-16 border-b border-[#E5E1D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C6A15B]/20 border border-[#C6A15B]/40 text-[#C6A15B] text-xs font-mono font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>Oportunidades de Inversión Patrimonial & Agrologística</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Activos Inmobiliarios de Alta Valorización en Urabá
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-3xl leading-relaxed">
            Predios estratégicos con vocación agrologística, comercial, ganadera e industrial estructurados para inversionistas privados e institucionales.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs font-mono">
            <div className="p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-md">
              <div className="text-xl font-bold text-[#C6A15B]">Puerto Antioquia</div>
              <div className="text-slate-200 mt-0.5">Impacto en Valorización</div>
            </div>
            <div className="p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-md">
              <div className="text-xl font-bold text-emerald-300">100%</div>
              <div className="text-slate-200 mt-0.5">Tradición & Títulos</div>
            </div>
            <div className="p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-md">
              <div className="text-xl font-bold text-teal-300">Agro & Puerto</div>
              <div className="text-slate-200 mt-0.5">Estrategia Multimodal</div>
            </div>
            <div className="p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-md">
              <div className="text-xl font-bold text-purple-300">Dossier</div>
              <div className="text-slate-200 mt-0.5">Estructurado en 24h</div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog of Investment Assets */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-[#E5E1D8] pb-4 flex justify-between items-end">
          <div>
            <span className="text-xs font-mono uppercase text-[#C6A15B] font-bold tracking-wider">
              Portafolio de Inversión
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#242321] mt-1">
              Oportunidades Inmobiliarias Certificadas
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-[#1E3A2F] bg-white border border-[#E5E1D8] px-3 py-1.5 rounded-xl shadow-xs">
            {investmentProperties.length} Oportunidades
          </span>
        </div>

        {loading ? (
          <div className="text-center py-16 text-xs font-mono text-[#6B6A63]">
            Cargando oportunidades de inversión desde base de datos...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investmentProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
