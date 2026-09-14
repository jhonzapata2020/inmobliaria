export interface LocationCoords {
  lat: number;
  lng: number;
}

export const DEPARTMENTS = [
  'Antioquia',
  'Córdoba',
  'Chocó',
  'La Guajira',
  'Sucre',
  'Bolívar',
] as const;

export type DepartmentName = typeof DEPARTMENTS[number] | string;

export interface MunicipalityItem {
  name: string;
  department: string;
  label: string; // e.g. "Riohacha (La Guajira)"
  coords: LocationCoords;
}

export const MUNICIPALITIES_LA_GUAJIRA: MunicipalityItem[] = [
  { name: 'Riohacha', department: 'La Guajira', label: 'Riohacha (La Guajira)', coords: { lat: 11.5444, lng: -72.9072 } },
  { name: 'Albania', department: 'La Guajira', label: 'Albania (La Guajira)', coords: { lat: 11.1611, lng: -72.5919 } },
  { name: 'Barrancas', department: 'La Guajira', label: 'Barrancas (La Guajira)', coords: { lat: 10.9572, lng: -72.7881 } },
  { name: 'Dibulla', department: 'La Guajira', label: 'Dibulla (La Guajira)', coords: { lat: 11.2722, lng: -73.3083 } },
  { name: 'Distracción', department: 'La Guajira', label: 'Distracción (La Guajira)', coords: { lat: 10.8983, lng: -72.8883 } },
  { name: 'El Molino', department: 'La Guajira', label: 'El Molino (La Guajira)', coords: { lat: 10.6544, lng: -72.9250 } },
  { name: 'Fonseca', department: 'La Guajira', label: 'Fonseca (La Guajira)', coords: { lat: 10.8875, lng: -72.8478 } },
  { name: 'Hatonuevo', department: 'La Guajira', label: 'Hatonuevo (La Guajira)', coords: { lat: 11.0631, lng: -72.6961 } },
  { name: 'La Jagua del Pilar', department: 'La Guajira', label: 'La Jagua del Pilar (La Guajira)', coords: { lat: 10.5133, lng: -73.0761 } },
  { name: 'Maicao', department: 'La Guajira', label: 'Maicao (La Guajira)', coords: { lat: 11.3783, lng: -72.2411 } },
  { name: 'Manaure', department: 'La Guajira', label: 'Manaure (La Guajira)', coords: { lat: 11.7750, lng: -72.4444 } },
  { name: 'San Juan del Cesar', department: 'La Guajira', label: 'San Juan del Cesar (La Guajira)', coords: { lat: 10.7711, lng: -73.0028 } },
  { name: 'Uribia', department: 'La Guajira', label: 'Uribia (La Guajira)', coords: { lat: 11.7133, lng: -72.2664 } },
  { name: 'Urumita', department: 'La Guajira', label: 'Urumita (La Guajira)', coords: { lat: 10.5639, lng: -73.0128 } },
  { name: 'Villanueva', department: 'La Guajira', label: 'Villanueva (La Guajira)', coords: { lat: 10.6053, lng: -72.9806 } },
];

export const MUNICIPALITIES_ANTIOQUIA: MunicipalityItem[] = [
  { name: 'Turbo', department: 'Antioquia', label: 'Turbo (Antioquia)', coords: { lat: 8.0925, lng: -76.7281 } },
  { name: 'Necoclí', department: 'Antioquia', label: 'Necoclí (Antioquia)', coords: { lat: 8.4258, lng: -76.7864 } },
  { name: 'Apartadó', department: 'Antioquia', label: 'Apartadó (Antioquia)', coords: { lat: 7.8825, lng: -76.6258 } },
  { name: 'Carepa', department: 'Antioquia', label: 'Carepa (Antioquia)', coords: { lat: 7.7575, lng: -76.6547 } },
  { name: 'Chigorodó', department: 'Antioquia', label: 'Chigorodó (Antioquia)', coords: { lat: 7.6681, lng: -76.6808 } },
  { name: 'Arboletes', department: 'Antioquia', label: 'Arboletes (Antioquia)', coords: { lat: 8.8508, lng: -76.4267 } },
  { name: 'Mutatá', department: 'Antioquia', label: 'Mutatá (Antioquia)', coords: { lat: 7.2436, lng: -76.4358 } },
  { name: 'San Pedro de Urabá', department: 'Antioquia', label: 'San Pedro de Urabá (Antioquia)', coords: { lat: 8.2764, lng: -76.3764 } },
  { name: 'San Juan de Urabá', department: 'Antioquia', label: 'San Juan de Urabá (Antioquia)', coords: { lat: 8.7592, lng: -76.5292 } },
];

