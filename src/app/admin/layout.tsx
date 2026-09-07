'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building2, 
  Landmark, 
  Users, 
  FileText, 
  FileSpreadsheet, 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronRight, 
  Home,
  Check
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
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true
    },
    {
      name: 'Inventario de Predios',
      href: '/admin/propiedades',
      icon: Building2
    },
    {
      name: 'Activos Especiales (SAE)',
      href: '/custodia-sae',
      icon: Landmark
    },
    {
      name: 'Clientes & Inversionistas',
      href: '/admin/crm',
      icon: Users
    },
    {
      name: 'Contratos',
      href: '/admin/contratos',
      icon: FileText
    }
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#1C1917] flex flex-col font-sans">
      
      {/* Top Fixed Executive Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] shadow-xs px-4 sm:px-6 py-3.5 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-[#1C1917] hover:bg-[#F8F7F4]"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#1E3A2F] text-white flex items-center justify-center shadow-sm">
              <Building2 className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="font-serif text-sm font-bold text-[#1C1917] leading-tight">
                ACTIVOS & INVERSIONES DARIEN S.A.S.
              </div>
              <div className="text-[10px] font-mono text-[#1E3A2F] font-bold uppercase tracking-wider">
                Panel Interno de Control & Custodia
              </div>
            </div>
          </Link>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-[#1E3A2F]/5 border border-[#1E3A2F]/20 text-[#1E3A2F] rounded-xl text-xs font-bold hover:bg-[#1E3A2F]/10 transition-colors shadow-2xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#1E3A2F]" />
            <span>Mi Dossier</span>
            <span className="bg-[#1E3A2F] text-white font-bold text-[10px] px-1.5 py-0.5 rounded-full font-mono">
              {summary.propertyCount}
            </span>
          </button>

          <div className="h-5 w-px bg-[#E5E7EB] hidden sm:block" />

          {/* User Profile */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1E3A2F] text-white font-bold text-xs flex items-center justify-center font-mono shadow-xs">
              AD
            </div>
            <div className="hidden md:block text-xs text-left">
              <span className="font-bold text-[#1C1917] block leading-none">Administración</span>
              <span className="text-[10px] text-stone-500 font-mono">admin@activosdarien.com</span>
            </div>
          </div>

          <Link
            href="/"
            className="p-2 text-stone-500 hover:text-[#1E3A2F] hover:bg-[#F8F7F4] rounded-lg transition-colors"
            title="Salir al portal público"
          >
            <Home className="w-4.5 h-4.5" />
          </Link>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-[#E5E7EB] transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 flex flex-col justify-between pt-16 lg:pt-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 space-y-6 overflow-y-auto">
            
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-stone-400 font-bold tracking-wider px-3">
                Menú de Gestión
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
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        active
                          ? 'bg-[#1E3A2F] text-white shadow-sm'
                          : 'text-[#1C1917] hover:bg-[#F8F7F4] hover:text-[#1E3A2F]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${active ? 'text-emerald-300' : 'text-stone-400'}`} />
                        <span>{item.name}</span>
                      </div>
                      {active && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                    </Link>
                  );
                })}

                {/* Generador de Dossiers Trigger Button */}
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    setIsExecutiveModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#1C1917] hover:bg-[#F8F7F4] hover:text-[#1E3A2F] transition-all text-left mt-1"
                >
                  <div className="flex items-center gap-2.5">
                    <FileSpreadsheet className="w-4 h-4 text-[#1E3A2F]" />
                    <span>Generador de Dossiers</span>
                  </div>
                </button>
              </nav>
            </div>

            {/* Institutional Custody Badge */}
            <div className="p-3.5 bg-[#1E3A2F]/5 border border-[#1E3A2F]/15 rounded-xl space-y-1 text-xs text-[#1C1917]">
              <div className="flex items-center gap-1.5 font-bold text-[#1E3A2F]">
                <ShieldCheck className="w-4 h-4 text-[#1E3A2F]" />
                Custodia Territorial SAE
              </div>
              <p className="text-[11px] text-stone-600 font-mono leading-tight">
                480 Ha bajo protocolo en Unguía (Chocó).
              </p>
            </div>

          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-[#E5E7EB] bg-[#F8F7F4] text-[11px] font-mono text-stone-500 flex justify-between items-center">
            <span>DARIEN S.A.S. • v2.0</span>
            <span className="w-2 h-2 rounded-full bg-[#1E3A2F]"></span>
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
