'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  TrendingUp, 
  Calendar, 
  ChevronRight, 
  ChevronLeft,
  Coins,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { Lead, CRMStage } from '../../types/crm';
import { formatCurrency } from '../../lib/formatters';
import { LeadDetailModal } from './LeadDetailModal';
import { getLeadsAction, updateLeadStageAction } from '../../app/actions/leads';

interface KanbanBoardProps {
  initialLeads?: Lead[];
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ initialLeads }) => {
  const [leads, setLeads] = useState<Lead[]>(initialLeads || []);
  const [loading, setLoading] = useState(!initialLeads);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');

  const loadLeads = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const dbLeads = await getLeadsAction();
      setLeads(dbLeads || []);
    } catch (err: any) {
      console.error('Error loading CRM leads:', err);
      setFetchError('Error al cargar la información del CRM desde la base de datos Supabase.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialLeads) {
      loadLeads();
    }
  }, [initialLeads]);

  const stages: CRMStage[] = [
    'Nuevo',
    'Contactado',
    'En Visita',
    'Negociación',
    'Cerrado',
    'Descartado'
  ];

  // Move lead stage with rollback on failure
  const moveLead = async (leadId: string, direction: 'next' | 'prev') => {
    setActionError(null);
    const targetLead = leads.find((l) => l.id === leadId);
    if (!targetLead) return;

    const currentIndex = stages.indexOf(targetLead.stage);
    let newStage = targetLead.stage;

    if (direction === 'next' && currentIndex < stages.length - 1) {
      newStage = stages[currentIndex + 1];
    } else if (direction === 'prev' && currentIndex > 0) {
      newStage = stages[currentIndex - 1];
    }

    if (newStage === targetLead.stage) return;

    const previousLeads = [...leads];

    // Optimistic UI update
    setLeads((prevLeads) =>
      prevLeads.map((lead) => {
        if (lead.id !== leadId) return lead;
        return {
          ...lead,
          stage: newStage,
          updatedDate: new Date().toISOString().split('T')[0]
        };
      })
    );

    // Persist to Supabase DB with Rollback on failure
    const res = await updateLeadStageAction(leadId, newStage);
    if (!res.success) {
      setLeads(previousLeads);
      setActionError(res.error || 'No se pudo actualizar la etapa del cliente. Operación revertida.');
    }
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updatedLead.id ? updatedLead : l)));
    setSelectedLead(updatedLead);
  };

  // Filtered Leads
  const filteredLeads = leads.filter((lead) => {
    const titleMatch = (lead.propertyOfInterestTitle || '').toLowerCase().includes(searchQuery.toLowerCase());
    const codeMatch = (lead.propertyCode || '').toLowerCase().includes(searchQuery.toLowerCase());
    const nameMatch = lead.clientName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSearch = nameMatch || titleMatch || codeMatch;
    const matchesPriority = priorityFilter ? lead.priority === priorityFilter : true;
    return matchesSearch && matchesPriority;
  });

  // Calculate Metrics
  const totalPipelineValue = leads.reduce((sum, l) => sum + (l.potentialValue || 0), 0);
  const activeOffersCount = leads.filter((l) => l.stage === 'Negociación').length;
  const scheduledVisitsCount = leads.filter((l) => l.stage === 'En Visita').length;
  const closedCount = leads.filter((l) => l.stage === 'Cerrado').length;
  const conversionRate = Math.round((closedCount / (leads.length || 1)) * 100) || 0;

  return (
    <div className="space-y-6">
      
      {/* Top Error Alert Banners */}
      {fetchError && (
        <div className="p-4 bg-rose-950/80 border border-rose-800 text-rose-200 rounded-2xl flex justify-between items-center text-xs font-mono">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{fetchError}</span>
          </div>
          <button
            onClick={loadLeads}
            className="px-3 py-1 bg-rose-700 text-white rounded-lg hover:bg-rose-600 flex items-center gap-1 font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reintentar
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-200 rounded-xl text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-slate-400 hover:text-white font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Top Metrics Dashboard Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-mono">Valor Total Pipeline</div>
            <div className="text-lg font-bold text-emerald-400 font-mono">
              {loading ? '...' : formatCurrency(totalPipelineValue)}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="p-3 bg-teal-500/20 text-teal-400 rounded-xl border border-teal-500/30">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-mono">Negociaciones Activas</div>
            <div className="text-xl font-bold text-teal-300 font-mono">{loading ? '...' : `${activeOffersCount} Oportunidades`}</div>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-mono">Visitas Programadas</div>
            <div className="text-xl font-bold text-amber-400 font-mono">{loading ? '...' : `${scheduledVisitsCount} Visitas`}</div>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-mono">Tasa Conversión Cierre</div>
            <div className="text-xl font-bold text-purple-300 font-mono">{loading ? '...' : `${conversionRate}% Est.`}</div>
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

      {/* Kanban Loading State */}
      {loading ? (
        <div className="py-16 text-center text-xs font-mono text-slate-400 flex justify-center items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
          <span>Cargando embudo CRM desde Supabase PostgreSQL...</span>
        </div>
      ) : (
        /* Kanban Stages Columns */
        <div className="flex gap-4 overflow-x-auto pb-6">
          {stages.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.stage === stage);
            const stageTotalValue = stageLeads.reduce((sum, l) => sum + (l.potentialValue || 0), 0);

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
                      No hay leads registrados en esta etapa
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
                            {lead.propertyCode && (
                              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-slate-950 px-1.5 py-0.5 rounded">
                                {lead.propertyCode}
                              </span>
                            )}
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

                        {lead.propertyOfInterestTitle && (
                          <div className="text-xs text-slate-300 font-semibold line-clamp-1">
                            {lead.propertyOfInterestTitle}
                          </div>
                        )}

                        <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800/80 font-mono">
                          <span className="font-bold text-emerald-400">
                            {formatCurrency(lead.potentialValue)}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            👤 {(lead.assignedAgent || 'Asesor').split(' ')[1] || lead.assignedAgent || 'Asesor'}
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
      )}

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
