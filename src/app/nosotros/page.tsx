'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, ShieldCheck, MapPin, Award, Users, CheckCircle2 } from 'lucide-react';

export default function NosotrosPage() {
  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Header */}
      <section className="bg-slate-950 pt-16 pb-16 border-b border-slate-800 text-center space-y-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-mono uppercase text-emerald-400 font-semibold tracking-wider">
            Identidad Corporativa
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-2">
            Conocimiento del Territorio & Solidez Patrimonial
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto mt-3">
            ACTIVOS & INVERSIONES DARIEN S.A.S. nace de la convención de que el desarrollo inmobiliario en las regiones estratégicas de Urabá y el Darién requiere de un acompañamiento técnico, jurídico y comercial interdisciplinario.
          </p>
        </div>
      </section>

      {/* Values & Principles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-lg">Transparencia Jurídica</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cada activo de nuestro portafolio atraviesa una rigurosa auditoría de títulos, verificación de la tradición en instrumentos públicos y conceptos de uso del suelo emitidos por las alcaldías locales.
            </p>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-950 text-teal-400 flex items-center justify-center font-bold">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-lg">Arraigo Regional</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Conocemos minuciosamente las dinámicas agrarias, logísticas e industriales de Necoclí, Turbo, Apartadó, Carepa, Chigorodó, Acandí y el Atrato.
            </p>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-lg">Custodia Institucional</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Capacidad demostrada para la administración y puesta en valor de bienes de especial complejidad o bajo régimen de custodia institucional SAE.
            </p>
          </div>
        </div>
      </section>

      {/* Corporate Offices */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
        <h2 className="font-serif text-2xl font-bold text-white">
          Sedes & Presencia Territorial
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-emerald-400 text-sm">Sede Operativa Urabá (Apartadó)</h4>
            <p className="text-slate-300">Centro Comercial Plaza Ortiz, Oficina 402, Calle 100.</p>
            <p className="text-slate-400 font-mono">Teléfono: +57 (4) 828-9000</p>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-teal-400 text-sm">Sede Administrativa Medellín</h4>
            <p className="text-slate-300">Edificio Corporativo El Poblado, Piso 12.</p>
            <p className="text-slate-400 font-mono">Teléfono: +57 (4) 444-1234</p>
          </div>
        </div>
      </section>

    </div>
  );
}
