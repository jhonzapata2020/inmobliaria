'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { LayoutGrid, Map, Layers } from 'lucide-react';
import { PropertyFilterState, Property } from '../../types/property';
import { PropertyCard } from '../../components/catalog/PropertyCard';
import { AdvancedFilters } from '../../components/catalog/AdvancedFilters';
import { PropertyMap } from '../../components/map/PropertyMap';
import { useFavorites } from '../../context/FavoritesContext';
import { getPublishedProperties } from '../actions/properties';

function PropiedadesCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    async function loadProperties() {
      setLoading(true);
      try {
        const data = await getPublishedProperties(filters);
        setProperties(data);
      } catch (err) {
        console.error('Failed to load published properties:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, [filters]);

  // Sync active filters to URL for shareable links
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.searchQuery) params.set('searchQuery', filters.searchQuery);
    if (filters.modality) params.set('modality', filters.modality);
    if (filters.assetType) params.set('assetType', filters.assetType);
    if (filters.municipality) params.set('municipality', filters.municipality);
    if (filters.department) params.set('department', filters.department);
    if (filters.minPrice) params.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice));
    if (filters.minArea) params.set('minArea', String(filters.minArea));
    if (filters.maxArea) params.set('maxArea', String(filters.maxArea));
    if (filters.legalStatus) params.set('legalStatus', filters.legalStatus);
    if (filters.isInvestmentOpportunity) params.set('isInvestmentOpportunity', 'true');
    if (showOnlyFavorites) params.set('favorites', 'true');

    const queryString = params.toString();
    const newPath = queryString ? `/propiedades?${queryString}` : '/propiedades';
    router.replace(newPath, { scroll: false });
  }, [filters, showOnlyFavorites, router]);

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

  const filteredProperties = useMemo(() => {
    if (!showOnlyFavorites) return properties;
    return properties.filter((p) => favoriteIds.includes(p.id));
  }, [properties, showOnlyFavorites, favoriteIds]);

  return (
    <div className="min-h-screen bg-[#F8F7F2] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Page Title Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-mono uppercase text-[#1E3A2F] font-bold tracking-wider">
              Marketplace Inmobiliario Premium
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#242321] mt-1">
              {showOnlyFavorites ? 'Mis Propiedades Favoritas' : 'Catálogo Visual de Propiedades'}
            </h1>
            <p className="text-xs text-[#6B6A63] font-mono mt-1">
              Se encontraron <strong className="text-[#1E3A2F] font-bold">{filteredProperties.length}</strong> activos validados en el portafolio
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-white border border-[#E5E1D8] p-1 rounded-xl text-xs font-mono shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors font-semibold ${
                viewMode === 'grid' ? 'bg-[#1E3A2F] text-white shadow' : 'text-[#6B6A63] hover:text-[#242321]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Grid
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors font-semibold ${
                viewMode === 'split' ? 'bg-[#0F766E] text-white shadow' : 'text-[#6B6A63] hover:text-[#242321]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Lista & Mapa
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors font-semibold ${
                viewMode === 'map' ? 'bg-[#C6A15B] text-[#242321] font-bold shadow' : 'text-[#6B6A63] hover:text-[#242321]'
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

        {/* Loading Indicator */}
        {loading ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#E5E1D8] text-xs font-mono text-[#6B6A63] shadow-sm">
            Consultando base de datos persistente en Supabase...
          </div>
        ) : (
          <>
            {/* VIEW MODE 1: GRID VIEW */}
            {viewMode === 'grid' && (
              <>
                {filteredProperties.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-2xl border border-[#E5E1D8] space-y-4 shadow-sm">
                    <p className="text-[#6B6A63] text-sm font-semibold">No se encontraron propiedades con los filtros aplicados.</p>
                    <button
                      onClick={handleResetFilters}
                      className="px-5 py-2.5 bg-[#1E3A2F] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-[#152921]"
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
                    <div key={p.id} className="p-3 bg-white rounded-xl border border-[#E5E1D8] text-xs shadow-sm">
                      <span className="font-mono text-[#1E3A2F] font-bold">{p.code}</span>
                      <h4 className="font-bold text-[#242321] truncate">{p.title}</h4>
                      <p className="text-[#6B6A63]">{p.municipality}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default function PropiedadesPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-[#6B6A63] font-mono">
        Cargando Catálogo de Propiedades...
      </div>
    }>
      <PropiedadesCatalogContent />
    </Suspense>
  );
}
