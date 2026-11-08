'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { 
  X, 
  Printer, 
  FileSpreadsheet, 
  MapPin,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';
import { Property, PropertyFilterState } from '../../types/property';
import { formatCurrency, formatArea, isPriceToNegotiate } from '../../lib/formatters';

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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  // Reset to first page whenever properties array or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [properties.length, filters.municipality, filters.assetType, filters.searchQuery]);

  const totalPages = Math.ceil(properties.length / pageSize) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, properties.length);

  const displayedProperties = useMemo(() => {
    return properties.slice(startIndex, endIndex);
  }, [properties, startIndex, endIndex]);

  const activeFiltersSummary = useMemo(() => {
    const parts: string[] = [];
    if (filters.portfolio === 'nacional') {
      parts.push('Portafolio: Nacional (SAE)');
    } else if (filters.portfolio === 'all') {
      parts.push('Portafolio: Consolidado Total');
    } else {
      parts.push('Portafolio: Territorial (Urabá)');
    }
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

  if (!isOpen) return null;

  const handlePrint = () => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.print();
      }, 150);
    });
  };

  const handleExportCSV = () => {
    if (!properties || properties.length === 0) return;

    const headers = [
      'Código',
      'Título',
      'Departamento',
      'Municipio',
      'Sector/Vereda',
      'Dirección',
      'Tipo de Activo',
      'Modalidad',
      'Área (Ha)',
      'Área (m²)',
      'Área Const (m²)',
      'Estado Jurídico',
      'Disponibilidad',
      'Tenencia/Ocupación',
      'Precio Venta (COP)',
      'Canon Renta (COP)',
      'Avalúo Comercial (COP)',
      'Activo SAE',
      'ID SAE'
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = properties.map((p) => [
      escapeCsv(p.code),
      escapeCsv(p.title),
      escapeCsv(p.department),
      escapeCsv(p.municipality),
      escapeCsv(p.sectorVereda || p.vereda),
      escapeCsv(p.address),
      escapeCsv(p.assetType),
      escapeCsv(p.modality),
      escapeCsv(p.landAreaHa),
      escapeCsv(p.landAreaM2),
      escapeCsv(p.builtAreaM2),
      escapeCsv(p.legalStatus),
      escapeCsv(p.availability),
      escapeCsv(p.occupancyStatus),
      escapeCsv(p.salePriceCop),
      escapeCsv(p.monthlyRentCop || p.monthlyRentEstimateCop),
      escapeCsv(p.commercialAppraisalCop || p.estimatedValueCop),
      escapeCsv(p.isSae ? 'SÍ' : 'NO'),
      escapeCsv(p.saeIdActivo)
    ]);

    const csvContent = '\uFEFF' + [
      headers.join(';'),
      ...rows.map((r) => r.join(';'))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const now = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `Reporte_Propiedades_${now}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const currentDate = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Listado de Inventario
                </span>
                <span className="text-[11px] font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded font-semibold">
                  {properties.length.toLocaleString('es-CO')} Predios
                </span>
              </div>
              <h2 className="text-base font-bold text-[#242321] font-serif mt-0.5">
                Reporte de Propiedades
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Export full dataset to CSV */}
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-[#1E3A2F] border border-[#E5E1D8] text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              title="Descargar todos los predios en formato CSV para Microsoft Excel"
            >
              <Download className="w-4 h-4 text-emerald-700" />
              <span>Exportar Excel (CSV)</span>
            </button>

            {/* Print Button (Neutral, Clean) */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1E3A2F] hover:bg-[#152921] text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
              title="Imprimir reporte en PDF"
            >
              <Printer className="w-4 h-4 text-[#C6A15B]" />
              <span>Imprimir Reporte (PDF)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-[#6B6A63] hover:text-[#242321] hover:bg-[#E5E1D8] rounded-xl transition-colors cursor-pointer ml-1"
              title="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Batch Pagination & Safety Controls (Screen Only) */}
        {properties.length > 0 && (
          <div className="bg-[#FAF9F5] border-b border-[#E5E1D8] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#6B6A63] no-print print:hidden">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1E3A2F]">Lote de Impresión:</span>
              <span>
                Mostrando <strong className="text-[#242321]">{startIndex + 1} - {endIndex}</strong> de <strong className="text-[#242321]">{properties.length.toLocaleString('es-CO')}</strong> predios
              </span>
              {properties.length > pageSize && (
                <span className="hidden md:inline text-[11px] bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded">
                  Mostrando {displayedProperties.length} predios por tanda para impresión ágil.
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Page Size Selector */}
              <div className="flex items-center gap-1.5">
                <span>Por página:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-[#E5E1D8] rounded-lg px-2 py-1 text-xs text-[#242321] font-semibold"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              {/* Page Navigator */}
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    disabled={safeCurrentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-[#E5E1D8] bg-white text-[#242321] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
                    title="Página anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-2 font-bold text-[#1E3A2F]">
                    {safeCurrentPage} / {totalPages}
                  </span>
                  <button
                    disabled={safeCurrentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1.5 rounded-lg border border-[#E5E1D8] bg-white text-[#242321] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
                    title="Página siguiente"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Printable Report Body */}
        <div 
          id="reporte-tabular-imprimible" 
          className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 print:p-0 print:overflow-visible print:bg-white"
        >
          {/* Neutral Clean Header */}
          <div className="border-b-2 border-[#1E3A2F] pb-5 space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="font-serif text-xl sm:text-2xl font-black text-[#1E3A2F] tracking-tight uppercase">
                  Reporte de Propiedades
                </h1>
                <p className="text-[11px] font-mono text-[#6B6A63] uppercase tracking-wider font-semibold">
                  Consolidado de Disponibilidad Predial e Inventario Inmobiliario • {filters.portfolio === 'nacional' ? 'Portafolio Nacional (SAE)' : filters.portfolio === 'all' ? 'Portafolio Consolidado' : 'Portafolio Territorial (Urabá)'}
                </p>
              </div>

              <div className="text-left sm:text-right font-mono text-xs text-[#6B6A63]">
                <p className="font-bold text-[#1E3A2F]">
                  DOCUMENTO DE INVENTARIO
                </p>
                <p className="capitalize text-[11px]">{currentDate}</p>
                {totalPages > 1 && (
                  <p className="text-[10px] text-gray-500 font-bold mt-0.5">
                    Lote {safeCurrentPage} de {totalPages} ({displayedProperties.length} de {properties.length} predios)
                  </p>
                )}
              </div>
            </div>

            {/* Filter Metadata Summary Strip */}
            <div className="bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl p-3 text-xs font-mono flex flex-wrap justify-between items-center gap-2 print:bg-gray-50 print:border-gray-300">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1E3A2F]">Filtros Aplicados:</span>
                <span className="text-[#242321]">{activeFiltersSummary}</span>
              </div>
              <div className="font-bold text-[#1E3A2F]">
                Predios en este Lote: <span className="bg-[#1E3A2F] text-white px-2 py-0.5 rounded text-[11px]">{displayedProperties.length}</span>
                {properties.length !== displayedProperties.length && (
                  <span className="ml-1 text-[#6B6A63] font-normal">de {properties.length.toLocaleString('es-CO')} totales</span>
                )}
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
                {displayedProperties.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#6B6A63] font-mono italic">
                      No hay predios que coincidan con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  displayedProperties.map((prop, idx) => {
                    const isEven = idx % 2 === 0;

                    const hasValuation = (prop.salePriceCop && prop.salePriceCop > 0) || 
                                         (prop.estimatedValueCop && prop.estimatedValueCop > 0) || 
                                         (prop.monthlyRentCop && prop.monthlyRentCop > 0) ||
                                         (prop.commercialAppraisalCop && prop.commercialAppraisalCop > 0);

                    const priceDisplay = prop.salePriceCop || prop.estimatedValueCop || prop.commercialAppraisalCop;
                    const rentDisplay = prop.monthlyRentCop || prop.monthlyRentEstimateCop;

                    const builtM2Num = prop.builtAreaM2 ? Number(prop.builtAreaM2) : 0;

                    return (
                      <tr 
                        key={prop.id || prop.code || `prop-row-${idx}`} 
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
                            <MapPin className="w-3 h-3 text-[#1E3A2F] shrink-0 print:hidden" />
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
                          {!isNaN(builtM2Num) && builtM2Num > 0 ? (
                            <span className="block text-[10px] text-gray-500 font-sans">
                              {builtM2Num.toLocaleString('es-CO')} m² const.
                            </span>
                          ) : null}
                        </td>

                        {/* Col 5: Occupancy */}
                        <td className="p-2.5 border border-[#E5E1D8] text-center align-top print:border-gray-300">
                          {getOccupancyBadge(prop.occupancyStatus)}
                        </td>

                        {/* Col 6: Valuation / Rent */}
                        <td className="p-2.5 border border-[#E5E1D8] text-right align-top font-mono print:border-gray-300">
                          {isPriceToNegotiate(prop) ? (
                            <div>
                              <span className="font-semibold text-stone-700 block text-xs font-sans">
                                A convenir
                              </span>
                              {rentDisplay && rentDisplay > 0 && (
                                <span className="text-[10px] font-semibold text-blue-800 block mt-0.5">
                                  Canon ref: {formatCurrency(rentDisplay)}/mes
                                </span>
                              )}
                            </div>
                          ) : hasValuation ? (
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
            <p className="font-bold text-[#1E3A2F] text-xs uppercase tracking-wider">
              DOCUMENTO CONSOLIDADO DE INVENTARIO Y DISPONIBILIDAD INMOBILIARIA
            </p>
            <p className="text-[9px] text-gray-500 italic max-w-4xl mx-auto pt-1">
              * Documento informativo y de consulta predial. Los valores comerciales de referencia y especificaciones técnicas están sujetos a confirmación en visita técnica de campo y estudio de títulos.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
