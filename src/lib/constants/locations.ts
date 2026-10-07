export interface LocationCoords {
  lat: number;
  lng: number;
}

export const DEPARTMENTS = [
  'Antioquia',
  'Córdoba',
  'Chocó',
  'La Guajira',
  'Valle del Cauca',
  'Sucre',
  'Bolívar',
] as const;

export type DepartmentName = typeof DEPARTMENTS[number] | string;

export interface MunicipalityItem {
  name: string;
  department: string;
  label: string; // e.g. "Cali (Valle del Cauca)"
  coords: LocationCoords;
}

export const MUNICIPALITIES_VALLE: MunicipalityItem[] = [
  { name: 'Cali', department: 'Valle del Cauca', label: 'Cali (Valle del Cauca)', coords: { lat: 3.4516, lng: -76.5320 } },
  { name: 'Palmira', department: 'Valle del Cauca', label: 'Palmira (Valle del Cauca)', coords: { lat: 3.5394, lng: -76.3036 } },
  { name: 'Guadalajara de Buga', department: 'Valle del Cauca', label: 'Guadalajara de Buga (Valle del Cauca)', coords: { lat: 3.9008, lng: -76.2978 } },
  { name: 'Buenaventura', department: 'Valle del Cauca', label: 'Buenaventura (Valle del Cauca)', coords: { lat: 3.8801, lng: -77.0312 } },
  { name: 'Cartago', department: 'Valle del Cauca', label: 'Cartago (Valle del Cauca)', coords: { lat: 4.7464, lng: -75.9117 } },
  { name: 'Jamundí', department: 'Valle del Cauca', label: 'Jamundí (Valle del Cauca)', coords: { lat: 3.2608, lng: -76.5414 } },
  { name: 'El Cerrito', department: 'Valle del Cauca', label: 'El Cerrito (Valle del Cauca)', coords: { lat: 3.6853, lng: -76.3131 } },
  { name: 'Calima', department: 'Valle del Cauca', label: 'Calima (Valle del Cauca)', coords: { lat: 3.8967, lng: -76.4883 } },
  { name: 'La Unión', department: 'Valle del Cauca', label: 'La Unión (Valle del Cauca)', coords: { lat: 4.5317, lng: -76.1039 } },
  { name: 'Dagua', department: 'Valle del Cauca', label: 'Dagua (Valle del Cauca)', coords: { lat: 3.6575, lng: -76.6886 } },
  { name: 'Zarzal', department: 'Valle del Cauca', label: 'Zarzal (Valle del Cauca)', coords: { lat: 4.3986, lng: -76.0722 } },
  { name: 'Tuluá', department: 'Valle del Cauca', label: 'Tuluá (Valle del Cauca)', coords: { lat: 4.0847, lng: -76.1956 } },
  { name: 'Roldanillo', department: 'Valle del Cauca', label: 'Roldanillo (Valle del Cauca)', coords: { lat: 4.4144, lng: -76.1558 } },
  { name: 'Yumbo', department: 'Valle del Cauca', label: 'Yumbo (Valle del Cauca)', coords: { lat: 3.5819, lng: -76.4967 } },
  { name: 'Bugalagrande', department: 'Valle del Cauca', label: 'Bugalagrande (Valle del Cauca)', coords: { lat: 4.2128, lng: -76.1564 } },
  { name: 'Yotoco', department: 'Valle del Cauca', label: 'Yotoco (Valle del Cauca)', coords: { lat: 3.8647, lng: -76.3831 } },
  { name: 'Bolívar', department: 'Valle del Cauca', label: 'Bolívar (Valle del Cauca)', coords: { lat: 4.3411, lng: -76.2417 } },
  { name: 'Candelaria', department: 'Valle del Cauca', label: 'Candelaria (Valle del Cauca)', coords: { lat: 3.4078, lng: -76.3481 } },
  { name: 'Sevilla', department: 'Valle del Cauca', label: 'Sevilla (Valle del Cauca)', coords: { lat: 4.2661, lng: -75.9328 } },
  { name: 'El Dovio', department: 'Valle del Cauca', label: 'El Dovio (Valle del Cauca)', coords: { lat: 4.5089, lng: -76.2367 } },
  { name: 'Toro', department: 'Valle del Cauca', label: 'Toro (Valle del Cauca)', coords: { lat: 4.6117, lng: -76.0825 } },
  { name: 'Ansermanuevo', department: 'Valle del Cauca', label: 'Ansermanuevo (Valle del Cauca)', coords: { lat: 4.7967, lng: -75.9961 } },
  { name: 'Alcalá', department: 'Valle del Cauca', label: 'Alcalá (Valle del Cauca)', coords: { lat: 4.6747, lng: -75.7828 } },
  { name: 'La Cumbre', department: 'Valle del Cauca', label: 'La Cumbre (Valle del Cauca)', coords: { lat: 3.6486, lng: -76.5683 } },
  { name: 'Florida', department: 'Valle del Cauca', label: 'Florida (Valle del Cauca)', coords: { lat: 3.3222, lng: -76.2344 } },
  { name: 'San Pedro', department: 'Valle del Cauca', label: 'San Pedro (Valle del Cauca)', coords: { lat: 3.9964, lng: -76.2289 } },
  { name: 'Ginebra', department: 'Valle del Cauca', label: 'Ginebra (Valle del Cauca)', coords: { lat: 3.7231, lng: -76.2658 } },
  { name: 'Pradera', department: 'Valle del Cauca', label: 'Pradera (Valle del Cauca)', coords: { lat: 3.4208, lng: -76.2458 } },
  { name: 'Restrepo', department: 'Valle del Cauca', label: 'Restrepo (Valle del Cauca)', coords: { lat: 3.8236, lng: -76.5258 } },
  { name: 'Guacarí', department: 'Valle del Cauca', label: 'Guacarí (Valle del Cauca)', coords: { lat: 3.7661, lng: -76.3328 } },
  { name: 'La Victoria', department: 'Valle del Cauca', label: 'La Victoria (Valle del Cauca)', coords: { lat: 4.5261, lng: -76.0378 } },
  { name: 'Andalucía', department: 'Valle del Cauca', label: 'Andalucía (Valle del Cauca)', coords: { lat: 4.1708, lng: -76.1661 } },
  { name: 'Caicedonia', department: 'Valle del Cauca', label: 'Caicedonia (Valle del Cauca)', coords: { lat: 4.3319, lng: -75.8322 } },
  { name: 'Riofrío', department: 'Valle del Cauca', label: 'Riofrío (Valle del Cauca)', coords: { lat: 4.1567, lng: -76.2872 } },
  { name: 'Trujillo', department: 'Valle del Cauca', label: 'Trujillo (Valle del Cauca)', coords: { lat: 4.2117, lng: -76.3214 } },
  { name: 'Obando', department: 'Valle del Cauca', label: 'Obando (Valle del Cauca)', coords: { lat: 4.5808, lng: -75.9739 } },
  { name: 'Ulloa', department: 'Valle del Cauca', label: 'Ulloa (Valle del Cauca)', coords: { lat: 4.7042, lng: -75.7408 } },
  { name: 'Vijes', department: 'Valle del Cauca', label: 'Vijes (Valle del Cauca)', coords: { lat: 3.6967, lng: -76.5369 } },
  { name: 'Versalles', department: 'Valle del Cauca', label: 'Versalles (Valle del Cauca)', coords: { lat: 4.5778, lng: -76.1978 } },
  { name: 'El Águila', department: 'Valle del Cauca', label: 'El Águila (Valle del Cauca)', coords: { lat: 4.9128, lng: -76.0408 } },
];

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
  { name: 'Montería', department: 'Córdoba', label: 'Montería (Córdoba)', coords: { lat: 8.7479, lng: -75.8814 } },
  { name: 'Cereté', department: 'Córdoba', label: 'Cereté (Córdoba)', coords: { lat: 8.8847, lng: -75.7903 } },
  { name: 'San Antero', department: 'Córdoba', label: 'San Antero (Córdoba)', coords: { lat: 9.3736, lng: -75.7583 } },
  { name: 'Valencia', department: 'Córdoba', label: 'Valencia (Córdoba)', coords: { lat: 8.2611, lng: -76.1472 } },
  { name: 'Ayapel', department: 'Córdoba', label: 'Ayapel (Córdoba)', coords: { lat: 8.3139, lng: -75.1408 } },
  { name: 'Tierralta', department: 'Córdoba', label: 'Tierralta (Córdoba)', coords: { lat: 8.1722, lng: -76.0592 } },
  { name: 'Buenavista', department: 'Córdoba', label: 'Buenavista (Córdoba)', coords: { lat: 8.1561, lng: -75.4514 } },
  { name: 'Sahagún', department: 'Córdoba', label: 'Sahagún (Córdoba)', coords: { lat: 8.9469, lng: -75.4439 } },
  { name: 'San Bernardo del Viento', department: 'Córdoba', label: 'San Bernardo del Viento (Córdoba)', coords: { lat: 9.3547, lng: -75.9525 } },
  { name: 'La Apartada', department: 'Córdoba', label: 'La Apartada (Córdoba)', coords: { lat: 8.1014, lng: -75.3675 } },
  { name: 'Montelíbano', department: 'Córdoba', label: 'Montelíbano (Córdoba)', coords: { lat: 7.9808, lng: -75.4206 } },
  { name: 'Pueblo Nuevo', department: 'Córdoba', label: 'Pueblo Nuevo (Córdoba)', coords: { lat: 8.5483, lng: -75.5033 } },
  { name: 'Planeta Rica', department: 'Córdoba', label: 'Planeta Rica (Córdoba)', coords: { lat: 8.4075, lng: -75.5839 } },
  { name: 'Ciénaga de Oro', department: 'Córdoba', label: 'Ciénaga de Oro (Córdoba)', coords: { lat: 8.8786, lng: -75.6206 } },
  { name: 'Lorica', department: 'Córdoba', label: 'Lorica (Córdoba)', coords: { lat: 9.2392, lng: -75.8142 } },
  { name: 'Los Córdobas', department: 'Córdoba', label: 'Los Córdobas (Córdoba)', coords: { lat: 8.8953, lng: -76.3539 } },
  { name: 'San Carlos', department: 'Córdoba', label: 'San Carlos (Córdoba)', coords: { lat: 8.7981, lng: -75.7006 } },
  { name: 'Puerto Escondido', department: 'Córdoba', label: 'Puerto Escondido (Córdoba)', coords: { lat: 8.9867, lng: -76.2575 } },
  { name: 'Moñitos', department: 'Córdoba', label: 'Moñitos (Córdoba)', coords: { lat: 9.2475, lng: -76.1347 } },
  { name: 'San Pelayo', department: 'Córdoba', label: 'San Pelayo (Córdoba)', coords: { lat: 8.9592, lng: -75.8369 } },
  { name: 'Chinú', department: 'Córdoba', label: 'Chinú (Córdoba)', coords: { lat: 9.1069, lng: -75.3986 } },
  { name: 'Purísima de la Concepción', department: 'Córdoba', label: 'Purísima de la Concepción (Córdoba)', coords: { lat: 9.2383, lng: -75.7231 } },
  { name: 'San Andrés de Sotavento', department: 'Córdoba', label: 'San Andrés de Sotavento (Córdoba)', coords: { lat: 9.1444, lng: -75.5083 } },
  { name: 'Momil', department: 'Córdoba', label: 'Momil (Córdoba)', coords: { lat: 9.2397, lng: -75.6547 } },
  { name: 'Puerto Libertador', department: 'Córdoba', label: 'Puerto Libertador (Córdoba)', coords: { lat: 7.8864, lng: -75.6708 } },
  { name: 'Canalete', department: 'Córdoba', label: 'Canalete (Córdoba)', coords: { lat: 8.7892, lng: -76.2425 } },
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
