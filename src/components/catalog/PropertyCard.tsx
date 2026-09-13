'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Layers, 
  FileSpreadsheet, 
  Check, 
  MapPin, 
  Ruler, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import { Property } from '../../types/property';
import { formatCurrency, formatArea, getLegalStatusBadge, getModalityBadge } from '../../lib/formatters';
import { useDossier } from '../../context/DossierContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useCompare } from '../../context/CompareContext';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { addToDossier, isInDossier, removeFromDossier } = useDossier();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCompare, isInCompare, removeFromCompare } = useCompare();

  const inDossier = isInDossier(property.id);
  const favorite = isFavorite(property.id);
  const inCompare = isInCompare(property.id);

  const legalBadge = getLegalStatusBadge(property.legalStatus);
  const modalityBadge = getModalityBadge(property.modality);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (property.images && property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (property.images && property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const detailHref = `/propiedades/${property.slug || property.id}`;

  return (
    <div className="group bg-white border border-[#E5E1D8] hover:border-[#1E3A2F]/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      
      {/* Photo Container */}
      <div className="relative h-56 w-full bg-[#F1EFE8] overflow-hidden">
        <img
          src={property.featuredImage || property.images?.[currentImageIndex] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges & Actions */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2 z-10">
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm ${modalityBadge.bgClass} ${modalityBadge.textClass}`}>
              {modalityBadge.label}
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border backdrop-blur-md ${legalBadge.bgClass} ${legalBadge.textClass} ${legalBadge.borderClass}`}>
              {legalBadge.label}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Dossier Button Floating on Photo */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                inDossier ? removeFromDossier(property.id) : addToDossier(property);
              }}
              className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-sm ${
                inDossier 
                  ? 'bg-[#23866D] text-white font-bold' 
                  : 'bg-white/90 text-[#1E3A2F] hover:text-[#152921] hover:bg-white'
              }`}
              title={inDossier ? 'Quitar del dossier' : '+ Agregar al dossier'}
            >
              {inDossier ? <Check className="w-4 h-4 stroke-[3]" /> : <FileSpreadsheet className="w-4 h-4" />}
            </button>

            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(property.id);
              }}
              className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-sm ${
                favorite 
                  ? 'bg-rose-600 text-white' 
                  : 'bg-white/90 text-[#6B6A63] hover:text-[#242321] hover:bg-white'
              }`}
              title={favorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            >
              <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        {property.images && property.images.length > 1 && (
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={prevImage}
              className="p-1.5 rounded-full bg-white/80 text-[#242321] hover:bg-white transition-colors shadow-md"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="p-1.5 rounded-full bg-white/80 text-[#242321] hover:bg-white transition-colors shadow-md"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Image Indicators */}
        {property.images && property.images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {property.images.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === currentImageIndex ? 'bg-emerald-400 w-3' : 'bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Code Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="text-[10px] font-mono font-bold text-white bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-white/20">
            {property.code}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2">
          {/* Asset Type & Location */}
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono text-[#1E3A2F] font-bold uppercase tracking-wider flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-[#23866D]" />
              {property.assetType}
            </span>
            <span className="text-[#6B6A63] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
              {property.municipality}, {property.department}
            </span>
          </div>

          {/* Title */}
          <Link href={detailHref} className="block group-hover:text-[#1E3A2F] transition-colors">
            <h3 className="font-serif text-base font-bold text-[#242321] line-clamp-1">
              {property.title}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-xs text-[#6B6A63] line-clamp-2 leading-relaxed">
            {property.shortDescription}
          </p>
        </div>

        {/* Specs Grid */}
        <div className="pt-3 border-t border-[#E5E1D8] grid grid-cols-2 gap-2 text-xs">
          <div className="bg-[#F8F7F2] p-2 rounded-xl border border-[#E5E1D8] flex items-center gap-2">
            <Ruler className="w-4 h-4 text-[#0F766E] shrink-0" />
            <div>
              <span className="text-[10px] text-[#929087] block leading-none">Área Total</span>
              <span className="font-mono font-bold text-[#242321] text-xs">
                {formatArea(property.landAreaHa, property.landAreaM2)}
              </span>
            </div>
          </div>

          <div className="bg-[#F8F7F2] p-2 rounded-xl border border-[#E5E1D8] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#23866D] shrink-0" />
            <div>
              <span className="text-[10px] text-[#929087] block leading-none">Topografía</span>
              <span className="font-semibold text-[#242321] text-xs truncate block max-w-[90px]">
                {property.topography || 'No especificada'}
              </span>
            </div>
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-3 border-t border-[#E5E1D8] space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-[#6B6A63] font-mono">Valor Comercial:</span>
            <span className="text-base font-serif font-bold text-[#1E3A2F] font-mono">
              {property.modality === 'Venta' && formatCurrency(property.salePriceCop)}
              {property.modality === 'Arriendo' && `${formatCurrency(property.monthlyRentCop)}/mes`}
              {property.modality === 'Custodia SAE' && 'Regulada SAE'}
              {property.modality === 'Inversión' && formatCurrency(property.salePriceCop || property.estimatedValueCop)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* Compare Toggle */}
            <button
              onClick={() => (inCompare ? removeFromCompare(property.id) : addToCompare(property))}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                inCompare
                  ? 'bg-[#C6A15B]/20 text-[#C6A15B] border border-[#C6A15B]/50'
                  : 'bg-[#F1EFE8] text-[#242321] hover:bg-[#E5E1D8]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#6B6A63]" />
              <span>{inCompare ? 'Comparando' : 'Comparar'}</span>
            </button>

            {/* Dossier Toggle */}
            <button
              onClick={() => (inDossier ? removeFromDossier(property.id) : addToDossier(property))}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                inDossier
                  ? 'bg-[#23866D] text-white font-bold'
                  : 'bg-[#1E3A2F] hover:bg-[#152921] text-white'
              }`}
            >
              {inDossier ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>En Dossier</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>+ Dossier</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
