'use client';

import React from 'react';
import { ShieldCheck, MapPin, Award } from 'lucide-react';

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F2] pb-20 space-y-16">
      
      {/* Hero Header */}
      <section className="bg-[#F1EFE8] pt-16 pb-16 border-b border-[#E5E1D8] text-center space-y-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-mono uppercase text-[#1E3A2F] font-bold tracking-wider">
            Identidad Corporativa
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#242321] mt-2">
            Conocimiento del Territorio & Solidez Patrimonial
          </h1>
          <p className="text-sm text-[#6B6A63] max-w-2xl mx-auto mt-3">
            ACTIVOS & INVERSIONES DARIEN S.A.S. nace de la convicción de que el desarrollo inmobiliario en las regiones estratégicas de Urabá y el Darién requiere de un acompañamiento técnico, jurídico y comercial interdisciplinario.
          </p>
        </div>
      </section>

      {/* Values & Principles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white border border-[#E5E1D8] rounded-2xl space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#EEF4EF] text-[#1E3A2F] flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[#242321] text-lg">Transparencia Jurídica</h3>
            <p className="text-xs text-[#6B6A63] leading-relaxed">
              Cada activo de nuestro portafolio atraviesa una rigurosa auditoría de títulos, verificación de la tradición en instrumentos públicos y conceptos de uso del suelo emitidos por las alcaldías locales.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#E5E1D8] rounded-2xl space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#EEF4EF] text-[#0F766E] flex items-center justify-center font-bold">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[#242321] text-lg">Arraigo Regional</h3>
            <p className="text-xs text-[#6B6A63] leading-relaxed">
              Conocemos minuciosamente las dinámicas agrarias, logísticas e industriales de Necoclí, Turbo, Apartadó, Carepa, Chigorodó, Acandí y el Atrato.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#E5E1D8] rounded-2xl space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#6D4C7D] flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[#242321] text-lg">Custodia Institucional</h3>
            <p className="text-xs text-[#6B6A63] leading-relaxed">
              Capacidad demostrada para la administración y puesta en valor de bienes de especial complejidad o bajo régimen de custodia institucional SAE.
            </p>
          </div>
        </div>
      </section>

      {/* Corporate Offices */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white border border-[#E5E1D8] rounded-3xl p-8 space-y-6 shadow-sm">
        <h2 className="font-serif text-2xl font-bold text-[#242321]">
          Sedes & Presencia Territorial
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-4 bg-[#F8F7F2] rounded-xl border border-[#E5E1D8] space-y-2">
            <h4 className="font-bold text-[#1E3A2F] text-sm">Sede Operativa Urabá (Apartadó)</h4>
            <p className="text-[#242321]">Centro Comercial Plaza Ortiz, Oficina 402, Calle 100.</p>
            <p className="text-[#6B6A63] font-mono">Teléfono: +57 (4) 828-9000</p>
          </div>
          <div className="p-4 bg-[#F8F7F2] rounded-xl border border-[#E5E1D8] space-y-2">
            <h4 className="font-bold text-[#0F766E] text-sm">Sede Administrativa Medellín</h4>
            <p className="text-[#242321]">Edificio Corporativo El Poblado, Piso 12.</p>
            <p className="text-[#6B6A63] font-mono">Teléfono: +57 (4) 444-1234</p>
          </div>
        </div>
      </section>

    </div>
  );
}