export const MUNICIPALITIES_CORDOBA: MunicipalityItem[] = [
  { name: 'Los Córdobas', department: 'Córdoba', label: 'Los Córdobas (Córdoba)', coords: { lat: 8.8953, lng: -76.3539 } },
  { name: 'Montería', department: 'Córdoba', label: 'Montería (Córdoba)', coords: { lat: 8.7479, lng: -75.8814 } },
  { name: 'Tierralta', department: 'Córdoba', label: 'Tierralta (Córdoba)', coords: { lat: 8.1722, lng: -76.0592 } },
  { name: 'Valencia', department: 'Córdoba', label: 'Valencia (Córdoba)', coords: { lat: 8.2611, lng: -76.1472 } },
  { name: 'Planeta Rica', department: 'Córdoba', label: 'Planeta Rica (Córdoba)', coords: { lat: 8.4075, lng: -75.5839 } },
  { name: 'Sahagún', department: 'Córdoba', label: 'Sahagún (Córdoba)', coords: { lat: 8.9469, lng: -75.4439 } },
  { name: 'Cereté', department: 'Córdoba', label: 'Cereté (Córdoba)', coords: { lat: 8.8847, lng: -75.7903 } },
  { name: 'Lorica', department: 'Córdoba', label: 'Lorica (Córdoba)', coords: { lat: 9.2392, lng: -75.8142 } },
];

export const MUNICIPALITIES_CHOCO: MunicipalityItem[] = [
  { name: 'Acandí', department: 'Chocó', label: 'Acandí (Chocó)', coords: { lat: 8.5083, lng: -77.2778 } },
  { name: 'Unguía', department: 'Chocó', label: 'Unguía (Chocó)', coords: { lat: 8.0439, lng: -77.0939 } },
  { name: 'Riosucio', department: 'Chocó', label: 'Riosucio (Chocó)', coords: { lat: 7.4394, lng: -77.1189 } },
  { name: 'Bahía Solano', department: 'Chocó', label: 'Bahía Solano (Chocó)', coords: { lat: 6.2239, lng: -77.4039 } },
];

export const ALL_MUNICIPALITIES: MunicipalityItem[] = [
  ...MUNICIPALITIES_LA_GUAJIRA,
  ...MUNICIPALITIES_ANTIOQUIA,
  ...MUNICIPALITIES_CORDOBA,
  ...MUNICIPALITIES_CHOCO,
];

export function getCoordinatesForMunicipality(municipalityName: string): LocationCoords {
  if (!municipalityName) return { lat: 11.5444, lng: -72.9072 };
  const cleanName = municipalityName.trim().toLowerCase();
  const found = ALL_MUNICIPALITIES.find(
    (m) => m.name.toLowerCase() === cleanName || m.label.toLowerCase().includes(cleanName)
  );
  if (found) return found.coords;

  if (
    cleanName.includes('guajira') ||
    cleanName.includes('riohacha') ||
    cleanName.includes('dibulla') ||
    cleanName.includes('maicao') ||
    cleanName.includes('uribia') ||
    cleanName.includes('manaure') ||
    cleanName.includes('san juan del cesar')
  ) {
    return { lat: 11.5444, lng: -72.9072 };
  }
  return { lat: 8.0925, lng: -76.7281 };
}
