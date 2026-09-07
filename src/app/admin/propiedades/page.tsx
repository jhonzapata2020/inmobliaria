'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit, 
  Copy, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  Lock,
  MapPin,
  Ruler,
  FileSpreadsheet
} from 'lucide-react';
import { INITIAL_PROPERTIES } from '../../../data/mockProperties';
import { Property } from '../../../types/property';
import { formatCurrency, formatArea, getLegalStatusBadge } from '../../../lib/formatters';
import { PropertyFormModal } from '../../../components/admin/PropertyFormModal';

export default function AdminPropiedadesPage() {
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [assetTypeFilter, setAssetTypeFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formInstance, setFormInstance] = useState(0);

  const handleCreateNew = () => {
    setEditingProperty(null);
    setFormInstance((current) => current + 1);
    setModalOpen(true);
  };

  const handleEdit = (prop: Property) => {
    setEditingProperty(prop);
    setFormInstance((current) => current + 1);
    setModalOpen(true);
  };

  const handleDuplicate = (prop: Property) => {
    const duplicated: Property = {
      ...prop,
      id: `prop-${Date.now()}`,
      code: `${prop.code}-COPY`,
      title: `${prop.title} (Copia)`,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setProperties([duplicated, ...properties]);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este registro demostrativo del inventario?')) {
      setProperties(properties.filter((p) => p.id !== id));
    }
  };

  const handleSaveProperty = (savedProp: Property) => {
    if (properties.some((p) => p.id === savedProp.id)) {
      setProperties(properties.map((p) => (p.id === savedProp.id ? savedProp : p)));
    } else {
      setProperties([savedProp, ...properties]);
    }
  };

  const filteredProperties = properties.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.municipality.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = assetTypeFilter ? p.assetType === assetTypeFilter : true;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Panel Administrativo Interno</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white mt-1">
            Gestión de Inventario de Propiedades (CRUD)
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            {properties.length} registros en base de datos local demostrativa.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Crear Nueva Propiedad
        </button>
      </div>

      {/* Demo Notice Bar */}
      <div className="bg-amber-950/70 border border-amber-800/40 p-4 rounded-xl text-xs text-amber-200 flex items-center gap-3 font-mono">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
        <span>
          <strong>Nota de Demostración:</strong> Los datos mostrados son demostrativos y deben ser reemplazados por información validada antes de cualquier uso comercial o jurídico.
        </span>
      </div>

      {/* Controls Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por código, título o municipio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto text-xs">
          <label className="text-slate-400 font-mono">Tipo de Activo:</label>
          <select
            value={assetTypeFilter}
            onChange={(e) => setAssetTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none"
          >
            <option value="">Todos ({properties.length})</option>
            <option value="Finca">Fincas</option>
            <option value="Terreno">Terrenos / Lotes</option>
            <option value="Bodega">Bodegas</option>
            <option value="Edificio">Edificios</option>
            <option value="Local">Locales</option>
            <option value="Casa">Casas</option>
            <option value="Activo Especial">Activo Especial SAE</option>
          </select>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="p-4">Código / Título</th>
              <th className="p-4">Tipo & Modalidad</th>
              <th className="p-4">Ubicación</th>
              <th className="p-4">Área Total</th>
              <th className="p-4">Valor Comercial</th>
              <th className="p-4">Estado Jurídico</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredProperties.map((prop) => {
              const legalBadge = getLegalStatusBadge(prop.legalStatus);
              return (
                <tr key={prop.id} className="hover:bg-slate-850/60 transition-colors">
                  <td className="p-4 space-y-1">
                    <span className="font-bold text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 inline-block">
                      {prop.code}
                    </span>
                    <h4 className="font-bold text-white text-sm font-sans truncate max-w-xs">{prop.title}</h4>
                  </td>

                  <td className="p-4 font-sans">
                    <span className="font-bold text-slate-200 block">{prop.assetType}</span>
                    <span className="text-[11px] text-slate-400">{prop.modality}</span>
                  </td>

                  <td className="p-4 text-slate-300 font-sans">
                    {prop.municipality}, {prop.department}
                  </td>

                  <td className="p-4 text-slate-200 font-bold">
                    {formatArea(prop.areaTotalHa, prop.areaTotalM2)}
                  </td>

                  <td className="p-4 font-bold text-emerald-400">
                    {prop.modality === 'Venta' && formatCurrency(prop.price)}
                    {prop.modality === 'Arriendo' && `${formatCurrency(prop.monthlyRent)}/m`}
                    {prop.modality === 'Custodia' && 'Regulada SAE'}
                  </td>

                  <td className="p-4">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${legalBadge.bgClass} ${legalBadge.textClass} ${legalBadge.borderClass}`}>
                      {legalBadge.label}
                    </span>
                  </td>

                  <td className="p-4 text-right space-x-2">
                    <Link
                      href={`/propiedades/${prop.id}`}
                      className="p-2 text-slate-400 hover:text-white inline-block"
                      title="Ver Vista Pública"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleEdit(prop)}
                      className="p-2 text-slate-400 hover:text-emerald-400 inline-block"
                      title="Editar Propiedad"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(prop)}
                      className="p-2 text-slate-400 hover:text-teal-400 inline-block"
                      title="Duplicar Registro"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(prop.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 inline-block"
                      title="Eliminar Registro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Property Creation/Edit Wizard Modal */}
      <PropertyFormModal
        key={`${formInstance}-${editingProperty?.id ?? 'new'}`}
        propertyToEdit={editingProperty}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaveProperty={handleSaveProperty}
      />

    </div>
  );
}
