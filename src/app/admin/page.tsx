'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Ruler, 
  Building2, 
  Landmark, 
  Coins, 
  Search, 
  Edit, 
  Eye, 
  Plus, 
  Check, 
  FileSpreadsheet, 
  TrendingUp, 
  ShieldCheck, 
  MapPin,
  ChevronRight
} from 'lucide-react';
import { INITIAL_PROPERTIES } from '../../data/mockProperties';
import { Property, LegalStatus } from '../../types/property';
import { formatCurrency, formatArea, getLegalStatusBadge } from '../../lib/formatters';
import { PropertyFormModal } from '../../components/admin/PropertyFormModal';
import { useDossier } from '../../context/DossierContext';

export default function AdminDashboardPage() {
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [legalFilter, setLegalFilter] = useState<string>('Todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  const { addToDossier, isInDossier, removeFromDossier, summary } = useDossier();

  // Metrics Calculations
  const totalHectaresInCustody = useMemo(() => {
    return properties.reduce((sum, p) => sum + (p.landAreaHa || (p.landAreaM2 ? p.landAreaM2 / 10000 : 0)), 0);
  }, [properties]);

  const availableCount = properties.filter((p) => p.availability === 'Disponible').length;

  const saeInProcessCount = properties.filter(
    (p) => p.legalStatus === 'Activo especial SAE' || p.legalStatus === 'En estudio jurídico' || p.modality === 'Custodia SAE'
  ).length;

  const totalMonthlyEstimatedRent = useMemo(() => {
    return properties.reduce((sum, p) => sum + (p.monthlyRentCop || 0), 0);
  }, [properties]);

  // Filter Table Results
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const matchQuery = 
        (p.matriculaInmobiliaria || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.municipality.toLowerCase().includes(searchQuery.toLowerCase());

      if (legalFilter === 'Todos') return matchQuery;
      if (legalFilter === 'Saneado') return matchQuery && p.legalStatus === 'Saneado';
      if (legalFilter === 'En Inspección SAE') return matchQuery && (p.legalStatus === 'Activo especial SAE' || p.modality === 'Custodia SAE');
      if (legalFilter === 'En Arriendo') return matchQuery && (p.modality === 'Arriendo' || !!p.monthlyRentCop);
      if (legalFilter === 'En Estudio Jurídico') return matchQuery && p.legalStatus === 'En estudio jurídico';

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

  // Top 3 featured properties for Quick Selection / POS Dossier Cards
  const posProperties = properties.slice(0, 3);

  return (
    <div className="space-y-8 text-[#1C1917]">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
            Panel Interno de Control & Custodia
          </h1>
          <p className="text-xs text-stone-500 font-mono mt-0.5">
            ACTIVOS & INVERSIONES DARIEN S.A.S. — Monitoreo de inventario territorial y gestión de dossiers.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="px-4.5 py-2.5 bg-[#1E3A2F] hover:bg-[#152921] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4 text-emerald-300" /> Registrar Nuevo Predio
        </button>
      </div>

      {/* 2. TARJETAS DE MÉTRICAS SUPERIORES (Estilo Blanco/Arena con Bordes de 1px) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Hectáreas en Custodia */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-mono text-stone-500 font-bold uppercase tracking-wider">
              Total Hectáreas en Custodia
            </span>
            <div className="p-2 bg-[#F8F7F4] text-[#1E3A2F] rounded-lg border border-[#E5E7EB]">
              <Ruler className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#1C1917]">
            {totalHectaresInCustody.toFixed(1)} <span className="text-xs font-normal text-stone-500">Ha</span>
          </div>
          <div className="text-[11px] font-mono text-[#1E3A2F] font-semibold pt-1 border-t border-[#F8F7F4] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Urabá & Darién Chocoano
          </div>
        </div>

        {/* Card 2: Predios Disponibles (Venta/Arriendo) */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-mono text-stone-500 font-bold uppercase tracking-wider">
              Predios Disponibles
            </span>
            <div className="p-2 bg-[#F8F7F4] text-[#1E3A2F] rounded-lg border border-[#E5E7EB]">
              <Building2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#1C1917]">
            {availableCount} <span className="text-xs font-normal text-stone-500">Activos</span>
          </div>
          <div className="text-[11px] font-mono text-stone-600 pt-1 border-t border-[#F8F7F4]">
            <strong>8 Venta</strong> • <strong>2 Arriendo</strong>
          </div>
        </div>

        {/* Card 3: Bienes en Trámite SAE */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-mono text-stone-500 font-bold uppercase tracking-wider">
              Bienes en Trámite SAE
            </span>
            <div className="p-2 bg-[#F8F7F4] text-[#1E3A2F] rounded-lg border border-[#E5E7EB]">
              <Landmark className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#1C1917]">
            {saeInProcessCount} <span className="text-xs font-normal text-stone-500">Predios</span>
          </div>
          <div className="text-[11px] font-mono text-[#1E3A2F] font-semibold pt-1 border-t border-[#F8F7F4]">
            Estudio Técnico & Protocolo Activo
          </div>
        </div>

        {/* Card 4: Cánones Mensuales Estimados */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-mono text-stone-500 font-bold uppercase tracking-wider">
              Cánones Mensuales Estimados
            </span>
            <div className="p-2 bg-[#F8F7F4] text-[#1E3A2F] rounded-lg border border-[#E5E7EB]">
              <Coins className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-[#1C1917]">
            {formatCurrency(totalMonthlyEstimatedRent)}
          </div>
          <div className="text-[11px] font-mono text-stone-600 pt-1 border-t border-[#F8F7F4]">
            Recaudo programado
          </div>
        </div>

      </div>

      {/* 3. TABLA CENTRAL: CONTROL DE PREDIOS REGISTRADOS */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden space-y-4">
        
        {/* Table Header Controls */}
        <div className="p-5 border-b border-[#E5E7EB] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#F8F7F4]/60">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#1C1917]">
              Control de Predios Registrados
            </h2>
            <p className="text-xs text-stone-500 font-mono">
              Listado técnico de matrículas inmobiliarias, ubicaciones y estado legal.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Matrícula / Search Input */}
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar Código, Matrícula o Municipio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#E5E7EB] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1C1917] placeholder-stone-400 focus:outline-none focus:border-[#1E3A2F] shadow-2xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-5 flex gap-2 border-b border-[#E5E7EB] overflow-x-auto text-xs font-mono py-1.5 bg-white">
          {['Todos', 'Saneado', 'En Inspección SAE', 'En Arriendo', 'En Estudio Jurídico'].map((pill) => (
            <button
              key={pill}
              onClick={() => setLegalFilter(pill)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
                legalFilter === pill
                  ? 'bg-[#1E3A2F] text-white shadow-2xs'
                  : 'text-stone-600 hover:bg-[#F8F7F4] hover:text-[#1C1917]'
              }`}
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#F8F7F4] text-stone-600 uppercase text-[10px] tracking-wider border-b border-[#E5E7EB]">
              <tr>
                <th className="p-4">Código / Matrícula</th>
                <th className="p-4">Nombre del Predio</th>
                <th className="p-4">Municipio</th>
                <th className="p-4">Área (ha / m²)</th>
                <th className="p-4">Estado Legal</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredProperties.map((prop) => {
                const legalBadge = getLegalStatusBadge(prop.legalStatus);
                return (
                  <tr key={prop.id} className="hover:bg-[#F8F7F4]/80 transition-colors">
                    
                    {/* Código / Matrícula */}
                    <td className="p-4 space-y-1">
                      <span className="font-bold text-[#1E3A2F] bg-[#1E3A2F]/10 px-2 py-0.5 rounded border border-[#1E3A2F]/20 inline-block text-[11px]">
                        {prop.code}
                      </span>
                      <div className="text-[11px] text-stone-500 font-mono">{prop.matriculaInmobiliaria}</div>
                    </td>

                    {/* Nombre del Predio */}
                    <td className="p-4 font-sans">
                      <h4 className="font-bold text-[#1C1917] text-sm">{prop.title}</h4>
                      <span className="text-[11px] text-stone-500 font-mono">{prop.assetType} • {prop.modality}</span>
                    </td>

                    {/* Municipio */}
                    <td className="p-4 font-sans text-stone-700">
                      <span className="font-semibold">{prop.municipality}</span>, {prop.department}
                    </td>

                    {/* Área */}
                    <td className="p-4 font-bold text-[#1C1917]">
                      {formatArea(prop.landAreaHa, prop.landAreaM2)}
                    </td>

                    {/* Estado Legal */}
                    <td className="p-4">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-[#F8F7F4] text-[#1E3A2F] border border-[#E5E7EB] inline-block">
                        {prop.legalStatus}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/propiedades/${prop.id}`}
                        className="p-2 text-stone-500 hover:text-[#1E3A2F] hover:bg-[#F8F7F4] rounded-lg inline-block transition-colors"
                        title="Ver Ficha 360°"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleEdit(prop)}
                        className="p-2 text-[#1E3A2F] hover:bg-[#1E3A2F]/10 rounded-lg inline-block font-bold transition-colors"
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

      {/* 4. BARRAS DE PROGRESO: CONSOLIDADO DE ESTADO DEL PORTAFOLIO */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#E5E7EB] pb-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1C1917]">
              Consolidado del Estado del Portafolio
            </h3>
            <p className="text-xs text-stone-500 font-mono">
              Proporción de predios saneados vs. bienes en custodia institucional SAE.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#1E3A2F] bg-[#1E3A2F]/10 px-3 py-1 rounded-lg border border-[#1E3A2F]/20">
            Total {properties.length} Predios Validados
          </span>
        </div>

        <div className="space-y-4 text-xs font-mono pt-2">
          
          {/* Progress 1: Predios Saneados 100% */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[#1C1917] font-bold">
              <span>Predios Saneados 100% (Listos para negociación)</span>
              <span>60% (6 Activos)</span>
            </div>
            <div className="w-full h-3 bg-[#F8F7F4] rounded-full overflow-hidden border border-[#E5E7EB]">
              <div className="h-full bg-[#1E3A2F] rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>

          {/* Progress 2: Predios en Inspección / Custodia SAE */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-stone-700 font-bold">
              <span>Predios en Inspección & Custodia Especial SAE</span>
              <span>30% (3 Activos)</span>
            </div>
            <div className="w-full h-3 bg-[#F8F7F4] rounded-full overflow-hidden border border-[#E5E7EB]">
              <div className="h-full bg-stone-500 rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>

          {/* Progress 3: Predios Comercializados / Arrendados */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-stone-700 font-bold">
              <span>Predios Comercializados / En Arriendo Activo</span>
              <span>10% (1 Activo)</span>
            </div>
            <div className="w-full h-3 bg-[#F8F7F4] rounded-full overflow-hidden border border-[#E5E7EB]">
              <div className="h-full bg-emerald-700 rounded-full" style={{ width: '10%' }}></div>
            </div>
          </div>

        </div>
      </div>

      {/* 5. TARJETAS DE FOTOS INFERIORES: EFECTO SELECCIÓN RÁPIDA / POS DOSSIER */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1C1917]">
              Selección Rápida de Inmuebles para Dossier (POS)
            </h3>
            <p className="text-xs text-stone-500 font-mono">
              Haz clic en &ldquo;+ Agregar a Dossier&rdquo; para sumar activos a la cotización ejecutiva actual.
            </p>
          </div>
          <div className="text-xs font-mono text-[#1E3A2F] font-bold bg-[#1E3A2F]/10 px-3 py-1.5 rounded-xl border border-[#1E3A2F]/20 flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-[#1E3A2F]" />
            <span>Dossier Actual: <strong>{summary.propertyCount}</strong> activos</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posProperties.map((prop) => {
            const inDossier = isInDossier(prop.id);
            return (
              <div 
                key={prop.id}
                className={`bg-white border rounded-2xl overflow-hidden shadow-xs space-y-3 p-4 transition-all duration-200 flex flex-col justify-between ${
                  inDossier ? 'border-[#1E3A2F] ring-2 ring-[#1E3A2F]/30 bg-[#F8F7F4]/40' : 'border-[#E5E7EB] hover:border-stone-300'
                }`}
              >
                <div className="space-y-3">
                  {/* Photo Container */}
                  <div className="h-44 w-full rounded-xl overflow-hidden bg-slate-100 relative">
                    <img
                      src={prop.images[0]}
                      alt={prop.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-[#1E3A2F] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-sm">
                      {prop.code}
                    </div>
                  </div>

                  {/* Title & Info */}
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-sm text-[#1C1917] line-clamp-1">{prop.title}</h4>
                    <p className="text-xs text-stone-500 flex items-center gap-1 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-[#1E3A2F]" />
                      {prop.municipality}, {prop.department}
                    </p>
                  </div>

                  {/* Specs & Pricing */}
                  <div className="flex justify-between items-center text-xs font-mono pt-2 border-t border-[#E5E7EB]">
                    <span className="text-stone-600 font-semibold">
                      {formatArea(prop.landAreaHa, prop.landAreaM2)}
                    </span>
                    <span className="font-bold text-[#1E3A2F] text-sm">
                      {prop.modality === 'Venta' && formatCurrency(prop.salePriceCop)}
                      {prop.modality === 'Arriendo' && `${formatCurrency(prop.monthlyRentCop)}/m`}
                      {prop.modality === 'Custodia SAE' && 'Regulada SAE'}
                    </span>
                  </div>
                </div>

                {/* Interactive POS Button */}
                <button
                  onClick={() => (inDossier ? removeFromDossier(prop.id) : addToDossier(prop))}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs ${
                    inDossier
                      ? 'bg-[#1E3A2F] text-white shadow-sm'
                      : 'bg-[#F8F7F4] text-[#1E3A2F] border border-[#E5E7EB] hover:bg-[#1E3A2F] hover:text-white'
                  }`}
                >
                  {inDossier ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>✓ Seleccionado en Dossier</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>+ Agregar a Dossier</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Property Form Modal */}
      <PropertyFormModal
        propertyToEdit={editingProperty}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaveProperty={handleSaveProperty}
      />

    </div>
  );
}
