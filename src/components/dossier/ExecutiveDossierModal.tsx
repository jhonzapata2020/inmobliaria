'use client';

import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Building2, 
  ShieldCheck, 
  AlertTriangle,
  User
} from 'lucide-react';
import { useDossier } from '../../context/DossierContext';
import { formatCurrency, formatArea, getLegalStatusBadge } from '../../lib/formatters';

export const ExecutiveDossierModal: React.FC = () => {
  const { 
    selectedProperties, 
    summary, 
    isExecutiveModalOpen, 
    setIsExecutiveModalOpen,
    clientInfo,
    setClientInfo,
    dossierType,
    setDossierType
  } = useDossier();

  const [submitted, setSubmitted] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isExecutiveModalOpen) return null;

  const handlePrint = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      window.print();
    }, 800);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const currentDate = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-4 sm:p-6 md:p-10 flex justify-center animate-in fade-in duration-200">
      <div className="bg-white text-[#242321] w-full max-w-4xl rounded-2xl shadow-2xl border border-[#E5E1D8] flex flex-col my-auto overflow-hidden">
        
        {/* Modal Top Action Bar */}
        <div className="p-4 bg-[#F8F7F2] border-b border-[#E5E1D8] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#1E3A2F] bg-[#EEF4EF] border border-[#E5E1D8] px-2.5 py-1 rounded-md font-bold">
              DOSSIER OFICIAL • ACTIVOS DARIÉN
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              disabled={downloading}
              className="px-4 py-2 bg-[#1E3A2F] hover:bg-[#152921] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md transition-all"
            >
              {downloading ? (
                <span>Generando Documento...</span>
              ) : (
                <>
                  <Printer className="w-4 h-4" />
                  <span>Imprimir / Exportar PDF</span>
                </>
              )}
            </button>
            <button
              onClick={() => setIsExecutiveModalOpen(false)}
              className="p-2 rounded-xl text-[#6B6A63] hover:text-[#242321] hover:bg-[#E5E1D8] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dossier Document Container */}
        <div className="p-6 sm:p-10 bg-white text-[#242321] overflow-y-auto space-y-8 print:p-0 print:bg-white print:text-black">
          
          {/* Header Letterhead */}
          <div className="border-b-2 border-[#1E3A2F] pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#1E3A2F] text-white flex items-center justify-center shadow-md">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#242321] tracking-tight">
                  ACTIVOS & INVERSIONES DARIÉN S.A.S.
                </h1>
                <p className="text-xs text-[#1E3A2F] font-mono font-semibold">
                  NIT 901.884.210-4 • PORTAFOLIO EJECUTIVO DE ACTIVOS
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right font-mono text-xs text-[#6B6A63] space-y-1">
              <p><strong className="text-[#242321]">Ref:</strong> DOS-{Math.floor(100000 + Math.random() * 900000)}</p>
              <p><strong className="text-[#242321]">Fecha:</strong> {currentDate}</p>
              <p><strong className="text-[#242321]">Carácter:</strong> Confidencial / Comercial</p>
            </div>
          </div>

          {/* Client Information Form / Preview Block */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#F8F7F2] p-5 rounded-xl border border-[#E5E1D8]">
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#1E3A2F] font-bold flex items-center gap-1.5">
                <User className="w-4 h-4" /> Datos del Destinatario / Interesado
              </h3>

              {!submitted ? (
                <form onSubmit={handleSubmitRequest} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[#6B6A63] mb-1 font-mono">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Dr. Fernando Restrepo"
                      value={clientInfo.fullName}
                      onChange={(e) => setClientInfo({ ...clientInfo, fullName: e.target.value })}
                      className="w-full bg-white border border-[#E5E1D8] rounded-lg px-3 py-2 text-[#242321] focus:outline-none focus:border-[#1E3A2F]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#6B6A63] mb-1 font-mono">Empresa / Fondo</label>
                    <input
                      type="text"
                      placeholder="Ej. Inversiones del Darién S.A."
                      value={clientInfo.companyName}
                      onChange={(e) => setClientInfo({ ...clientInfo, companyName: e.target.value })}
                      className="w-full bg-white border border-[#E5E1D8] rounded-lg px-3 py-2 text-[#242321] focus:outline-none focus:border-[#1E3A2F]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#6B6A63] mb-1 font-mono">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      placeholder="ejemplo@empresa.com"
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                      className="w-full bg-white border border-[#E5E1D8] rounded-lg px-3 py-2 text-[#242321] focus:outline-none focus:border-[#1E3A2F]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#6B6A63] mb-1 font-mono">Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+57 300 000 0000"
                      value={clientInfo.phone}
                      onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                      className="w-full bg-white border border-[#E5E1D8] rounded-lg px-3 py-2 text-[#242321] focus:outline-none focus:border-[#1E3A2F]"
                    />
                  </div>
                </form>
              ) : (
                <div className="space-y-1 text-sm text-[#242321]">
                  <p><strong>Destinatario:</strong> {clientInfo.fullName || 'Cliente Preferencial'}</p>
                  {clientInfo.companyName && <p><strong>Empresa:</strong> {clientInfo.companyName}</p>}
                  <p><strong>Contacto:</strong> {clientInfo.email} • {clientInfo.phone}</p>
                </div>
              )}
            </div>

            {/* Dossier Type Config */}
            <div className="space-y-3 border-t md:border-t-0 md:border-l border-[#E5E1D8] md:pl-5 pt-4 md:pt-0">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#0F766E] font-bold">
                Perfil de Presentación
              </h3>
              <select
                value={dossierType}
                onChange={(e) => setDossierType(e.target.value as any)}
                className="w-full bg-white border border-[#E5E1D8] rounded-lg px-3 py-2 text-xs text-[#242321] focus:outline-none focus:border-[#0F766E]"
              >
                <option value="Inversionista">Perfil Inversionista Privado</option>
                <option value="Ejecutivo">Perfil Ejecutivo Corporativo</option>
                <option value="Bancario / Financiero">Perfil Bancario / Financiero</option>
                <option value="Institucional">Perfil Institucional SAE</option>
              </select>

              <div className="text-[11px] text-[#6B6A63] space-y-1 pt-1 font-mono">
                <p>✓ Marca corporativa oficial</p>
                <p>✓ Desglose técnico & jurídico</p>
                <p>✓ Matrículas e imágenes HD</p>
              </div>
            </div>
          </div>

          {/* Consolidated Executive Metrics Summary */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#242321] tracking-wider uppercase font-mono border-b border-[#E5E1D8] pb-2">
              1. Resumen Consolidado del Portafolio
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-[#F8F7F2] rounded-xl border border-[#E5E1D8]">
                <div className="text-2xl font-bold font-mono text-[#1E3A2F]">{summary.propertyCount}</div>
                <div className="text-xs text-[#6B6A63] font-medium mt-1">Activos Seleccionados</div>
              </div>
              <div className="p-4 bg-[#F8F7F2] rounded-xl border border-[#E5E1D8]">
                <div className="text-lg font-bold font-mono text-[#0F766E]">
                  {summary.totalAreaHa > 0 && <span className="block">{summary.totalAreaHa.toLocaleString('es-CO')} Ha</span>}
                  {summary.totalAreaM2 > 0 && <span className="block text-sm text-[#6B6A63]">{summary.totalAreaM2.toLocaleString('es-CO')} m²</span>}
                </div>
                <div className="text-xs text-[#6B6A63] font-medium mt-1">Área Consolidada</div>
              </div>
              <div className="p-4 bg-[#F8F7F2] rounded-xl border border-[#E5E1D8]">
                <div className="text-lg font-bold font-mono text-[#1E3A2F]">
                  {summary.hasSale ? formatCurrency(summary.totalSalePrice) : 'N/A'}
                </div>
                <div className="text-xs text-[#6B6A63] font-medium mt-1">Total Venta Estimado</div>
              </div>
              <div className="p-4 bg-[#F8F7F2] rounded-xl border border-[#E5E1D8]">
                <div className="text-lg font-bold font-mono text-[#0F766E]">
                  {summary.hasRent ? `${formatCurrency(summary.totalMonthlyRent)}/m` : 'N/A'}
                </div>
                <div className="text-xs text-[#6B6A63] font-medium mt-1">Canon Arriendo Estimado</div>
              </div>
            </div>
          </div>

          {/* Detailed Property Cards for Dossier */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-[#242321] tracking-wider uppercase font-mono border-b border-[#E5E1D8] pb-2">
              2. Fichas Técnicas de los Activos
            </h3>

            {selectedProperties.map((prop, idx) => {
              const legalBadge = getLegalStatusBadge(prop.legalStatus);
              return (
                <div 
                  key={prop.id}
                  className="bg-[#F8F7F2] rounded-2xl border border-[#E5E1D8] p-6 space-y-4 print:border-slate-300 print:bg-white"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#1E3A2F] text-white rounded">
                          #{idx + 1} — {prop.code}
                        </span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${legalBadge.bgClass} ${legalBadge.textClass} ${legalBadge.borderClass}`}>
                          {legalBadge.label}
                        </span>
                        <span className="text-xs font-medium px-2 py-0.5 bg-white text-[#242321] border border-[#E5E1D8] rounded">
                          {prop.assetType}
                        </span>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-[#242321]">
                        {prop.title}
                      </h4>
                      <p className="text-xs text-[#6B6A63] flex items-center gap-1 mt-1">
                        <Building2 className="w-3.5 h-3.5 text-[#0F766E]" />
                        {prop.sectorVereda ? `${prop.sectorVereda}, ` : ''}{prop.municipality}, {prop.department}
                      </p>
                    </div>

                    <div className="text-left sm:text-right font-mono">
                      <div className="text-xs text-[#6B6A63]">Valor / Canon Comercial</div>
                      <div className="text-lg font-bold text-[#1E3A2F] font-serif">
                        {prop.modality === 'Venta' && formatCurrency(prop.salePriceCop)}
                        {prop.modality === 'Arriendo' && `${formatCurrency(prop.monthlyRentCop)}/mes`}
                        {prop.modality === 'Custodia SAE' && 'Regulada SAE'}
                        {prop.modality === 'Inversión' && formatCurrency(prop.salePriceCop || prop.estimatedValueCop)}
                      </div>
                    </div>
                  </div>

                  {/* Main Thumbnail Photo */}
                  {prop.images && prop.images[0] && (
                    <div className="h-48 w-full rounded-xl overflow-hidden bg-[#F1EFE8] relative">
                      <img 
                        src={prop.featuredImage || prop.images[0]} 
                        alt={prop.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Technical Attributes Table */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white p-4 rounded-xl border border-[#E5E1D8] font-mono">
                    <div>
                      <span className="text-[#6B6A63] block">Área Total:</span>
                      <span className="font-bold text-[#242321]">{formatArea(prop.landAreaHa, prop.landAreaM2)}</span>
                    </div>
                    <div>
                      <span className="text-[#6B6A63] block">Área Construida:</span>
                      <span className="font-bold text-[#242321]">{prop.builtAreaM2 ? `${prop.builtAreaM2} m²` : 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[#6B6A63] block">Matrícula (MI):</span>
                      <span className="font-bold text-[#1E3A2F]">{prop.matriculaInmobiliaria || prop.folioMatricula || 'Sujeto a verificación'}</span>
                    </div>
                    <div>
                      <span className="text-[#6B6A63] block">Topografía:</span>
                      <span className="font-bold text-[#242321]">{prop.topography || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="text-xs leading-relaxed text-[#6B6A63] space-y-2">
                    <p><strong className="text-[#242321]">Descripción Comercial:</strong> {prop.description}</p>
                    <p><strong className="text-[#242321]">Análisis de Oportunidad:</strong> {prop.opportunityAnalysis}</p>
                    <p className="text-[#6B6A63]"><strong className="text-[#242321]">Condiciones Comerciales:</strong> {prop.commercialConditions}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mandatory Legal Disclaimer Box */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1.5 leading-relaxed">
            <div className="font-bold text-amber-900 flex items-center gap-1.5 uppercase font-mono">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Aviso Legal & Términos de Verificación Comercial
            </div>
            <p>
              Este documento tiene carácter estrictamente informativo y comercial emitido por ACTIVOS & INVERSIONES DARIÉN S.A.S. La información, linderos, matrículas inmobiliarias y cifras están sujetas a validación técnica, jurídica, catastral, ambiental y comercial previa a cualquier firma de promesa, negociación, contrato o transacción oficial.
            </p>
          </div>

          {/* Corporate Footer & Signature */}
          <div className="pt-6 border-t border-[#E5E1D8] flex flex-col sm:flex-row justify-between items-center text-xs text-[#6B6A63] gap-4">
            <div>
              <p className="font-semibold text-[#242321]">ACTIVOS & INVERSIONES DARIÉN S.A.S.</p>
              <p>Departamento de Gestión Comercial & Custodia Patrimonial</p>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1E3A2F]" />
              <span className="font-mono text-[#1E3A2F] font-bold">www.activosdarien.com.co</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
