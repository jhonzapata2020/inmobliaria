'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Edit, 
  Copy, 
  Trash2, 
  Eye, 
  Building
} from 'lucide-react';
import { Property } from '../../../types/property';
import { formatCurrency, formatArea } from '../../../lib/formatters';
import { PropertyFormModal } from '../../../components/admin/PropertyFormModal';
import { getAllPropertiesAdmin, upsertPropertyAction, deletePropertyAction } from '../../actions/properties';

export default function AdminPropiedadesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [assetTypeFilter, setAssetTypeFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formInstance, setFormInstance] = useState(0);

  const loadAdminProperties = async () => {
    setLoading(true);
    try {
      const data = await getAllPropertiesAdmin();
      setProperties(data);
    } catch (err) {
      console.error('Failed to load admin properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminProperties();
  }, []);

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

  const handleDuplicate = async (prop: Property) => {
    const duplicated: Partial<Property> = {
      ...prop,
      id: undefined,
      code: `${prop.code}-COPY`,
      slug: `${prop.slug}-copy-${Date.now().toString().slice(-4)}`,
      title: `${prop.title} (Copia)`,
      createdDate: new Date().toISOString().split('T')[0]
    };
    const res = await upsertPropertyAction(duplicated);
    if (res.success) {
      await loadAdminProperties();
    } else {
      alert(`Error al duplicar el predio: ${res.error}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este registro del inventario oficial?')) {
      const res = await deletePropertyAction(id);
      if (res.success) {
        await loadAdminProperties();
      } else {
        alert(`Error al eliminar: ${res.error}`);
      }
    }
  };

  const handleSaveProperty = async (savedProp: Property) => {
    const res = await upsertPropertyAction(savedProp);
    if (res.success) {
      await loadAdminProperties();
      setModalOpen(false);
    } else {
      alert(`Error al guardar en Supabase: ${res.error}`);
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
      
      {/* Header Corporativo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E5E7EB] pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Gestión de Inventario & Portafolio de Predios
          </h1>
          <p className="text-xs text-stone-500 font-mono mt-1">
            {properties.length} activos registrados en Supabase PostgreSQL.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4.5 py-2.5 bg-[#1E3A2F] hover:bg-[#152921] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-emerald-300" /> Registrar Nuevo Predio
        </button>
      </div>

      {/* Control Bar & Search */}
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
            <option value="Lote">Terrenos / Lotes</option>
            <option value="Bodega">Bodegas</option>
            <option value="Edificio">Edificios</option>
            <option value="Local">Locales</option>
            <option value="Casa">Casas</option>
            <option value="Activo Especial">Activo Especial SAE</option>
          </select>
        </div>
      </div>

      {/* Loading & Properties Table */}
      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-stone-500 bg-white rounded-2xl border border-[#E5E7EB]">
          Cargando inventario persistente desde Supabase...
        </div>
      ) : (
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
                      <div className="text-[11px] text-stone-500 font-mono">{prop.matriculaInmobiliaria || prop.folioMatricula}</div>
                    </td>

                    <td className="p-4 font-sans">
                      <h4 className="font-bold text-stone-900 text-sm">{prop.title}</h4>
                      <span className="text-[11px] text-stone-500 font-mono">{prop.assetType} • {prop.modality}</span>
                    </td>

                    <td className="p-4 text-stone-700 font-sans">
                      <span className="font-semibold">{prop.municipality}</span>, {prop.department}
                    </td>

                    <td className="p-4 text-stone-900 font-bold">
                      {formatArea(prop.landAreaHa, prop.landAreaM2)}
                    </td>

                    <td className="p-4 font-bold text-[#1E3A2F]">
                      {prop.modality === 'Venta' && formatCurrency(prop.salePriceCop)}
                      {prop.modality === 'Arriendo' && `${formatCurrency(prop.monthlyRentCop)}/mes`}
                      {prop.modality === 'Custodia SAE' && 'Regulada SAE'}
                      {prop.modality === 'Inversión' && formatCurrency(prop.salePriceCop || prop.estimatedValueCop)}
                    </td>

                    <td className="p-4">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-[#F8F7F4] text-[#1E3A2F] border border-[#E5E7EB] inline-block">
                        {prop.legalStatus}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/propiedades/${prop.slug || prop.id}`}
                        className="p-2 text-stone-500 hover:text-stone-900 hover:bg-[#F8F7F4] rounded-lg inline-block transition-colors"
                        title="Ver Ficha 360°"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleEdit(prop)}
                        className="p-2 text-[#1E3A2F] hover:bg-[#1E3A2F]/10 rounded-lg inline-block font-bold transition-colors cursor-pointer"
                        title="Editar Registro"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(prop)}
                        className="p-2 text-stone-500 hover:text-[#1E3A2F] hover:bg-[#F8F7F4] rounded-lg inline-block transition-colors cursor-pointer"
                        title="Duplicar Registro"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prop.id)}
                        className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg inline-block transition-colors cursor-pointer"
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
      )}

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
