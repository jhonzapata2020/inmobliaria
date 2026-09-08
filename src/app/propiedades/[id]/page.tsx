'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Ruler, 
  ShieldCheck, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  ArrowLeft,
  Share2,
  Check
} from 'lucide-react';
import { INITIAL_PROPERTIES } from '../../../data/mockProperties';
import { formatCurrency, formatArea, getLegalStatusBadge, getModalityBadge } from '../../../lib/formatters';
import { useDossier } from '../../../context/DossierContext';
import { useFavorites } from '../../../context/FavoritesContext';
import { useCompare } from '../../../context/CompareContext';
import { PropertyMap } from '../../../components/map/PropertyMap';
import { PropertyCard } from '../../../components/catalog/PropertyCard';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params?.id as string;

  const property = INITIAL_PROPERTIES.find(
    (p) => p.id === propertyId || p.code === propertyId || p.slug === propertyId || p.saeIdActivo === propertyId
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  // Form states
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');

  const { addToDossier, isInDossier, removeFromDossier } = useDossier();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCompare, isInCompare } = useCompare();

  if (!property) {
    return (
      <div className="min-h-screen bg-[#F8F7F2]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-5">
          <p className="text-xs font-mono uppercase tracking-wider text-[#C9795B]">Activo no encontrado</p>
          <h1 className="font-serif text-3xl font-bold text-[#242321]">Esta propiedad ya no está disponible</h1>
          <p className="text-sm text-[#6B6A63]">El enlace puede estar desactualizado. Regresa al catálogo para consultar las oportunidades activas.</p>
          <Link href="/propiedades" className="inline-flex items-center rounded-xl bg-[#1E3A2F] px-5 py-3 text-sm font-semibold text-white hover:bg-[#152921]">
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  const inDossier = isInDossier(property.id);
  const favorite = isFavorite(property.id);
  const inCompare = isInCompare(property.id);

  const legalBadge = getLegalStatusBadge(property.legalStatus);
  const modalityBadge = getModalityBadge(property.modality);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.shortDescription,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace de la propiedad copiado al portapapeles!');
    }
  };

  const similarProperties = INITIAL_PROPERTIES.filter(
    (p) => p.id !== property.id && (p.assetType === property.assetType || p.municipality === property.municipality)
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F8F7F2] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Top Breadcrumb Navigation */}
        <div className="flex justify-between items-center text-xs font-mono text-[#6B6A63]">
          <div className="flex items-center gap-2">
            <Link href="/propiedades" className="hover:text-[#1E3A2F] flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Volver al catálogo
            </Link>
            <span>/</span>
            <span className="text-[#1E3A2F] font-bold">{property.code}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white border border-[#E5E1D8] hover:bg-[#F1EFE8] text-[#242321] flex items-center gap-1.5 shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Compartir</span>
            </button>
          </div>
        </div>

        {/* Main Title & Action Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-[#E5E1D8] pb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 items-center text-xs">
              <span className={`font-bold px-3 py-1 rounded-lg ${modalityBadge.bgClass} ${modalityBadge.textClass}`}>
                {modalityBadge.label}
              </span>
              <span className={`font-semibold px-2.5 py-1 rounded-lg border ${legalBadge.bgClass} ${legalBadge.textClass} ${legalBadge.borderClass}`}>
                {legalBadge.label}
              </span>
              <span className="font-mono bg-white text-[#242321] px-2.5 py-1 rounded-lg border border-[#E5E1D8]">
                Código: {property.code}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#242321]">
              {property.title}
            </h1>
            <p className="text-sm text-[#6B6A63] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#0F766E]" />
              {property.sectorVereda ? `${property.sectorVereda}, ` : ''}{property.municipality}, {property.department}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Price Tag */}
            <div className="bg-white border border-[#E5E1D8] p-4 rounded-2xl text-left font-mono shadow-sm">
              <div className="text-xs text-[#6B6A63]">Valor / Canon Comercial</div>
              <div className="text-2xl font-bold text-[#1E3A2F] font-serif">
                {property.modality === 'Venta' && formatCurrency(property.price)}
                {property.modality === 'Arriendo' && `${formatCurrency(property.monthlyRent)}/mes`}
                {property.modality === 'Custodia' && 'Regulada SAE'}
                {property.modality === 'Inversión' && formatCurrency(property.price || property.estimatedValue)}
              </div>
            </div>

            {/* Dossier Toggle CTA */}
            <button
              onClick={() => (inDossier ? removeFromDossier(property.id) : addToDossier(property))}
              className={`px-6 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-md transition-all ${
                inDossier
                  ? 'bg-[#23866D] text-white'
                  : 'bg-[#1E3A2F] hover:bg-[#152921] text-white'
              }`}
            >
              {inDossier ? <Check className="w-5 h-5 stroke-[3]" /> : <FileSpreadsheet className="w-5 h-5" />}
              <span>{inDossier ? 'En Dossier' : 'Agregar al Dossier'}</span>
            </button>
          </div>
        </div>

        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            className="md:col-span-2 h-[420px] rounded-2xl overflow-hidden bg-[#F1EFE8] border border-[#E5E1D8] relative group cursor-pointer shadow-sm"
            onClick={() => setShowGalleryModal(true)}
          >
            <img 
              src={property.images[activeImageIndex] || property.images[0]} 
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-mono text-[#242321] border border-[#E5E1D8] shadow-sm">
              Hacer clic para ampliar ({activeImageIndex + 1} de {property.images.length})
            </div>
          </div>

          <div className="space-y-4 flex flex-col justify-between">
            {property.images.slice(0, 2).map((imgUrl, i) => (
              <div 
                key={i}
                className={`h-[200px] rounded-2xl overflow-hidden bg-[#F1EFE8] cursor-pointer border-2 transition-all shadow-sm ${
                  activeImageIndex === i ? 'border-[#1E3A2F]' : 'border-transparent opacity-80 hover:opacity-100'
                }`}
                onClick={() => setActiveImageIndex(i)}
              >
                <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-6 rounded-2xl border border-[#E5E1D8] font-mono text-xs shadow-sm">
          <div>
            <span className="text-[#6B6A63] block">Área Total:</span>
            <span className="text-base font-bold text-[#242321]">{formatArea(property.areaTotalHa, property.areaTotalM2)}</span>
          </div>
          <div>
            <span className="text-[#6B6A63] block">Área Construida:</span>
            <span className="text-base font-bold text-[#0F766E]">{property.builtAreaM2 ? `${property.builtAreaM2} m²` : 'Sin construir'}</span>
          </div>
          <div>
            <span className="text-[#6B6A63] block">Topografía:</span>
            <span className="text-base font-bold text-[#242321]">{property.topography}</span>
          </div>
          <div>
            <span className="text-[#6B6A63] block">Estado Jurídico:</span>
            <span className="text-base font-bold text-[#1E3A2F]">{property.legalStatus}</span>
          </div>
        </div>

        {/* Detailed Technical & Commercial Specs Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Commercial Description & Technical Sheet */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Commercial Overview */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#242321] border-b border-[#E5E1D8] pb-3">
                Descripción Comercial & Análisis
              </h2>
              <p className="text-sm leading-relaxed text-[#6B6A63]">
                {property.description}
              </p>
              <div className="p-5 bg-[#EEF4EF] border border-[#E5E1D8] rounded-xl space-y-1.5 text-xs">
                <span className="font-mono text-[#1E3A2F] font-bold block uppercase tracking-wider">Análisis de Oportunidad & Desarrollo</span>
                <p className="text-[#242321] leading-relaxed">{property.opportunityAnalysis}</p>
              </div>
            </div>

            {/* Complete Technical Specification Sheet */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#242321] border-b border-[#E5E1D8] pb-3">
                Ficha Técnica & Jurídica 360°
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {property.saeIdActivo && (
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 space-y-1 shadow-sm sm:col-span-2 flex items-center justify-between">
                    <div>
                      <span className="text-[#6D4C7D] block font-mono font-semibold uppercase tracking-wider text-[11px]">ID Activo SAE (Base de Datos Oficial)</span>
                      <span className="font-mono font-bold text-xl text-purple-900">{property.saeIdActivo}</span>
                    </div>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full border border-purple-200">
                      Custodia SAE
                    </span>
                  </div>
                )}
                <div className="p-4 bg-white rounded-xl border border-[#E5E1D8] space-y-1 shadow-sm">
                  <span className="text-[#6B6A63] block font-mono">Folio de Matrícula Inmobiliaria:</span>
                  <span className="font-mono font-bold text-base text-[#1E3A2F]">{property.folioMatricula || property.matriculaInmobiliaria}</span>
                </div>
                <div className="p-4 bg-white rounded-xl border border-[#E5E1D8] space-y-1 shadow-sm">
                  <span className="text-[#6B6A63] block font-mono">Cédula Catastral:</span>
                  <span className="font-mono font-bold text-[#0F766E] break-all">{property.cedulaCatastral}</span>
                </div>
                <div className="p-4 bg-white rounded-xl border border-[#E5E1D8] space-y-1 shadow-sm">
                  <span className="text-[#6B6A63] block">Altitud sobre el nivel del mar:</span>
                  <span className="font-bold text-[#242321]">{property.altitudeMsl ? `${property.altitudeMsl} msnm` : 'Baja altitud'}</span>
                </div>
                <div className="p-4 bg-white rounded-xl border border-[#E5E1D8] space-y-1 shadow-sm">
                  <span className="text-[#6B6A63] block">Fuentes Hídricas:</span>
                  <span className="font-bold text-[#242321]">{property.waterSources}</span>
                </div>
                <div className="p-4 bg-white rounded-xl border border-[#E5E1D8] space-y-1 sm:col-span-2 shadow-sm">
                  <span className="text-[#6B6A63] block">Vías de Acceso:</span>
                  <span className="font-bold text-[#242321]">{property.accessRoads}</span>
                </div>
                <div className="p-4 bg-white rounded-xl border border-[#E5E1D8] space-y-1 sm:col-span-2 shadow-sm">
                  <span className="text-[#6B6A63] block">Estado Documental & Tradición:</span>
                  <span className="font-bold text-[#242321]">{property.documentStatus}</span>
                </div>
              </div>
            </div>

            {/* Map Location */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#242321] border-b border-[#E5E1D8] pb-3">
                Ubicación Georreferenciada
              </h2>
              <PropertyMap properties={[property]} height="400px" />
            </div>

            {/* Downloadable Documents */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#242321] border-b border-[#E5E1D8] pb-3">
                Documentos Disponibles
              </h2>
              <div className="space-y-2">
                {property.documentsAvailable.map((doc, idx) => (
                  <div key={idx} className="p-4 bg-white border border-[#E5E1D8] rounded-xl flex justify-between items-center text-xs shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#EEF4EF] text-[#1E3A2F] rounded-lg font-mono font-bold">
                        {doc.type}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#242321]">{doc.name}</h4>
                        <span className="text-[#6B6A63] font-mono">{doc.size}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => alert(`Descargando documento de demostración: ${doc.name}`)}
                      className="px-3.5 py-2 bg-[#F1EFE8] hover:bg-[#E5E1D8] text-[#1E3A2F] font-semibold rounded-xl flex items-center gap-1.5 border border-[#E5E1D8]"
                    >
                      <Download className="w-4 h-4 text-[#1E3A2F]" /> Descargar
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Inquiry & Advisory Form */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white border border-[#E5E1D8] rounded-2xl p-6 space-y-6 shadow-md">
              
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-[#242321]">
                  Solicitar Información o Visita
                </h3>
                <p className="text-xs text-[#6B6A63]">
                  Contacta directamente con un asesor de ACTIVOS & INVERSIONES DARIEN.
                </p>
              </div>

              {!contactSubmitted ? (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[#6B6A63] mb-1 font-mono font-medium">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Tu nombre completo"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-[#242321] placeholder-[#929087] focus:outline-none focus:border-[#1E3A2F]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#6B6A63] mb-1 font-mono font-medium">Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+57 300 000 0000"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-[#242321] placeholder-[#929087] focus:outline-none focus:border-[#1E3A2F]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#6B6A63] mb-1 font-mono font-medium">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      placeholder="correo@ejemplo.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-[#242321] placeholder-[#929087] focus:outline-none focus:border-[#1E3A2F]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#6B6A63] mb-1 font-mono font-medium">Mensaje o Consulta</label>
                    <textarea
                      rows={3}
                      placeholder="Deseo coordinar una visita técnica o recibir información jurídica adicional..."
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      className="w-full bg-[#F8F7F2] border border-[#E5E1D8] rounded-xl p-3.5 text-[#242321] placeholder-[#929087] focus:outline-none focus:border-[#1E3A2F]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#1E3A2F] hover:bg-[#152921] text-white font-bold rounded-xl shadow-md transition-colors text-xs"
                  >
                    Enviar Solicitud
                  </button>
                </form>
              ) : (
                <div className="p-6 bg-[#EEF4EF] border border-[#E5E1D8] rounded-xl text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-[#23866D] mx-auto" />
                  <h4 className="font-bold text-[#242321] text-sm">¡Solicitud Recibida con Éxito!</h4>
                  <p className="text-xs text-[#6B6A63]">
                    Un asesor comercial de ACTIVOS & INVERSIONES DARIEN se pondrá en contacto contigo en breve.
                  </p>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
          <div className="pt-10 border-t border-[#E5E1D8] space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#242321]">
              Propiedades Similares en la Región
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
