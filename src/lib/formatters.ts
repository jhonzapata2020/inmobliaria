import { LegalStatus, Modality } from '../types/property';

export function formatCurrency(amount?: number): string {
  if (amount === undefined || amount === null || amount === 0) return 'Bajo solicitud';
  if (amount >= 1000000000) {
    const millones = amount / 1000000;
    return `$${millones.toLocaleString('es-CO', { maximumFractionDigits: 1 })} Millones COP`;
  }
  if (amount >= 1000000) {
    const millones = amount / 1000000;
    return `$${millones.toLocaleString('es-CO', { maximumFractionDigits: 1 })} Millones COP`;
  }
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatArea(areaHa?: number, areaM2?: number): string {
  if (areaHa && areaHa > 0) {
    const m2 = areaM2 || areaHa * 10000;
    return `${areaHa.toLocaleString('es-CO')} Ha (${m2.toLocaleString('es-CO')} m²)`;
  }
  if (areaM2 && areaM2 > 0) {
    if (areaM2 >= 10000) {
      const ha = (areaM2 / 10000).toFixed(2);
      return `${ha} Ha (${areaM2.toLocaleString('es-CO')} m²)`;
    }
    return `${areaM2.toLocaleString('es-CO')} m²`;
  }
  return 'Sujeto a deslinde';
}

export function getLegalStatusBadge(status: LegalStatus): { label: string; bgClass: string; textClass: string; borderClass: string } {
  switch (status) {
    case 'Saneado':
      return {
        label: 'Saneado 100%',
        bgClass: 'bg-emerald-50 dark:bg-emerald-950/40',
        textClass: 'text-emerald-700 dark:text-emerald-300',
        borderClass: 'border-emerald-200 dark:border-emerald-800'
      };
    case 'En estudio jurídico':
      return {
        label: 'En estudio jurídico',
        bgClass: 'bg-amber-50 dark:bg-amber-950/40',
        textClass: 'text-amber-700 dark:text-amber-300',
        borderClass: 'border-amber-200 dark:border-amber-800'
      };
    case 'En proceso de saneamiento':
      return {
        label: 'En saneamiento',
        bgClass: 'bg-orange-50 dark:bg-orange-950/40',
        textClass: 'text-orange-700 dark:text-orange-300',
        borderClass: 'border-orange-200 dark:border-orange-800'
      };
    case 'Activo especial SAE':
      return {
        label: 'Custodia SAE',
        bgClass: 'bg-purple-50 dark:bg-purple-950/40',
        textClass: 'text-purple-700 dark:text-purple-300',
        borderClass: 'border-purple-200 dark:border-purple-800'
      };
    case 'Con documentación parcial':
      return {
        label: 'Doc. Parcial',
        bgClass: 'bg-zinc-100 dark:bg-zinc-800',
        textClass: 'text-zinc-700 dark:text-zinc-300',
        borderClass: 'border-zinc-300 dark:border-zinc-700'
      };
    default:
      return {
        label: status || 'Bajo solicitud',
        bgClass: 'bg-blue-50 dark:bg-blue-950/40',
        textClass: 'text-blue-700 dark:text-blue-300',
        borderClass: 'border-blue-200 dark:border-blue-800'
      };
  }
}

export function getModalityBadge(modality: Modality): { label: string; bgClass: string; textClass: string } {
  switch (modality) {
    case 'Venta':
      return {
        label: 'En Venta',
        bgClass: 'bg-teal-600',
        textClass: 'text-white'
      };
    case 'Arriendo':
      return {
        label: 'En Arriendo',
        bgClass: 'bg-slate-700',
        textClass: 'text-white'
      };
    case 'Custodia SAE':
      return {
        label: 'Custodia SAE',
        bgClass: 'bg-purple-700',
        textClass: 'text-white'
      };
    case 'Inversión':
      return {
        label: 'Oportunidad Inversión',
        bgClass: 'bg-amber-600',
        textClass: 'text-white'
      };
    default:
      return {
        label: modality,
        bgClass: 'bg-zinc-600',
        textClass: 'text-white'
      };
  }
}
