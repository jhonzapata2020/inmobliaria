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
  Lock
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-[#6B6A63] border-t border-[#E5E1D8] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#E5E1D8]">
          
          {/* Brand & Corporate Overview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1E3A2F] text-white flex items-center justify-center shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-lg font-bold text-[#242321] block">
                  ACTIVOS & INVERSIONES DARIEN
                </span>
                <span className="text-[10px] font-mono text-[#1E3A2F] font-bold tracking-wider uppercase">
                  S.A.S. • NIT 901.884.210-4
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[#6B6A63]">
              Plataforma inmobiliaria especializada en la comercialización, administración, valoración, arriendo y custodia de activos urbanos, rurales, comerciales y bajo modalidad SAE en Colombia, con especial arraigo en las regiones estratégicas de Urabá y Darién.
            </p>
            <div className="flex items-center gap-3 text-xs text-[#1E3A2F] font-medium pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EEF4EF] border border-[#E5E1D8] rounded-full font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#23866D]" />
                Administración & Custodia Profesional
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#242321] tracking-wider uppercase font-mono">
              Portafolio de Activos
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/propiedades?assetType=Finca" className="hover:text-[#1E3A2F] transition-colors flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-[#929087]" /> Fincas & Predios Rurales
                </Link>
              </li>
              <li>
                <Link href="/propiedades?assetType=Terreno" className="hover:text-[#1E3A2F] transition-colors flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-[#929087]" /> Terrenos & Lotes
                </Link>
              </li>
              <li>
                <Link href="/propiedades?assetType=Bodega" className="hover:text-[#1E3A2F] transition-colors flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-[#929087]" /> Bodegas & Logística
                </Link>
              </li>
              <li>
                <Link href="/custodia-sae" className="hover:text-[#6D4C7D] transition-colors flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-[#929087]" /> Activos Custodia SAE
                </Link>
              </li>
              <li>
                <Link href="/inversion" className="hover:text-[#C6A15B] transition-colors flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-[#929087]" /> Oportunidades de Inversión
                </Link>
              </li>
            </ul>
          </div>

          {/* Territories Covered */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#242321] tracking-wider uppercase font-mono">
              Cobertura Territorial
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center gap-2 text-[#242321]">
                <MapPin className="w-3.5 h-3.5 text-[#1E3A2F] shrink-0" />
                Necoclí • Turbo • Apartadó (Antioquia)
              </li>
              <li className="flex items-center gap-2 text-[#242321]">
                <MapPin className="w-3.5 h-3.5 text-[#1E3A2F] shrink-0" />
                Carepa • Chigorodó • Mutatá
              </li>
              <li className="flex items-center gap-2 text-[#242321]">
                <MapPin className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                Acandí • Unguía (Darién Chocoano)
              </li>
              <li className="flex items-center gap-2 text-[#242321]">
                <Globe className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                Corredores Portuarios & Agroindustriales
              </li>
            </ul>
          </div>

          {/* Contact Details & Office */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#242321] tracking-wider uppercase font-mono">
              Contacto Corporativo
            </h3>
            <div className="space-y-2 text-sm">
              <p className="flex items-start gap-2 text-[#242321]">
                <MapPin className="w-4 h-4 text-[#1E3A2F] shrink-0 mt-0.5" />
                <span>Sede Principal: CC Plaza Ortiz, Oficina 402, Apartadó, Antioquia.</span>
              </p>
              <p className="flex items-center gap-2 text-[#242321]">
                <Phone className="w-4 h-4 text-[#0F766E] shrink-0" />
                <span>+57 (4) 828-9000</span>
              </p>
              <p className="flex items-center gap-2 text-[#242321]">
                <Mail className="w-4 h-4 text-[#0F766E] shrink-0" />
                <span>contacto@activosdarien.com.co</span>
              </p>
            </div>

            <div className="pt-2">
              <Link 
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs text-[#1E3A2F] bg-[#F1EFE8] border border-[#E5E1D8] px-3 py-1.5 rounded-lg hover:bg-[#E5E1D8] transition-colors font-medium"
              >
                <Lock className="w-3 h-3 text-[#1E3A2F]" /> Portal Socios / Panel Interno
              </Link>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#929087]">
          <div className="space-y-1 text-center md:text-left">
            <p>© {new Date().getFullYear()} ACTIVOS & INVERSIONES DARIEN S.A.S. Todos los derechos reservados.</p>
            <p className="text-[11px] text-[#929087]">
              * Nota: Los datos, matrículas e imágenes de demostración tienen fines exclusivamente ilustrativos y están sujetos a verificación legal, técnica y comercial previa a cualquier negociación.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[#6B6A63]">
            <Link href="/contacto" className="hover:text-[#242321] transition-colors">Términos de Servicio</Link>
            <span>•</span>
            <Link href="/contacto" className="hover:text-[#242321] transition-colors">Tratamiento de Datos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
