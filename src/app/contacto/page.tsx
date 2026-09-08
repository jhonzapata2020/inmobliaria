'use client';

import React, { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, CheckCircle2, Send, ShieldCheck } from 'lucide-react';

export default function ContactoPage() {
  const [submitted, setSubmitted] = useState(false);
  const [interestType, setInterestType] = useState('Comprar');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const requestedType = new URLSearchParams(window.location.search).get('type');
    if (requestedType === 'sae') setInterestType('Custodia SAE');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F7F2] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase text-[#1E3A2F] font-bold tracking-wider">
            Canales de Atención Directa
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#242321]">
            Contáctate con un Asesor Senior
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6A63]">
            Estamos listos para atender tus requerimientos de compra, venta, arriendo, administración o consulta sobre bienes en custodia SAE.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Contact Info & Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E5E1D8] rounded-3xl p-8 space-y-6 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-[#242321]">
                Oficinas Principales
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#1E3A2F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#242321] block font-mono text-sm">Sede Urabá (Apartadó)</strong>
                    <span className="text-[#6B6A63]">Centro Comercial Plaza Ortiz, Oficina 402, Calle 100.</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#0F766E] shrink-0" />
                  <div>
                    <strong className="text-[#242321] block font-mono">PBX Corporativo</strong>
                    <span className="text-[#6B6A63]">+57 (4) 828-9000</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#0F766E] shrink-0" />
                  <div>
                    <strong className="text-[#242321] block font-mono">Correo Electrónico</strong>
                    <span className="text-[#6B6A63]">contacto@activosdarien.com.co</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E1D8] text-xs text-[#6B6A63] space-y-2 font-mono">
                <p className="flex items-center gap-1.5 text-[#1E3A2F] font-bold">
                  <ShieldCheck className="w-4 h-4" /> Horario de Atención:
                </p>
                <p>Lunes a Viernes: 8:00 AM – 6:00 PM</p>
                <p>Sábados: 8:00 AM – 1:00 PM</p>
              </div>
            </div>
          </div>

          {/* Dynamic Contextual Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#E5E1D8] rounded-3xl p-8 shadow-sm space-y-6">
              
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[#6B6A63] mb-1 font-mono font-medium">Tipo de Interés Principal *</label>
                    <select
                      value={interestType}
                      onChange={(e) => setInterestType(e.target.value)}
                      className="w-full bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl px-4 py-3 text-[#242321] font-bold text-sm focus:outline-none focus:border-[#1E3A2F]"
                    >
                      <option value="Comprar">Quiero Comprar una Propiedad</option>
                      <option value="Arrendar">Quiero Arrendar un Inmueble</option>
                      <option value="Consignar">Quiero Consignar mi Inmueble para Venta/Arriendo</option>
                      <option value="Invertir">Soy Inversionista y Busco Oportunidades</option>
                      <option value="Custodia SAE">Consulta sobre Custodia & Administración SAE</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#6B6A63] mb-1 font-mono font-medium">Nombre Completo *</label>
                      <input
                        type="text"
                        required
                        placeholder="Tu nombre"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-[#242321] focus:outline-none focus:border-[#1E3A2F]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#6B6A63] mb-1 font-mono font-medium">Empresa / Entidad</label>
                      <input
                        type="text"
                        placeholder="Nombre de empresa (opcional)"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-[#242321] focus:outline-none focus:border-[#1E3A2F]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#6B6A63] mb-1 font-mono font-medium">Teléfono / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+57 300 000 0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-[#242321] focus:outline-none focus:border-[#1E3A2F]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#6B6A63] mb-1 font-mono font-medium">Correo Electrónico *</label>
                      <input
                        type="email"
                        required
                        placeholder="correo@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-[#242321] focus:outline-none focus:border-[#1E3A2F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#6B6A63] mb-1 font-mono font-medium">Ciudad o Municipio de Interés</label>
                    <input
                      type="text"
                      placeholder="Ej. Apartadó, Necoclí, Medellín..."
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-[#242321] focus:outline-none focus:border-[#1E3A2F]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#6B6A63] mb-1 font-mono font-medium">Detalles del Requerimiento</label>
                    <textarea
                      rows={4}
                      placeholder="Describe las características de la propiedad que buscas o deseas consignar..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl p-3.5 text-[#242321] focus:outline-none focus:border-[#1E3A2F]"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-[#6B6A63]">
                    <input type="checkbox" required defaultChecked className="rounded accent-[#1E3A2F]" />
                    <span>Acepto la política de tratamiento de datos personales conforme a la Ley 1581.</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#1E3A2F] hover:bg-[#152921] text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send className="w-4 h-4" /> Enviar Mensaje a Asesor
                  </button>
                </form>
              ) : (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#EEF4EF] text-[#23866D] flex items-center justify-center mx-auto border border-[#E5E1D8]">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-xl font-bold text-[#242321]">¡Mensaje Radicado Correctamente!</h3>
                    <p className="text-xs text-[#6B6A63] max-w-sm mx-auto">
                      Gracias {fullName}, tu requerimiento para <strong>{interestType}</strong> ha sido asignado a un ejecutivo de cuenta. Te contactaremos hoy mismo.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
