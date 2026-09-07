'use client';

import React, { useState } from 'react';
import { 
  Kanban, 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  Building2, 
  TrendingUp, 
  Calendar, 
  Tag, 
  User, 
  ChevronRight, 
  ChevronLeft,
  Coins,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Lead, CRMStage, CRMMetrics } from '../../types/crm';
import { INITIAL_LEADS } from '../../data/mockLeads';
import { formatCurrency } from '../../lib/formatters';
import { LeadDetailModal } from './LeadDetailModal';

export const KanbanBoard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');

  const stages: CRMStage[] = [
    'Nuevo interesado',
    'Contactado',
    'Visita programada',
    'En análisis de necesidad',
    'En estudio jurídico',
    'Oferta radicada',
    'Negociación',
    'Cierre / contrato',
    'No concretado'
  ];

  // Move lead stage
  const moveLead = (leadId: string, direction: 'next' | 'prev') => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) => {
        if (lead.id !== leadId) return lead;

        const currentIndex = stages.indexOf(lead.stage);
        if (direction === 'next' && currentIndex < stages.length - 1) {
          return { ...lead, stage: stages[currentIndex + 1], updatedDate: new Date().toISOString().split('T')[0] };
        }
        if (direction === 'prev' && currentIndex > 0) {
          return { ...lead, stage: stages[currentIndex - 1], updatedDate: new Date().toISOString().split('T')[0] };
        }
        return lead;
      })
    );
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updatedLead.id ? updatedLead : l)));
    setSelectedLead(updatedLead);
  };

  // Filtered Leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.propertyOfInterestTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.propertyCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = priorityFilter ? lead.priority === priorityFilter : true;
    return matchesSearch && matchesPriority;
  });

  // Calculate Metrics
  const totalPipelineValue = leads.reduce((sum, l) => sum + l.potentialValue, 0);
  const activeOffersCount = leads.filter((l) => l.stage === 'Oferta radicada' || l.stage === 'Negociación').length;
  const scheduledVisitsCount = leads.filter((l) => l.stage === 'Visita programada').length;
  const closedCount = leads.filter((l) => l.stage === 'Cierre / contrato').length;
  const conversionRate = Math.round((closedCount / leads.length) * 100) || 15;

  return (
    <div className="space-y-6">
      
      {/* Top Metrics Dashboard Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-mono">Valor Total Pipeline</div>
            <div className="text-lg font-bold text-emerald-400 font-mono">
              {formatCurrency(totalPipelineValue)}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="p-3 bg-teal-500/20 text-teal-400 rounded-xl border border-teal-500/30">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-mono">Ofertas / Negociación</div>
            <div className="text-xl font-bold text-teal-300 font-mono">{activeOffersCount} Oportunidades</div>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-mono">Visitas Programadas</div>
            <div className="text-xl font-bold text-amber-400 font-mono">{scheduledVisitsCount} Visitas</div>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-mono">Tasa Conversión Cierre</div>
            <div className="text-xl font-bold text-purple-300 font-mono">{conversionRate}% Est.</div>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar interesado, empresa o código..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end text-xs">
          <span className="text-slate-400 font-mono">Prioridad:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
          >
            <option value="">Todas</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>
      </div>

      {/* Kanban Stages Columns */}
      <div className="flex gap-4 overflow-x-auto pb-6">
        {stages.map((stage) => {
          const stageLeads = filteredLeads.filter((l) => l.stage === stage);
          const stageTotalValue = stageLeads.reduce((sum, l) => sum + l.potentialValue, 0);

          return (
            <div key={stage} className="w-80 shrink-0 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col max-h-[75vh]">
              
              {/* Column Header */}
              <div className="p-3.5 bg-slate-900 border-b border-slate-800 rounded-t-2xl flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-xs text-white flex items-center gap-1.5">
                    {stage}
                    <span className="text-[10px] font-mono font-normal text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                      {stageLeads.length}
                    </span>
                  </h3>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {formatCurrency(stageTotalValue)}
                  </div>
                </div>
              </div>

              {/* Lead Cards Container */}
              <div className="p-3 flex-1 overflow-y-auto space-y-3">
                {stageLeads.length === 0 ? (
                  <div className="text-center py-8 text-slate-600 text-xs font-mono">
                    Sin oportunidades
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <div 
                      key={lead.id}
                      className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl space-y-3 shadow-md transition-all group relative cursor-pointer"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono text-emerald-400 font-bold bg-slate-950 px-1.5 py-0.5 rounded">
                            {lead.propertyCode}
                          </span>
                          <h4 className="font-bold text-xs text-white mt-1 group-hover:text-emerald-400 transition-colors">
                            {lead.clientName}
                          </h4>
                          {lead.companyName && (
                            <p className="text-[11px] text-slate-400 truncate max-w-[180px]">
                              {lead.companyName}
                            </p>
                          )}
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          lead.priority === 'Alta' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {lead.priority}
                        </span>
                      </div>

                      <div className="text-xs text-slate-300 font-semibold line-clamp-1">
                        {lead.propertyOfInterestTitle}
                      </div>

                      <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800/80 font-mono">
                        <span className="font-bold text-emerald-400">
                          {formatCurrency(lead.potentialValue)}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          👤 {lead.assignedAgent.split(' ')[1] || lead.assignedAgent}
                        </span>
                      </div>

                      {/* Stage Transition Control Arrows */}
                      <div 
                        className="flex justify-between pt-2 border-t border-slate-800/50 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => moveLead(lead.id, 'prev')}
                          disabled={stages.indexOf(lead.stage) === 0}
                          className="p-1 text-slate-500 hover:text-white disabled:opacity-30"
                          title="Mover a etapa anterior"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-[10px] text-slate-500 self-center font-mono">
                          {lead.nextActivity ? '📋 Actividad' : 'Ver Detalle'}
                        </span>
                        <button
                          onClick={() => moveLead(lead.id, 'next')}
                          disabled={stages.indexOf(lead.stage) === stages.length - 1}
                          className="p-1 text-slate-500 hover:text-emerald-400 disabled:opacity-30"
                          title="Avanzar etapa"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          isOpen={!!selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdateLead={handleUpdateLead}
        />
      )}
    </div>
  );
};
