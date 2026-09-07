'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Globe, 
  ArrowRight,
  ExternalLink,
  Lock
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Corporate Overview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <span className="font-serif text-lg font-bold text-white block">
                  ACTIVOS & INVERSIONES DARIEN
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold tracking-wider uppercase">
                  S.A.S. • NIT 901.884.210-4
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              Plataforma inmobiliaria especializada en la comercialización, administración, valoración, arriendo y custodia de activos urbanos, rurales, comerciales y bajo modalidad SAE en Colombia, con especial arraigo en las regiones estratégicas de Urabá y Darién.
            </p>
            <div className="flex items-center gap-3 text-xs text-emerald-400 font-medium pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 border border-emerald-800/60 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Administración & Custodia Profesional
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase font-mono">
              Portafolio de Activos
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/propiedades?assetType=Finca" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-slate-600" /> Fincas & Predios Rurales
                </Link>
              </li>
              <li>
                <Link href="/propiedades?assetType=Terreno" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-slate-600" /> Terrenos & Lotes
                </Link>
              </li>
              <li>
                <Link href="/propiedades?assetType=Bodega" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-slate-600" /> Bodegas & Logística
                </Link>
              </li>
              <li>
                <Link href="/custodia-sae" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-slate-600" /> Activos Custodia SAE
                </Link>
              </li>
              <li>
                <Link href="/inversion" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-slate-600" /> Oportunidades de Inversión
                </Link>
              </li>
            </ul>
          </div>

          {/* Territories Covered */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase font-mono">
              Cobertura Territorial
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Necoclí • Turbo • Apartadó (Antioquia)
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Carepa • Chigorodó • Mutatá
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                Acandí • Unguía (Darién Chocoano)
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Globe className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                Corredores Portuarios & Agroindustriales
              </li>
            </ul>
          </div>

          {/* Contact Details & Office */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase font-mono">
              Contacto Corporativo
            </h3>
            <div className="space-y-2 text-sm">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Sede Principal: Centro Comercial Plaza Ortiz, Oficina 402, Apartadó, Antioquia.</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>+57 (4) 828-9000</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>contacto@activosdarien.com.co</span>
              </p>
            </div>

            <div className="pt-2">
              <Link 
                href="/admin/crm"
                className="inline-flex items-center gap-1.5 text-xs text-amber-300 bg-amber-950/40 border border-amber-800/40 px-3 py-1.5 rounded-lg hover:bg-amber-900/50 transition-colors"
              >
                <Lock className="w-3 h-3" /> Acceso Asesores & Administración
              </Link>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div className="space-y-1 text-center md:text-left">
            <p>© {new Date().getFullYear()} ACTIVOS & INVERSIONES DARIEN S.A.S. Todos los derechos reservados.</p>
            <p className="text-[11px] text-slate-600">
              * Nota: Los datos, matrículas e imágenes de demostración tienen fines exclusivamente ilustrativos y están sujetos a verificación legal, técnica y comercial previa a cualquier negociación.
            </p>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/contacto" className="hover:text-slate-200 transition-colors">Términos de Servicio</Link>
            <span>•</span>
            <Link href="/contacto" className="hover:text-slate-200 transition-colors">Tratamiento de Datos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
