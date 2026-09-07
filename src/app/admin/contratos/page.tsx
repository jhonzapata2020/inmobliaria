'use client';

import React from 'react';
import { FileText, CheckCircle2, Clock, ShieldCheck, Download, Search } from 'lucide-react';
import { formatCurrency } from '../../../lib/formatters';

export default function AdminContratosPage() {
  const mockContracts = [
    {
      id: 'CT-088',
      property: 'Parque Logístico & Bodega "El Eje"',
      code: 'DAR-BOD-003',
      tenant: 'Logística Bananera del Caribe S.A.S.',
      type: 'Arriendo Comercial',
      monthlyRent: 42000000,
      startDate: '2025-06-01',
      endDate: '2027-05-31',
      status: 'Vigente',
      insurancePolicy: 'Seguros Bolívar #884920'
    },
    {
      id: 'CT-089',
      property: 'Local Comercial Esquina "Plaza Darién"',
      code: 'DAR-LOC-007',
      tenant: 'Banco Bananero Comercial',
      type: 'Arriendo Comercial',
      monthlyRent: 12500000,
      startDate: '2026-01-01',
      endDate: '2028-12-31',
      status: 'En trámite de firma',
      insurancePolicy: 'Sura Fianza #119402'
    },
    {
      id: 'CT-090',
      property: 'Hacienda La Gloria (Custodia SAE)',
      code: 'DAR-SAE-004',
      tenant: 'Fondo de Tierras Sostenibles',
      type: 'Custodia Productiva REDD+',
      monthlyRent: 25000000,
      startDate: '2026-03-01',
      endDate: '2031-02-28',
      status: 'En estudio jurídico',
      insurancePolicy: 'Garantía Institucional SAE'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-900">
            Contratos de Arriendo & Promesas de Venta
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            Control de pólizas de arrendamiento, vigencias y recaudo mensual de cánones.
          </p>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-4">Ref / Inmueble</th>
              <th className="p-4">Arrendatario / Titular</th>
              <th className="p-4">Tipo de Contrato</th>
              <th className="p-4">Canon Mensual</th>
              <th className="p-4">Vigencia</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Documento</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {mockContracts.map((ct) => (
              <tr key={ct.id} className="hover:bg-slate-50">
                <td className="p-4 space-y-1">
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block text-[11px]">
                    {ct.id} • {ct.code}
                  </span>
                  <h4 className="font-bold text-slate-900 font-sans text-sm">{ct.property}</h4>
                </td>

                <td className="p-4 text-slate-800 font-sans font-semibold">
                  {ct.tenant}
                </td>

                <td className="p-4 text-slate-600">
                  {ct.type}
                </td>

                <td className="p-4 font-bold text-emerald-800">
                  {formatCurrency(ct.monthlyRent)}/mes
                </td>

                <td className="p-4 text-slate-500">
                  {ct.startDate} al {ct.endDate}
                </td>

                <td className="p-4">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                    ct.status === 'Vigente' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'
                  }`}>
                    {ct.status}
                  </span>
                </td>

                <td className="p-4 text-right">
                  <button 
                    onClick={() => alert(`Descargando minuta borrador de contrato ${ct.id}`)}
                    className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg inline-flex items-center gap-1 font-bold"
                  >
                    <Download className="w-4 h-4" /> PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
