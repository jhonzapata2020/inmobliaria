export type CRMStage = 
  | 'Nuevo'
  | 'Contactado'
  | 'En Visita'
  | 'Negociación'
  | 'Cerrado'
  | 'Descartado';

export type LeadPriority = 'Alta' | 'Media' | 'Baja';

export interface LeadNote {
  id: string;
  author: string;
  date: string;
  text: string;
  type: 'Nota' | 'Llamada' | 'Visita' | 'Correo' | 'Oferta';
}

export interface LeadActivity {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  assignedTo: string;
}

export interface Lead {
  id: string; // UUID
  clientName: string;
  companyName?: string;
  phone: string;
  email: string;
  propertyOfInterestId?: string;
  propertyOfInterestTitle?: string;
  propertyCode?: string;
  potentialValue?: number;
  stage: CRMStage;
  priority: LeadPriority;
  nextActivity?: string;
  assignedAgent?: string;
  updatedDate: string;
  createdDate: string;
  tags: string[];
  notes: LeadNote[];
  activities: LeadActivity[];
}

export type CrmLead = Lead;

export interface CRMMetrics {
  totalLeads: number;
  totalPipelineValue: number;
  scheduledVisitsCount: number;
  activeOffersCount: number;
  conversionRatePercent: number;
}
