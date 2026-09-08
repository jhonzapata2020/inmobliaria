'use client';

import React, { useState } from 'react';
import { 
  Filter, 
  RotateCcw, 
  Search, 
  X, 
  Sparkles,
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

  const quickChips = [
    { label: 'Venta', action: () => updateField('modality', filters.modality === 'Venta' ? '' : 'Venta'), isActive: filters.modality === 'Venta' },
    { label: 'Arriendo', action: () => updateField('modality', filters.modality === 'Arriendo' ? '' : 'Arriendo'), isActive: filters.modality === 'Arriendo' },
    { label: 'Fincas', action: () => updateField('assetType', filters.assetType === 'Finca' ? '' : 'Finca'), isActive: filters.assetType === 'Finca' },
    { label: 'Lotes / Terrenos', action: () => updateField('assetType', filters.assetType === 'Terreno' ? '' : 'Terreno'), isActive: filters.assetType === 'Terreno' },
    { label: 'Bodegas', action: () => updateField('assetType', filters.assetType === 'Bodega' ? '' : 'Bodega'), isActive: filters.assetType === 'Bodega' },
    { label: 'Saneado 100%', action: () => updateField('legalStatus', filters.legalStatus === 'Saneado' ? '' : 'Saneado'), isActive: filters.legalStatus === 'Saneado' },
    { label: 'Custodia SAE', action: () => updateField('modality', filters.modality === 'Custodia' ? '' : 'Custodia'), isActive: filters.modality === 'Custodia', isPurple: true },
    { label: 'Alta valorización', action: () => updateField('isInvestmentOpportunity', !filters.isInvestmentOpportunity), isActive: filters.isInvestmentOpportunity, isGold: true },
  ];

  return (
    <div className="bg-white border border-[#E5E1D8] rounded-2xl p-5 shadow-sm space-y-4">
      
      {/* Quick Chips Row */}
      <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-[#E5E1D8]">
        <span className="text-xs font-mono font-bold text-[#6B6A63] uppercase tracking-wider mr-1">Filtros Rápidos:</span>
        {quickChips.map((chip, idx) => {
          let activeStyles = 'bg-[#1E3A2F] text-white border-[#1E3A2F]';
          if (chip.isPurple) activeStyles = 'bg-[#6D4C7D] text-white border-[#6D4C7D]';
          if (chip.isGold) activeStyles = 'bg-[#C6A15B] text-[#242321] font-bold border-[#C6A15B]';

          return (
            <button
              key={idx}
              onClick={chip.action}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 ${
                chip.isActive
                  ? activeStyles
                  : 'bg-[#F8F7F2] text-[#242321] border-[#E5E1D8] hover:bg-[#E5E1D8]'
              }`}
            >
              {chip.isActive && <Check className="w-3.5 h-3.5" />}
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* Top Search Bar & Action Toggle */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Main Keyword Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#6B6A63] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por código (ej. DAR-FIN-001), municipio, título o características..."
            value={filters.searchQuery}
            onChange={(e) => updateField('searchQuery', e.target.value)}
            className="w-full bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#242321] placeholder-[#929087] focus:outline-none focus:border-[#1E3A2F] focus:ring-1 focus:ring-[#1E3A2F] transition-colors"
          />
          {filters.searchQuery && (
            <button
              onClick={() => updateField('searchQuery', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#929087] hover:text-[#242321]"
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
                ? 'bg-[#C6A15B]/20 text-[#C6A15B] border-[#C6A15B]/60 shadow-sm'
                : 'bg-[#F8F7F2] border-[#E5E1D8] text-[#6B6A63] hover:text-[#242321]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>Oportunidad Inversión</span>
          </button>

          {/* Reset Filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={onResetFilters}
              className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-[#F1EFE8] text-[#6B6A63] hover:text-rose-600 hover:bg-[#E5E1D8] flex items-center gap-1.5 transition-colors border border-[#E5E1D8]"
              title="Limpiar todos los filtros"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Limpiar</span>
            </button>
          )}

          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="md:hidden px-4 py-2.5 rounded-xl bg-[#1E3A2F] text-white font-medium text-xs flex items-center gap-2 shadow-sm"
          >
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="bg-white text-[#1E3A2F] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Primary Filter Grid (Desktop View) */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-3 text-xs pt-2 border-t border-[#E5E1D8]">
        
        {/* Modality */}
        <div>
          <label className="block text-[#6B6A63] mb-1 font-mono font-medium">Modalidad</label>
          <select
            value={filters.modality}
            onChange={(e) => updateField('modality', e.target.value)}
            className="w-full bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl px-3 py-2 text-[#242321] focus:outline-none focus:border-[#1E3A2F]"
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
          <label className="block text-[#6B6A63] mb-1 font-mono font-medium">Tipo de Activo</label>
          <select
            value={filters.assetType}
            onChange={(e) => updateField('assetType', e.target.value)}
            className="w-full bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl px-3 py-2 text-[#242321] focus:outline-none focus:border-[#1E3A2F]"
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
          <label className="block text-[#6B6A63] mb-1 font-mono font-medium">Municipio / Zona</label>
          <select
            value={filters.municipality}
            onChange={(e) => updateField('municipality', e.target.value)}
            className="w-full bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl px-3 py-2 text-[#242321] focus:outline-none focus:border-[#1E3A2F]"
          >
            <option value="">Todos los municipios</option>
            <option value="Necoclí">Necoclí (Antioquia)</option>
            <option value="Turbo">Turbo (Antioquia)</option>
            <option value="Apartadó">Apartadó (Antioquia)</option>
            <option value="Carepa">Carepa (Antioquia)</option>
            <option value="Chigorodó">Chigorodó (Antioquia)</option>
            <option value="Acandí">Acandí (Chocó)</option>
            <option value="Unguía">Unguía (Chocó)</option>
          </select>
        </div>

        {/* Legal Status */}
        <div>
          <label className="block text-[#6B6A63] mb-1 font-mono font-medium">Estado Jurídico</label>
          <select
            value={filters.legalStatus}
            onChange={(e) => updateField('legalStatus', e.target.value)}
            className="w-full bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl px-3 py-2 text-[#242321] focus:outline-none focus:border-[#1E3A2F]"
          >
            <option value="">Cualquier estado</option>
            <option value="Saneado">Saneado 100%</option>
            <option value="En estudio jurídico">En estudio jurídico</option>
            <option value="Activo especial SAE">Activo Especial SAE</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-[#6B6A63] mb-1 font-mono font-medium">Ordenar por</label>
          <select
            value={filters.sortBy}
            onChange={(e) => updateField('sortBy', e.target.value as any)}
            className="w-full bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl px-3 py-2 text-[#242321] focus:outline-none focus:border-[#1E3A2F] font-semibold"
          >
            <option value="recent">Más recientes primero</option>
            <option value="featured">Destacadas primero</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="area-desc">Mayor Área Total</option>
          </select>
        </div>

        <div>
          <label className="block text-[#6B6A63] mb-1 font-mono font-medium">Precio mínimo (COP)</label>
          <input
            type="number"
            min="0"
            value={filters.minPrice}
            onChange={(e) => updateField('minPrice', e.target.value)}
            placeholder="Sin mínimo"
            className="w-full bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl px-3 py-2 text-[#242321] focus:outline-none focus:border-[#1E3A2F]"
          />
        </div>

        <div>
          <label className="block text-[#6B6A63] mb-1 font-mono font-medium">Precio máximo (COP)</label>
          <input
            type="number"
            min="0"
            value={filters.maxPrice}
            onChange={(e) => updateField('maxPrice', e.target.value)}
            placeholder="Sin máximo"
            className="w-full bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl px-3 py-2 text-[#242321] focus:outline-none focus:border-[#1E3A2F]"
          />
        </div>

        <div>
          <label className="block text-[#6B6A63] mb-1 font-mono font-medium">Área mínima (Ha)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={filters.minArea}
            onChange={(e) => updateField('minArea', e.target.value)}
            placeholder="Sin mínimo"
            className="w-full bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl px-3 py-2 text-[#242321] focus:outline-none focus:border-[#1E3A2F]"
          />
        </div>

        <div>
          <label className="block text-[#6B6A63] mb-1 font-mono font-medium">Área máxima (Ha)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={filters.maxArea}
            onChange={(e) => updateField('maxArea', e.target.value)}
            placeholder="Sin máximo"
            className="w-full bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl px-3 py-2 text-[#242321] focus:outline-none focus:border-[#1E3A2F]"
          />
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E5E1D8] text-xs">
          <span className="text-[#6B6A63] font-mono">Filtros Activos:</span>
          {filters.modality && (
            <span className="px-2.5 py-1 bg-[#F8F7F2] text-[#1E3A2F] rounded-lg border border-[#E5E1D8] flex items-center gap-1 font-medium">
              Modalidad: {filters.modality}
              <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => updateField('modality', '')} />
            </span>
          )}
          {filters.assetType && (
            <span className="px-2.5 py-1 bg-[#F8F7F2] text-[#0F766E] rounded-lg border border-[#E5E1D8] flex items-center gap-1 font-medium">
              Tipo: {filters.assetType}
              <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => updateField('assetType', '')} />
            </span>
          )}
          {filters.municipality && (
            <span className="px-2.5 py-1 bg-[#F8F7F2] text-[#242321] rounded-lg border border-[#E5E1D8] flex items-center gap-1 font-medium">
              Ubicación: {filters.municipality}
              <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => updateField('municipality', '')} />
            </span>
          )}
          {filters.legalStatus && (
            <span className="px-2.5 py-1 bg-[#F8F7F2] text-[#C9795B] rounded-lg border border-[#E5E1D8] flex items-center gap-1 font-medium">
              Jurídico: {filters.legalStatus}
              <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => updateField('legalStatus', '')} />
            </span>
          )}
        </div>
      )}

      {/* Mobile Filters Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 flex flex-col justify-end md:hidden">
          <div className="bg-white border border-[#E5E1D8] rounded-2xl p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#E5E1D8]">
              <h3 className="font-bold text-[#242321] text-sm">Filtros de Búsqueda Avanzada</h3>
              <button onClick={() => setMobileDrawerOpen(false)} className="text-[#6B6A63]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#6B6A63] mb-1 font-mono font-medium">Modalidad</label>
                <select
                  value={filters.modality}
                  onChange={(e) => updateField('modality', e.target.value)}
                  className="w-full bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl px-3 py-2.5 text-[#242321]"
                >
                  <option value="">Todas las modalidades</option>
                  <option value="Venta">Venta</option>
                  <option value="Arriendo">Arriendo</option>
                  <option value="Custodia">Custodia SAE</option>
                </select>
              </div>

              <div>
                <label className="block text-[#6B6A63] mb-1 font-mono font-medium">Tipo de Activo</label>
                <select
                  value={filters.assetType}
                  onChange={(e) => updateField('assetType', e.target.value)}
                  className="w-full bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl px-3 py-2.5 text-[#242321]"
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
                <label className="block text-[#6B6A63] mb-1 font-mono font-medium">Municipio</label>
                <select
                  value={filters.municipality}
                  onChange={(e) => updateField('municipality', e.target.value)}
                  className="w-full bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl px-3 py-2.5 text-[#242321]"
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
            </div>

            <div className="pt-3 border-t border-[#E5E1D8] flex gap-2">
              <button
                onClick={onResetFilters}
                className="flex-1 py-2.5 bg-[#F1EFE8] text-[#242321] rounded-xl text-xs font-semibold"
              >
                Limpiar
              </button>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="flex-1 py-2.5 bg-[#1E3A2F] text-white rounded-xl text-xs font-bold"
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
