'use client';

import React, { useMemo } from 'react';
import { 
  X, 
  Printer, 
  Building2, 
  FileSpreadsheet, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MapPin
} from 'lucide-react';
import { Property, PropertyFilterState } from '../../types/property';
import { formatCurrency, formatArea } from '../../lib/formatters';

interface ExecutiveInventoryReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  filters: PropertyFilterState;
}

export const ExecutiveInventoryReportModal: React.FC<ExecutiveInventoryReportModalProps> = ({
  isOpen,
  onClose,
  properties,
  filters
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const activeFiltersSummary = useMemo(() => {
    const parts: string[] = [];
    if (filters.searchQuery) parts.push(`Búsqueda: "${filters.searchQuery}"`);
    if (filters.municipality) parts.push(`Municipio: ${filters.municipality}`);
    if (filters.department) parts.push(`Depto: ${filters.department}`);
    if (filters.assetType) parts.push(`Tipo: ${filters.assetType}`);
    if (filters.modality) parts.push(`Modalidad: ${filters.modality}`);
    if (filters.legalStatus) parts.push(`Estado Jurídico: ${filters.legalStatus}`);
    if (filters.isInvestmentOpportunity) parts.push(`Alta Valorización`);
    if (filters.minAreaHa || filters.maxAreaHa) {
      parts.push(`Área: ${filters.minAreaHa || 0} - ${filters.maxAreaHa || '∞'} Ha`);
    }
    return parts.length > 0 ? parts.join(' • ') : 'Portafolio Completo (Sin Filtros)';
  }, [filters]);

  const getOccupancyBadge = (status?: string) => {
    switch (status) {
      case 'Desocupado':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Desocupado</span>;
      case 'Ocupado':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">Ocupado</span>;
      case 'Arrendado':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">Arrendado</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-300">Sin especificar</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center animate-in fade-in duration-200 executive-dossier-backdrop print:static print:bg-white print:p-0 print:m-0 print:overflow-visible">
      <div className="bg-white text-[#242321] w-full max-w-6xl max-h-[92vh] rounded-2xl shadow-2xl border border-[#E5E1D8] flex flex-col overflow-hidden executive-dossier-card print:static print:shadow-none print:border-none print:max-w-full print:max-h-none print:overflow-visible">
        
        {/* Top Control Bar (Screen Only) */}
        <div className="p-4 bg-[#F8F7F2] border-b border-[#E5E1D8] flex flex-wrap items-center justify-between gap-3 no-print print:hidden shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-900 rounded-lg">
              <FileSpreadsheet className="w-5 h-5 text-emerald-800" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Sábana de Inventario Predial
              </span>
              <h2 className="text-base font-bold text-[#242321] font-serif mt-0.5">
                Informe Ejecutivo Tabular ({properties.length} Predios)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E3A2F] hover:bg-[#152921] text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Exportar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#6B6A63] hover:text-[#242321] hover:bg-[#E5E1D8] rounded-xl transition-colors cursor-pointer"
              title="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div 
          id="dossier-printable-area" 
          className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 print:p-0 print:overflow-visible print:bg-white"
        >
          {/* Institutional Header */}
          <div className="border-b-2 border-[#1E3A2F] pb-5 space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#1E3A2F] text-[#C6A15B] flex items-center justify-center font-serif font-bold text-sm">
                    D
                  </div>
                  <div>
                    <h1 className="font-serif text-lg sm:text-xl font-bold text-[#1E3A2F] tracking-tight">
                      ACTIVOS & INVERSIONES DARIÉN S.A.S.
                    </h1>
                    <p className="text-[11px] font-mono text-[#6B6A63] uppercase tracking-wider">
                      División Tierras & Inversión • Nit: 901.789.452-1
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right font-mono text-xs text-[#6B6A63]">
                <p className="font-bold text-[#1E3A2F]">INFORME CONSOLIDADO PREDIAL</p>
                <p className="capitalize text-[11px]">{currentDate}</p>
              </div>
            </div>

            {/* Filter Metadata Summary Strip */}
            <div className="bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl p-3 text-xs font-mono flex flex-wrap justify-between items-center gap-2 print:bg-gray-50 print:border-gray-300">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1E3A2F]">Filtros Aplicados:</span>
                <span className="text-[#242321]">{activeFiltersSummary}</span>
              </div>
              <div className="font-bold text-[#1E3A2F]">
                Total Predios Listados: <span className="bg-[#1E3A2F] text-white px-2 py-0.5 rounded text-[11px]">{properties.length}</span>
              </div>
            </div>
          </div>

          {/* Tabular Inventory Grid (1 Property per Row) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans border border-[#E5E1D8] print:border-gray-400">
              <thead>
                <tr className="bg-[#1E3A2F] text-white text-[11px] font-mono uppercase tracking-wider print:bg-emerald-950 print:text-white">
                  <th className="p-2.5 border border-[#1E3A2F] w-24 text-center">Código</th>
                  <th className="p-2.5 border border-[#1E3A2F]">Nombre del Predio & Ubicación</th>
                  <th className="p-2.5 border border-[#1E3A2F] w-32">Tipo / Modalidad</th>
                  <th className="p-2.5 border border-[#1E3A2F] w-28 text-right">Extensión</th>
                  <th className="p-2.5 border border-[#1E3A2F] w-28 text-center">Tenencia</th>
                  <th className="p-2.5 border border-[#1E3A2F] w-44 text-right">Valor Referencia / Renta</th>
                  <th className="p-2.5 border border-[#1E3A2F] w-36">Estado Jurídico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1D8] print:divide-gray-300">
                {properties.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#6B6A63] font-mono italic">
                      No hay predios que coincidan con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  properties.map((prop, idx) => {
                    const isEven = idx % 2 === 0;

                    // Pricing logic
                    const hasValuation = (prop.salePriceCop && prop.salePriceCop > 0) || 
                                         (prop.estimatedValueCop && prop.estimatedValueCop > 0) || 
                                         (prop.monthlyRentCop && prop.monthlyRentCop > 0) ||
                                         (prop.commercialAppraisalCop && prop.commercialAppraisalCop > 0);

                    const priceDisplay = prop.salePriceCop || prop.estimatedValueCop || prop.commercialAppraisalCop;
                    const rentDisplay = prop.monthlyRentCop || prop.monthlyRentEstimateCop;

                    return (
                      <tr 
                        key={prop.id || prop.code} 
                        className={`break-inside-avoid ${isEven ? 'bg-white' : 'bg-[#F9F8F3]'} hover:bg-emerald-50/40 transition-colors print:bg-white`}
                      >
                        {/* Col 1: Code */}
                        <td className="p-2.5 border border-[#E5E1D8] font-mono font-bold text-[#1E3A2F] text-center align-top print:border-gray-300">
                          {prop.code}
                          {prop.isSae && (
                            <span className="block text-[9px] font-sans text-purple-700 bg-purple-50 rounded px-1 mt-0.5 border border-purple-200">
                              SAE #{prop.saeIdActivo || 'SAE'}
                            </span>
                          )}
                        </td>

                        {/* Col 2: Title & Location */}
                        <td className="p-2.5 border border-[#E5E1D8] align-top print:border-gray-300">
                          <span className="font-bold text-[#242321] block text-xs">
                            {prop.title}
                          </span>
                          <span className="text-[11px] text-[#6B6A63] font-mono flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#1E3A2F] shrink-0" />
                            {[prop.sectorVereda || prop.vereda, prop.municipality, prop.department].filter(Boolean).join(', ')}
                          </span>
                          {prop.address && prop.address !== prop.title && (
                            <span className="text-[10px] text-gray-500 italic block mt-0.5">
                              {prop.address}
                            </span>
                          )}
                        </td>

                        {/* Col 3: Asset Type & Modality */}
                        <td className="p-2.5 border border-[#E5E1D8] align-top print:border-gray-300">
                          <span className="font-semibold text-[#242321] block">
                            {prop.assetType}
                          </span>
                          <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 ${
                            prop.modality === 'Venta' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : prop.modality === 'Arriendo'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {prop.modality}
                          </span>
                        </td>

                        {/* Col 4: Extension */}
                        <td className="p-2.5 border border-[#E5E1D8] font-mono text-right align-top text-[11px] font-medium print:border-gray-300">
                          {formatArea(prop.landAreaHa, prop.landAreaM2)}
                          {prop.builtAreaM2 && prop.builtAreaM2 > 0 ? (
                            <span className="block text-[10px] text-gray-500 font-sans">
                              {prop.builtAreaM2.toLocaleString('es-CO')} m² const.
                            </span>
                          ) : null}
                        </td>

                        {/* Col 5: Occupancy */}
                        <td className="p-2.5 border border-[#E5E1D8] text-center align-top print:border-gray-300">
                          {getOccupancyBadge(prop.occupancyStatus)}
                        </td>

                        {/* Col 6: Valuation / Rent */}
                        <td className="p-2.5 border border-[#E5E1D8] text-right align-top font-mono print:border-gray-300">
                          {hasValuation ? (
                            <>
                              {priceDisplay && priceDisplay > 0 && (
                                <span className="font-bold text-[#1E3A2F] block text-xs">
                                  {formatCurrency(priceDisplay)}
                                </span>
                              )}
                              {rentDisplay && rentDisplay > 0 && (
                                <span className="text-[10px] font-semibold text-blue-800 block">
                                  Canon: {formatCurrency(rentDisplay)}/mes
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-[10px] font-sans font-medium text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 block text-center">
                              Bajo Solicitud / Estudio
                            </span>
                          )}
                        </td>

                        {/* Col 7: Legal Status */}
                        <td className="p-2.5 border border-[#E5E1D8] align-top text-[11px] print:border-gray-300">
                          <span className="font-medium text-gray-800 block">
                            {prop.legalStatus || 'Saneado 100%'}
                          </span>
                          <span className="text-[10px] text-emerald-800 font-semibold block mt-0.5">
                            {prop.availability || 'Disponible'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Institutional Footer & Disclaimer */}
          <div className="pt-4 border-t border-[#E5E1D8] text-center text-[10px] font-mono text-[#6B6A63] space-y-1.5 print:border-gray-400 print:text-black">
            <p className="font-bold text-[#1E3A2F] text-xs">
              ACTIVOS & INVERSIONES DARIÉN S.A.S. • División de Gestión Predial & Proyectos Especiales
            </p>
            <p>
              Urabá & Darién, Colombia | Correo: gerencia@activosdarien.com | Nit: 901.789.452-1
            </p>
            <p className="text-[9px] text-gray-500 italic max-w-4xl mx-auto pt-1">
              * Documento ejecutivo oficial generado desde la plataforma de gestión territorial. Los valores comerciales de referencia y especificaciones técnicas están sujetos a confirmación en visita técnica de campo y estudio de títulos.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
