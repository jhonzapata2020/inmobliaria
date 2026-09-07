'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Ruler, 
  ShieldCheck, 
  FileText, 
  TrendingUp, 
  Coins, 
  Users, 
  Search, 
  Edit, 
  Eye, 
  Plus, 
  Filter, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Landmark,
  FileSpreadsheet
} from 'lucide-react';
import { INITIAL_PROPERTIES } from '../../data/mockProperties';
import { INITIAL_LEADS } from '../../data/mockLeads';
import { Property, LegalStatus } from '../../types/property';
import { formatCurrency, formatArea } from '../../lib/formatters';
import { PropertyFormModal } from '../../components/admin/PropertyFormModal';
import { useDossier } from '../../context/DossierContext';

export default function AdminDashboardPage() {
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [legalFilter, setLegalFilter] = useState<string>('Todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  const { setIsExecutiveModalOpen, addToDossier } = useDossier();

  // Metrics Calculations
  const totalHectaresInCustody = useMemo(() => {
    return properties.reduce((sum, p) => sum + (p.areaTotalHa || (p.areaTotalM2 ? p.areaTotalM2 / 10000 : 0)), 0);
  }, [properties]);

  const availableCount = properties.filter((p) => p.availability === 'Disponible').length;

  const totalMonthlyBilledRent = useMemo(() => {
    return properties.reduce((sum, p) => sum + (p.monthlyRent || 0), 0);
  }, [properties]);

  const activeLeadsCount = INITIAL_LEADS.length;

  // Filter Table Results
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // Search by Matrícula, Code or Title/Municipality
      const matchQuery = 
        p.matriculaInmobiliaria.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.municipality.toLowerCase().includes(searchQuery.toLowerCase());

      if (legalFilter === 'Todos') return matchQuery;
      if (legalFilter === 'Saneado') return matchQuery && p.legalStatus === 'Saneado';
      if (legalFilter === 'En Extinción') return matchQuery && (p.legalStatus === 'En estudio jurídico' || p.legalStatus === 'En proceso de saneamiento');
      if (legalFilter === 'En Arriendo') return matchQuery && (p.modality === 'Arriendo' || p.monthlyRent);
      if (legalFilter === 'Custodia SAE') return matchQuery && (p.legalStatus === 'Activo especial SAE' || p.modality === 'Custodia');

      return matchQuery;
    });
  }, [properties, searchQuery, legalFilter]);

  const handleEdit = (prop: Property) => {
    setEditingProperty(prop);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingProperty(null);
    setModalOpen(true);
  };

  const handleSaveProperty = (savedProp: Property) => {
    if (properties.some((p) => p.id === savedProp.id)) {
      setProperties(properties.map((p) => (p.id === savedProp.id ? savedProp : p)));
    } else {
      setProperties([savedProp, ...properties]);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Panel de Control & Métricas Generales
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Monitoreo en tiempo real de predios en custodia SAE, facturación de cánones e inventario.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCreate}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-900/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> Nuevo Predio
          </button>
        </div>
      </div>

      {/* 1. TARJETAS DE RESUMEN SUPERIOR (TailAdmin Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Hectáreas en Custodia */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-mono text-slate-500 font-semibold uppercase tracking-wider">
                Hectáreas Totales en Custodia
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900">
                {totalHectaresInCustody.toFixed(1)} <span className="text-sm font-normal text-slate-500">Ha</span>
              </div>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
              <Ruler className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold font-mono pt-1 border-t border-slate-100">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12.5% vs año anterior (Urabá & Chocó)</span>
          </div>
        </div>

        {/* Card 2: Predios Disponibles */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-mono text-slate-500 font-semibold uppercase tracking-wider">
                Predios Disponibles
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900">
                {availableCount} <span className="text-sm font-normal text-slate-500">Activos</span>
              </div>
            </div>
            <div className="p-3 bg-teal-50 text-teal-700 rounded-xl border border-teal-100">
              <Landmark className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono pt-1 border-t border-slate-100">
            <span className="text-teal-700 font-bold">8 Venta</span> • <span>2 Arriendo</span> • <span>2 SAE</span>
          </div>
        </div>

        {/* Card 3: Cánones Facturados */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-mono text-slate-500 font-semibold uppercase tracking-wider">
                Cánones Facturados Mes
              </span>
              <div className="text-xl font-bold font-mono text-slate-900">
                {formatCurrency(totalMonthlyBilledRent)}
              </div>
            </div>
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl border border-amber-100">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold font-mono pt-1 border-t border-slate-100">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% recaudo al día (Apartadó / Turbo)</span>
          </div>
        </div>

        {/* Card 4: Prospectos Activos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-mono text-slate-500 font-semibold uppercase tracking-wider">
                Prospectos Activos (CRM)
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900">
                {activeLeadsCount} <span className="text-sm font-normal text-slate-500">Leads</span>
              </div>
            </div>
            <div className="p-3 bg-purple-50 text-purple-700 rounded-xl border border-purple-100">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-purple-700 font-semibold font-mono pt-1 border-t border-slate-100">
            <span>8 en Estudio Jurídico Avanzado</span>
          </div>
        </div>

      </div>

      {/* 2. TABLA ADMINISTRATIVA COMPLETA DE BIENES */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
        
        {/* Table Filter Controls Header */}
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
          <div>
            <h2 className="font-serif text-lg font-bold text-slate-900">
              Inventario de Predios & Activos Especiales
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              Filtrado por Matrícula Inmobiliaria y estado de saneamiento jurídico.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar Matrícula (ej. 034-...) o Nombre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Filter Tabs Pills */}
        <div className="px-5 flex gap-2 border-b border-slate-200 overflow-x-auto text-xs font-mono py-1">
          {['Todos', 'Saneado', 'En Extinción', 'En Arriendo', 'Custodia SAE'].map((tab) => (
            <button
              key={tab}
              onClick={() => setLegalFilter(tab)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
                legalFilter === tab
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">Código & Nombre del Predio</th>
                <th className="p-4">Matrícula Inmobiliaria</th>
                <th className="p-4">Municipio / Zona</th>
                <th className="p-4">Área Total</th>
                <th className="p-4">Canon / Precio</th>
                <th className="p-4">Estado Legal</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProperties.map((prop) => {
                let badgeStyle = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                if (prop.legalStatus === 'En estudio jurídico') badgeStyle = 'bg-amber-100 text-amber-800 border-amber-200';
                if (prop.legalStatus === 'Activo especial SAE') badgeStyle = 'bg-purple-100 text-purple-800 border-purple-200';
                if (prop.legalStatus === 'En proceso de saneamiento') badgeStyle = 'bg-orange-100 text-orange-800 border-orange-200';

                return (
                  <tr key={prop.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 space-y-1">
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block text-[11px]">
                        {prop.code}
                      </span>
                      <h4 className="font-bold text-slate-900 font-sans text-sm">{prop.title}</h4>
                    </td>

                    <td className="p-4 font-bold text-slate-700">
                      {prop.matriculaInmobiliaria}
                    </td>

                    <td className="p-4 text-slate-600 font-sans">
                      <span className="font-semibold">{prop.municipality}</span>, {prop.department}
                    </td>

                    <td className="p-4 text-slate-800 font-bold">
                      {formatArea(prop.areaTotalHa, prop.areaTotalM2)}
                    </td>

                    <td className="p-4 font-bold text-emerald-800">
                      {prop.modality === 'Venta' && formatCurrency(prop.price)}
                      {prop.modality === 'Arriendo' && `${formatCurrency(prop.monthlyRent)}/mes`}
                      {prop.modality === 'Custodia' && 'Regulada SAE'}
                      {prop.modality === 'Inversión' && formatCurrency(prop.price)}
                    </td>

                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${badgeStyle}`}>
                        {prop.legalStatus}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/propiedades/${prop.id}`}
                        className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg inline-block"
                        title="Ver Ficha 360°"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleEdit(prop)}
                        className="p-2 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg inline-block font-semibold"
                        title="Editar Registro"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* 3. RECENT ACTIVITY & SUBREGIONAL WIDGETS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity Log */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>Bitácora de Contratos & Saneamiento Reciente</span>
            <span className="text-xs font-mono text-slate-400 font-normal">Últimos 30 días</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg font-bold">CT-088</div>
                <div>
                  <h4 className="font-bold text-slate-900">Arriendo Parque Logístico El Eje (Apartadó)</h4>
                  <p className="text-slate-500 font-mono">Inquilino: Logística Bananera del Caribe • Canon: $42M/mes</p>
                </div>
              </div>
              <span className="font-mono text-emerald-700 font-bold">Vigente</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-800 rounded-lg font-bold">SAE-04</div>
                <div>
                  <h4 className="font-bold text-slate-900">Estudio Técnico Hacienda La Gloria (Unguía)</h4>
                  <p className="text-slate-500 font-mono">Levantamiento de linderos georreferenciados REDD+ completado.</p>
                </div>
              </div>
              <span className="font-mono text-purple-700 font-bold">Completado</span>
            </div>
          </div>
        </div>

        {/* Subregional Distribution Progress */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Distribución Territorial
          </h3>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Apartadó (Antioquia)</span>
                <span className="font-bold text-slate-900">4 Predios (40%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Necoclí & Turbo</span>
                <span className="font-bold text-slate-900">3 Predios (30%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-600 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Acandí & Unguía (Chocó)</span>
                <span className="font-bold text-slate-900">2 Predios (20%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Property Creation / Edit Modal */}
      <PropertyFormModal
        propertyToEdit={editingProperty}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaveProperty={handleSaveProperty}
      />

    </div>
  );
}
