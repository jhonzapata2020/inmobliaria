'use client';

import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Building2, 
  ShieldCheck, 
  FileCheck2, 
  Send, 
  CheckCircle2, 
  AlertTriangle,
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md p-4 sm:p-6 md:p-10 flex justify-center animate-in fade-in duration-200">
      <div className="bg-slate-900 text-slate-100 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-800 flex flex-col my-auto overflow-hidden">
        
        {/* Modal Top Action Bar */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-md font-semibold">
              DOSSIER OFICIAL • ACTIVOS DARIEN
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              disabled={downloading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md transition-all"
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
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dossier Document Container (Styled for Screen & Print) */}
        <div className="p-6 sm:p-10 bg-slate-900 text-slate-100 overflow-y-auto space-y-8 print:p-0 print:bg-white print:text-slate-900">
          
          {/* Header Letterhead */}
          <div className="border-b-2 border-emerald-500 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 shadow-lg">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <div>
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                  ACTIVOS & INVERSIONES DARIEN S.A.S.
                </h1>
                <p className="text-xs text-emerald-400 font-mono font-semibold">
                  NIT 901.884.210-4 • PORTAFOLIO EJECUTIVO DE ACTIVOS
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right font-mono text-xs text-slate-400 space-y-1">
              <p><strong className="text-slate-200">Ref:</strong> DOS-{Math.floor(100000 + Math.random() * 900000)}</p>
              <p><strong className="text-slate-200">Fecha:</strong> {currentDate}</p>
              <p><strong className="text-slate-200">Carácter:</strong> Confidencial / Comercial</p>
            </div>
          </div>

          {/* Client Information Form / Preview Block */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950/70 p-5 rounded-xl border border-slate-800 print:bg-slate-50 print:border-slate-300">
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                <User className="w-4 h-4" /> Datos del Destinatario / Interesado
              </h3>

              {!submitted ? (
                <form onSubmit={handleSubmitRequest} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Dr. Fernando Restrepo"
                      value={clientInfo.fullName}
                      onChange={(e) => setClientInfo({ ...clientInfo, fullName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Empresa / Fondo</label>
                    <input
                      type="text"
                      placeholder="Ej. Inversiones del Darién S.A."
                      value={clientInfo.companyName}
                      onChange={(e) => setClientInfo({ ...clientInfo, companyName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      placeholder="ejemplo@empresa.com"
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+57 300 000 0000"
                      value={clientInfo.phone}
                      onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </form>
              ) : (
                <div className="space-y-1 text-sm text-slate-200">
                  <p><strong>Destinatario:</strong> {clientInfo.fullName || 'Cliente Preferencial'}</p>
                  {clientInfo.companyName && <p><strong>Empresa:</strong> {clientInfo.companyName}</p>}
                  <p><strong>Contacto:</strong> {clientInfo.email} • {clientInfo.phone}</p>
                </div>
              )}
            </div>

            {/* Dossier Type Config */}
            <div className="space-y-3 border-t md:border-t-0 md:border-l border-slate-800 md:pl-5 pt-4 md:pt-0">
              <h3 className="text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold">
                Perfil de Presentación
              </h3>
              <select
                value={dossierType}
                onChange={(e) => setDossierType(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option value="Inversionista">Perfil Inversionista Privado</option>
                <option value="Ejecutivo">Perfil Ejecutivo Corporativo</option>
                <option value="Bancario / Financiero">Perfil Bancario / Financiero</option>
                <option value="Institucional">Perfil Institucional SAE</option>
              </select>

              <div className="text-[11px] text-slate-400 space-y-1 pt-1 font-mono">
                <p>✓ Marca corporativa oficial</p>
                <p>✓ Desglose técnico & jurídico</p>
                <p>✓ Matrículas e imágenes HD</p>
              </div>
            </div>
          </div>

          {/* Consolidated Executive Metrics Summary */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase font-mono border-b border-slate-800 pb-2">
              1. Resumen Consolidado del Portafolio
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                <div className="text-2xl font-bold font-mono text-emerald-400">{summary.propertyCount}</div>
                <div className="text-xs text-slate-400 font-medium mt-1">Activos Seleccionados</div>
              </div>
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                <div className="text-lg font-bold font-mono text-teal-300">
                  {summary.totalAreaHa > 0 && <span className="block">{summary.totalAreaHa.toLocaleString('es-CO')} Ha</span>}
                  {summary.totalAreaM2 > 0 && <span className="block text-sm text-slate-400">{summary.totalAreaM2.toLocaleString('es-CO')} m²</span>}
                </div>
                <div className="text-xs text-slate-400 font-medium mt-1">Área Consolidada</div>
              </div>
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                <div className="text-lg font-bold font-mono text-emerald-400">
                  {summary.hasSale ? formatCurrency(summary.totalSalePrice) : 'N/A'}
                </div>
                <div className="text-xs text-slate-400 font-medium mt-1">Total Venta Estimado</div>
              </div>
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                <div className="text-lg font-bold font-mono text-teal-400">
                  {summary.hasRent ? `${formatCurrency(summary.totalMonthlyRent)}/m` : 'N/A'}
                </div>
                <div className="text-xs text-slate-400 font-medium mt-1">Canon Arriendo Estimado</div>
              </div>
            </div>
          </div>

          {/* Detailed Property Cards for Dossier */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase font-mono border-b border-slate-800 pb-2">
              2. Fichas Técnicas de los Activos
            </h3>

            {selectedProperties.map((prop, idx) => {
              const legalBadge = getLegalStatusBadge(prop.legalStatus);
              return (
                <div 
                  key={prop.id}
                  className="bg-slate-950/90 rounded-2xl border border-slate-800 p-6 space-y-4 print:border-slate-300 print:bg-white"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded border border-emerald-800">
                          #{idx + 1} — {prop.code}
                        </span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${legalBadge.bgClass} ${legalBadge.textClass} ${legalBadge.borderClass}`}>
                          {legalBadge.label}
                        </span>
                        <span className="text-xs font-medium px-2 py-0.5 bg-slate-800 text-slate-300 rounded">
                          {prop.assetType}
                        </span>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-white print:text-slate-900">
                        {prop.title}
                      </h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        {prop.sectorVereda ? `${prop.sectorVereda}, ` : ''}{prop.municipality}, {prop.department}
                      </p>
                    </div>

                    <div className="text-left sm:text-right font-mono">
                      <div className="text-xs text-slate-400">Valor / Canon Comercial</div>
                      <div className="text-lg font-bold text-emerald-400">
                        {prop.modality === 'Venta' && formatCurrency(prop.price)}
                        {prop.modality === 'Arriendo' && `${formatCurrency(prop.monthlyRent)}/mes`}
                        {prop.modality === 'Custodia' && 'Regulada SAE'}
                        {prop.modality === 'Inversión' && formatCurrency(prop.price || prop.estimatedValue)}
                      </div>
                    </div>
                  </div>

                  {/* Main Thumbnail Photo */}
                  {prop.images && prop.images[0] && (
                    <div className="h-48 w-full rounded-xl overflow-hidden bg-slate-900 relative">
                      <img 
                        src={prop.images[0]} 
                        alt={prop.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Technical Attributes Table */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-900/80 p-4 rounded-xl border border-slate-800/80 font-mono">
                    <div>
                      <span className="text-slate-400 block">Área Total:</span>
                      <span className="font-bold text-white">{formatArea(prop.areaTotalHa, prop.areaTotalM2)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Área Construida:</span>
                      <span className="font-bold text-white">{prop.builtAreaM2 ? `${prop.builtAreaM2} m²` : 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Matrícula (Mock):</span>
                      <span className="font-bold text-emerald-300">{prop.matriculaInmobiliaria}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Topografía:</span>
                      <span className="font-bold text-white">{prop.topography}</span>
                    </div>
                  </div>

                  <div className="text-xs leading-relaxed text-slate-300 space-y-2">
                    <p><strong>Descripción Comercial:</strong> {prop.description}</p>
                    <p><strong>Análisis de Oportunidad:</strong> {prop.opportunityAnalysis}</p>
                    <p className="text-slate-400"><strong>Condiciones Comerciales:</strong> {prop.commercialConditions}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mandatory Legal Disclaimer Box */}
          <div className="p-4 bg-amber-950/60 border border-amber-600/40 rounded-xl text-xs text-amber-200/90 space-y-1.5 leading-relaxed">
            <div className="font-bold text-amber-300 flex items-center gap-1.5 uppercase font-mono">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Aviso Legal & Términos de Verificación Comercial
            </div>
            <p>
              Este documento tiene carácter estrictamente informativo y comercial emitido por ACTIVOS & INVERSIONES DARIEN S.A.S. La información, linderos, matrículas inmobiliarias y cifras están sujetas a validación técnica, jurídica, catastral, ambiental y comercial previa a cualquier firma de promesa, negociación, contrato o transacción oficial.
            </p>
          </div>

          {/* Corporate Footer & Signature */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
            <div>
              <p className="font-semibold text-slate-200">ACTIVOS & INVERSIONES DARIEN S.A.S.</p>
              <p>Departamento de Gestión Comercial & Custodia Patrimonial</p>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-emerald-400">www.activosdarien.com.co</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
