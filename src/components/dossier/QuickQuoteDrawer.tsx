'use client';

import React from 'react';
import { 
  X, 
  Trash2, 
  FileCheck2, 
  AlertTriangle, 
  Building2, 
  ArrowRight,
  ShieldCheck,
  Coins,
  MapPin,
  Ruler
} from 'lucide-react';
import { useDossier } from '../../context/DossierContext';
import { formatCurrency, formatArea, getLegalStatusBadge } from '../../lib/formatters';

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
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 text-slate-100 shadow-2xl border-l border-slate-800 flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  Dossier Ejecutivo & Cotizador
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  {summary.propertyCount} {summary.propertyCount === 1 ? 'activo seleccionado' : 'activos seleccionados'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Toast Notification when adding */}
          {lastAddedTitle && (
            <div className="mx-4 mt-3 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 flex items-center justify-between animate-in slide-in-from-top duration-200">
              <span className="truncate">¡Agregado al dossier: <strong>{lastAddedTitle}</strong>!</span>
              <span className="text-emerald-400 font-bold ml-2">✓</span>
            </div>
          )}

          {/* Mixed Modality Alert */}
          {summary.hasMixedModalities && (
            <div className="mx-4 mt-3 p-3 bg-amber-950/70 border border-amber-600/50 rounded-xl text-xs text-amber-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Modalidades Combinadas</span>
                Tu dossier incluye activos en <strong>Venta</strong>, <strong>Arriendo</strong> o <strong>Custodia SAE</strong>. Los totales financieros se desglosan por categoría.
              </div>
            </div>
          )}

          {/* Selected Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {selectedProperties.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto text-slate-600">
                  <Building2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-300">Tu Dossier está vacío</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Explora el catálogo y haz clic en &ldquo;Agregar al Dossier&rdquo; para consolidar propiedades y solicitar una cotización ejecutiva.
                  </p>
                </div>
              </div>
            ) : (
              selectedProperties.map((prop) => {
                const legalBadge = getLegalStatusBadge(prop.legalStatus);
                return (
                  <div 
                    key={prop.id}
                    className="p-3.5 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 rounded-xl space-y-2.5 transition-all duration-150 relative group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-slate-900 text-emerald-400 rounded">
                            {prop.code}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${legalBadge.bgClass} ${legalBadge.textClass} ${legalBadge.borderClass}`}>
                            {legalBadge.label}
                          </span>
                        </div>
                        <h4 className="font-semibold text-sm text-white mt-1 line-clamp-1">
                          {prop.title}
                        </h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-emerald-400" />
                          {prop.municipality}, {prop.department}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromDossier(prop.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="Eliminar del dossier"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-700/40">
                      <div className="flex items-center gap-1 text-slate-300 font-mono">
                        <Ruler className="w-3.5 h-3.5 text-teal-400" />
                        {formatArea(prop.areaTotalHa, prop.areaTotalM2)}
                      </div>
                      <div className="font-semibold text-emerald-400">
                        {prop.modality === 'Venta' && formatCurrency(prop.price)}
                        {prop.modality === 'Arriendo' && `${formatCurrency(prop.monthlyRent)}/mes`}
                        {prop.modality === 'Custodia' && 'Regulada SAE'}
                        {prop.modality === 'Inversión' && formatCurrency(prop.price || prop.estimatedValue)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Consolidated Quick Calculations & Footer */}
          {selectedProperties.length > 0 && (
            <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-4">
                  <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Área Consolidada:</span>
                  <span className="font-mono font-semibold text-slate-200 text-right">
                    {summary.totalAreaHa > 0 && <span className="block">{summary.totalAreaHa.toLocaleString('es-CO')} Ha</span>}
                    {summary.totalAreaM2 > 0 && <span className="block text-slate-400">{summary.totalAreaM2.toLocaleString('es-CO')} m²</span>}
                  </span>
                </div>
                {summary.hasSale && (
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Total Estimado Venta:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {formatCurrency(summary.totalSalePrice)}
                    </span>
                  </div>
                )}
                {summary.hasRent && (
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Canon Mensual Consolidado:</span>
                    <span className="font-mono font-bold text-teal-300">
                      {formatCurrency(summary.totalMonthlyRent)}/mes
                    </span>
                  </div>
                )}
                {summary.hasCustody && (
                  <div className="flex justify-between items-center text-purple-300 font-mono text-[11px]">
                    <span>Custodia Especial SAE:</span>
                    <span>Sujeto a normativa institucional</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={clearDossier}
                  className="px-3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-300 text-xs font-medium transition-colors"
                >
                  Vaciar
                </button>
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setIsExecutiveModalOpen(true);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01]"
                >
                  <span>Generar Dossier Ejecutivo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
