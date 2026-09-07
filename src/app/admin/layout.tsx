'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Building2, 
  Users, 
  FileText, 
  FileSpreadsheet, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight, 
  Bell, 
  Search,
  Landmark,
  Kanban,
  LayoutDashboard,
  Home
} from 'lucide-react';
import { useDossier } from '../../context/DossierContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setIsExecutiveModalOpen, setIsDrawerOpen, summary } = useDossier();

  const navItems = [
    {
      name: 'Métricas Generales',
      href: '/admin',
      icon: BarChart3,
      exact: true
    },
    {
      name: 'Inventario de Predios SAE',
      href: '/admin/propiedades',
      icon: Landmark
    },
    {
      name: 'Clientes & Inversionistas (CRM)',
      href: '/admin/crm',
      icon: Users
    },
    {
      name: 'Contratos de Arriendo / Venta',
      href: '/admin/contratos',
      icon: FileText
    }
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      
      {/* Top Fixed Admin Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm px-4 sm:px-6 py-3 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 p-0.5 shadow-md flex items-center justify-center text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <div className="font-serif text-sm font-bold text-slate-900 leading-tight">
                ACTIVOS & INVERSIONES DARIEN S.A.S.
              </div>
              <div className="text-[10px] font-mono text-emerald-700 font-semibold uppercase tracking-wider">
                Panel Interno de Administración
              </div>
            </div>
          </Link>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Dossier ({summary.propertyCount})</span>
          </button>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* User Profile */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center font-mono">
              AD
            </div>
            <div className="hidden md:block text-xs text-left">
              <span className="font-bold text-slate-900 block leading-none">Administrador</span>
              <span className="text-[10px] text-slate-500 font-mono">admin@activosdarien.com</span>
            </div>
          </div>

          <Link
            href="/"
            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Salir al portal público"
          >
            <Home className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar (TailAdmin Inspired Structure) */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 flex flex-col justify-between pt-16 lg:pt-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 space-y-6 overflow-y-auto">
            
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider px-3">
                Menú de Navegación
              </span>

              <nav className="space-y-1 pt-2">
                {navItems.map((item) => {
                  const active = isActive(item.href, item.exact);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        active
                          ? 'bg-emerald-700 text-white shadow-md shadow-emerald-900/10'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.name}</span>
                      </div>
                      {active && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                    </Link>
                  );
                })}

                {/* Generador de Dossiers CTA Button */}
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    setIsExecutiveModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all text-left mt-1"
                >
                  <div className="flex items-center gap-2.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Generador de Dossiers</span>
                  </div>
                </button>
              </nav>
            </div>

            {/* Sub-status Indicator */}
            <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl space-y-1.5 text-xs text-emerald-900 font-mono">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Custodia SAE Activa
              </div>
              <p className="text-[11px] text-emerald-700 leading-tight">
                480 Ha bajo protocolo de conservación en Unguía.
              </p>
            </div>

          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 text-[11px] font-mono text-slate-500 flex justify-between items-center">
            <span>v1.2 TailAdmin PropTech</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {children}
        </main>

      </div>
    </div>
  );
}
