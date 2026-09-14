'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ShieldCheck, 
  Handshake, 
  UserCheck, 
  ArrowRight, 
  PlusCircle, 
  Lock, 
  Award,
  Sparkles,
  FileText,
  Building,
  MessageSquare
} from 'lucide-react';
import { PropertyConsignmentModal } from '../../components/partners/PropertyConsignmentModal';

export default function PortalSociosLandingPage() {
  const [isConsignmentModalOpen, setIsConsignmentModalOpen] = useState(false);

  const whatsappMessage = encodeURIComponent(
    'Hola Activos & Inversiones Darién S.A.S., deseo coordinar una visita técnica para valorar y consignar mi predio.'
  );
  const whatsappUrl = `https://wa.me/573001234567?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-[#F8F7F4] font-sans text-[#1C1917]">
      
      {/* Hero Section */}
      <section className="relative bg-[#1E3A2F] text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34D399_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Red Comercial de Valor en Urabá & Darién</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Portal de Socios, Propietarios <br className="hidden sm:inline" />
            <span className="text-emerald-400">& Corredores Aliados</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-stone-300 font-normal leading-relaxed">
            Plataforma institucional para registrar, promocionar y monetizar activos inmobiliarios estratégicos en el Golfo de Urabá y el Darién bajo esquemas transparentes de comisión y protección jurídica.
          </p>

          {/* Hero 3-Button Structure */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            
            {/* Button 1: Consignar Inmueble (Propietarios) */}
            <button
              onClick={() => setIsConsignmentModalOpen(true)}
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              <Building className="w-4 h-4 text-emerald-950" />
              <span>Consignar Inmueble (Propietarios)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Button 2: Red de Corredores Aliados */}
            <Link
              href="/portal-socios/registro?type=broker"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              <Handshake className="w-4 h-4 text-emerald-300" />
              <span>Red de Corredores Aliados</span>
            </Link>

            {/* Button 3: Ingresar a mi Cuenta */}
            <Link
              href="/portal-socios/login"
              className="px-5 py-3.5 rounded-xl text-stone-300 hover:text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
            >
              <Lock className="w-4 h-4 text-emerald-300" />
              <span>Ingresar a mi Cuenta</span>
            </Link>

          </div>
        </div>
      </section>

      {/* Main Content & Benefits */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        
        {/* Direct Consignment Card for Owners */}
        <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Building2 className="w-80 h-80 text-emerald-300" />
          </div>

          <div className="space-y-3 max-w-xl relative z-10">
            <span className="px-3 py-1 rounded-full bg-emerald-800 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono font-bold uppercase inline-block">
              Atención Directa Propietarios
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              ¿Deseas vender o consignar tu predio sin crear cuenta?
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Completa la radicación rápida en menos de 2 minutos. Nuestro equipo de ingenieros y martilleros agendará la inspección presencial y el avalúo comercial.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 relative z-10 w-full sm:w-auto">
            <button
              onClick={() => setIsConsignmentModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Building className="w-4 h-4" />
              <span>Formulario de Consignación</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <MessageSquare className="w-4 h-4 text-emerald-300" />
              <span>WhatsApp Directo</span>
            </a>
          </div>
        </div>

        {/* Value proposition grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: For Allied Brokers */}
          <div className="bg-white border border-[#E5E1D8] rounded-3xl p-8 shadow-sm hover:shadow-md transition-all space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#1E3A2F] flex items-center justify-center">
                <Handshake className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#1C1917]">
                Corredores & Comisionistas Aliados
              </h2>
              <p className="text-stone-600 text-sm leading-relaxed">
                Registra tus captaciones exclusivas o compartidas. Te respaldamos con valoración comercial técnica, estructuración de dossiers ejecutivos y promoción en nuestra red privada de compradores institucionales.
              </p>

              <div className="p-4 bg-emerald-50/80 border border-emerald-200/60 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-900 uppercase">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Esquemas de Comisión Protegida</span>
                </div>
                <p className="text-xs text-emerald-800 leading-snug">
                  Tus datos de contacto directo y titulares permanecen protegidos bajo acuerdo corporativo (50/50, precio neto o fee fijo).
                </p>
              </div>
            </div>

            <Link
              href="/portal-socios/registro?type=broker"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1E3A2F] hover:bg-[#152921] text-white text-xs font-bold transition-colors"
            >
              <span>Registrarme como Corredor Aliado</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: For Direct Owners */}
          <div className="bg-white border border-[#E5E1D8] rounded-3xl p-8 shadow-sm hover:shadow-md transition-all space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 text-[#1E3A2F] flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#1C1917]">
                Propietarios Directos
              </h2>
              <p className="text-stone-600 text-sm leading-relaxed">
                Publica tu predio o finca directamente con el equipo técnico de Activos & Inversiones Darién S.A.S. Evaluamos tu activo, saneamos la información jurídica y gestionamos negociaciones transparentes.
              </p>

              <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-stone-800 uppercase">
                  <Award className="w-4 h-4 text-stone-600 shrink-0" />
                  <span>Moderación Técnica & Avalúo de Mercado</span>
                </div>
                <p className="text-xs text-stone-600 leading-snug">
                  Revisamos minuciosamente cada captación para asignarle un valor comercial estimado realista acorde a la zona agrícola/comercial.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsConsignmentModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold transition-colors"
            >
              <span>Consignar Inmueble (Formulario Rápido)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Steps section */}
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-10 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="font-serif text-xl sm:text-2xl font-bold">
              ¿Cómo funciona el proceso de captación y publicación?
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 font-mono">
              3 pasos simples garantizados por Activos & Inversiones Darién S.A.S.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-stone-800/80 border border-stone-700/50 rounded-2xl p-5 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center text-sm">
                01
              </div>
              <h4 className="font-bold text-sm text-white">Registro de Activo</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Ingresa ubicación, vocación del suelo, extensión y datos de contacto en el formulario por pasos.
              </p>
            </div>

            <div className="bg-stone-800/80 border border-stone-700/50 rounded-2xl p-5 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center text-sm">
                02
              </div>
              <h4 className="font-bold text-sm text-white">Moderación & Validación</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Nuestro equipo técnico analiza el estado jurídico, asigna imágenes de referencia y valida el precio comercial estimado.
              </p>
            </div>

            <div className="bg-stone-800/80 border border-stone-700/50 rounded-2xl p-5 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center text-sm">
                03
              </div>
              <h4 className="font-bold text-sm text-white">Publicación & Cierre</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Una vez aprobado, el activo pasa al catálogo público y dossier ejecutivo para conectar con inversionistas calificados.
              </p>
            </div>
          </div>
        </div>

        {/* Direct WhatsApp Contact Footer Banner */}
        <div className="bg-white border border-[#E5E1D8] rounded-3xl p-8 text-center space-y-4 shadow-sm">
          <h3 className="font-serif text-xl font-bold text-[#1C1917]">
            ¿Prefieres atención personalizada inmediata?
          </h3>
          <p className="text-xs text-stone-600 max-w-md mx-auto">
            Escríbenos directamente por WhatsApp para coordinar la visita técnica presencial y el avalúo comercial de tu predio.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all inline-flex items-center gap-2 shadow-sm"
            >
              <MessageSquare className="w-4 h-4 text-emerald-200" />
              <span>Contactar Asesor por WhatsApp</span>
            </a>

            <Link
              href="/portal-socios/login"
              className="px-5 py-3 rounded-xl bg-stone-100 text-stone-800 font-bold text-xs hover:bg-stone-200 transition-all inline-flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5 text-stone-600" />
              <span>Ingresar a Mi Cuenta</span>
            </Link>
          </div>
        </div>

      </section>

      {/* Property Consignment Modal */}
      <PropertyConsignmentModal
        isOpen={isConsignmentModalOpen}
        onClose={() => setIsConsignmentModalOpen(false)}
      />

    </div>
  );
}
