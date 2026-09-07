'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LayoutGrid, Map, MapPin, SlidersHorizontal, Layers, Search, Sparkles } from 'lucide-react';
import { INITIAL_PROPERTIES } from '../../data/mockProperties';
import { PropertyFilterState, Property } from '../../types/property';
import { PropertyCard } from '../../components/catalog/PropertyCard';
import { AdvancedFilters } from '../../components/catalog/AdvancedFilters';
import { PropertyMap } from '../../components/map/PropertyMap';
import { useFavorites } from '../../context/FavoritesContext';

function PropiedadesCatalogContent() {
  const searchParams = useSearchParams();

  // Initial filters from query params
  const [filters, setFilters] = useState<PropertyFilterState>({
    searchQuery: searchParams.get('searchQuery') || '',
    modality: searchParams.get('modality') || '',
    assetType: searchParams.get('assetType') || '',
    department: searchParams.get('department') || '',
    municipality: searchParams.get('municipality') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minArea: searchParams.get('minArea') || '',
    maxArea: searchParams.get('maxArea') || '',
    legalStatus: searchParams.get('legalStatus') || '',
    potentialUse: searchParams.get('potentialUse') || '',
    availability: '',
    isInvestmentOpportunity: searchParams.get('isInvestmentOpportunity') === 'true',
    sortBy: 'recent'
  });

  const showOnlyFavorites = searchParams.get('favorites') === 'true';
  const { favoriteIds } = useFavorites();

  const [viewMode, setViewMode] = useState<'grid' | 'split' | 'map'>('grid');

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      modality: '',
      assetType: '',
      department: '',
      municipality: '',
      minPrice: '',
      maxPrice: '',
      minArea: '',
      maxArea: '',
      legalStatus: '',
      potentialUse: '',
      availability: '',
      isInvestmentOpportunity: false,
      sortBy: 'recent'
    });
  };

  // Filter & Sort Logic
  const filteredProperties = useMemo(() => {
    return INITIAL_PROPERTIES.filter((p) => {
      // Favorite filter
      if (showOnlyFavorites && !favoriteIds.includes(p.id)) return false;

      // Keyword search
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchCode = p.code.toLowerCase().includes(q);
        const matchMun = p.municipality.toLowerCase().includes(q);
        const matchDesc = p.shortDescription.toLowerCase().includes(q);
        if (!matchTitle && !matchCode && !matchMun && !matchDesc) return false;
      }

      // Modality
      if (filters.modality && p.modality !== filters.modality) return false;

      // Asset Type
      if (filters.assetType && p.assetType !== filters.assetType) return false;

      // Municipality
      if (filters.municipality && p.municipality !== filters.municipality) return false;

      // Legal status
      if (filters.legalStatus && p.legalStatus !== filters.legalStatus) return false;

      // Investment flag
      if (filters.isInvestmentOpportunity && !p.isInvestmentOpportunity) return false;

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return (a.price || a.monthlyRent || 0) - (b.price || b.monthlyRent || 0);
      if (filters.sortBy === 'price-desc') return (b.price || b.monthlyRent || 0) - (a.price || a.monthlyRent || 0);
      if (filters.sortBy === 'area-desc') return (b.areaTotalHa || b.areaTotalM2 || 0) - (a.areaTotalHa || a.areaTotalM2 || 0);
      if (filters.sortBy === 'featured') return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
    });
  }, [filters, showOnlyFavorites, favoriteIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-emerald-400 font-semibold tracking-wider">
            Marketplace Inmobiliario
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white mt-1">
            {showOnlyFavorites ? 'Mis Propiedades Favoritas' : 'Catálogo Visual de Propiedades'}
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Se encontraron <strong className="text-emerald-400 font-bold">{filteredProperties.length}</strong> activos validados
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-mono">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors font-semibold ${
              viewMode === 'grid' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Grid
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors font-semibold ${
              viewMode === 'split' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Lista & Mapa
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors font-semibold ${
              viewMode === 'map' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Map className="w-3.5 h-3.5" /> Mapa Full
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AdvancedFilters
        filters={filters}
        onFilterChange={setFilters}
        onResetFilters={handleResetFilters}
        totalResults={filteredProperties.length}
      />

      {/* VIEW MODE 1: GRID VIEW */}
      {viewMode === 'grid' && (
        <>
          {filteredProperties.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-4">
              <p className="text-slate-400 text-sm font-semibold">No se encontraron propiedades con los filtros aplicados.</p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Limpiar Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </>
      )}

      {/* VIEW MODE 2: SPLIT LIST & MAP */}
      {viewMode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 space-y-4 max-h-[800px] overflow-y-auto pr-2">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          <div className="lg:col-span-6 sticky top-24">
            <PropertyMap properties={filteredProperties} height="780px" />
          </div>
        </div>
      )}

      {/* VIEW MODE 3: FULL MAP */}
      {viewMode === 'map' && (
        <div className="space-y-4">
          <PropertyMap properties={filteredProperties} height="700px" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProperties.map((p) => (
              <div key={p.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                <span className="font-mono text-emerald-400 font-bold">{p.code}</span>
                <h4 className="font-bold text-white truncate">{p.title}</h4>
                <p className="text-slate-400">{p.municipality}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default function PropiedadesPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500 font-mono">
        Cargando Catálogo de Propiedades...
      </div>
    }>
      <PropiedadesCatalogContent />
    </Suspense>
  );
}
