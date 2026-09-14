'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  Lock,
  Layers,
  DollarSign,
  User,
  Phone,
  Sparkles,
  Compass,
  FileCheck
} from 'lucide-react';
import { submitPartnerPropertyAction } from '../../actions/partners';
import { formatCurrency } from '../../../lib/formatters';

const TROPICAL_PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1592417817098-8f3d6eb12765?auto=format&fit=crop&w=1200&q=80',
];

export default function PartnerNuevoActivoPage() {
  const router = useRouter();

  // Step state (1, 2, or 3)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  // Bloque 1: Ubicación & Vocación
  const [title, setTitle] = useState('');
  const [assetType, setAssetType] = useState('Finca');
  const [modality, setModality] = useState('Venta');
  const [department, setDepartment] = useState('Antioquia');
  const [municipality, setMunicipality] = useState('Turbo');
  const [vereda, setVereda] = useState('');
  const [address, setAddress] = useState('');
  const [landAreaHa, setLandAreaHa] = useState<string>('');
  const [landAreaM2, setLandAreaM2] = useState<string>('');
  const [potentialUse, setPotentialUse] = useState('Ganadería');

  // Bloque 2: Estructura de Negocio & Comisión
  const [commissionAgreement, setCommissionAgreement] = useState<'split_50_50' | 'net_price_group_commission' | 'fixed_fee'>('split_50_50');
  const [salePriceCop, setSalePriceCop] = useState<string>('');
  const [netPriceOwnerCop, setNetPriceOwnerCop] = useState<string>('');
  const [groupCommissionCop, setGroupCommissionCop] = useState<string>('');
  const [fixedFeeCop, setFixedFeeCop] = useState<string>('');

  // Bloque 3: Anexos, Linderos & Datos Confidenciales
  const [imageUrl, setImageUrl] = useState('');
  const [imagesList, setImagesList] = useState<string[]>([TROPICAL_PLACEHOLDERS[0]]);
  const [linderosNotes, setLinderosNotes] = useState('');
  const [titularName, setTitularName] = useState('');
  const [titularPhone, setTitularPhone] = useState('');
  const [titularCedula, setTitularCedula] = useState('');
  const [privateNotes, setPrivateNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAddImageUrl = () => {
    if (imageUrl.trim()) {
      setImagesList([...imagesList, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImagesList(imagesList.filter((_, i) => i !== index));
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !municipality.trim()) {
      setErrorMsg('Por favor ingresa el título de referencia y el municipio del activo.');
      return;
    }
    setErrorMsg(null);
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setStep(3);
  };

  const handleSubmitFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // Calculate final suggested price if net price scheme is selected
    let finalSalePrice = salePriceCop ? Number(salePriceCop) : undefined;
    if (commissionAgreement === 'net_price_group_commission' && netPriceOwnerCop) {
      const net = Number(netPriceOwnerCop) || 0;
      const comm = Number(groupCommissionCop) || 0;
      finalSalePrice = net + comm;
    }

    const contactNotesPayload = `
DATOS DEL PROPIETARIO / CONTACTO DE LA LLAVE:
Nombre del Titular: ${titularName || 'No especificado'}
Teléfono Directo: ${titularPhone || 'No especificado'}
Cédula / NIT: ${titularCedula || 'No especificado'}

OBSERVACIONES CONFIDENCIALES DE RADICACIÓN:
${privateNotes || 'Sin notas adicionales'}
    `.trim();

    try {
      const res = await submitPartnerPropertyAction({
        title,
        assetType,
        modality,
        department,
        municipality,
        vereda,
        address,
        landAreaHa: landAreaHa ? Number(landAreaHa) : undefined,
        landAreaM2: landAreaM2 ? Number(landAreaM2) : undefined,
        potentialUse,
        salePriceCop: finalSalePrice,
        commissionAgreement,
        netPriceOwnerCop: netPriceOwnerCop ? Number(netPriceOwnerCop) : undefined,
        groupCommissionCop: groupCommissionCop ? Number(groupCommissionCop) : undefined,
        fixedFeeCop: fixedFeeCop ? Number(fixedFeeCop) : undefined,
        linderosNotes,
        images: imagesList.length > 0 ? imagesList : [TROPICAL_PLACEHOLDERS[0]],
        contactNotes: contactNotesPayload,
      });

      if (!res.success) {
        setErrorMsg(res.message || 'No se pudo radicar la captación.');
        setLoading(false);
        return;
      }

      router.push('/socios/dashboard');
      router.refresh();
    } catch (err: unknown) {
      console.error('Error submitting property:', err);
      setErrorMsg('Ocurrió un error inesperado al radicar el predio.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] font-sans text-[#1C1917] pb-16">
      
      {/* Header */}
      <header className="bg-[#1E3A2F] text-white py-6 border-b border-emerald-900/40">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link
            href="/socios/dashboard"
            className="inline-flex items-center gap-2 text-stone-300 hover:text-white text-xs font-bold font-mono transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Dashboard</span>
          </Link>

          <div className="text-right">
            <span className="text-[11px] font-mono text-emerald-300 font-bold uppercase block">
              Radicación Predial & Captación
            </span>
            <span className="text-xs text-stone-300">Bloque {step} de 3</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 mt-8 space-y-6">
        
        {/* Step Indicator */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-white border border-[#E5E1D8] rounded-2xl shadow-xs">
          <div className={`py-2 px-3 rounded-xl text-center font-mono text-xs font-bold transition-all ${
            step === 1 ? 'bg-[#1E3A2F] text-white' : step > 1 ? 'bg-emerald-100 text-emerald-900' : 'text-stone-400'
          }`}>
            1. Ubicación & Vocación
          </div>
          <div className={`py-2 px-3 rounded-xl text-center font-mono text-xs font-bold transition-all ${
            step === 2 ? 'bg-[#1E3A2F] text-white' : step > 2 ? 'bg-emerald-100 text-emerald-900' : 'text-stone-400'
          }`}>
            2. Negocio & Comisión
          </div>
          <div className={`py-2 px-3 rounded-xl text-center font-mono text-xs font-bold transition-all ${
            step === 3 ? 'bg-[#1E3A2F] text-white' : 'text-stone-400'
          }`}>
            3. Anexos & Confidencial
          </div>
        </div>

        {/* Commercial Trust Notice */}
        <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-start gap-3 text-xs text-emerald-900">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-mono font-bold uppercase block">Protección Comercial Darién S.A.S.</span>
            <p className="text-emerald-800 leading-snug mt-0.5">
              Tus predios radicados quedan protegidos bajo el esquema contractual acordado. Los datos del propietario / titular permanecen protegidos y visibles únicamente por la administración.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center gap-2 font-mono">
            <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* BLOQUE 1: Ubicación & Vocación */}
        {step === 1 && (
          <form onSubmit={handleNextStep1} className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[#E5E1D8] pb-4">
              <h2 className="font-serif text-xl font-bold text-[#1C1917]">
                Bloque 1: Ubicación y Vocación Territorial
              </h2>
              <p className="text-xs text-stone-500 font-mono mt-0.5">
                Identificación de la propiedad, extensión y municipio base
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                  Título de Referencia del Predio *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Finca Ganadera El Recreo - Vereda Puerto Rey"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-4 py-3 text-stone-900 font-medium focus:outline-none focus:border-[#1E3A2F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                    Tipo de Activo *
                  </label>
                  <select
                    value={assetType}
                    onChange={(e) => setAssetType(e.target.value)}
                    className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-stone-900 font-medium focus:outline-none focus:border-[#1E3A2F]"
                  >
                    <option value="Finca">Finca / Predio Rural</option>
                    <option value="Lote">Lote / Terreno</option>
                    <option value="Terreno">Terreno Agrícola</option>
                    <option value="Casa">Casa Campestre / Residencia</option>
                    <option value="Bodega">Bodega / Galpón Industrial</option>
                    <option value="Local">Local Comercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                    Modalidad *
                  </label>
                  <select
                    value={modality}
                    onChange={(e) => setModality(e.target.value)}
                    className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-stone-900 font-medium focus:outline-none focus:border-[#1E3A2F]"
                  >
                    <option value="Venta">Venta</option>
                    <option value="Arriendo">Arriendo</option>
                    <option value="Inversión">Oportunidad de Inversión / Cesión</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                    Departamento *
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-stone-900 font-medium focus:outline-none focus:border-[#1E3A2F]"
                  >
                    <option value="La Guajira">La Guajira</option>
                    <option value="Antioquia">Antioquia</option>
                    <option value="Córdoba">Córdoba</option>
                    <option value="Chocó">Chocó</option>
                    <option value="Sucre">Sucre</option>
                    <option value="Bolívar">Bolívar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                    Municipio *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Riohacha, Dibulla, Maicao, San Juan del Cesar, Turbo"
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                    className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-stone-900 font-medium focus:outline-none focus:border-[#1E3A2F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                    Vereda / Sector
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Vereda Puerto Rey / Corregimiento El Tres"
                    value={vereda}
                    onChange={(e) => setVereda(e.target.value)}
                    className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-stone-900 font-medium focus:outline-none focus:border-[#1E3A2F]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                    Dirección / Referencia Vial
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Troncal Ruta 74, Km 12"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-stone-900 font-medium focus:outline-none focus:border-[#1E3A2F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                    Hectáreas (Ha)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Ej. 18.5"
                    value={landAreaHa}
                    onChange={(e) => {
                      setLandAreaHa(e.target.value);
                      if (e.target.value) setLandAreaM2(String(Number(e.target.value) * 10000));
                    }}
                    className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-stone-900 font-mono font-medium focus:outline-none focus:border-[#1E3A2F]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                    Metros² (m²)
                  </label>
                  <input
                    type="number"
                    placeholder="Ej. 185000"
                    value={landAreaM2}
                    onChange={(e) => {
                      setLandAreaM2(e.target.value);
                      if (e.target.value) setLandAreaHa(String(Number(e.target.value) / 10000));
                    }}
                    className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-stone-900 font-mono font-medium focus:outline-none focus:border-[#1E3A2F]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                    Vocación Principal
                  </label>
                  <select
                    value={potentialUse}
                    onChange={(e) => setPotentialUse(e.target.value)}
                    className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-stone-900 font-medium focus:outline-none focus:border-[#1E3A2F]"
                  >
                    <option value="Ganadería">Ganadería (Ceba/Leche)</option>
                    <option value="Agroforestal">Agroforestal (Teca/Balsa)</option>
                    <option value="Cacao / Palma">Cacao / Palma / Plátano</option>
                    <option value="Comercial">Comercial / EDS / Puerto</option>
                    <option value="Residencial">Vivienda Campestre</option>
                    <option value="Conservación / Ecoturismo">Conservación / Ecoturismo</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#1E3A2F] hover:bg-[#152921] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <span>Continuar a Estructura de Negocio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* BLOQUE 2: Estructura de Negocio & Comisión */}
        {step === 2 && (
          <form onSubmit={handleNextStep2} className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[#E5E1D8] pb-4">
              <h2 className="font-serif text-xl font-bold text-[#1C1917]">
                Bloque 2: Estructura de Negocio y Comisión
              </h2>
              <p className="text-xs text-stone-500 font-mono mt-0.5">
                Define el esquema comercial adaptado al propietario o grupo de aliados
              </p>
            </div>

            <div className="space-y-5 text-xs">
              
              {/* Scheme selector */}
              <div>
                <label className="block text-stone-700 font-mono font-bold mb-2 uppercase">
                  Esquema Comercial Seleccionado *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  <button
                    type="button"
                    onClick={() => setCommissionAgreement('split_50_50')}
                    className={`p-4 rounded-2xl border text-left transition-all space-y-1 ${
                      commissionAgreement === 'split_50_50'
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/30'
                        : 'border-[#E5E1D8] bg-[#F8F7F4] hover:bg-stone-50'
                    }`}
                  >
                    <span className="font-bold text-stone-900 block">Comisión Compartida 50/50</span>
                    <span className="text-[11px] text-stone-600 block leading-tight">
                      Punta de captación estándar (50% Darién / 50% Corredor o Grupo)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCommissionAgreement('net_price_group_commission')}
                    className={`p-4 rounded-2xl border text-left transition-all space-y-1 ${
                      commissionAgreement === 'net_price_group_commission'
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/30'
                        : 'border-[#E5E1D8] bg-[#F8F7F4] hover:bg-stone-50'
                    }`}
                  >
                    <span className="font-bold text-stone-900 block">Precio Neto + Comisión Grupo</span>
                    <span className="text-[11px] text-stone-600 block leading-tight">
                      Valor neto al dueño + honorarios fijados por la cadena de aliados
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCommissionAgreement('fixed_fee')}
                    className={`p-4 rounded-2xl border text-left transition-all space-y-1 ${
                      commissionAgreement === 'fixed_fee'
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/30'
                        : 'border-[#E5E1D8] bg-[#F8F7F4] hover:bg-stone-50'
                    }`}
                  >
                    <span className="font-bold text-stone-900 block">Fee Fijo / Plataforma</span>
                    <span className="text-[11px] text-stone-600 block leading-tight">
                      Tarifa plana fija por estructuración y vinculación de inversionista
                    </span>
                  </button>

                </div>
              </div>

              {/* Dynamic Inputs based on selected scheme */}
              {commissionAgreement === 'split_50_50' && (
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                  <span className="font-mono font-bold text-stone-800 uppercase block text-[11px]">
                    Esquema Estándar 50/50
                  </span>
                  <div>
                    <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                      Precio de Venta Sugerido (COP)
                    </label>
                    <input
                      type="number"
                      placeholder="Ej. 650000000"
                      value={salePriceCop}
                      onChange={(e) => setSalePriceCop(e.target.value)}
                      className="w-full bg-white border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-stone-900 font-mono font-bold text-emerald-900 focus:outline-none focus:border-[#1E3A2F]"
                    />
                  </div>
                </div>
              )}

              {commissionAgreement === 'net_price_group_commission' && (
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-4">
                  <span className="font-mono font-bold text-stone-800 uppercase block text-[11px]">
                    Esquema Precio Neto Propietario + Comisión de Grupo
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                        Valor Neto Solicitado al Dueño (COP) *
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="Ej. 500000000"
                        value={netPriceOwnerCop}
                        onChange={(e) => setNetPriceOwnerCop(e.target.value)}
                        className="w-full bg-white border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-stone-900 font-mono font-bold focus:outline-none focus:border-[#1E3A2F]"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                        Comisión Total Requerida por Grupo (COP) *
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="Ej. 30000000"
                        value={groupCommissionCop}
                        onChange={(e) => setGroupCommissionCop(e.target.value)}
                        className="w-full bg-white border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-stone-900 font-mono font-bold focus:outline-none focus:border-[#1E3A2F]"
                      />
                    </div>
                  </div>

                  {netPriceOwnerCop && (
                    <div className="p-3 bg-emerald-100/70 border border-emerald-200 rounded-xl text-xs font-mono text-emerald-900 flex justify-between items-center">
                      <span>Precio Total de Lista Publicado:</span>
                      <span className="font-bold text-sm">
                        {formatCurrency((Number(netPriceOwnerCop) || 0) + (Number(groupCommissionCop) || 0))}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {commissionAgreement === 'fixed_fee' && (
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-4">
                  <span className="font-mono font-bold text-stone-800 uppercase block text-[11px]">
                    Esquema Fee Fijo de Cierre / Plataforma
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                        Precio de Venta Sugerido (COP)
                      </label>
                      <input
                        type="number"
                        placeholder="Ej. 800000000"
                        value={salePriceCop}
                        onChange={(e) => setSalePriceCop(e.target.value)}
                        className="w-full bg-white border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-stone-900 font-mono font-bold text-emerald-900 focus:outline-none focus:border-[#1E3A2F]"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                        Fee Fijo Acordado (COP) *
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="Ej. 15000000"
                        value={fixedFeeCop}
                        onChange={(e) => setFixedFeeCop(e.target.value)}
                        className="w-full bg-white border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-stone-900 font-mono font-bold focus:outline-none focus:border-[#1E3A2F]"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </button>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#1E3A2F] hover:bg-[#152921] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <span>Continuar a Anexos & Confidencial</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* BLOQUE 3: Anexos, Linderos & Contacto Privado */}
        {step === 3 && (
          <form onSubmit={handleSubmitFinal} className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[#E5E1D8] pb-4">
              <h2 className="font-serif text-xl font-bold text-[#1C1917]">
                Bloque 3: Anexos, Linderos y Contacto de la Llave
              </h2>
              <p className="text-xs text-stone-500 font-mono mt-0.5">
                Fotos de entorno tropical, descripción de linderos e información confidencial
              </p>
            </div>

            <div className="space-y-6 text-xs">
              
              {/* Fotos Section */}
              <div className="space-y-3">
                <label className="block text-stone-700 font-mono font-bold uppercase">
                  Fotografía del Predio (Entorno Tropical / Agropecuario)
                </label>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://imagenes.ejemplo.com/finca1.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-stone-900 font-mono focus:outline-none focus:border-[#1E3A2F]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-3 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-bold shrink-0 transition-colors"
                  >
                    Agregar URL
                  </button>
                </div>

                {imagesList.length > 0 && (
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                    <span className="text-[11px] font-mono font-bold text-stone-600 block">
                      {imagesList.length} imagen(es) en galería:
                    </span>
                    <ul className="space-y-1">
                      {imagesList.map((url, i) => (
                        <li key={i} className="flex items-center justify-between text-[11px] font-mono text-stone-700 bg-white p-2 border border-stone-200 rounded-lg">
                          <span className="truncate max-w-xs">{url}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(i)}
                            className="text-rose-600 font-bold hover:underline ml-2"
                          >
                            Eliminar
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Linderos & Topografía */}
              <div>
                <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                  Notas de Linderos, Vías & Topografía (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej. Limita por el norte con caño natural, por el sur con la vía principal. Topografía 100% plana mecanizable."
                  value={linderosNotes}
                  onChange={(e) => setLinderosNotes(e.target.value)}
                  className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl p-3 text-stone-900 font-medium focus:outline-none focus:border-[#1E3A2F]"
                />
              </div>

              {/* Private Titular / Key Contact Information Box */}
              <div className="p-5 bg-stone-900 text-white rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase">
                  <Lock className="w-4 h-4" />
                  <span>Datos del Propietario / Contacto de la Llave (Privado para Administración)</span>
                </div>
                <p className="text-stone-300 text-[11px]">
                  Información visible únicamente para el departamento de moderación técnica y el creador de la captación.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-400 font-mono font-bold mb-1 uppercase text-[10px]">
                      Nombre del Titular / Dueño
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Pedro José Gómez"
                      value={titularName}
                      onChange={(e) => setTitularName(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 font-mono font-bold mb-1 uppercase text-[10px]">
                      Teléfono Directo del Titular
                    </label>
                    <input
                      type="tel"
                      placeholder="Ej. +57 311 987 6543"
                      value={titularPhone}
                      onChange={(e) => setTitularPhone(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-400 font-mono font-bold mb-1 uppercase text-[10px]">
                    Cédula / NIT del Titular (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. 15.345.678 de Turbo"
                    value={titularCedula}
                    onChange={(e) => setTitularCedula(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 font-mono font-bold mb-1 uppercase text-[10px]">
                    Observaciones Confidenciales / Estado Documental
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ej. Tiene escritura pública al día. Disposición a recibir permuta parcial en la zona urbana."
                    value={privateNotes}
                    onChange={(e) => setPrivateNotes(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl p-3 text-white font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>Radicando predio...</span>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4" />
                    <span>Radicar Predio para Moderación</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </main>

    </div>
  );
}
