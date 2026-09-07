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
  AlertTriangle, 
  ShieldCheck,
  MapPin,
  Ruler
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
      p.municipality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.matriculaInmobiliaria.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = assetTypeFilter ? p.assetType === assetTypeFilter : true;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 text-[#1C1917]">
      
      {/* Header Corporativo Sobrio */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E5E7EB] pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Gestión de Inventario & Portafolio de Predios
          </h1>
          <p className="text-xs text-stone-500 font-mono mt-1">
            {properties.length} registros en base de datos local demostrativa.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4.5 py-2.5 bg-[#1E3A2F] hover:bg-[#152921] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4 text-emerald-300" /> Registrar Nuevo Predio
        </button>
      </div>

      {/* Banner de Aviso Demostrativo Sutil */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-800 flex items-center gap-3 font-mono">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
        <span>
          <strong>Nota de Demostración:</strong> Los datos mostrados son demostrativos y deben ser reemplazados por información validada antes de cualquier uso comercial o jurídico.
        </span>
      </div>

      {/* Control Bar & Search (Paleta Clara) */}
      <div className="p-4 bg-white border border-[#E5E7EB] rounded-2xl shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por Matrícula, Código, Nombre o Municipio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#1E3A2F] shadow-2xs font-mono"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto text-xs font-mono">
          <label className="text-stone-500 font-bold">Tipo de Activo:</label>
          <select
            value={assetTypeFilter}
            onChange={(e) => setAssetTypeFilter(e.target.value)}
            className="bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-semibold focus:outline-none focus:border-[#1E3A2F]"
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

      {/* Properties Table (Paleta Clara Sobria) */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#F5F5F4] text-stone-600 uppercase text-xs font-semibold tracking-wider border-b border-[#E5E7EB]">
            <tr>
              <th className="p-4">Código / Matrícula</th>
              <th className="p-4">Nombre del Predio</th>
              <th className="p-4">Municipio</th>
              <th className="p-4">Área Total</th>
              <th className="p-4">Valor Comercial</th>
              <th className="p-4">Estado Legal</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {filteredProperties.map((prop) => {
              return (
                <tr key={prop.id} className="hover:bg-[#F8F7F4]/80 transition-colors">
                  <td className="p-4 space-y-1">
                    <span className="font-bold text-[#1E3A2F] bg-[#1E3A2F]/10 px-2 py-0.5 rounded border border-[#1E3A2F]/20 inline-block text-[11px]">
                      {prop.code}
                    </span>
                    <div className="text-[11px] text-stone-500 font-mono">{prop.matriculaInmobiliaria}</div>
                  </td>

                  <td className="p-4 font-sans">
                    <h4 className="font-bold text-stone-900 text-sm">{prop.title}</h4>
                    <span className="text-[11px] text-stone-500 font-mono">{prop.assetType} • {prop.modality}</span>
                  </td>

                  <td className="p-4 text-stone-700 font-sans">
                    <span className="font-semibold">{prop.municipality}</span>, {prop.department}
                  </td>

                  <td className="p-4 text-stone-900 font-bold">
                    {formatArea(prop.areaTotalHa, prop.areaTotalM2)}
                  </td>

                  <td className="p-4 font-bold text-[#1E3A2F]">
                    {prop.modality === 'Venta' && formatCurrency(prop.price)}
                    {prop.modality === 'Arriendo' && `${formatCurrency(prop.monthlyRent)}/mes`}
                    {prop.modality === 'Custodia' && 'Regulada SAE'}
                    {prop.modality === 'Inversión' && formatCurrency(prop.price)}
                  </td>

                  <td className="p-4">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-[#F8F7F4] text-[#1E3A2F] border border-[#E5E7EB] inline-block">
                      {prop.legalStatus}
                    </span>
                  </td>

                  <td className="p-4 text-right space-x-2">
                    <Link
                      href={`/propiedades/${prop.id}`}
                      className="p-2 text-stone-500 hover:text-stone-900 hover:bg-[#F8F7F4] rounded-lg inline-block transition-colors"
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
                    <button
                      onClick={() => handleDuplicate(prop)}
                      className="p-2 text-stone-500 hover:text-[#1E3A2F] hover:bg-[#F8F7F4] rounded-lg inline-block transition-colors"
                      title="Duplicar Registro"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(prop.id)}
                      className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg inline-block transition-colors"
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
