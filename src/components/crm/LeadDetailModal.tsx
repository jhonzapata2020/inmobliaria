'use client';

import React, { useState } from 'react';
import { 
  X, 
  User, 
  Building, 
  Phone, 
  Mail, 
  Calendar, 
  Plus, 
  CheckSquare, 
  MessageSquare, 
  PhoneCall, 
  FileText, 
  Clock, 
  Tag, 
  ShieldCheck,
  Send
} from 'lucide-react';
import { Lead, CRMStage, LeadPriority } from '../../types/crm';
import { formatCurrency } from '../../lib/formatters';

interface LeadDetailModalProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onUpdateLead: (updatedLead: Lead) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  isOpen,
  onClose,
  onUpdateLead
}) => {
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteType, setNewNoteType] = useState<'Nota' | 'Llamada' | 'Visita' | 'Correo' | 'Oferta'>('Nota');
  const [newActivityTitle, setNewActivityTitle] = useState('');

  if (!isOpen) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNote = {
      id: `n-${Date.now()}`,
      author: lead.assignedAgent || 'Asesor Comercial',
      date: new Date().toISOString().split('T')[0],
      text: newNoteText,
      type: newNoteType
    };

    const updatedLead: Lead = {
      ...lead,
      notes: [newNote, ...lead.notes],
      updatedDate: new Date().toISOString().split('T')[0]
    };

    onUpdateLead(updatedLead);
    setNewNoteText('');
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityTitle.trim()) return;

    const newActivity = {
      id: `a-${Date.now()}`,
      title: newActivityTitle,
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      completed: false,
      assignedTo: lead.assignedAgent || 'Asesor Comercial'
    };

    const updatedLead: Lead = {
      ...lead,
      activities: [newActivity, ...lead.activities],
      updatedDate: new Date().toISOString().split('T')[0]
    };

    onUpdateLead(updatedLead);
    setNewActivityTitle('');
  };

  const toggleActivityComplete = (activityId: string) => {
    const updatedActivities = lead.activities.map((a) =>
      a.id === activityId ? { ...a, completed: !a.completed } : a
    );

    onUpdateLead({
      ...lead,
      activities: updatedActivities,
      updatedDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleStageChange = (newStage: CRMStage) => {
    onUpdateLead({
      ...lead,
      stage: newStage,
      updatedDate: new Date().toISOString().split('T')[0]
    });
  };

  const stagesList: CRMStage[] = [
    'Nuevo',
    'Contactado',
    'En Visita',
    'Negociación',
    'Cerrado',
    'Descartado'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md p-4 sm:p-6 md:p-10 flex justify-center animate-in fade-in duration-200">
      <div className="bg-slate-900 text-slate-100 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-800 flex flex-col my-auto overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                {lead.clientName}
                {lead.companyName && <span className="text-xs text-slate-400 font-normal">({lead.companyName})</span>}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Oportunidad #{lead.id} • Actualizado: {lead.updatedDate}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 max-h-[80vh]">
          
          {/* Status Bar Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-mono">Etapa del Pipeline</label>
              <select
                value={lead.stage}
                onChange={(e) => handleStageChange(e.target.value as CRMStage)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-emerald-500"
              >
                {stagesList.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-mono">Prioridad & Responsable</label>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded font-bold ${
                  lead.priority === 'Alta' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-slate-800 text-slate-300'
                }`}>
                  {lead.priority}
                </span>
                <span className="text-slate-300 font-medium truncate">
                  👤 {lead.assignedAgent}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Details & Property of Interest */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 space-y-2">
              <span className="font-mono text-slate-400 block font-semibold uppercase">Información de Contacto</span>
              <p className="flex items-center gap-2 text-slate-200">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> {lead.phone}
              </p>
              <p className="flex items-center gap-2 text-slate-200">
                <Mail className="w-3.5 h-3.5 text-teal-400" /> {lead.email}
              </p>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 space-y-2">
              <span className="font-mono text-slate-400 block font-semibold uppercase">Activo de Interés</span>
              <p className="font-bold text-white text-sm">{lead.propertyOfInterestTitle}</p>
              <div className="flex justify-between items-center text-slate-400 font-mono">
                <span>Código: <strong className="text-emerald-400">{lead.propertyCode}</strong></span>
                <span className="text-emerald-400 font-bold">{formatCurrency(lead.potentialValue)}</span>
              </div>
            </div>
          </div>

          {/* Activity Tasks Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold flex items-center justify-between">
              <span>Próximas Tareas & Actividades</span>
              <span className="text-slate-500">{lead.activities.length} pendientes</span>
            </h3>

            <form onSubmit={handleAddActivity} className="flex gap-2 text-xs">
              <input
                type="text"
                placeholder="Agregar nueva tarea (ej. Agendar avalúo técnico)..."
                value={newActivityTitle}
                onChange={(e) => setNewActivityTitle(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-semibold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Agregar
              </button>
            </form>

            <div className="space-y-2">
              {lead.activities.length === 0 ? (
                <p className="text-xs text-slate-500 font-mono">No hay actividades programadas.</p>
              ) : (
                lead.activities.map((act) => (
                  <div key={act.id} className="flex items-center gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
                    <input
                      type="checkbox"
                      checked={act.completed}
                      onChange={() => toggleActivityComplete(act.id)}
                      className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                    />
                    <span className={`flex-1 font-medium ${act.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {act.title}
                    </span>
                    <span className="font-mono text-slate-400 text-[10px]">📅 {act.dueDate}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Historical Log & Notes */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Historial de Interacciones & Notas
            </h3>

            {/* Note Adder Form */}
            <form onSubmit={handleAddNote} className="space-y-2 text-xs">
              <div className="flex gap-2">
                <select
                  value={newNoteType}
                  onChange={(e) => setNewNoteType(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none"
                >
                  <option value="Nota">📝 Nota</option>
                  <option value="Llamada">📞 Llamada</option>
                  <option value="Visita">📍 Visita</option>
                  <option value="Oferta">💰 Oferta</option>
                </select>
                <input
                  type="text"
                  placeholder="Escribir bitácora de seguimiento..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl"
                >
                  Registrar
                </button>
              </div>
            </form>

            <div className="space-y-3 pt-2">
              {lead.notes.map((note) => (
                <div key={note.id} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between items-center text-[11px] font-mono text-slate-400">
                    <span className="font-semibold text-emerald-400">{note.type} • {note.author}</span>
                    <span>{note.date}</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed">{note.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
