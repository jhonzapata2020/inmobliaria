'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  X, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  PhoneCall, 
  Sparkles,
  ShieldCheck,
  MapPin,
  DollarSign,
  Maximize2
} from 'lucide-react';
import { submitConsignmentLeadAction } from '../../app/actions/leads';

interface PropertyConsignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MUNICIPALITIES_LIST = [
  'Riohacha (La Guajira)',
  'Dibulla (La Guajira)',
  'Maicao (La Guajira)',
  'San Juan del Cesar (La Guajira)',
  'Uribia (La Guajira)',
  'Manaure (La Guajira)',
  'Fonseca (La Guajira)',
  'Barrancas (La Guajira)',
  'Albania (La Guajira)',
  'Hatonuevo (La Guajira)',
  'Villanueva (La Guajira)',
  'El Molino (La Guajira)',
  'Distracción (La Guajira)',
  'La Jagua del Pilar (La Guajira)',
  'Urumita (La Guajira)',
  'Turbo',
  'Necoclí',
  'Apartadó',
  'Carepa',
  'Chigorodó',
  'Arboletes',
  'San Pedro de Urabá',
  'San Juan de Urabá',
  'Mutatá',
  'Los Córdobas',
  'Montería',
  'Tierralta',
  'Acandí',
  'Unguía',
  'Otro Municipio'
];

export const PropertyConsignmentModal: React.FC<PropertyConsignmentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [municipality, setMunicipality] = useState('Turbo');
  const [extensionArea, setExtensionArea] = useState('');
  const [expectedPriceCop, setExpectedPriceCop] = useState('');
  const [comments, setComments] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!clientName.trim() || !phone.trim() || !municipality.trim()) {
      setErrorMsg('Por favor completa tu nombre, teléfono/WhatsApp y el municipio del predio.');
      setLoading(false);
      return;
    }

    try {
      const res = await submitConsignmentLeadAction({
        clientName,
        phone,
        email,
        municipality,
        extensionArea,
        expectedPriceCop: expectedPriceCop ? Number(expectedPriceCop) : undefined,
        comments,
      });

      if (!res.success) {
        setErrorMsg(res.message || 'No se pudo radicar la consignación.');
        setLoading(false);
        return;
      }

      setSuccessMsg('¡Predio radicado exitosamente! Tu información ha ingresado a nuestra mesa comercial.');
      setLoading(false);
    } catch (err: unknown) {
      console.error('Consignment submission error:', err);
      setErrorMsg('Ocurrió un error inesperado al enviar los datos.');
      setLoading(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hola Activos & Inversiones Darién S.A.S., acabo de consignar mi predio en ${municipality} (${extensionArea || 'Urabá'}). Deseo coordinar la visita técnica de valoración.`
  );
  const whatsappUrl = `https://wa.me/573001234567?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-xl bg-white border border-[#E5E1D8] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-[#1E3A2F] text-white p-6 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/70 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Consignación Directa de Propietarios</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold">
              Consignar / Vender Inmueble
            </h2>
            <p className="text-xs text-stone-300">
              Valoración técnica y difusión en la red comercial de Urabá & Córdobas
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Trust Banner */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-tight">
              Sin registros cerrados obligatorios. Completa este formulario rápido y nuestro equipo comercial coordinará la inspección técnica de tu predio.
            </p>
          </div>

          {successMsg ? (
            <div className="p-6 text-center space-y-4 bg-emerald-50/60 border border-emerald-200 rounded-3xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-emerald-950 text-lg">
                  ¡Consignación Radicada con Éxito!
                </h3>
                <p className="text-xs text-emerald-800 max-w-md mx-auto">
                  {successMsg}
                </p>
              </div>

              {/* Direct WhatsApp Call to Action */}
              <div className="pt-2 p-4 bg-white border border-emerald-300 rounded-2xl space-y-2 text-center shadow-xs">
                <p className="text-xs font-bold text-stone-800">
                  ¿Prefieres atención personalizada inmediata?
                </p>
                <p className="text-[11px] text-stone-600">
                  Escríbenos directamente por WhatsApp para coordinar la visita técnica y el avalúo.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-[0.98]"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-200" />
                  <span>Contactar Asesor por WhatsApp</span>
                </a>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-stone-800 text-white font-bold text-xs hover:bg-stone-900 transition-colors"
                >
                  Cerrar Ventana
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {errorMsg && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-mono">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                    Nombre del Propietario / Contacto *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Gustavo Adolfo Pérez"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-stone-900 font-medium focus:outline-none focus:border-[#1E3A2F]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. +57 300 987 6543"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-stone-900 font-medium focus:outline-none focus:border-[#1E3A2F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                    Municipio del Predio *
                  </label>
                  <select
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                    className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-stone-900 font-medium focus:outline-none focus:border-[#1E3A2F]"
                  >
                    {MUNICIPALITIES_LIST.map((muni) => (
                      <option key={muni} value={muni}>
                        {muni}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                    Extensión (Ha o m²)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. 15 Hectáreas / 5.000 m²"
                    value={extensionArea}
                    onChange={(e) => setExtensionArea(e.target.value)}
                    className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-stone-900 font-medium focus:outline-none focus:border-[#1E3A2F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                    Expectativa de Precio (COP)
                  </label>
                  <input
                    type="number"
                    placeholder="Ej. 450000000"
                    value={expectedPriceCop}
                    onChange={(e) => setExpectedPriceCop(e.target.value)}
                    className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-stone-900 font-mono font-bold text-emerald-900 focus:outline-none focus:border-[#1E3A2F]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                    Correo Electrónico (Opcional)
                  </label>
                  <input
                    type="email"
                    placeholder="propietario@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-stone-900 font-medium focus:outline-none focus:border-[#1E3A2F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                  Observaciones / Estado del Predio (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej. Predio ganadero con pasto mombasa, acceso sobre vía principal, escrituras al día."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl p-3 text-stone-900 font-medium focus:outline-none focus:border-[#1E3A2F]"
                />
              </div>

              {/* Direct WhatsApp Call to Action Banner */}
              <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-emerald-950 block text-xs">¿Prefieres atención personalizada inmediata?</span>
                  <span className="text-[11px] text-emerald-800 block">Escríbenos por WhatsApp para coordinar la visita técnica.</span>
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-200" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-[#1E3A2F] hover:bg-[#152921] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span>Enviando consignación...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-emerald-300" />
                      <span>Enviar Consignación</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
