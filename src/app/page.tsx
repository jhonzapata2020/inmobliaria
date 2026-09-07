'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Trees, 
  Warehouse, 
  Landmark,
  PhoneCall,
  FileSpreadsheet,
  Users,
  Compass
} from 'lucide-react';
import { INITIAL_PROPERTIES } from '../data/mockProperties';
import { PropertyCard } from '../components/catalog/PropertyCard';
import { PropertyMap } from '../components/map/PropertyMap';

export default function HomePage() {
  const router = useRouter();

  // Search Bar State
  const [searchQuery, setSearchQuery] = useState('');
  const [modality, setModality] = useState('');
  const [assetType, setAssetType] = useState('');
  const [municipality, setMunicipality] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('searchQuery', searchQuery);
    if (modality) params.set('modality', modality);
    if (assetType) params.set('assetType', assetType);
    if (municipality) params.set('municipality', municipality);

    router.push(`/propiedades?${params.toString()}`);
  };

  const featuredProperties = INITIAL_PROPERTIES.filter((p) => p.isFeatured).slice(0, 6);
  const investmentOpportunities = INITIAL_PROPERTIES.filter((p) => p.isInvestmentOpportunity).slice(0, 4);

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO PRINCIPAL EDITORIAL */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-10 pb-20 overflow-hidden bg-slate-950">
        
        {/* Editorial Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80" 
            alt="Finca Urabá Darién"
            className="w-full h-full object-cover opacity-25 scale-105 animate-in fade-in duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Brand Tag Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold shadow-xl backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Firma Especializada en Gestión Inmobiliaria & Custodia SAE</span>
          </div>

          {/* Main Title & Subtitle */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              Activos con propósito. <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-200 bg-clip-text text-transparent">
                Inversiones con territorio.
              </span>
            </h1>
            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Conectamos personas, empresas e inversionistas con oportunidades inmobiliarias urbanas, rurales y comerciales en Colombia. Especialistas en Urabá y Darién.
            </p>
          </div>

          {/* Central Marketplace Search Card */}
          <div className="max-w-5xl mx-auto bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-4 sm:p-6 rounded-3xl shadow-2xl space-y-4">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-left">
              
              {/* Keyword */}
              <div className="space-y-1">
                <label className="text-slate-400 font-mono flex items-center gap-1">
                  <Search className="w-3.5 h-3.5 text-emerald-400" /> ¿Qué buscas?
                </label>
                <input
                  type="text"
                  placeholder="Ej. Finca ganadera, Bodega..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Modality */}
              <div className="space-y-1">
                <label className="text-slate-400 font-mono">Modalidad</label>
                <select
                  value={modality}
                  onChange={(e) => setModality(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-semibold"
                >
                  <option value="">Todas las modalidades</option>
                  <option value="Venta">Venta</option>
                  <option value="Arriendo">Arriendo</option>
                  <option value="Custodia">Custodia SAE</option>
                  <option value="Inversión">Oportunidad Inversión</option>
                </select>
              </div>

              {/* Asset Type */}
              <div className="space-y-1">
                <label className="text-slate-400 font-mono">Tipo de Activo</label>
                <select
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Todos los activos</option>
                  <option value="Finca">Fincas & Predios Rurales</option>
                  <option value="Terreno">Terrenos & Lotes</option>
                  <option value="Bodega">Bodegas & Logística</option>
                  <option value="Edificio">Edificios Corporativos</option>
                  <option value="Local">Locales Comerciales</option>
                  <option value="Activo Especial">Activo Especial SAE</option>
                </select>
              </div>

              {/* Municipality */}
              <div className="space-y-1">
                <label className="text-slate-400 font-mono">Ubicación / Municipio</label>
                <select
                  value={municipality}
                  onChange={(e) => setMunicipality(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Todos los municipios</option>
                  <option value="Apartadó">Apartadó</option>
                  <option value="Turbo">Turbo</option>
                  <option value="Necoclí">Necoclí</option>
                  <option value="Carepa">Carepa</option>
                  <option value="Chigorodó">Chigorodó</option>
                  <option value="Acandí">Acandí</option>
                  <option value="Unguía">Unguía</option>
                </select>
              </div>

            </form>

            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2 border-t border-slate-800">
              <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>+10 propiedades validadas en Urabá & Darién</span>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <Link
                  href="/contacto"
                  className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors text-center"
                >
                  Hablar con un Asesor
                </Link>
                <button
                  onClick={handleSearchSubmit}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <span>Explorar Oportunidades</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. PROPIEDADES DESTACADAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-mono uppercase text-emerald-400 font-semibold tracking-wider">
              Portafolio Exclusivo
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
              Propiedades & Activos Destacados
            </h2>
          </div>
          <Link
            href="/propiedades"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 font-mono"
          >
            Ver catálogo completo (+10) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* 3. CATEGORÍAS DE ACTIVOS */}
      <section className="bg-slate-900/60 border-y border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase text-teal-400 font-semibold tracking-wider">
              Especialización Sectorial
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Explora por Categoría de Activo
            </h2>
            <p className="text-xs text-slate-400">
              Diversidad de predios adaptados a diferentes estrategias de inversión patrimonial.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <Link 
              href="/propiedades?assetType=Finca"
              className="p-6 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-2xl space-y-3 group transition-all duration-200 shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Trees className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
                  Fincas & Agro
                </h3>
                <p className="text-xs text-slate-400 mt-1">Ganadería, banano, palma y conservación.</p>
              </div>
            </Link>

            <Link 
              href="/propiedades?assetType=Bodega"
              className="p-6 bg-slate-950 border border-slate-800 hover:border-teal-500/50 rounded-2xl space-y-3 group transition-all duration-200 shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-950 text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Warehouse className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base group-hover:text-teal-400 transition-colors">
                  Bodegas & Logística
                </h3>
                <p className="text-xs text-slate-400 mt-1">Eje portuario y almacenamiento AAA.</p>
              </div>
            </Link>

            <Link 
              href="/custodia-sae"
              className="p-6 bg-slate-950 border border-slate-800 hover:border-purple-500/50 rounded-2xl space-y-3 group transition-all duration-200 shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base group-hover:text-purple-400 transition-colors">
                  Custodia SAE
                </h3>
                <p className="text-xs text-slate-400 mt-1">Administración institucional de activos especiales.</p>
              </div>
            </Link>

            <Link 
              href="/propiedades?assetType=Terreno"
              className="p-6 bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-2xl space-y-3 group transition-all duration-200 shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors">
                  Terrenos & Lotes
                </h3>
                <p className="text-xs text-slate-400 mt-1">Desarrollo ecoturístico e industrial.</p>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* 4. SNEAK-PEEK MAPA TERRITORIAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-end border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono uppercase text-emerald-400 font-semibold tracking-wider">
              Georreferenciación & Coordenadas
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
              Explorador Territorial Interactivo
            </h2>
          </div>
          <Link
            href="/mapa"
            className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 font-mono"
          >
            Abrir Mapa Pantalla Completa <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <PropertyMap properties={INITIAL_PROPERTIES} height="480px" />
      </section>

      {/* 5. BENEFICIOS Y METRICAS DE CONFIANZA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase text-emerald-400 font-bold">
                ¿Por qué ACTIVOS & INVERSIONES DARIEN?
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight">
                Respaldo jurídico, conocimiento profundo del territorio y rigor patrimonial.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                No somos intermediarios tradicionales. Somos estructuradores de proyectos inmobiliarios, gestores de activos especiales y aliados estratégicos para el desarrollo de Urabá y el Darién.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-2xl font-bold text-emerald-400">100%</div>
                <div className="text-slate-300 font-bold">Estudio de Títulos</div>
                <div className="text-slate-500 text-[11px]">Verificación documental rigurosa.</div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-2xl font-bold text-teal-400">SAE</div>
                <div className="text-slate-300 font-bold">Custodia Institucional</div>
                <div className="text-slate-500 text-[11px]">Protocolos de puesta en valor.</div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-2xl font-bold text-amber-400">+8 Subregiones</div>
                <div className="text-slate-300 font-bold">Presencia Local</div>
                <div className="text-slate-500 text-[11px]">Apartadó, Turbo, Acandí y más.</div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-2xl font-bold text-purple-400">24h</div>
                <div className="text-slate-300 font-bold">Dossier Ejecutivo</div>
                <div className="text-slate-500 text-[11px]">Cotizador rápido consolidado.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION FINAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 border border-emerald-800/50 rounded-3xl p-10 sm:p-14 space-y-6 shadow-2xl">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            ¿Tienes una propiedad para consignar o buscas una oportunidad de inversión?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Nuestro equipo interdisciplinario te acompañará en todo el proceso técnico, comercial y legal.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/contacto"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl"
            >
              Consignar mi Inmueble
            </Link>
            <Link
              href="/inversion"
              className="px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-semibold text-sm"
            >
              Ver Oportunidades de Inversión
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
