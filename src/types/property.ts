export type Modality = 'Venta' | 'Arriendo' | 'Custodia' | 'Inversión' | 'Custodia SAE';

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
  | 'Información disponible bajo solicitud'
  | string;

export type AvailabilityStatus = 'Disponible' | 'En negociación' | 'Reservado' | 'Adjudicado';

export interface Property {
  id: string;
  code: string;
  slug?: string;
  title: string;
  shortDescription: string;
  description: string;
  opportunityAnalysis: string;
  assetType: AssetType;
  modality: Modality;
  
  // Real SAE Database Metadata
  isSae?: boolean;
  saeIdActivo?: string;
  folioMatricula?: string;

  price?: number; // COP for sale
  priceTotal?: number; // Alias for price
  monthlyRent?: number; // COP for rent
  rentMonthly?: number; // Alias for monthlyRent
  estimatedValue?: number; // COP for custody evaluation
  
  totalArea?: number;
  areaUnit?: string;
  areaTotalHa?: number; // Hectares if rural
  areaTotalM2?: number; // Square meters
  builtAreaM2?: number; // Built area
  builtArea?: number;
  
  // Location
  department: string;
  municipality: string;
  sectorVereda?: string;
  vereda?: string;
  address?: string;
  latitude: number;
  longitude: number;
  altitudeMsl?: number;
  coordinates?: { lat: number; lng: number };
  
  // Specs & Tech info
  matriculaInmobiliaria: string;
  cedulaCatastral: string;
  topography: string; // e.g. Plana, Ondulada, Mixta
  accessRoads: string;
  waterSources: string;
  publicServices: string[];
  currentUse: string;
  potentialUses: string[];
  existingInfrastructure: string[];
  environmentalNotes: string;
  
  // Legal & Verification
  legalStatus: LegalStatus;
  documentStatus: string;
  commercialConditions: string;
  isDemoData: boolean;
  
  // Media & Metadata
  images: string[];
  featuredImage?: string;
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

export type PotentialUse =
  | 'Ganadería'
  | 'Agroforestal'
  | 'Cacao / Palma'
  | 'Logístico / Industrial'
  | 'Comercial'
  | 'Residencial'
  | 'Conservación / Ecoturismo'
  | string;

export interface PropertyFilterState {
  searchQuery: string;
  modality: string;
  assetType: string;
  department?: string;
  municipality: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  minArea?: number | string;
  maxArea?: number | string;
  minAreaHa?: number | string;
  maxAreaHa?: number | string;
  legalStatus?: string;
  potentialUse?: string;
  availability?: string;
  isInvestmentOpportunity?: boolean;
  sortBy?: 'recent' | 'price-asc' | 'price-desc' | 'area-desc' | 'featured' | string;
}
