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
  Sparkles, 
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
    if (property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  return (
    <div className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-emerald-950/20 transition-all duration-200 flex flex-col justify-between">
      
      {/* Photo Container */}
      <div className="relative h-56 w-full bg-slate-950 overflow-hidden">
        <img
          src={property.images[currentImageIndex] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/40 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2 z-10">
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-md ${modalityBadge.bgClass} ${modalityBadge.textClass}`}>
              {modalityBadge.label}
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border backdrop-blur-md ${legalBadge.bgClass} ${legalBadge.textClass} ${legalBadge.borderClass}`}>
              {legalBadge.label}
            </span>
          </div>

          {/* Favorite Button */}
          <button
            onClick={() => toggleFavorite(property.id)}
            className={`p-2 rounded-xl backdrop-blur-md transition-all ${
              favorite 
                ? 'bg-rose-500 text-white shadow-lg' 
                : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-900/90'
            }`}
            title={favorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          >
            <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Carousel Navigation Arrows */}
        {property.images.length > 1 && (
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={prevImage}
              className="p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Image Indicators */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {property.images.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === currentImageIndex ? 'bg-emerald-400 w-3' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Code Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="text-[10px] font-mono font-bold text-slate-200 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-slate-700/60">
            {property.code}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2">
          {/* Asset Type & Location */}
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Building className="w-3.5 h-3.5" />
              {property.assetType}
            </span>
            <span className="text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              {property.municipality}, {property.department}
            </span>
          </div>

          {/* Title */}
          <Link href={`/propiedades/${property.id}`} className="block group-hover:text-emerald-400 transition-colors">
            <h3 className="font-serif text-base font-bold text-white line-clamp-1">
              {property.title}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {property.shortDescription}
          </p>
        </div>

        {/* Specs Grid */}
        <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800 flex items-center gap-2">
            <Ruler className="w-4 h-4 text-teal-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 block leading-none">Área Total</span>
              <span className="font-mono font-semibold text-slate-200 text-xs">
                {formatArea(property.areaTotalHa, property.areaTotalM2)}
              </span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 block leading-none">Topografía</span>
              <span className="font-semibold text-slate-200 text-xs truncate block max-w-[90px]">
                {property.topography}
              </span>
            </div>
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-3 border-t border-slate-800 space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-slate-400 font-mono">Valor Comercial:</span>
            <span className="text-base font-serif font-bold text-emerald-400 font-mono">
              {property.modality === 'Venta' && formatCurrency(property.price)}
              {property.modality === 'Arriendo' && `${formatCurrency(property.monthlyRent)}/mes`}
              {property.modality === 'Custodia' && 'Regulada SAE'}
              {property.modality === 'Inversión' && formatCurrency(property.price || property.estimatedValue)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* Compare Toggle */}
            <button
              onClick={() => (inCompare ? removeFromCompare(property.id) : addToCompare(property))}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                inCompare
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{inCompare ? 'Comparando' : 'Comparar'}</span>
            </button>

            {/* Dossier Toggle */}
            <button
              onClick={() => (inDossier ? removeFromDossier(property.id) : addToDossier(property))}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md ${
                inDossier
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white'
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
