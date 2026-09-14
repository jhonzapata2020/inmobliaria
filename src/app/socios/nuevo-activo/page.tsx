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
  Sparkles
} from 'lucide-react';
import { submitPartnerPropertyAction } from '../../actions/partners';

export default function PartnerNuevoActivoPage() {
  const router = useRouter();

  // Step state (1, 2, or 3)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  // Step 1: Ubicación & Tipo
  const [title, setTitle] = useState('');
  const [assetType, setAssetType] = useState('Finca');
  const [modality, setModality] = useState('Venta');
  const [department, setDepartment] = useState('Antioquia');
  const [municipality, setMunicipality] = useState('Turbo');
  const [vereda, setVereda] = useState('');
  const [address, setAddress] = useState('');

  // Step 2: Extensión & Valoración
  const [landAreaHa, setLandAreaHa] = useState<string>('');
  const [landAreaM2, setLandAreaM2] = useState<string>('');
  const [potentialUse, setPotentialUse] = useState('Ganadería');
  const [salePriceCop, setSalePriceCop] = useState<string>('');
  const [commissionAgreement, setCommissionAgreement] = useState('split_50_50');

  // Step 3: Fotos & Notas del Titular
  const [imageUrl, setImageUrl] = useState('');
  const [imagesList, setImagesList] = useState<string[]>([]);
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
      setErrorMsg('Por favor ingresa un título descriptivo y el municipio del activo.');
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

    const contactNotesPayload = `
TITULAR DE LA PROPIEDAD:
Nombre: ${titularName || 'No especificado'}
Teléfono / Contacto: ${titularPhone || 'No especificado'}
Cédula / NIT: ${titularCedula || 'No especificado'}

OBSERVACIONES CONFIDENCIALES DEL SOCIO:
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
        salePriceCop: salePriceCop ? Number(salePriceCop) : undefined,
        commissionAgreement,
        images: imagesList,
        contactNotes: contactNotesPayload,
      });

      if (!res.success) {
        setErrorMsg(res.message || 'No se pudo enviar la captación.');
        setLoading(false);
        return;
      }

      router.push('/socios/dashboard');
      router.refresh();
    } catch (err: unknown) {
      console.error('Error submitting property:', err);
      setErrorMsg('Ocurrió un error inesperado al registrar la propiedad.');
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
            <span>Volver a Mi Dashboard</span>
          </Link>

          <div className="text-right">
            <span className="text-[11px] font-mono text-emerald-300 font-bold uppercase block">
              Formulario de Captación
            </span>
            <span className="text-xs text-stone-300">Paso {step} de 3</span>
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
            1. Ubicación
          </div>
          <div className={`py-2 px-3 rounded-xl text-center font-mono text-xs font-bold transition-all ${
            step === 2 ? 'bg-[#1E3A2F] text-white' : step > 2 ? 'bg-emerald-100 text-emerald-900' : 'text-stone-400'
          }`}>
            2. Extensión & Precio
          </div>
          <div className={`py-2 px-3 rounded-xl text-center font-mono text-xs font-bold transition-all ${
            step === 3 ? 'bg-[#1E3A2F] text-white' : 'text-stone-400'
          }`}>
            3. Titular & Fotos
          </div>
        </div>

        {/* Commercial Trust Notice */}
        <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-start gap-3 text-xs text-emerald-900">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-mono font-bold uppercase block">Garantía Comercial Darién S.A.S.</span>
            <p className="text-emerald-800 leading-snug mt-0.5">
              Tus captaciones están protegidas bajo el acuerdo de corretaje compartido 50/50 de Activos & Inversiones Darién S.A.S. La información privada del titular es confidencial y segura.
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

        {/* STEP 1: Ubicación & Identificación */}
        {step === 1 && (
          <form onSubmit={handleNextStep1} className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[#E5E1D8] pb-4">
              <h2 className="font-serif text-xl font-bold text-[#1C1917]">
                Paso 1: Identificación y Ubicación del Activo
              </h2>
              <p className="text-xs text-stone-500 font-mono mt-0.5">
                Ingresa el nombre de referencia y la ubicación exacta dentro del territorio
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                  Título Descriptivo / Nombre del Predio *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Finca Ganadera & Agrícola San José - Sector Río Grande"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-4 py-3 text-stone-900 font-medium focus:outline-none focus:border-[#1E3A2F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                    Tipo de Inmueble *
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
                    <option value="Activo Especial">Activo Especial / Proyecto</option>
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
                    placeholder="Ej. Turbo, Necoclí, Apartadó, Los Córdobas"
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                    className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-stone-900 font-medium focus:outline-none focus:border-[#1E3A2F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                    Vereda / Sector (Opcional)
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
                    placeholder="Ej. Troncal Ruta 74, Km 15"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-stone-900 font-medium focus:outline-none focus:border-[#1E3A2F]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#1E3A2F] hover:bg-[#152921] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <span>Continuar a Extensión & Precio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Extensión & Valoración Sugerida */}
        {step === 2 && (
          <form onSubmit={handleNextStep2} className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[#E5E1D8] pb-4">
              <h2 className="font-serif text-xl font-bold text-[#1C1917]">
                Paso 2: Extensión, Vocación & Precio Sugerido
              </h2>
              <p className="text-xs text-stone-500 font-mono mt-0.5">
                Especifica las áreas de tierra, aptitud del suelo y pretensión económica
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                    Extensión en Hectáreas (Ha)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Ej. 25.5"
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
                    Extensión en Metros Cuadrados (m²)
                  </label>
                  <input
                    type="number"
                    placeholder="Ej. 255000"
                    value={landAreaM2}
                    onChange={(e) => {
                      setLandAreaM2(e.target.value);
                      if (e.target.value) setLandAreaHa(String(Number(e.target.value) / 10000));
                    }}
                    className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-stone-900 font-mono font-medium focus:outline-none focus:border-[#1E3A2F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                    Vocación / Uso Principal Sugerido
                  </label>
                  <select
                    value={potentialUse}
                    onChange={(e) => setPotentialUse(e.target.value)}
                    className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-stone-900 font-medium focus:outline-none focus:border-[#1E3A2F]"
                  >
                    <option value="Ganadería">Ganadería (Ceba / Leche)</option>
                    <option value="Agroforestal">Agroforestal (Teca / Balsa)</option>
                    <option value="Cacao / Palma">Cacao / Palma / Frutales</option>
                    <option value="Comercial">Comercial / EDS / Logístico</option>
                    <option value="Residencial">Residencial / Vivienda Campestre</option>
                    <option value="Conservación / Ecoturismo">Conservación / Ecoturismo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                    Precio de Venta Sugerido (COP)
                  </label>
                  <input
                    type="number"
                    placeholder="Ej. 450000000"
                    value={salePriceCop}
                    onChange={(e) => setSalePriceCop(e.target.value)}
                    className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-stone-900 font-mono font-bold text-emerald-900 focus:outline-none focus:border-[#1E3A2F]"
                  />
                  <span className="text-[10px] text-stone-400 font-mono block mt-1">
                    * Si es indeterminado o por avaluar, déjalo en blanco (se asignará &quot;A convenir&quot;)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-mono font-bold mb-1 uppercase">
                  Esquema de Acuerdo Comercial / Comisión
                </label>
                <select
                  value={commissionAgreement}
                  onChange={(e) => setCommissionAgreement(e.target.value)}
                  className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-stone-900 font-medium focus:outline-none focus:border-[#1E3A2F]"
                >
                  <option value="split_50_50">Acuerdo de Corretaje Compartido 50/50 (Corredor Aliado)</option>
                  <option value="direct_owner">Propietario Directo (Sin intermediario)</option>
                  <option value="custom">Condición comercial especial / Exclusividad</option>
                </select>
              </div>
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
                <span>Continuar a Fotos & Titular</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Fotos & Datos Privados del Titular */}
        {step === 3 && (
          <form onSubmit={handleSubmitFinal} className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[#E5E1D8] pb-4">
              <h2 className="font-serif text-xl font-bold text-[#1C1917]">
                Paso 3: Evidencia Fotográfica & Contacto del Titular
              </h2>
              <p className="text-xs text-stone-500 font-mono mt-0.5">
                Ingresa URLs de imágenes de la propiedad y los datos directos del propietario
              </p>
            </div>

            <div className="space-y-6 text-xs">
              
              {/* Fotos Section */}
              <div className="space-y-3">
                <label className="block text-stone-700 font-mono font-bold uppercase">
                  Fotografía de Referencia (URL de Imagen)
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
                      {imagesList.length} imagen(es) agregada(s):
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

              {/* Private Titular Information Box */}
              <div className="p-5 bg-stone-900 text-white rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase">
                  <Lock className="w-4 h-4" />
                  <span>Datos Privados del Titular / Propietario (Confidencial)</span>
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
                    rows={3}
                    placeholder="Ej. Tiene escritura pública al día, sin gravámenes. El dueño está dispuesto a recibir permutables hasta un 30%."
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
                  <span>Enviando captación...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Enviar para Moderación</span>
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
