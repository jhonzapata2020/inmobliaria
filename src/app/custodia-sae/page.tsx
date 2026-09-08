'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Landmark, 
  Lock, 
  Trees,
  FileText
} from 'lucide-react';
import { INITIAL_PROPERTIES } from '../../data/mockProperties';
import { PropertyCard } from '../../components/catalog/PropertyCard';

export default function CustodiaSaePage() {
  const saeProperties = INITIAL_PROPERTIES.filter((p) => p.legalStatus === 'Activo especial SAE' || p.modality === 'Custodia');

  return (
    <div className="min-h-screen bg-[#F8F7F2] pb-20 space-y-16">
      
      {/* Hero */}
      <section className="relative bg-[#F1EFE8] pt-16 pb-20 border-b border-[#E5E1D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-[#6D4C7D] text-xs font-mono font-bold">
            <Landmark className="w-4 h-4 text-[#6D4C7D]" />
            <span>Unidad Institucional de Custodia & Administración SAE</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#242321] max-w-4xl mx-auto leading-tight">
            Administración, Custodia y Puesta en Valor de <br />
            <span className="text-[#6D4C7D]">Activos Especiales en Colombia</span>
          </h1>

          <p className="text-sm sm:text-base text-[#6B6A63] max-w-2xl mx-auto leading-relaxed">
            Ofrecemos un modelo integral de conservación patrimonial, control de inventario georreferenciado, seguimiento ambiental y aprovechamiento productivo para bienes rurales y urbanos bajo administración institucional.
          </p>

          <div className="flex justify-center gap-4 pt-2">
            <Link
              href="/contacto?type=sae"
              className="px-6 py-3.5 rounded-xl bg-[#6D4C7D] hover:bg-purple-900 text-white font-bold text-xs shadow-md"
            >
              Consultar Protocolo de Custodia
            </Link>
          </div>
        </div>
      </section>

      {/* Institutional Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase text-[#6D4C7D] font-bold tracking-wider">
            Servicios Especializados
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#242321]">
            Ejes Operativos de Gestión SAE
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-6 bg-white border border-[#E5E1D8] rounded-2xl space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6D4C7D] flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#242321] text-base">Custodia & Preservación</h3>
            <p className="text-[#6B6A63] leading-relaxed">
              Monitoreo territorial periódico, control de ocupaciones indebidas y mantenimiento de cercados e infraestructura existente.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#E5E1D8] rounded-2xl space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#EEF4EF] text-[#1E3A2F] flex items-center justify-center font-bold">
              <Trees className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#242321] text-base">Puesta en Valor Productiva</h3>
            <p className="text-[#6B6A63] leading-relaxed">
              Estructuración de contratos de arrendamiento o esquemas de aprovechamiento silvopastoril y programas de bonos de carbono.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#E5E1D8] rounded-2xl space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#EEF4EF] text-[#0F766E] flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#242321] text-base">Saneamiento Técnico-Jurídico</h3>
            <p className="text-[#6B6A63] leading-relaxed">
              Trazabilidad registral en ORIP, saneamiento de deudas prediales, aclaración de linderos y archivo digital georreferenciado.
            </p>
          </div>
        </div>
      </section>

      {/* Activos Bajo Custodia Activa */}
      {saeProperties.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="border-b border-[#E5E1D8] pb-4">
            <span className="text-xs font-mono uppercase text-[#6D4C7D] font-bold tracking-wider">
              Inventario de Custodia
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#242321] mt-1">
              Activos Especiales Regulados
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {saeProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
