'use client';

import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Coins, 
  ShieldCheck, 
  FileText, 
  Image as ImageIcon, 
  AlertTriangle,
  Save
} from 'lucide-react';
import { Property, AssetType, Modality, LegalStatus, PotentialUse } from '../../types/property';

interface PropertyFormModalProps {
  propertyToEdit?: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveProperty: (property: Property) => void;
}

export const PropertyFormModal: React.FC<PropertyFormModalProps> = ({
  propertyToEdit,
  isOpen,
  onClose,
  onSaveProperty
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Property>>(
    propertyToEdit || {
      code: `DAR-NEW-${Math.floor(100 + Math.random() * 900)}`,
      title: '',
      shortDescription: '',
      description: '',
      opportunityAnalysis: '',
      assetType: 'Finca',
      modality: 'Venta',
      price: 1500000000,
      monthlyRent: 0,
      areaTotalHa: 10,
      areaTotalM2: 100000,
      builtAreaM2: 250,
      department: 'Antioquia',
      municipality: 'Apartadó',
      sectorVereda: 'Vereda Central',
      latitude: 7.8821,
      longitude: -76.6261,
      topography: 'Plana (90%)',
      accessRoads: 'Vía pavimentada en buen estado',
      waterSources: 'Nacimiento natural permanente',
      publicServices: ['Energía eléctrica', 'Agua de pozo'],
      currentUse: 'Explotación agropecuaria',
      potentialUses: ['Agropecuario', 'Inversión'],
      legalStatus: 'Saneado',
      matriculaInmobiliaria: '034-DEMO-001',
      cedulaCatastral: '0504500000010000',
      documentStatus: 'Escritura pública saneada',
      commercialConditions: 'Pago de contado o fiducia',
      isDemoData: true,
      images: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80'
      ],
      documentsAvailable: [{ name: 'Certificado de Tradición (Mock)', type: 'PDF', size: '1.2 MB' }],
      availability: 'Disponible',
      isFeatured: true,
      isInvestmentOpportunity: true,
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0]
    }
  );

  if (!isOpen) return null;

  const updateField = (field: keyof Property, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.code) {
      alert('Por favor completa los campos obligatorios.');
      return;
    }

    const finalProperty: Property = {
      ...formData,
      id: formData.id || `prop-${Date.now()}`,
      updatedDate: new Date().toISOString().split('T')[0]
    } as Property;

    onSaveProperty(finalProperty);
    onClose();
  };

  const stepsList = [
    '1. Info General',
    '2. Ubicación',
    '3. Precio & Modalidad',
    '4. Specs Físicas',
    '5. Info Jurídica',
    '6. Multimedia',
    '7. Documentos',
    '8. Publicación'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md p-4 sm:p-6 flex justify-center animate-in fade-in duration-200">
      <div className="bg-slate-900 text-slate-100 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-800 flex flex-col my-auto overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base sm:text-lg">
                {propertyToEdit ? 'Editar Propiedad' : 'Crear Nueva Propiedad'} ({formData.code})
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Paso {step} de 8 — {stepsList[step - 1]}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Warning Notice Bar */}
        <div className="bg-amber-950/70 border-b border-amber-800/40 px-5 py-2 text-xs text-amber-200 flex items-center gap-2 font-mono">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Los datos mostrados son demostrativos y deben ser reemplazados por información validada antes de cualquier uso comercial o jurídico.</span>
        </div>

        {/* Wizard Step Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950 overflow-x-auto text-xs font-mono">
          {stepsList.map((sLabel, idx) => (
            <button
              key={sLabel}
              onClick={() => setStep(idx + 1)}
              className={`px-4 py-3 shrink-0 transition-colors border-b-2 font-semibold ${
                step === idx + 1
                  ? 'border-emerald-500 text-emerald-400 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {sLabel}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto max-h-[65vh] space-y-5 text-xs">
          
          {/* STEP 1: General Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Código Interno *</label>
                  <input
                    type="text"
                    required
                    value={formData.code || ''}
                    onChange={(e) => updateField('code', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Tipo de Activo *</label>
                  <select
                    value={formData.assetType || 'Finca'}
                    onChange={(e) => updateField('assetType', e.target.value as AssetType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  >
                    <option value="Finca">Finca</option>
                    <option value="Terreno">Terreno / Lote</option>
                    <option value="Bodega">Bodega</option>
                    <option value="Edificio">Edificio</option>
                    <option value="Local">Local Comercial</option>
                    <option value="Casa">Casa Campestre</option>
                    <option value="Activo Especial">Activo Especial SAE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Nombre / Título Comercial *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Finca Ganadera El Edén de Urabá"
                  value={formData.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Resumen Corto *</label>
                <input
                  type="text"
                  placeholder="Resumen atractivo para la tarjeta del catálogo..."
                  value={formData.shortDescription || ''}
                  onChange={(e) => updateField('shortDescription', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Descripción Completa *</label>
                <textarea
                  rows={4}
                  value={formData.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Location */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Departamento</label>
                  <select
                    value={formData.department || 'Antioquia'}
                    onChange={(e) => updateField('department', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Antioquia">Antioquia</option>
                    <option value="Chocó">Chocó</option>
                    <option value="Córdoba">Córdoba</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Municipio</label>
                  <input
                    type="text"
                    value={formData.municipality || ''}
                    onChange={(e) => updateField('municipality', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Vereda / Sector</label>
                <input
                  type="text"
                  value={formData.sectorVereda || ''}
                  onChange={(e) => updateField('sectorVereda', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Latitud</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude || 7.8821}
                    onChange={(e) => updateField('latitude', parseFloat(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Longitud</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude || -76.6261}
                    onChange={(e) => updateField('longitude', parseFloat(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Pricing & Modality */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Modalidad Comercial</label>
                <select
                  value={formData.modality || 'Venta'}
                  onChange={(e) => updateField('modality', e.target.value as Modality)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                >
                  <option value="Venta">Venta</option>
                  <option value="Arriendo">Arriendo</option>
                  <option value="Custodia">Custodia SAE</option>
                  <option value="Inversión">Oportunidad de Inversión</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Precio Venta / Estimado (COP)</label>
                  <input
                    type="number"
                    value={formData.price || 0}
                    onChange={(e) => updateField('price', parseFloat(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Canon Mensual Arriendo (COP)</label>
                  <input
                    type="number"
                    value={formData.monthlyRent || 0}
                    onChange={(e) => updateField('monthlyRent', parseFloat(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-teal-300 font-mono font-bold text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Physical Specs */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Área Hectáreas</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.areaTotalHa || 0}
                    onChange={(e) => updateField('areaTotalHa', parseFloat(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Área m²</label>
                  <input
                    type="number"
                    value={formData.areaTotalM2 || 0}
                    onChange={(e) => updateField('areaTotalM2', parseInt(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Construidos m²</label>
                  <input
                    type="number"
                    value={formData.builtAreaM2 || 0}
                    onChange={(e) => updateField('builtAreaM2', parseInt(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Topografía</label>
                <input
                  type="text"
                  value={formData.topography || ''}
                  onChange={(e) => updateField('topography', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Vías de Acceso</label>
                <input
                  type="text"
                  value={formData.accessRoads || ''}
                  onChange={(e) => updateField('accessRoads', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Legal Information */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Estado Jurídico</label>
                <select
                  value={formData.legalStatus || 'Saneado'}
                  onChange={(e) => updateField('legalStatus', e.target.value as LegalStatus)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                >
                  <option value="Saneado">Saneado 100%</option>
                  <option value="En estudio jurídico">En estudio jurídico</option>
                  <option value="En proceso de saneamiento">En proceso de saneamiento</option>
                  <option value="Activo especial SAE">Activo Especial SAE</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Matrícula (Demostrativa)</label>
                  <input
                    type="text"
                    value={formData.matriculaInmobiliaria || ''}
                    onChange={(e) => updateField('matriculaInmobiliaria', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Cédula Catastral (Demostrativa)</label>
                  <input
                    type="text"
                    value={formData.cedulaCatastral || ''}
                    onChange={(e) => updateField('cedulaCatastral', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6 & 7 & 8: Media, Docs & Save */}
          {step >= 6 && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-slate-300">
                <p>Resumen de imágenes cargadas: {formData.images?.length || 0} fotografías HD.</p>
                <p className="text-emerald-400 font-mono text-[11px] mt-1">✓ Listo para publicar en portal web.</p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Anterior
              </button>
            ) : <div />}

            {step < 8 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md"
              >
                Siguiente <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg"
              >
                <Save className="w-4 h-4" /> Guardar Propiedad
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};
