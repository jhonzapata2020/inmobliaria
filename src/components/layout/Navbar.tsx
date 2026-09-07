'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  FileSpreadsheet, 
  Heart, 
  Layers, 
  Menu, 
  X, 
  ChevronDown, 
  PhoneCall, 
  ShieldCheck, 
  Kanban, 
  LayoutDashboard,
  Search
} from 'lucide-react';
import { useDossier } from '../../context/DossierContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useCompare } from '../../context/CompareContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const { summary, setIsDrawerOpen } = useDossier();
  const { favoritesCount } = useFavorites();
  const { comparedProperties, setIsCompareModalOpen } = useCompare();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800 shadow-xl">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-xs py-1.5 px-4 text-slate-200 border-b border-emerald-800/40">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-emerald-500/30">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Gestión Patrimonial
            </span>
            <span>Urabá • Darién • Antioquia • Chocó — Custodia SAE & Inversión Territorial</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <a href="tel:+5748289000" className="hover:text-emerald-400 flex items-center gap-1 transition-colors">
              <PhoneCall className="w-3 h-3 text-teal-400" />
              +57 (4) 828-9000
            </a>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline text-slate-300">Medellín & Apartadó</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Building2 className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="font-serif text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              ACTIVOS & INVERSIONES
            </div>
            <div className="text-[10px] font-mono tracking-wider uppercase text-emerald-400 font-semibold flex items-center gap-1">
              DARIEN S.A.S.
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <Link
            href="/"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/') ? 'text-emerald-400 bg-slate-800/80 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Inicio
          </Link>
          <Link
            href="/propiedades"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive('/propiedades') ? 'text-emerald-400 bg-slate-800/80 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Search className="w-4 h-4 text-emerald-400" />
            Explorar Propiedades
          </Link>
          <Link
            href="/mapa"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive('/mapa') ? 'text-emerald-400 bg-slate-800/80 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <MapPin className="w-4 h-4 text-teal-400" />
            Mapa Territorial
          </Link>
          <Link
            href="/custodia-sae"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/custodia-sae') ? 'text-emerald-400 bg-slate-800/80 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Custodia SAE
          </Link>
          <Link
            href="/inversion"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/inversion') ? 'text-emerald-400 bg-slate-800/80 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Oportunidades
          </Link>
          <Link
            href="/nosotros"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/nosotros') ? 'text-emerald-400 bg-slate-800/80 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Nosotros
          </Link>
          <Link
            href="/contacto"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/contacto') ? 'text-emerald-400 bg-slate-800/80 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Contacto
          </Link>

          {/* Internal Portal Dropdown */}
          <div className="relative">
            <button
              onClick={() => setAdminMenuOpen(!adminMenuOpen)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-amber-300 hover:bg-slate-800 flex items-center gap-1 transition-colors border border-amber-500/30 bg-amber-500/10"
            >
              Panel Interno
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {adminMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onMouseLeave={() => setAdminMenuOpen(false)}
              >
                <div className="px-3 py-1.5 text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                  Módulos de Gestión
                </div>
                <Link
                  href="/admin/crm"
                  onClick={() => setAdminMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800 hover:text-emerald-400"
                >
                  <Kanban className="w-4 h-4 text-emerald-400" />
                  CRM Comercial (Kanban)
                </Link>
                <Link
                  href="/admin/propiedades"
                  onClick={() => setAdminMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800 hover:text-emerald-400"
                >
                  <LayoutDashboard className="w-4 h-4 text-teal-400" />
                  Gestión de Propiedades (CRUD)
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Global Floating Actions: Quick Quote / Dossier, Compare & Favorites */}
        <div className="hidden md:flex items-center gap-3">
          {/* Favorites Button */}
          <Link
            href="/propiedades?favorites=true"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-400 transition-colors relative"
            title="Ver Favoritos Guardados"
          >
            <Heart className="w-5 h-5" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-slate-900">
                {favoritesCount}
              </span>
            )}
          </Link>

          {/* Compare Button */}
          {comparedProperties.length > 0 && (
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors relative flex items-center gap-1 text-xs font-medium"
              title="Comparar Propiedades"
            >
              <Layers className="w-5 h-5 text-amber-400" />
              <span className="hidden xl:inline">Comparar</span>
              <span className="bg-amber-500 text-slate-950 font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-slate-900">
                {comparedProperties.length}
              </span>
            </button>
          )}

          {/* Quick Quote / Dossier Drawer Trigger Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="relative px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-medium text-sm shadow-lg shadow-teal-900/40 flex items-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
            <span>Mi Dossier</span>
            <span className="bg-white text-teal-900 font-bold text-xs px-2 py-0.5 rounded-full">
              {summary.propertyCount}
            </span>
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="p-2 rounded-lg bg-teal-600/30 text-teal-300 border border-teal-500/40 relative"
          >
            <FileSpreadsheet className="w-5 h-5" />
            {summary.propertyCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {summary.propertyCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
            >
              Inicio
            </Link>
            <Link
              href="/propiedades"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-emerald-400 hover:bg-slate-800"
            >
              Explorar Propiedades
            </Link>
            <Link
              href="/mapa"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-teal-400 hover:bg-slate-800"
            >
              Mapa Territorial
            </Link>
            <Link
              href="/custodia-sae"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
            >
              Custodia SAE
            </Link>
            <Link
              href="/inversion"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
            >
              Oportunidades de Inversión
            </Link>
            <Link
              href="/nosotros"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
            >
              Nosotros
            </Link>
            <Link
              href="/contacto"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
            >
              Contacto
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="text-xs font-mono text-amber-400 uppercase tracking-wider px-3 font-semibold">
              Módulos de Gestión Interna
            </div>
            <Link
              href="/admin/crm"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-slate-900 text-slate-200 text-sm hover:bg-slate-800"
            >
              <Kanban className="w-4 h-4 text-emerald-400" />
              CRM Comercial (Kanban)
            </Link>
            <Link
              href="/admin/propiedades"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-slate-900 text-slate-200 text-sm hover:bg-slate-800"
            >
              <LayoutDashboard className="w-4 h-4 text-teal-400" />
              Gestión de Propiedades (CRUD)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
