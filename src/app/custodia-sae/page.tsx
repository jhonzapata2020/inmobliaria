'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Landmark, CheckCircle2, ArrowRight, FileSpreadsheet, Building } from 'lucide-react';
import { PropertyCard } from '../../components/catalog/PropertyCard';
import { Property } from '../../types/property';
import { getPublishedProperties } from '../actions/properties';

export default function CustodiaSaePage() {
  const [saeProperties, setSaeProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSaeProperties() {
      try {
        const allProps = await getPublishedProperties();
        const filtered = allProps.filter((p) => p.modality === 'Custodia SAE' || p.isSae || p.assetType === 'Activo Especial');
        setSaeProperties(filtered);
      } catch (err) {
        console.error('Failed to load SAE properties:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSaeProperties();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F7F2] pb-20 space-y-16">
      
      {/* Hero Custodia SAE */}
      <section className="bg-[#1E3A2F] text-white pt-12 pb-16 border-b border-[#E5E1D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-900/60 border border-purple-400/40 text-purple-200 text-xs font-mono font-bold">
            <Landmark className="w-4 h-4 text-purple-300" />
            <span>Gestión Institucional de Activos Especiales</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Programa Especial de Custodia Territorial & Puesta en Valor SAE
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-3xl leading-relaxed">
            Administración técnica, saneamiento físico, inventario agrológico y protocolos de aprovechamiento económico regulado para predios en Urabá y el Darién.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs font-mono">
            <div className="p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-md">
              <div className="text-xl font-bold text-emerald-300">100%</div>
              <div className="text-slate-200 mt-0.5">Ficha Técnica Oficial</div>
            </div>
            <div className="p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-md">
              <div className="text-xl font-bold text-purple-300">Custodia</div>
              <div className="text-slate-200 mt-0.5">Seguridad & Linderos</div>
            </div>
            <div className="p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-md">
              <div className="text-xl font-bold text-amber-300">Productivo</div>
              <div className="text-slate-200 mt-0.5">Aprovechamiento Regulado</div>
            </div>
            <div className="p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-md">
              <div className="text-xl font-bold text-teal-300">Urabá</div>
              <div className="text-slate-200 mt-0.5">Cobertura Regional</div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog of SAE Assets */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-[#E5E1D8] pb-4 flex justify-between items-end">
          <div>
            <span className="text-xs font-mono uppercase text-[#6D4C7D] font-bold tracking-wider">
              Inventario de Predios SAE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#242321] mt-1">
              Activos Especiales Disponibles para Custodia & Proyecto
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-[#1E3A2F] bg-white border border-[#E5E1D8] px-3 py-1.5 rounded-xl shadow-xs">
            {saeProperties.length} Predios Registrados
          </span>
        </div>

        {loading ? (
          <div className="text-center py-16 text-xs font-mono text-[#6B6A63]">
            Cargando predios SAE desde base de datos...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {saeProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
