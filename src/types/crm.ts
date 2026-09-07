export type CRMStage = 
  | 'Nuevo interesado'
  | 'Contactado'
  | 'Visita programada'
  | 'En análisis de necesidad'
  | 'En estudio jurídico'
  | 'Oferta radicada'
  | 'Negociación'
  | 'Cierre / contrato'
  | 'No concretado';

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
  id: string;
  clientName: string;
  companyName?: string;
  phone: string;
  email: string;
  propertyOfInterestId: string;
  propertyOfInterestTitle: string;
  propertyCode: string;
  potentialValue: number;
  stage: CRMStage;
  priority: LeadPriority;
  nextActivity: string;
  assignedAgent: string;
  updatedDate: string;
  createdDate: string;
  tags: string[];
  notes: LeadNote[];
  activities: LeadActivity[];
}

export interface CRMMetrics {
  totalLeads: number;
  totalPipelineValue: number;
  scheduledVisitsCount: number;
  activeOffersCount: number;
  conversionRatePercent: number;
}
