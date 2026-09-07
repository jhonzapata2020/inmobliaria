'use client';

import React, { useState } from 'react';
import { 
  Filter, 
  RotateCcw, 
  Search, 
  X, 
  ChevronDown, 
  Sparkles,
  Building2,
  MapPin,
  Coins,
  ShieldCheck,
  Check
} from 'lucide-react';
import { PropertyFilterState } from '../../types/property';

interface AdvancedFiltersProps {
  filters: PropertyFilterState;
  onFilterChange: (newFilters: PropertyFilterState) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const updateField = (field: keyof PropertyFilterState, value: any) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  // Active filter labels count
  const activeFiltersCount = [
    filters.modality,
    filters.assetType,
    filters.department,
    filters.municipality,
    filters.minPrice,
    filters.maxPrice,
    filters.minArea,
    filters.maxArea,
    filters.legalStatus,
    filters.potentialUse,
    filters.availability,
    filters.isInvestmentOpportunity ? 'Inversión' : ''
  ].filter(Boolean).length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Top Search Bar & Filter Toggle */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Main Keyword Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por código (ej. DAR-FIN-001), municipio, título o características..."
            value={filters.searchQuery}
            onChange={(e) => updateField('searchQuery', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          {filters.searchQuery && (
            <button
              onClick={() => updateField('searchQuery', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Investment Opportunity Toggle */}
          <button
            onClick={() => updateField('isInvestmentOpportunity', !filters.isInvestmentOpportunity)}
            className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              filters.isInvestmentOpportunity
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Oportunidad Inversión</span>
          </button>

          {/* Reset Filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={onResetFilters}
              className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-400 hover:text-rose-300 hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
              title="Limpiar todos los filtros"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Limpiar</span>
            </button>
          )}

          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="md:hidden px-4 py-2.5 rounded-xl bg-teal-600 text-white font-medium text-xs flex items-center gap-2 shadow-md"
          >
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="bg-white text-teal-900 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Primary Filter Grid (Desktop View) */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-3 text-xs pt-2 border-t border-slate-800/80">
        
        {/* Modality */}
        <div>
          <label className="block text-slate-400 mb-1 font-mono">Modalidad</label>
          <select
            value={filters.modality}
            onChange={(e) => updateField('modality', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="">Todas las modalidades</option>
            <option value="Venta">Venta</option>
            <option value="Arriendo">Arriendo</option>
            <option value="Custodia">Custodia SAE</option>
            <option value="Inversión">Oportunidad Inversión</option>
          </select>
        </div>

        {/* Asset Type */}
        <div>
          <label className="block text-slate-400 mb-1 font-mono">Tipo de Activo</label>
          <select
            value={filters.assetType}
            onChange={(e) => updateField('assetType', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="">Todos los tipos</option>
            <option value="Finca">Fincas</option>
            <option value="Terreno">Terrenos / Lotes</option>
            <option value="Bodega">Bodegas</option>
            <option value="Edificio">Edificios</option>
            <option value="Local">Locales Comerciales</option>
            <option value="Casa">Casas Campestres</option>
            <option value="Activo Especial">Activo Especial SAE</option>
          </select>
        </div>

        {/* Municipality */}
        <div>
          <label className="block text-slate-400 mb-1 font-mono">Municipio / Zona</label>
          <select
            value={filters.municipality}
            onChange={(e) => updateField('municipality', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="">Todos los municipios</option>
            <option value="Necoclí">Necoclí (Antioquia)</option>
            <option value="Turbo">Turbo (Antioquia)</option>
            <option value="Apartadó">Apartadó (Antioquia)</option>
            <option value="Carepa">Carepa (Antioquia)</option>
            <option value="Chigorodó">Chigorodó (Antioquia)</option>
            <option value="Mutatá">Mutatá (Antioquia)</option>
            <option value="Acandí">Acandí (Chocó)</option>
            <option value="Unguía">Unguía (Chocó)</option>
          </select>
        </div>

        {/* Legal Status */}
        <div>
          <label className="block text-slate-400 mb-1 font-mono">Estado Jurídico</label>
          <select
            value={filters.legalStatus}
            onChange={(e) => updateField('legalStatus', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="">Cualquier estado</option>
            <option value="Saneado">Saneado 100%</option>
            <option value="En estudio jurídico">En estudio jurídico</option>
            <option value="Activo especial SAE">Activo Especial SAE</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-slate-400 mb-1 font-mono">Ordenar por</label>
          <select
            value={filters.sortBy}
            onChange={(e) => updateField('sortBy', e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-semibold"
          >
            <option value="recent">Más recientes primero</option>
            <option value="featured">Destacadas primero</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="area-desc">Mayor Área Total</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 mb-1 font-mono">Precio mínimo (COP)</label>
          <input
            type="number"
            min="0"
            value={filters.minPrice}
            onChange={(e) => updateField('minPrice', e.target.value)}
            placeholder="Sin mínimo"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1 font-mono">Precio máximo (COP)</label>
          <input
            type="number"
            min="0"
            value={filters.maxPrice}
            onChange={(e) => updateField('maxPrice', e.target.value)}
            placeholder="Sin máximo"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1 font-mono">Área mínima (Ha)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={filters.minArea}
            onChange={(e) => updateField('minArea', e.target.value)}
            placeholder="Sin mínimo"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1 font-mono">Área máxima (Ha)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={filters.maxArea}
            onChange={(e) => updateField('maxArea', e.target.value)}
            placeholder="Sin máximo"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60 text-xs">
          <span className="text-slate-500 font-mono">Filtros Activos:</span>
          {filters.modality && (
            <span className="px-2.5 py-1 bg-slate-800 text-emerald-300 rounded-lg border border-slate-700 flex items-center gap-1">
              Modalidad: {filters.modality}
              <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => updateField('modality', '')} />
            </span>
          )}
          {filters.assetType && (
            <span className="px-2.5 py-1 bg-slate-800 text-teal-300 rounded-lg border border-slate-700 flex items-center gap-1">
              Tipo: {filters.assetType}
              <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => updateField('assetType', '')} />
            </span>
          )}
          {filters.municipality && (
            <span className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded-lg border border-slate-700 flex items-center gap-1">
              Ubicación: {filters.municipality}
              <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => updateField('municipality', '')} />
            </span>
          )}
          {filters.legalStatus && (
            <span className="px-2.5 py-1 bg-slate-800 text-amber-300 rounded-lg border border-slate-700 flex items-center gap-1">
              Jurídico: {filters.legalStatus}
              <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => updateField('legalStatus', '')} />
            </span>
          )}
        </div>
      )}

      {/* Mobile Filters Modal */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md p-4 flex flex-col justify-end md:hidden">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">Filtros de Búsqueda Avanzada</h3>
              <button onClick={() => setMobileDrawerOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Modalidad</label>
                <select
                  value={filters.modality}
                  onChange={(e) => updateField('modality', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                >
                  <option value="">Todas las modalidades</option>
                  <option value="Venta">Venta</option>
                  <option value="Arriendo">Arriendo</option>
                  <option value="Custodia">Custodia SAE</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Tipo de Activo</label>
                <select
                  value={filters.assetType}
                  onChange={(e) => updateField('assetType', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                >
                  <option value="">Todos los tipos</option>
                  <option value="Finca">Fincas</option>
                  <option value="Terreno">Terrenos / Lotes</option>
                  <option value="Bodega">Bodegas</option>
                  <option value="Edificio">Edificios</option>
                  <option value="Local">Locales Comerciales</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Municipio</label>
                <select
                  value={filters.municipality}
                  onChange={(e) => updateField('municipality', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                >
                  <option value="">Todos los municipios</option>
                  <option value="Necoclí">Necoclí</option>
                  <option value="Turbo">Turbo</option>
                  <option value="Apartadó">Apartadó</option>
                  <option value="Carepa">Carepa</option>
                  <option value="Chigorodó">Chigorodó</option>
                  <option value="Acandí">Acandí</option>
                  <option value="Unguía">Unguía</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Precio mínimo</label>
                  <input
                    type="number"
                    min="0"
                    value={filters.minPrice}
                    onChange={(e) => updateField('minPrice', e.target.value)}
                    placeholder="COP"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Precio máximo</label>
                  <input
                    type="number"
                    min="0"
                    value={filters.maxPrice}
                    onChange={(e) => updateField('maxPrice', e.target.value)}
                    placeholder="COP"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Área mínima (Ha)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={filters.minArea}
                    onChange={(e) => updateField('minArea', e.target.value)}
                    placeholder="Ha"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Área máxima (Ha)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={filters.maxArea}
                    onChange={(e) => updateField('maxArea', e.target.value)}
                    placeholder="Ha"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Estado jurídico</label>
                <select
                  value={filters.legalStatus}
                  onChange={(e) => updateField('legalStatus', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                >
                  <option value="">Cualquier estado</option>
                  <option value="Saneado">Saneado 100%</option>
                  <option value="En estudio jurídico">En estudio jurídico</option>
                  <option value="Activo especial SAE">Activo Especial SAE</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex gap-2">
              <button
                onClick={onResetFilters}
                className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Limpiar
              </button>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Aplicar ({totalResults})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
