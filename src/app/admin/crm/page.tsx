'use client';

import React from 'react';
import { KanbanBoard } from '../../../components/crm/KanbanBoard';
import { Kanban, ShieldCheck, Lock } from 'lucide-react';

export default function AdminCRMPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Módulo Interno Comercial & Pipeline</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white mt-1">
            CRM Comercial — Embudo Kanban
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Gestión de interesados, ofertas radicadas, estudios jurídicos y cierres comerciales.
          </p>
        </div>
      </div>

      {/* Main Kanban Component */}
      <KanbanBoard />

    </div>
  );
}
