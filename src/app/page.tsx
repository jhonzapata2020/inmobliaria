'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Trees, 
  Warehouse, 
  Landmark,
  Compass,
  Store,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Building,
  Grid
} from 'lucide-react';
import { INITIAL_PROPERTIES } from '../data/mockProperties';
import { PropertyCard } from '../components/catalog/PropertyCard';
import { PropertyMap } from '../components/map/PropertyMap';
import { Property } from '../types/property';

interface CarouselSectionProps {
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  properties: Property[];
  viewAllUrl?: string;
}

function AssetCarouselSection({ title, subtitle, badge, badgeColor = 'text-[#1E3A2F]', properties, viewAllUrl = '/propiedades' }: CarouselSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  if (properties.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
      {/* Header with Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E1D8] pb-4">
        <div>
          {badge && (
            <span className={`text-xs font-mono uppercase font-bold tracking-wider ${badgeColor}`}>
              {badge}
            </span>
          )}
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#242321] mt-0.5">
            {title}
          </h2>
          <p className="text-xs text-[#6B6A63] mt-0.5 max-w-2xl">
            {subtitle}
          </p>
        </div>

        {/* Carousel Controls & View All Link */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <Link
            href={viewAllUrl}
            className="text-xs font-semibold text-[#1E3A2F] hover:text-[#152921] flex items-center gap-1 font-mono mr-2"
          >
            Ver más ({properties.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={scrollLeft}
            aria-label="Anterior"
            className="p-2.5 rounded-full bg-white border border-[#E5E1D8] hover:border-[#1E3A2F] text-[#242321] hover:bg-[#F8F7F2] shadow-xs transition-all hover:scale-105"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollRight}
            aria-label="Siguiente"
            className="p-2.5 rounded-full bg-white border border-[#E5E1D8] hover:border-[#1E3A2F] text-[#242321] hover:bg-[#F8F7F2] shadow-xs transition-all hover:scale-105"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4 pt-1 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {properties.map((property) => (
          <div key={property.id} className="min-w-[280px] sm:min-w-[340px] max-w-[360px] flex-shrink-0">
            <PropertyCard property={property} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const router = useRouter();

  // Search Bar State
  const [searchQuery, setSearchQuery] = useState('');
  const [modality, setModality] = useState('');
  const [assetType, setAssetType] = useState('');
  const [municipality, setMunicipality] = useState('');

  // Category Tab State
  const [activeTab, setActiveTab] = useState<string>('todos');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('searchQuery', searchQuery);
    if (modality) params.set('modality', modality);
    if (assetType) params.set('assetType', assetType);
    if (municipality) params.set('municipality', municipality);

    router.push(`/propiedades?${params.toString()}`);
  };

  // Filter properties based on active tab
  const getFilteredProperties = () => {
    if (activeTab === 'Venta') {
      return INITIAL_PROPERTIES.filter((p) => p.modality === 'Venta');
    }
    if (activeTab === 'Arriendo') {
      return INITIAL_PROPERTIES.filter((p) => p.modality === 'Arriendo');
    }
    if (activeTab === 'Custodia') {
      return INITIAL_PROPERTIES.filter((p) => p.modality === 'Custodia' || p.assetType === 'Activo Especial');
    }
    if (activeTab === 'Inversión') {
      return INITIAL_PROPERTIES.filter((p) => p.isInvestmentOpportunity);
    }
    return INITIAL_PROPERTIES;
  };

  const filteredProperties = getFilteredProperties();

  // Featured properties logic: hero property (prop-001) moved further back (position 4)
  const allFeatured = filteredProperties.filter((p) => p.isFeatured);
  const heroPropInFeatured = allFeatured.find((p) => p.id === 'prop-001');
  const otherFeatured = allFeatured.filter((p) => p.id !== 'prop-001');
  const featuredProperties = heroPropInFeatured
    ? [...otherFeatured.slice(0, 3), heroPropInFeatured, ...otherFeatured.slice(3)]
    : allFeatured;

  const ruralFarms = filteredProperties.filter((p) => p.assetType === 'Finca' || p.assetType === 'Terreno');
  const commercialLogistics = filteredProperties.filter((p) => p.assetType === 'Bodega' || p.assetType === 'Local' || p.assetType === 'Edificio');
  const saeAssets = filteredProperties.filter((p) => p.modality === 'Custodia' || p.assetType === 'Activo Especial');

  return (
    <div className="space-y-16 pb-20 bg-[#F8F7F2]">
      
      {/* 1. BARRA SUPERIOR DE MODALIDADES (ESTILO AIRBNB TABS) */}
      <div className="sticky top-16 z-30 bg-[#F8F7F2]/95 backdrop-blur-md border-b border-[#E5E1D8] py-3 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start sm:justify-center gap-6 sm:gap-10 overflow-x-auto scrollbar-none py-1 text-xs">
            
            <button
              onClick={() => setActiveTab('todos')}
              className={`flex items-center gap-2 pb-2.5 font-medium transition-all whitespace-nowrap border-b-2 ${
                activeTab === 'todos'
                  ? 'border-[#1E3A2F] text-[#242321] font-bold'
                  : 'border-transparent text-[#6B6A63] hover:text-[#242321] hover:border-[#E5E1D8]'
              }`}
            >
              <Grid className="w-4 h-4 text-[#1E3A2F]" />
              <span>Todos los Activos</span>
            </button>

            <button
              onClick={() => setActiveTab('Venta')}
              className={`flex items-center gap-2 pb-2.5 font-medium transition-all whitespace-nowrap border-b-2 ${
                activeTab === 'Venta'
                  ? 'border-[#1E3A2F] text-[#242321] font-bold'
                  : 'border-transparent text-[#6B6A63] hover:text-[#242321] hover:border-[#E5E1D8]'
              }`}
            >
              <Trees className="w-4 h-4 text-[#1E3A2F]" />
              <span>Predios en Venta</span>
            </button>

            <button
              onClick={() => setActiveTab('Arriendo')}
              className={`flex items-center gap-2 pb-2.5 font-medium transition-all whitespace-nowrap border-b-2 ${
                activeTab === 'Arriendo'
                  ? 'border-[#1E3A2F] text-[#242321] font-bold'
                  : 'border-transparent text-[#6B6A63] hover:text-[#242321] hover:border-[#E5E1D8]'
              }`}
            >
              <Warehouse className="w-4 h-4 text-[#0F766E]" />
              <span>Arrendamiento Comercial/Rural</span>
            </button>

            <button
              onClick={() => setActiveTab('Custodia')}
              className={`flex items-center gap-2 pb-2.5 font-medium transition-all whitespace-nowrap border-b-2 ${
                activeTab === 'Custodia'
                  ? 'border-[#6D4C7D] text-[#242321] font-bold'
                  : 'border-transparent text-[#6B6A63] hover:text-[#242321] hover:border-[#E5E1D8]'
              }`}
            >
              <Landmark className="w-4 h-4 text-[#6D4C7D]" />
              <span>Custodia SAE</span>
            </button>

            <button
              onClick={() => setActiveTab('Inversión')}
              className={`flex items-center gap-2 pb-2.5 font-medium transition-all whitespace-nowrap border-b-2 ${
                activeTab === 'Inversión'
                  ? 'border-[#C6A15B] text-[#242321] font-bold'
                  : 'border-transparent text-[#6B6A63] hover:text-[#242321] hover:border-[#E5E1D8]'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-[#C6A15B]" />
              <span>Oportunidades de Inversión</span>
            </button>

          </div>
        </div>
      </div>

      {/* 2. HERO PRINCIPAL ASIMÉTRICO (SPLIT LAYOUT 12-COLUMNS WITH AIRBNB PILL SEARCH BAR) */}
      <section className="relative pt-6 sm:pt-8 pb-14 bg-[#F8F7F2] border-b border-[#E5E1D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* COLUMNA IZQUIERDA (7 COLUMNAS): BADGE, TÍTULO, SUBTÍTULO, PÍLDORA DE BÚSQUEDA Y MÉTRICAS */}
            <div className="order-2 lg:order-1 lg:col-span-7 space-y-6 text-left">
              
              {/* Encabezado y Título Principal */}
              <div className="space-y-4">
                {/* Badge Superior */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#1E3A2F]/30 text-[#1E3A2F] text-xs font-mono font-bold shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-[#23866D]" />
                  <span>Gestión Inmobiliaria & Custodia SAE</span>
                </div>

                {/* Título Principal Proporcional */}
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#242321] leading-[1.15]">
                  Activos con propósito. <br />
                  <span className="text-[#1E3A2F]">
                    Inversiones con territorio.
                  </span>
                </h1>

                {/* Subtítulo Editorial */}
                <p className="text-sm sm:text-base text-[#6B6A63] max-w-xl leading-relaxed">
                  Descubre fincas, terrenos, bodegas y activos patrimoniales en Urabá, Darién y Colombia con dictamen técnico y legal.
                </p>
              </div>

              {/* BUSCADOR EN PÍLDORA FLOTANTE (AIRBNB UX PILL) INTEGRADO */}
              <div className="bg-white border border-[#E5E1D8] rounded-2xl sm:rounded-full p-3 sm:p-2 shadow-xl hover:shadow-2xl transition-all duration-300">
                <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 sm:divide-x divide-[#E5E1D8] text-xs">
                  
                  {/* Segmento 1: Territorio / Municipio */}
                  <div className="px-3.5 py-2 sm:py-1 space-y-0.5 text-left flex-1 hover:bg-[#F8F7F2] rounded-xl sm:rounded-l-full transition-colors cursor-pointer">
                    <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#1E3A2F] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0F766E]" /> Territorio
                    </label>
                    <select
                      value={municipality}
                      onChange={(e) => setMunicipality(e.target.value)}
                      className="w-full bg-transparent font-medium text-[#242321] focus:outline-none cursor-pointer text-xs"
                    >
                      <option value="">Apartadó, Turbo, Necoclí...</option>
                      <option value="Apartadó">Apartadó</option>
                      <option value="Turbo">Turbo</option>
                      <option value="Necoclí">Necoclí</option>
                      <option value="Carepa">Carepa</option>
                      <option value="Chigorodó">Chigorodó</option>
                      <option value="Acandí">Acandí</option>
                      <option value="Unguía">Unguía</option>
                    </select>
                  </div>

                  {/* Segmento 2: Tipo de Inmueble */}
                  <div className="px-3.5 py-2 sm:py-1 space-y-0.5 text-left flex-1 hover:bg-[#F8F7F2] transition-colors cursor-pointer">
                    <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#1E3A2F] flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-[#1E3A2F]" /> Tipo Activo
                    </label>
                    <select
                      value={assetType}
                      onChange={(e) => setAssetType(e.target.value)}
                      className="w-full bg-transparent font-medium text-[#242321] focus:outline-none cursor-pointer text-xs"
                    >
                      <option value="">Fincas, Bodegas...</option>
                      <option value="Finca">Fincas</option>
                      <option value="Terreno">Terrenos & Lotes</option>
                      <option value="Bodega">Bodegas</option>
                      <option value="Local">Locales</option>
                      <option value="Casa">Casas</option>
                      <option value="Activo Especial">Custodia SAE</option>
                    </select>
                  </div>

                  {/* Segmento 3: Modalidad */}
                  <div className="px-3.5 py-2 sm:py-1 space-y-0.5 text-left flex-1 hover:bg-[#F8F7F2] transition-colors cursor-pointer">
                    <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#1E3A2F] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" /> Modalidad
                    </label>
                    <select
                      value={modality}
                      onChange={(e) => setModality(e.target.value)}
                      className="w-full bg-transparent font-medium text-[#242321] focus:outline-none cursor-pointer text-xs"
                    >
                      <option value="">Venta, Arriendo...</option>
                      <option value="Venta">Venta</option>
                      <option value="Arriendo">Arriendo</option>
                      <option value="Custodia">Custodia SAE</option>
                      <option value="Inversión">Inversión</option>
                    </select>
                  </div>

                  {/* Botón Final: Lupa Verde */}
                  <div className="p-1 sm:pl-2 flex items-center justify-center">
                    <button
                      type="submit"
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1E3A2F] hover:bg-[#152921] text-white flex items-center justify-center shadow-md transition-all hover:scale-105"
                      title="Buscar Propiedades"
                    >
                      <Search className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>

                </form>
              </div>

              {/* Micro-Métricas Institucionales */}
              <div className="grid grid-cols-3 gap-3 pt-2 font-mono text-xs border-t border-[#E5E1D8]">
                <div className="space-y-0.5">
                  <div className="font-bold text-[#1E3A2F] text-sm">12.000+ Ha</div>
                  <div className="text-[#6B6A63] text-[11px]">Gestionadas</div>
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-[#0F766E] text-sm">Urabá & Darién</div>
                  <div className="text-[#6B6A63] text-[11px]">Cobertura Regional</div>
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-[#6D4C7D] text-sm">Custodia SAE</div>
                  <div className="text-[#6B6A63] text-[11px]">Especializada</div>
                </div>
              </div>

            </div>

            {/* COLUMNA DERECHA (5 COLUMNAS): TARJETA DESTACADA CON FOTO DE PREDIO INSIGNIA */}
            <div className="order-1 lg:order-2 lg:col-span-5 relative">
              {/* Decorative Subtle Backdrop Circle */}
              <div className="absolute -inset-4 bg-[#EEF4EF] rounded-[40px] -z-10 rotate-1 transform hidden sm:block" />

              {/* Featured Asset Floating Card */}
              <div className="bg-white border border-[#E5E1D8] rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl space-y-0 group transition-all duration-300">
                
                {/* Photo Container */}
                <div className="relative max-h-[260px] sm:max-h-[320px] h-60 sm:h-80 w-full overflow-hidden bg-[#F1EFE8]">
                  <img
                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
                    alt="Hacienda El Porvenir - Necoclí"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

                  {/* Floating Badges */}
                  <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex justify-between items-center z-10">
                    <span className="bg-[#C6A15B] text-[#242321] font-bold text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full shadow-md">
                      ★ Oportunidad Destacada
                    </span>
                    <span className="bg-white/90 backdrop-blur-md text-[#242321] font-mono text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-md">
                      Necoclí, Antioquia
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 z-10">
                    <span className="text-[10px] sm:text-xs font-mono font-bold text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/20">
                      DAR-FIN-001
                    </span>
                  </div>
                </div>

                {/* Footer of Floating Asset Card */}
                <div className="p-4 sm:p-5 space-y-3 text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[11px] font-mono text-[#1E3A2F] font-bold uppercase tracking-wider">
                        Finca Agroganadera & Bananera
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#242321] mt-0.5">
                        Hacienda El Porvenir
                      </h3>
                      <p className="text-xs text-[#6B6A63] mt-0.5 line-clamp-1">
                        140 Hectáreas planas con riego propio y frente costero.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-[#E5E1D8] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#6B6A63] font-mono block leading-none">Valor Comercial:</span>
                      <span className="font-serif font-bold text-[#1E3A2F] text-base sm:text-lg">
                        $4.200.000.000 COP
                      </span>
                    </div>

                    <Link
                      href="/propiedades/DAR-FIN-001"
                      className="px-3.5 py-2 rounded-xl bg-[#1E3A2F] hover:bg-[#152921] text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all hover:scale-105"
                    >
                      <span>+ Ver Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FILAS DE ACTIVOS HORIZONTALES CON FLECHAS DE NAVEGACIÓN (CARRUSELES AIRBNB) */}
      <div className="space-y-16">
        
        {/* Carrusel 1: Destacados */}
        <AssetCarouselSection
          title="Predios e Inversiones Destacadas en Urabá & Darién"
          subtitle="Oportunidades de alta valorización con dictamen de títulos y vocación productiva certificada."
          badge="Portafolio Exclusivo"
          badgeColor="text-[#1E3A2F]"
          properties={featuredProperties}
        />

        {/* Carrusel 2: Fincas & Activos Rurales */}
        <AssetCarouselSection
          title="Fincas & Activos Rurales de Alta Aptitud"
          subtitle="Tierras fértiles con fuentes hídricas permanentes, pastos mejorados y vocación agrologística."
          badge="Sector Agropecuario"
          badgeColor="text-[#23866D]"
          properties={ruralFarms}
        />

        {/* Carrusel 3: Renta Logística & Comercial */}
        <AssetCarouselSection
          title="Bodegas, Locales & Eje Portuario AAA"
          subtitle="Infraestructura lista para operación logística, acopio y comercio en Apartadó y Turbo."
          badge="Desarrollo Urbano & Logístico"
          badgeColor="text-[#0F766E]"
          properties={commercialLogistics}
        />

        {/* Carrusel 4: Custodia SAE */}
        <AssetCarouselSection
          title="Activos Especiales en Custodia SAE"
          subtitle="Predios territoriales bajo administración, custodia e inventario técnico institucional."
          badge="Custodia Especializada"
          badgeColor="text-[#6D4C7D]"
          properties={saeAssets}
        />

      </div>

      {/* 4. EXPLORAR POR CATEGORÍA */}
      <section className="bg-[#EEF4EF] border-y border-[#E5E1D8] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-1.5 max-w-2xl mx-auto">
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
