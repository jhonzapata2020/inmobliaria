import { Lead } from '../types/crm';

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-101',
    clientName: 'Roberto Gómez Gaviria',
    companyName: 'Inversiones AgroUrabá S.A.S.',
    phone: '+57 311 482 9901',
    email: 'rgomez@agrouraba.com',
    propertyOfInterestId: 'prop-001',
    propertyOfInterestTitle: 'Finca Ganadera "El Edén de Urabá"',
    propertyCode: 'DAR-FIN-001',
    potentialValue: 3840000000,
    stage: 'Oferta radicada',
    priority: 'Alta',
    nextActivity: 'Revisión de oferta formal en comité de inversión',
    assignedAgent: 'Ing. Carlos Mendoza',
    updatedDate: '2026-03-05',
    createdDate: '2026-02-12',
    tags: ['Inversionista Agro', 'Ganadería', 'Contado'],
    notes: [
      {
        id: 'n1',
        author: 'Carlos Mendoza',
        date: '2026-02-14',
        text: 'Cliente realizó visita técnica al predio en Necoclí con zootecnista. Impresionado con la disponibilidad de agua.',
        type: 'Visita'
      },
      {
        id: 'n2',
        author: 'Carlos Mendoza',
        date: '2026-03-01',
        text: 'Radicó carta de intención formal por $3.600M. Pendiente contraoferta.',
        type: 'Oferta'
      }
    ],
    activities: [
      {
        id: 'a1',
        title: 'Presentar respuesta a carta de intención',
        dueDate: '2026-03-09',
        completed: false,
        assignedTo: 'Ing. Carlos Mendoza'
      }
    ]
  },
  {
    id: 'lead-102',
    clientName: 'Dra. Patricia Jaramillo',
    companyName: 'Logística Bananera del Caribe',
    phone: '+57 300 219 4433',
    email: 'pjaramillo@logbananera.co',
    propertyOfInterestId: 'prop-003',
    propertyOfInterestTitle: 'Parque Logístico & Bodega "El Eje"',
    propertyCode: 'DAR-BOD-003',
    potentialValue: 42000000,
    stage: 'En estudio jurídico',
    priority: 'Alta',
    nextActivity: 'Validación de fianza y capacidad de pago',
    assignedAgent: 'Dra. Maria Fernanda Salazar',
    updatedDate: '2026-03-04',
    createdDate: '2026-02-20',
    tags: ['Arriendo Bodega', 'Logística', 'Corporativo'],
    notes: [
      {
        id: 'n3',
        author: 'Maria Fernanda Salazar',
        date: '2026-02-22',
        text: 'Solicitó adaptar 1 muelles adicional. Se confirmó factibilidad técnica.',
        type: 'Nota'
      }
    ],
    activities: [
      {
        id: 'a2',
        title: 'Emitir borrador de contrato de arrendamiento',
        dueDate: '2026-03-10',
        completed: false,
        assignedTo: 'Dra. Maria Fernanda Salazar'
      }
    ]
  },
  {
    id: 'lead-103',
    clientName: 'Fondo de Tierras Sostenibles (FTS)',
    companyName: 'FTS Global Latam',
    phone: '+57 320 889 1234',
    email: 'contact@fts-latam.org',
    propertyOfInterestId: 'prop-004',
    propertyOfInterestTitle: 'Activo Especial SAE "Hacienda La Gloria"',
    propertyCode: 'DAR-SAE-004',
    potentialValue: 12400000000,
    stage: 'En análisis de necesidad',
    priority: 'Alta',
    nextActivity: 'Reunión institucional para esquema de custodia productiva REDD+',
    assignedAgent: 'Dr. Alejandro Darién',
    updatedDate: '2026-03-06',
    createdDate: '2026-02-01',
    tags: ['SAE', 'Custodia', 'Carbono', 'Institucional'],
    notes: [
      {
        id: 'n4',
        author: 'Alejandro Darién',
        date: '2026-02-15',
        text: 'Interesados en desarrollar proyecto de bonos de carbono sobre las 480 Ha.',
        type: 'Llamada'
      }
    ],
    activities: [
      {
        id: 'a3',
        title: 'Enviar dossier institucional de custodia SAE',
        dueDate: '2026-03-08',
        completed: true,
        assignedTo: 'Dr. Alejandro Darién'
      }
    ]
  },
  {
    id: 'lead-104',
    clientName: 'Constructora Urabá Moderno S.A.',
    companyName: 'Constructora Urabá Moderno',
    phone: '+57 315 901 7788',
    email: 'gerencia@urabamoderno.com',
    propertyOfInterestId: 'prop-002',
    propertyOfInterestTitle: 'Predio Agrologístico Portuario "Bahía Colombia"',
    propertyCode: 'DAR-LOT-002',
    potentialValue: 6750000000,
    stage: 'Negociación',
    priority: 'Alta',
    nextActivity: 'Acuerdos sobre forma de pago y promesas de compraventa',
    assignedAgent: 'Ing. Carlos Mendoza',
    updatedDate: '2026-03-05',
    createdDate: '2026-01-28',
    tags: ['Lote Industrial', 'Puerto', 'Desarrollo'],
    notes: [
      {
        id: 'n5',
        author: 'Carlos Mendoza',
        date: '2026-03-02',
        text: 'Se avanzó en estructuración del plan de pagos a 10 meses.',
        type: 'Nota'
      }
    ],
    activities: []
  },
  {
    id: 'lead-105',
    clientName: 'Gabriel Eduardo Restrepo',
    companyName: 'Particular Inversionista',
    phone: '+57 318 334 0011',
    email: 'grestrepo@gmail.com',
    propertyOfInterestId: 'prop-009',
    propertyOfInterestTitle: 'Casa Campestre "Villa Esmeralda"',
    propertyCode: 'DAR-CAS-009',
    potentialValue: 980000000,
    stage: 'Visita programada',
    priority: 'Media',
    nextActivity: 'Visita presencial el sábado 14 de marzo a las 10:00 AM',
    assignedAgent: 'Dra. Maria Fernanda Salazar',
    updatedDate: '2026-03-06',
    createdDate: '2026-03-02',
    tags: ['Casa Campestre', 'Mutatá', 'Familia'],
    notes: [],
    activities: [
      {
        id: 'a4',
        title: 'Confirmar llegada con conserje de Villa Esmeralda',
        dueDate: '2026-03-13',
        completed: false,
        assignedTo: 'Dra. Maria Fernanda Salazar'
      }
    ]
  },
  {
    id: 'lead-106',
    clientName: 'Banco Bananero Comercial',
    companyName: 'BBVA / Banco Comercial',
    phone: '+57 301 772 8822',
    email: 'activos@bancobananero.com',
    propertyOfInterestId: 'prop-007',
    propertyOfInterestTitle: 'Local Comercial "Plaza Darién"',
    propertyCode: 'DAR-LOC-007',
    potentialValue: 12500000,
    stage: 'Contactado',
    priority: 'Media',
    nextActivity: 'Envío de planos arquitectónicos de detalle',
    assignedAgent: 'Dra. Maria Fernanda Salazar',
    updatedDate: '2026-03-03',
    createdDate: '2026-03-01',
    tags: ['Local Commercial', 'Carepa'],
    notes: [],
    activities: []
  },
  {
    id: 'lead-107',
    clientName: 'Grupo EcoTurismo del Darién',
    companyName: 'EcoDarién Tours',
    phone: '+57 314 661 2299',
    email: 'info@ecodarien.co',
    propertyOfInterestId: 'prop-005',
    propertyOfInterestTitle: 'Lote Ecoturístico "Playa Almejal"',
    propertyCode: 'DAR-ECO-005',
    potentialValue: 1980000000,
    stage: 'Nuevo interesado',
    priority: 'Baja',
    nextActivity: 'Llamada inicial de calificación de presupuesto',
    assignedAgent: 'Ing. Carlos Mendoza',
    updatedDate: '2026-03-06',
    createdDate: '2026-03-06',
    tags: ['Ecoturismo', 'Acandí', 'Playa'],
    notes: [],
    activities: []
  }
];
