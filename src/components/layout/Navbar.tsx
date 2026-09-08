'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building2, 
  FileSpreadsheet, 
  Lock, 
  Menu, 
  X
} from 'lucide-react';
import { useDossier } from '../../context/DossierContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { summary, setIsDrawerOpen } = useDossier();

  // Hide public navbar on all /admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E5E1D8] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
        
        {/* Brand Logo - Stacked Lockup (Sin truncar & sin desbordamientos) */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1E3A2F] text-white flex items-center justify-center shadow-xs group-hover:bg-[#152921] transition-colors shrink-0">
            <Building2 className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-emerald-300" />
          </div>
          <div>
            <span className="font-serif font-bold text-xs sm:text-sm tracking-tight text-[#242321] leading-tight block">
              ACTIVOS & INVERSIONES
            </span>
            <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-[#1E3A2F] uppercase block">
              DARIÉN S.A.S.
            </span>
          </div>
        </Link>

        {/* Central Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <Link
            href="/propiedades"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/propiedades')
                ? 'text-[#1E3A2F] bg-[#F8F7F2] font-bold'
                : 'text-[#6B6A63] hover:text-[#242321] hover:bg-[#F8F7F2]'
            }`}
          >
            Catálogo de Activos
          </Link>

          <Link
            href="/custodia-sae"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/custodia-sae')
                ? 'text-[#6D4C7D] bg-purple-50 font-bold'
                : 'text-[#6B6A63] hover:text-[#6D4C7D] hover:bg-purple-50/50'
            }`}
          >
            Custodia & Gestión SAE
          </Link>

          <Link
            href="/nosotros"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/nosotros') || isActive('/mapa')
                ? 'text-[#1E3A2F] bg-[#F8F7F2] font-bold'
                : 'text-[#6B6A63] hover:text-[#242321] hover:bg-[#F8F7F2]'
            }`}
          >
            Territorio Urabá
          </Link>

          <Link
            href="/contacto"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/contacto')
                ? 'text-[#1E3A2F] bg-[#F8F7F2] font-bold'
                : 'text-[#6B6A63] hover:text-[#242321] hover:bg-[#F8F7F2]'
            }`}
          >
            Contacto
          </Link>
        </nav>

        {/* Right Actions Container: Desktop Actions & Mobile Menu Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Desktop Partner Access (Portal Socios) */}
          <Link
            href="/admin"
            className="hidden md:flex text-[#6B6A63] hover:text-[#1E3A2F] text-xs font-semibold items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-[#F8F7F2] transition-colors"
            title="Acceso Asesores & Panel Interno"
          >
            <Lock className="w-3.5 h-3.5 text-[#6B6A63]" />
            <span>Portal Socios</span>
          </Link>

          <div className="hidden md:block h-5 w-px bg-[#E5E1D8]" />

          {/* Primary Action Button: Mi Dossier (Desktop >= md) */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="hidden md:flex px-4 py-2.5 rounded-xl bg-[#1E3A2F] hover:bg-[#152921] text-white font-semibold text-xs shadow-xs items-center gap-2.5 transition-all active:scale-[0.98]"
            title="Mi Dossier"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>Mi Dossier</span>
            <span className="bg-white/20 text-white font-mono font-bold text-xs px-2 py-0.5 rounded-full">
              {summary.propertyCount}
            </span>
          </button>

          {/* Mobile Navigation Toggle Button (Mobile < md) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-9 w-9 flex md:hidden items-center justify-center rounded-lg border border-[#E5E1D8] text-[#242321] hover:bg-[#F8F7F2] transition-colors shrink-0"
            aria-label="Menú principal"
          >
            {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E5E1D8] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          
          {/* Highlighted Mobile Dossier CTA Button */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setIsDrawerOpen(true);
            }}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#1E3A2F] text-white font-semibold text-xs shadow-sm active:scale-[0.99] transition-all"
          >
            <span className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Mi Dossier Ejecutivo</span>
            </span>
            <span className="bg-white/20 font-mono font-bold text-xs px-2.5 py-0.5 rounded-full">
              {summary.propertyCount}
            </span>
          </button>

          {/* Navigation Links */}
          <div className="space-y-1 text-sm font-medium pt-1">
            <Link
              href="/propiedades"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-[#242321] hover:bg-[#F8F7F2]"
            >
              Catálogo de Activos
            </Link>
            <Link
              href="/custodia-sae"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-[#242321] hover:bg-[#F8F7F2]"
            >
              Custodia & Gestión SAE
            </Link>
            <Link
              href="/nosotros"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-[#242321] hover:bg-[#F8F7F2]"
            >
              Territorio Urabá
            </Link>
            <Link
              href="/contacto"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-[#242321] hover:bg-[#F8F7F2]"
            >
              Contacto
            </Link>
          </div>

          <div className="pt-3 border-t border-[#E5E1D8] space-y-2">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#F8F7F2] text-[#242321] text-xs font-semibold"
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
