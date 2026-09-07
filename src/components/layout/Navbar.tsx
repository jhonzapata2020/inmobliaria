'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building2, 
  FileSpreadsheet, 
  Lock, 
  Menu, 
  X,
  MapPin,
  Landmark,
  Search,
  Phone
} from 'lucide-react';
import { useDossier } from '../../context/DossierContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { summary, setIsDrawerOpen } = useDossier();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo - Editorial & Sobrio */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#1E3A2F] text-white flex items-center justify-center shadow-xs group-hover:bg-[#152921] transition-colors">
            <Building2 className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div className="font-serif text-base font-bold tracking-tight text-[#1C1917]">
              ACTIVOS & INVERSIONES
            </div>
            <div className="text-[10px] font-mono tracking-wider uppercase text-[#1E3A2F] font-bold">
              DARIEN S.A.S.
            </div>
          </div>
        </Link>

        {/* Central Navigation Links (Consolidated to 4 Essential Items) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <Link
            href="/propiedades"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/propiedades')
                ? 'text-[#1E3A2F] bg-[#F8F7F4] font-bold'
                : 'text-slate-700 hover:text-slate-900 hover:bg-[#F8F7F4]/60'
            }`}
          >
            Catálogo de Activos
          </Link>

          <Link
            href="/custodia-sae"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/custodia-sae')
                ? 'text-[#1E3A2F] bg-[#F8F7F4] font-bold'
                : 'text-slate-700 hover:text-slate-900 hover:bg-[#F8F7F4]/60'
            }`}
          >
            Custodia & Gestión SAE
          </Link>

          <Link
            href="/mapa"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/mapa')
                ? 'text-[#1E3A2F] bg-[#F8F7F4] font-bold'
                : 'text-slate-700 hover:text-slate-900 hover:bg-[#F8F7F4]/60'
            }`}
          >
            Territorio & Cobertura
          </Link>

          <Link
            href="/contacto"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/contacto')
                ? 'text-[#1E3A2F] bg-[#F8F7F4] font-bold'
                : 'text-slate-700 hover:text-slate-900 hover:bg-[#F8F7F4]/60'
            }`}
          >
            Contacto
          </Link>
        </nav>

        {/* Right Actions: Ghost Partner Link & Forest Green Primary Dossier CTA */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* Portal Socios / Panel Interno Link (Discrete Ghost Button) */}
          <Link
            href="/admin"
            className="text-slate-600 hover:text-[#1E3A2F] text-xs font-semibold flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            title="Acceso Asesores & Panel Interno"
          >
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Portal Socios</span>
          </Link>

          <div className="h-5 w-px bg-[#E5E7EB]" />

          {/* Primary Action Button: Mi Dossier (#1E3A2F Deep Forest Green) */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#1E3A2F] hover:bg-[#152921] text-white font-semibold text-xs shadow-xs flex items-center gap-2.5 transition-all active:scale-[0.98]"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
            <span>Mi Dossier</span>
            <span className="bg-white/20 text-white font-mono font-bold text-xs px-2 py-0.5 rounded-full">
              {summary.propertyCount}
            </span>
          </button>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="p-2 rounded-xl bg-[#1E3A2F] text-white relative"
          >
            <FileSpreadsheet className="w-5 h-5" />
            {summary.propertyCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-400 text-slate-950 text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center ring-2 ring-white">
                {summary.propertyCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E5E7EB] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="space-y-1 text-sm font-medium">
            <Link
              href="/propiedades"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-slate-800 hover:bg-[#F8F7F4]"
            >
              Catálogo de Activos
            </Link>
            <Link
              href="/custodia-sae"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-slate-800 hover:bg-[#F8F7F4]"
            >
              Custodia & Gestión SAE
            </Link>
            <Link
              href="/mapa"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-slate-800 hover:bg-[#F8F7F4]"
            >
              Territorio & Cobertura
            </Link>
            <Link
              href="/contacto"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-slate-800 hover:bg-[#F8F7F4]"
            >
              Contacto
            </Link>
          </div>

          <div className="pt-3 border-t border-[#E5E7EB] space-y-2">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#F8F7F4] text-slate-800 text-xs font-semibold"
            >
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#1E3A2F]" />
                Portal Socios (Panel Interno)
              </span>
              <span className="text-[10px] font-mono text-[#1E3A2F] uppercase">Acceso</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
