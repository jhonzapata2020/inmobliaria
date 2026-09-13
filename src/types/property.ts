export type Modality = 'Venta' | 'Arriendo' | 'Custodia SAE' | 'Inversión';
export type PropertyModality = Modality;

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
export type EditorialStatus = 'draft' | 'review' | 'published' | 'archived';

export interface DocumentItem {
  name: string;
  type: string;
  size: string;
  url?: string;
}

export interface Property {
  id: string; // UUID or string id
  code: string;
  slug: string;
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

  // Canonical Financial Fields (COP)
  salePriceCop?: number;
  monthlyRentCop?: number;
  estimatedValueCop?: number;
  
  // Canonical Area Fields
  landAreaM2?: number;
  landAreaHa?: number; // Calculated: landAreaM2 / 10000
  builtAreaM2?: number;
  
  // Canonical Location Coordinates
  department: string;
  municipality: string;
  sectorVereda?: string;
  vereda?: string;
  address?: string;
  latitude: number;
  longitude: number;
  isConfidentialCoords?: boolean;
  altitudeMsl?: number;
  
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
  
  // Legal & Editorial
  legalStatus: LegalStatus;
  documentStatus: string;
  commercialConditions: string;
  editorialStatus?: EditorialStatus;
  isDemoData?: boolean;
  
  // Media & Documents
  images: string[];
  featuredImage?: string;
  videoUrl?: string;
  virtualTourUrl?: string;
  documentsAvailable: DocumentItem[];
  
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
