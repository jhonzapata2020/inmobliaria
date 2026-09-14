import React from 'react';
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
  FileText
} from 'lucide-react';

export default function PortalSociosLandingPage() {
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

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/portal-socios/registro"
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-sm shadow-lg flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              <UserCheck className="w-4 h-4" />
              <span>Registrarme como Socio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/portal-socios/login"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              <Lock className="w-4 h-4 text-emerald-300" />
              <span>Ingresar al Portal</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content & Benefits */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        
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
                  <span>Acuerdo de Corretaje Compartido 50/50</span>
                </div>
                <p className="text-xs text-emerald-800 leading-snug">
                  Tus datos de contacto directo y titulares permanecen protegidos bajo acuerdo corporativo. Comisión compartida garantizada por contrato.
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

            <Link
              href="/portal-socios/registro?type=owner"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold transition-colors"
            >
              <span>Registrarme como Propietario</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
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
                Ingresa ubicación, vocación del suelo, extensión y datos de contacto en el formulario por pasos (`/socios/nuevo-activo`).
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

        {/* Access CTA Banner */}
        <div className="bg-white border border-[#E5E1D8] rounded-3xl p-8 text-center space-y-4 shadow-sm">
          <h3 className="font-serif text-xl font-bold text-[#1C1917]">
            ¿Ya tienes una cuenta registrada?
          </h3>
          <p className="text-xs text-stone-600 max-w-md mx-auto">
            Accede a tu panel para ver el estado de revisión de tus predios o registrar nuevos inmuebles.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              href="/portal-socios/login"
              className="px-5 py-2.5 rounded-xl bg-[#1E3A2F] text-white font-bold text-xs hover:bg-[#152921] transition-all inline-flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-300" />
              <span>Iniciar Sesión en el Portal</span>
            </Link>

            <Link
              href="/socios/dashboard"
              className="px-5 py-2.5 rounded-xl bg-stone-100 text-stone-800 font-bold text-xs hover:bg-stone-200 transition-all inline-flex items-center gap-2"
            >
              <FileText className="w-3.5 h-3.5 text-stone-600" />
              <span>Ir a Mi Dashboard</span>
            </Link>
          </div>
        </div>

      </section>

    </div>
  );
}
