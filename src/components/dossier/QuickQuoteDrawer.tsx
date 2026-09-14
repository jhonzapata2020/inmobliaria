'use client';

import React from 'react';
import { 
  X, 
  Trash2, 
  FileCheck2, 
  AlertTriangle, 
  Building2, 
  ArrowRight,
  MapPin,
  Ruler
} from 'lucide-react';
import { useDossier } from '../../context/DossierContext';
import { formatCurrency, formatArea, getLegalStatusBadge, isPriceToNegotiate } from '../../lib/formatters';

export const QuickQuoteDrawer: React.FC = () => {
  const { 
    selectedProperties, 
    removeFromDossier, 
    clearDossier, 
    summary, 
    isDrawerOpen, 
    setIsDrawerOpen,
    setIsExecutiveModalOpen,
    lastAddedTitle
  } = useDossier();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg md:max-w-3xl lg:max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#E5E1D8]">
        
        {/* Header - Fixed */}
        <div className="p-5 bg-[#F8F7F2] border-b border-[#E5E1D8] flex items-start justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#EEF4EF] text-[#1E3A2F] rounded-xl border border-[#E5E1D8] shrink-0">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#242321]">
                  Dossier Ejecutivo & Cotizador
                </h2>
                <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#1E3A2F] text-white rounded-md">
                  {summary.propertyCount} {summary.propertyCount === 1 ? 'activo' : 'activos'}
                </span>
              </div>
              <p className="text-xs text-[#6B6A63] mt-0.5">
                Resumen de activos seleccionados para consolidación de portafolio y cotización formal.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-2 rounded-xl text-[#6B6A63] hover:text-[#242321] hover:bg-[#E5E1D8] transition-colors shrink-0"
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Notification when adding */}
        {lastAddedTitle && (
          <div className="mx-5 mt-3 p-3 bg-[#EEF4EF] border border-[#23866D]/40 rounded-xl text-xs text-[#1E3A2F] flex items-center justify-between flex-shrink-0 animate-in slide-in-from-top duration-200">
            <span className="truncate">¡Agregado al dossier: <strong>{lastAddedTitle}</strong>!</span>
            <span className="text-[#23866D] font-bold ml-2">✓</span>
          </div>
        )}

        {/* Mixed Modality Alert */}
        {summary.hasMixedModalities && (
          <div className="mx-5 mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5 flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Modalidades Combinadas</span>
              Tu dossier incluye activos en <strong>Venta</strong>, <strong>Arriendo</strong> o <strong>Custodia SAE</strong>. Los totales financieros se desglosan por categoría.
            </div>
          </div>
        )}

        {/* Selected Items List - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5">
          {selectedProperties.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F1EFE8] flex items-center justify-center mx-auto text-[#929087]">
                <Building2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[#242321]">Tu Dossier está vacío</p>
                <p className="text-xs text-[#6B6A63] max-w-sm mx-auto">
                  Explora el catálogo y haz clic en &ldquo;Agregar al Dossier&rdquo; para consolidar propiedades y solicitar una cotización ejecutiva.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedProperties.map((prop) => {
                const legalBadge = getLegalStatusBadge(prop.legalStatus);
                return (
                  <div 
                    key={prop.id}
                    className="p-4 bg-[#F8F7F2] hover:bg-[#F1EFE8] border border-[#E5E1D8] rounded-xl flex flex-col justify-between gap-3 transition-all duration-150 relative group shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 pr-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-[#1E3A2F] text-white rounded">
                            {prop.code}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${legalBadge.bgClass} ${legalBadge.textClass} ${legalBadge.borderClass}`}>
                            {legalBadge.label}
                          </span>
                        </div>
                        <h4 className="font-semibold text-sm text-[#242321] line-clamp-1">
                          {prop.title}
                        </h4>
                        <p className="text-xs text-[#6B6A63] flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                          <span className="truncate">{prop.municipality}, {prop.department}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromDossier(prop.id)}
                        className="p-1.5 text-[#929087] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                        title="Eliminar del dossier"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2.5 border-t border-[#E5E1D8]">
                      <div className="flex items-center gap-1 text-[#6B6A63] font-mono">
                        <Ruler className="w-3.5 h-3.5 text-[#0F766E]" />
                        {formatArea(prop.landAreaHa, prop.landAreaM2)}
                      </div>
                      <div className="font-semibold text-[#1E3A2F]">
                        {isPriceToNegotiate(prop) ? (
                          <span className="text-stone-700">A convenir</span>
                        ) : (
                          <>
                            {prop.modality === 'Venta' && formatCurrency(prop.salePriceCop)}
                            {prop.modality === 'Arriendo' && `${formatCurrency(prop.monthlyRentCop)}/mes`}
                            {prop.modality === 'Custodia SAE' && 'Regulada SAE'}
                            {prop.modality === 'Inversión' && formatCurrency(prop.salePriceCop || prop.estimatedValueCop)}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Consolidated Quick Calculations & Footer - Fixed */}
        {selectedProperties.length > 0 && (
          <div className="p-5 bg-[#F8F7F2] border-t border-[#E5E1D8] space-y-4 flex-shrink-0">
            <div className="p-3.5 bg-white rounded-xl border border-[#E5E1D8] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex sm:flex-col justify-between sm:justify-center text-[#6B6A63]">
                <span className="text-[11px] font-mono text-[#6B6A63]">Área Consolidada:</span>
                <span className="font-mono font-bold text-[#242321] text-sm">
                  {summary.totalAreaHa > 0 ? `${summary.totalAreaHa.toLocaleString('es-CO')} Ha` : `${summary.totalAreaM2.toLocaleString('es-CO')} m²`}
                </span>
              </div>
              {summary.hasSale && (
                <div className="flex sm:flex-col justify-between sm:justify-center text-[#6B6A63]">
                  <span className="text-[11px] font-mono text-[#6B6A63]">Total Estimado Venta:</span>
                  <span className="font-mono font-bold text-[#1E3A2F] text-sm">
                    {formatCurrency(summary.totalSalePrice)}
                  </span>
                </div>
              )}
              {summary.hasRent && (
                <div className="flex sm:flex-col justify-between sm:justify-center text-[#6B6A63]">
                  <span className="text-[11px] font-mono text-[#6B6A63]">Canon Mensual Consolidado:</span>
                  <span className="font-mono font-bold text-[#0F766E] text-sm">
                    {formatCurrency(summary.totalMonthlyRent)}/mes
                  </span>
                </div>
              )}
              {summary.hasCustody && !summary.hasSale && !summary.hasRent && (
                <div className="flex sm:flex-col justify-between sm:justify-center text-[#6D4C7D] font-mono text-xs">
                  <span>Custodia Especial SAE:</span>
                  <span className="font-bold">Regulada Institucional</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={clearDossier}
                className="px-4 py-3 rounded-xl bg-[#F1EFE8] hover:bg-[#E5E1D8] text-[#6B6A63] hover:text-rose-600 text-xs font-semibold transition-colors border border-[#E5E1D8]"
              >
                Vaciar
              </button>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  setIsExecutiveModalOpen(true);
                }}
                className="flex-1 py-3.5 px-5 rounded-xl bg-[#1E3A2F] hover:bg-[#152921] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01]"
              >
                <span>Generar Dossier Ejecutivo</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
