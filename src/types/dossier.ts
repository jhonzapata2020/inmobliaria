import { Property } from './property';

export interface ClientInfo {
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  city: string;
  notes?: string;
}

export type DossierType = 'Inversionista' | 'Ejecutivo' | 'Bancario / Financiero' | 'Institucional';

export interface DossierSummary {
  propertyCount: number;
  totalAreaHa: number;
  totalAreaM2: number;
  totalSalePrice: number;
  totalMonthlyRent: number;
  hasSale: boolean;
  hasRent: boolean;
  hasCustody: boolean;
  hasMixedModalities: boolean;
}

export interface DossierState {
  selectedProperties: Property[];
  clientInfo: ClientInfo;
  dossierType: DossierType;
  generatedDate?: string;
}
