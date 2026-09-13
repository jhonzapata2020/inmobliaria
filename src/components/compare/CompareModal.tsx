'use client';

import React from 'react';
import { X, Layers, Trash2, MapPin } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { formatCurrency, formatArea, getLegalStatusBadge } from '../../lib/formatters';

export const CompareModal: React.FC = () => {
  const { 
    comparedProperties, 
    removeFromCompare, 
    clearCompare, 
    isCompareModalOpen, 
    setIsCompareModalOpen 
  } = useCompare();

  if (!isCompareModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md p-4 sm:p-6 md:p-10 flex justify-center animate-in fade-in duration-200">
      <div className="bg-slate-900 text-slate-100 w-full max-w-6xl rounded-2xl shadow-2xl border border-slate-800 flex flex-col my-auto max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-white">
                Comparador Técnico de Activos ({comparedProperties.length} de 4)
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Análisis comparativo de especificaciones, valores y estado jurídico
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={clearCompare}
              className="text-xs text-slate-400 hover:text-rose-400 font-medium transition-colors"
            >
              Vaciar Comparador
            </button>
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Matrix Content */}
        <div className="flex-1 overflow-x-auto p-6">
          {comparedProperties.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <p className="text-slate-400 text-sm">No has seleccionado propiedades para comparar.</p>
              <p className="text-xs text-slate-500">Haz clic en el botón &ldquo;Comparar&rdquo; en las tarjetas del catálogo.</p>
            </div>
          ) : (
            <div className="min-w-[700px] grid grid-cols-5 gap-4">
              
              {/* Row Header Labels Column */}
              <div className="space-y-6 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider pt-32">
                <div className="h-10 flex items-center">Precio / Canon</div>
                <div className="h-10 flex items-center">Área Total</div>
                <div className="h-10 flex items-center">Área Construida</div>
                <div className="h-10 flex items-center">Ubicación</div>
                <div className="h-10 flex items-center">Tipo de Activo</div>
                <div className="h-10 flex items-center">Estado Jurídico</div>
                <div className="h-10 flex items-center">Topografía</div>
                <div className="h-10 flex items-center">Acceso</div>
                <div className="h-10 flex items-center">Usos Potenciales</div>
              </div>

              {/* Property Item Columns */}
              {comparedProperties.map((prop) => {
                const legalBadge = getLegalStatusBadge(prop.legalStatus);
                return (
                  <div key={prop.id} className="space-y-6 text-xs bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    {/* Header info */}
                    <div className="h-32 space-y-2 relative">
                      <button
                        onClick={() => removeFromCompare(prop.id)}
                        className="absolute top-0 right-0 p-1 text-slate-500 hover:text-rose-400 rounded"
                        title="Quitar de la comparación"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700 inline-block">
                        {prop.code}
                      </span>
                      <h4 className="font-bold text-white text-sm line-clamp-2">{prop.title}</h4>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        {prop.municipality}
                      </div>
                    </div>

                    <div className="h-10 flex items-center font-bold text-emerald-400 text-sm font-mono">
                      {prop.modality === 'Venta' && formatCurrency(prop.salePriceCop)}
                      {prop.modality === 'Arriendo' && `${formatCurrency(prop.monthlyRentCop)}/m`}
                      {prop.modality === 'Custodia SAE' && 'Regulada SAE'}
                      {prop.modality === 'Inversión' && formatCurrency(prop.salePriceCop || prop.estimatedValueCop)}
                    </div>

                    <div className="h-10 flex items-center font-mono font-semibold text-slate-200">
                      {formatArea(prop.landAreaHa, prop.landAreaM2)}
                    </div>

                    <div className="h-10 flex items-center font-mono text-slate-300">
                      {prop.builtAreaM2 ? `${prop.builtAreaM2} m²` : 'N/A'}
                    </div>

                    <div className="h-10 flex items-center text-slate-300">
                      {prop.municipality}, {prop.department}
                    </div>

                    <div className="h-10 flex items-center font-semibold text-white">
                      {prop.assetType}
                    </div>

                    <div className="h-10 flex items-center">
                      <span className={`text-[10px] font-semibold px-2 py-1 rounded border ${legalBadge.bgClass} ${legalBadge.textClass} ${legalBadge.borderClass}`}>
                        {legalBadge.label}
                      </span>
                    </div>

                    <div className="h-10 flex items-center text-slate-300">
                      {prop.topography || 'N/A'}
                    </div>

                    <div className="h-10 flex items-center text-slate-300 line-clamp-2 text-[11px]">
                      {prop.accessRoads || 'N/A'}
                    </div>

                    <div className="h-10 flex items-center flex-wrap gap-1 text-[10px]">
                      {(prop.potentialUses || []).map((u) => (
                        <span key={u} className="px-1.5 py-0.5 bg-slate-800 text-teal-300 rounded">
                          {u}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
