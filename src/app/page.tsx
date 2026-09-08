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
  Compass,
  Store,
  Briefcase
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

  return (
    <div className="space-y-20 pb-20 bg-[#F8F7F2]">
      
      {/* 1. HERO PRINCIPAL EDITORIAL & MARKETPLACE SEARCH */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-12 pb-20 overflow-hidden bg-[#F1EFE8] border-b border-[#E5E1D8]">
        
        {/* Landscape Background Image with Light Editorial Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80" 
            alt="Territorio Urabá Darién"
            className="w-full h-full object-cover opacity-20 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F1EFE8] via-[#F1EFE8]/70 to-[#F8F7F2]/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Brand Tag Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E5E1D8] text-[#1E3A2F] text-xs font-mono font-semibold shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#23866D]" />
            <span>Firma Especializada en Gestión Inmobiliaria & Custodia SAE</span>
          </div>

          {/* Main Title & Subtitle */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#242321] leading-[1.1]">
              Activos con propósito. <br />
              <span className="text-[#1E3A2F]">
                Inversiones con territorio.
              </span>
            </h1>
            <p className="text-base sm:text-xl text-[#6B6A63] max-w-2xl mx-auto leading-relaxed">
              Descubre fincas, terrenos, bodegas, locales y oportunidades patrimoniales en Urabá, Darién y Colombia.
            </p>
          </div>

          {/* Central Marketplace Search Card */}
          <div className="max-w-5xl mx-auto bg-white border border-[#E5E1D8] p-6 rounded-3xl shadow-xl space-y-5 text-left">
            <form id="property-search-form" onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              
              {/* Keyword */}
              <div className="space-y-1.5">
                <label className="text-[#6B6A63] font-semibold flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-[#1E3A2F]" /> ¿Qué activo buscas?
                </label>
                <input
                  type="text"
                  placeholder="Ej. Finca ganadera, Bodega..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-[#242321] placeholder-[#929087] focus:outline-none focus:border-[#1E3A2F] focus:ring-1 focus:ring-[#1E3A2F]"
                />
              </div>

              {/* Location / Municipality */}
              <div className="space-y-1.5">
                <label className="text-[#6B6A63] font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0F766E]" /> ¿Dónde?
                </label>
                <select
                  value={municipality}
                  onChange={(e) => setMunicipality(e.target.value)}
                  className="w-full bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-[#242321] focus:outline-none focus:border-[#1E3A2F] focus:ring-1 focus:ring-[#1E3A2F]"
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

              {/* Modality */}
              <div className="space-y-1.5">
                <label className="text-[#6B6A63] font-semibold">Modalidad</label>
                <select
                  value={modality}
                  onChange={(e) => setModality(e.target.value)}
                  className="w-full bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-[#242321] focus:outline-none focus:border-[#1E3A2F] focus:ring-1 focus:ring-[#1E3A2F] font-medium"
                >
                  <option value="">Todas las modalidades</option>
                  <option value="Venta">Venta</option>
                  <option value="Arriendo">Arriendo</option>
                  <option value="Custodia">Custodia SAE</option>
                  <option value="Inversión">Oportunidad Inversión</option>
                </select>
              </div>

              {/* Asset Type */}
              <div className="space-y-1.5">
                <label className="text-[#6B6A63] font-semibold">Tipo de Activo</label>
                <select
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value)}
                  className="w-full bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-[#242321] focus:outline-none focus:border-[#1E3A2F] focus:ring-1 focus:ring-[#1E3A2F]"
                >
                  <option value="">Todos los tipos</option>
                  <option value="Finca">Fincas & Predios Rurales</option>
                  <option value="Terreno">Terrenos & Lotes</option>
                  <option value="Bodega">Bodegas & Logística</option>
                  <option value="Casa">Casas & Residencial</option>
                  <option value="Edificio">Edificios Corporativos</option>
                  <option value="Local">Locales Comerciales</option>
                  <option value="Oficina">Oficina</option>
                  <option value="Activo Especial">Activo Especial SAE</option>
                </select>
              </div>

            </form>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-3 border-t border-[#E5E1D8]">
              <div className="text-xs text-[#6B6A63] font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C6A15B]" />
                <span>+10 inmuebles verificados en Urabá & Darién</span>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <Link
                  href="/contacto"
                  className="flex-1 sm:flex-none px-5 py-3.5 rounded-xl bg-[#F8F7F2] hover:bg-[#E5E1D8] text-[#242321] font-semibold text-xs transition-colors text-center border border-[#E5E1D8]"
                >
                  Hablar con un Asesor
                </Link>
                <button
                  type="submit"
                  form="property-search-form"
                  className="flex-1 sm:flex-none px-7 py-3.5 rounded-xl bg-[#1E3A2F] hover:bg-[#152921] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <span>Explorar Oportunidades</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. ACTIVOS DESTACADOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#E5E1D8] pb-6">
          <div>
            <span className="text-xs font-mono uppercase text-[#1E3A2F] font-bold tracking-wider">
              Portafolio Exclusivo
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#242321] mt-1">
              Propiedades & Activos Destacados
            </h2>
          </div>
          <Link
            href="/propiedades"
            className="text-xs font-semibold text-[#1E3A2F] hover:text-[#152921] flex items-center gap-1.5 font-mono"
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

      {/* 3. EXPLORAR POR CATEGORÍA */}
      <section className="bg-[#EEF4EF] border-y border-[#E5E1D8] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase text-[#23866D] font-bold tracking-wider">
              Especialización Sectorial
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#242321]">
              Explora por Categoría de Activo
            </h2>
            <p className="text-xs text-[#6B6A63]">
              Diversidad de predios adaptados a diferentes estrategias de inversión patrimonial.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            
            {/* Fincas & Agro */}
            <Link 
              href="/propiedades?assetType=Finca"
              className="p-5 bg-white border border-[#E5E1D8] hover:border-[#1E3A2F] rounded-2xl space-y-3 group transition-all duration-200 shadow-sm hover:shadow-md text-center flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-xl bg-[#EEF4EF] text-[#1E3A2F] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Trees className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#242321] text-sm group-hover:text-[#1E3A2F] transition-colors">
                  Fincas & Agro
                </h3>
                <p className="text-[11px] text-[#6B6A63] mt-1">Ganadería & cultivo</p>
              </div>
            </Link>

            {/* Terrenos & Lotes */}
            <Link 
              href="/propiedades?assetType=Terreno"
              className="p-5 bg-white border border-[#E5E1D8] hover:border-[#C9795B] rounded-2xl space-y-3 group transition-all duration-200 shadow-sm hover:shadow-md text-center flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F1EFE8] text-[#C9795B] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#242321] text-sm group-hover:text-[#C9795B] transition-colors">
                  Terrenos & Lotes
                </h3>
                <p className="text-[11px] text-[#6B6A63] mt-1">Desarrollo territorial</p>
              </div>
            </Link>

            {/* Bodegas & Logística */}
            <Link 
              href="/propiedades?assetType=Bodega"
              className="p-5 bg-white border border-[#E5E1D8] hover:border-[#0F766E] rounded-2xl space-y-3 group transition-all duration-200 shadow-sm hover:shadow-md text-center flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-xl bg-[#EEF4EF] text-[#0F766E] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Warehouse className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#242321] text-sm group-hover:text-[#0F766E] transition-colors">
                  Bodegas & Logística
                </h3>
                <p className="text-[11px] text-[#6B6A63] mt-1">Eje portuario AAA</p>
              </div>
            </Link>

            {/* Locales Comerciales */}
            <Link 
              href="/propiedades?assetType=Local"
              className="p-5 bg-white border border-[#E5E1D8] hover:border-[#1E3A2F] rounded-2xl space-y-3 group transition-all duration-200 shadow-sm hover:shadow-md text-center flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F8F7F2] text-[#1E3A2F] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#242321] text-sm group-hover:text-[#1E3A2F] transition-colors">
                  Locales Comerciales
                </h3>
                <p className="text-[11px] text-[#6B6A63] mt-1">Zonas de alto flujo</p>
              </div>
            </Link>

            {/* Oportunidades de Inversión */}
            <Link 
              href="/inversion"
              className="p-5 bg-white border border-[#E5E1D8] hover:border-[#C6A15B] rounded-2xl space-y-3 group transition-all duration-200 shadow-sm hover:shadow-md text-center flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F1EFE8] text-[#C6A15B] flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#242321] text-sm group-hover:text-[#C6A15B] transition-colors">
                  Oportunidades
                </h3>
                <p className="text-[11px] text-[#6B6A63] mt-1">Alta valorización</p>
              </div>
            </Link>

            {/* Custodia SAE - Purple Accent */}
            <Link 
              href="/custodia-sae"
              className="p-5 bg-white border border-[#E5E1D8] hover:border-[#6D4C7D] rounded-2xl space-y-3 group transition-all duration-200 shadow-sm hover:shadow-md text-center flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#6D4C7D] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#242321] text-sm group-hover:text-[#6D4C7D] transition-colors">
                  Custodia SAE
                </h3>
                <p className="text-[11px] text-[#6D4C7D] font-medium mt-1">Activos Especiales</p>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* 4. EXPLORAR POR TERRITORIO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-[#E5E1D8] pb-4">
          <span className="text-xs font-mono uppercase text-[#C9795B] font-bold tracking-wider">
            Cobertura Regional
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#242321] mt-1">
            Explora por Territorio & Municipio
          </h2>
          <p className="text-xs text-[#6B6A63] mt-1">
            Presencia estratégica en los corredores agrícolas, logísticos y turísticos del Golfo de Urabá y el Darién.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          {[
            { name: 'Apartadó', dept: 'Antioquia', count: '4 predios', tag: 'Eje Comercial' },
            { name: 'Turbo', dept: 'Antioquia', count: '3 predios', tag: 'Puerto & Logística' },
            { name: 'Necoclí', dept: 'Antioquia', count: '2 predios', tag: 'Turismo & Playas' },
            { name: 'Carepa', dept: 'Antioquia', count: '1 predio', tag: 'Aeropuerto' },
            { name: 'Chigorodó', dept: 'Antioquia', count: '1 predio', tag: 'Agroganadero' },
            { name: 'Acandí', dept: 'Chocó', count: '2 predios', tag: 'Darién Caribe' },
            { name: 'Unguía', dept: 'Chocó', count: '1 predio', tag: 'Reserva Forestal' },
            { name: 'Urabá', dept: 'Subregión', count: '8 predios', tag: 'Gran Mercado' },
            { name: 'Darién', dept: 'Subregión', count: '3 predios', tag: 'Biodiversidad' },
            { name: 'Medellín / Ant.', dept: 'Antioquia', count: '1 predio', tag: 'Sede Corporativa' },
          ].map((item, idx) => (
            <Link
              key={idx}
              href={`/propiedades?municipality=${item.name}`}
              className="p-4 bg-white border border-[#E5E1D8] hover:border-[#1E3A2F] rounded-xl space-y-1 group transition-all"
            >
              <div className="font-bold text-[#242321] text-sm group-hover:text-[#1E3A2F] flex justify-between items-center">
                <span>{item.name}</span>
                <span className="text-[10px] font-mono text-[#23866D] font-normal">{item.count}</span>
              </div>
              <div className="text-[11px] text-[#6B6A63]">{item.dept}</div>
              <div className="text-[10px] font-mono text-[#929087] pt-1 border-t border-[#F1EFE8]">{item.tag}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. EXPLORADOR TERRITORIAL CON MAPA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-end border-b border-[#E5E1D8] pb-4">
          <div>
            <span className="text-xs font-mono uppercase text-[#0F766E] font-bold tracking-wider">
              Georreferenciación & Coordenadas
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#242321] mt-1">
              Explorador Territorial Interactivo
            </h2>
          </div>
          <Link
            href="/mapa"
            className="text-xs font-semibold text-[#0F766E] hover:text-[#1E3A2F] flex items-center gap-1 font-mono"
          >
            Abrir Mapa Pantalla Completa <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <PropertyMap properties={INITIAL_PROPERTIES} height="480px" />
      </section>

      {/* 6. RESPALDO Y METRICAS DE CONFIANZA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#E5E1D8] rounded-3xl p-8 sm:p-12 space-y-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase text-[#1E3A2F] font-bold">
                ¿Por qué ACTIVOS & INVERSIONES DARIEN?
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#242321] leading-tight">
                Respaldo jurídico, conocimiento del territorio y rigor patrimonial.
              </h2>
              <p className="text-xs sm:text-sm text-[#6B6A63] leading-relaxed">
                Somos estructuradores de proyectos inmobiliarios, gestores de activos especiales y aliados estratégicos para el desarrollo patrimonial en Urabá y el Darién.
              </p>
              <div className="text-[11px] font-mono text-[#929087]">
                * Datos e indicadores demostrativos de plataforma.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-[#E5E1D8] space-y-1">
                <div className="text-2xl font-bold text-[#1E3A2F]">100%</div>
                <div className="text-[#242321] font-bold">Estudio de Títulos</div>
                <div className="text-[#6B6A63] text-[11px]">Verificación documental rigurosa.</div>
              </div>

              <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-[#E5E1D8] space-y-1">
                <div className="text-2xl font-bold text-[#6D4C7D]">SAE</div>
                <div className="text-[#242321] font-bold">Custodia Institucional</div>
                <div className="text-[#6B6A63] text-[11px]">Protocolos de puesta en valor.</div>
              </div>

              <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-[#E5E1D8] space-y-1">
                <div className="text-2xl font-bold text-[#C9795B]">10+</div>
                <div className="text-[#242321] font-bold">Municipios Cubiertos</div>
                <div className="text-[#6B6A63] text-[11px]">Apartadó, Turbo, Acandí y más.</div>
              </div>

              <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-[#E5E1D8] space-y-1">
                <div className="text-2xl font-bold text-[#C6A15B]">24h</div>
                <div className="text-[#242321] font-bold">Dossier Ejecutivo</div>
                <div className="text-[#6B6A63] text-[11px]">Cotizador rápido consolidado.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LLAMADO FINAL A LA ACCIÓN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-[#1E3A2F] text-white rounded-3xl p-10 sm:p-14 space-y-6 shadow-xl">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">
            ¿Buscas un activo específico o deseas poner tu propiedad en valor?
          </h2>
          <p className="text-sm text-slate-200 max-w-xl mx-auto">
            Nuestro equipo interdisciplinario te acompañará en todo el proceso técnico, comercial y legal.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/contacto"
              className="px-6 py-3.5 rounded-xl bg-[#23866D] hover:bg-[#152921] text-white font-bold text-sm shadow-md"
            >
              Hablar con un Asesor
            </Link>
            <Link
              href="/contacto"
              className="px-6 py-3.5 rounded-xl bg-white text-[#1E3A2F] hover:bg-[#F1EFE8] font-bold text-sm"
            >
              Consignar un Inmueble
            </Link>
            <Link
              href="/inversion"
              className="px-6 py-3.5 rounded-xl bg-[#C6A15B] text-[#242321] hover:bg-amber-400 font-bold text-sm"
            >
              Solicitar Oportunidad de Inversión
            </Link>
            <Link
              href="/custodia-sae"
              className="px-6 py-3.5 rounded-xl bg-[#6D4C7D] text-white hover:bg-purple-900 font-bold text-sm"
            >
              Consultar Custodia SAE
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
