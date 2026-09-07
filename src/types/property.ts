export type Modality = 'Venta' | 'Arriendo' | 'Custodia' | 'Inversión';

export type AssetType = 
  | 'Finca'
  | 'Lote'
  | 'Terreno'
  | 'Casa'
  | 'Bodega'
  | 'Edificio'
  | 'Local'
  | 'Oficina'
  | 'Activo Especial';

export type LegalStatus = 
  | 'Saneado'
  | 'En estudio jurídico'
  | 'En proceso de saneamiento'
  | 'Con documentación parcial'
  | 'Activo especial SAE'
  | 'Información disponible bajo solicitud';

export type AvailabilityStatus = 'Disponible' | 'En negociación' | 'Reservado' | 'Adjudicado';

export type PotentialUse = 
  | 'Agropecuario'
  | 'Ganadero'
  | 'Industrial'
  | 'Comercial'
  | 'Residencial'
  | 'Logístico'
  | 'Turístico'
  | 'Oficina'
  | 'Inversión';

export interface PropertyFeature {
  id: string;
  name: string;
  category: 'Acceso' | 'Servicios' | 'Geografía' | 'Infraestructura' | 'Jurídico';
}

export interface Property {
  id: string;
  code: string;
  title: string;
  shortDescription: string;
  description: string;
  opportunityAnalysis: string;
  assetType: AssetType;
  modality: Modality;
  price?: number; // COP for sale
  monthlyRent?: number; // COP for rent
  estimatedValue?: number; // COP for custody / investment evaluation
  areaTotalHa?: number; // Hectares if rural
  areaTotalM2?: number; // Square meters
  builtAreaM2?: number; // Built area
  
  // Location
  department: string;
  municipality: string;
  sectorVereda?: string;
  latitude: number;
  longitude: number;
  altitudeMsl?: number;
  
  // Specs & Tech info
  matriculaInmobiliaria: string;
  cedulaCatastral: string;
  topography: string; // e.g. Plana, Ondulada, Mixta
  accessRoads: string;
  waterSources: string;
  publicServices: string[];
  currentUse: string;
  potentialUses: PotentialUse[];
  existingInfrastructure: string[];
  environmentalNotes: string;
  
  // Legal & Verification
  legalStatus: LegalStatus;
  documentStatus: string;
  commercialConditions: string;
  isDemoData: boolean;
  
  // Media & Metadata
  images: string[];
  videoUrl?: string;
  virtualTourUrl?: string;
  documentsAvailable: { name: string; type: string; size: string }[];
  
  // Status & Flags
  availability: AvailabilityStatus;
  isFeatured: boolean;
  isInvestmentOpportunity: boolean;
  createdDate: string;
  updatedDate: string;
}

export interface PropertyFilterState {
  searchQuery: string;
  modality: string;
  assetType: string;
  department: string;
  municipality: string;
  minPrice: string;
  maxPrice: string;
  minArea: string;
  maxArea: string;
  legalStatus: string;
  potentialUse: string;
  availability: string;
  isInvestmentOpportunity: boolean;
  sortBy: 'recent' | 'price-asc' | 'price-desc' | 'area-desc' | 'featured';
}
