import os
import sys
import json
import psycopg2
from psycopg2.extras import execute_values
import pandas as pd
import numpy as np
import unicodedata

# Connection configuration
DB_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://postgres.beliwkapymtlufcytwxi:Galimatias%402020@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require"
)

EXCEL_PATH = "ANTIOQUIA.xlsx"

URABA_CANONICAL_MAP = {
    'TURBO': 'Turbo',
    'NECOCLI': 'Necoclí',
    'APARTADO': 'Apartadó',
    'CAREPA': 'Carepa',
    'CHIGORODO': 'Chigorodó',
    'SAN PEDRO DE URABA': 'San Pedro de Urabá',
    'ARBOLETES': 'Arboletes',
    'SAN JUAN DE URABA': 'San Juan de Urabá',
    'MUTATA': 'Mutatá',
    'MURINDO': 'Murindó',
    'VIGIA DEL FUERTE': 'Vigía del Fuerte'
}

def strip_accents(s):
    if not isinstance(s, str):
        return ""
    s_clean = s.replace('\ufffd', '')
    nfkd = unicodedata.normalize('NFKD', s_clean)
    return "".join([c for c in nfkd if not unicodedata.combining(c)]).strip().upper()

def sanitize_text(val, fallback=""):
    if pd.isna(val) or val is None:
        return fallback
    s = str(val).strip()
    if s == "" or s.lower() in ["nan", "none", "null"]:
        return fallback
    return s

def sanitize_num(val):
    if pd.isna(val) or val is None:
        return None
    try:
        n = float(val)
        return None if np.isnan(n) else n
    except (ValueError, TypeError):
        return None

def main():
    print("==================================================")
    print(" INGESTIÓN DE INVENTARIO A public.properties SUPABASE")
    print("==================================================")

    conn = psycopg2.connect(DB_URL)
    conn.autocommit = True
    cur = conn.cursor()

    # 1. Ingest Canonical Seed Properties
    print("\n[1/2] Procesando Predios Canónicos del Portafolio...")
    
    canonical_properties = [
        {
            "code": "DAR-SAE-001",
            "slug": "hacienda-el-reposo-1-necocli",
            "title": "Hacienda El Reposo N° 1",
            "short_description": "Extensa finca ganadera y agroforestal ubicada en zona estratégica de Necoclí.",
            "description": "Extensa finca ganadera y agroforestal ubicada en zona estratégica de Necoclí. Cuenta con topografía suavemente ondulada, fuentes hídricas permanentes y aptitud para ganadería regenerativa y cultivos de cacao o palma.",
            "opportunity_analysis": "Excelente oportunidad de inversión rural con vocación agrologística en zona de alta valorización de Necoclí.",
            "asset_type": "Finca",
            "modality": "Custodia SAE",
            "is_sae": True,
            "sae_id_activo": "528835",
            "folio_matricula": "034-937",
            "matricula_inmobiliaria": "034-937",
            "cedula_catastral": "4902002000000300009000000000",
            "legal_status": "En Proceso 100% (Custodia Territorial)",
            "department": "Antioquia",
            "municipality": "Necoclí",
            "sector_vereda": "Vereda Aguas Claras",
            "vereda": "Aguas Claras",
            "address": "Finca El Reposo N° 1, Vereda Aguas Claras",
            "land_area_ha": 90.2,
            "land_area_m2": 902000,
            "built_area_m2": 280,
            "topography": "Ondulada suave con división tradicional de potreros.",
            "water_sources": "Quebradas veredales y reservorios de agua",
            "access_roads": "Conectividad mediante carreteable veredal desde la vía principal.",
            "public_services": ["Energía eléctrica 110V/220V", "Agua de pozo artesanal", "Cobertura celular 4G LTE"],
            "current_use": "Ganadería tradicional y conservación",
            "potential_uses": ["Agropecuario", "Ganadero", "Inversión"],
            "existing_infrastructure": ["Corral ganadero", "Casa de administración 280 m2"],
            "environmental_notes": "Reserva de vegetación nativa sobre linderos.",
            "document_status": "Activo bajo inventario oficial y custodia SAE.",
            "commercial_conditions": "Arrendamiento de aprovechamiento o custodia temporal.",
            "is_demo_data": False,
            "monthly_rent_cop": 6800000,
            "sale_price_cop": 2250000000,
            "images": [
                "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop"
            ],
            "featured_image": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop",
            "latitude": 8.5562,
            "longitude": -76.7118,
            "altitude_msl": 18,
            "editorial_status": "published",
            "availability": "Disponible",
            "is_featured": True,
            "is_investment_opportunity": True
        },
        {
            "code": "DAR-SAE-002",
            "slug": "finca-betania-turbo",
            "title": "Finca Ganadera Betania",
            "short_description": "Predio rural altamente productivo con vocación pecuaria y agropecuaria en Turbo.",
            "description": "Predio rural altamente productivo con vocación pecuaria y agropecuaria. Excelente conexión vial hacia los ejes logísticos de Urabá y cercanía al puerto.",
            "opportunity_analysis": "Ubicación estratégica cercana al eje portuario de Turbo.",
            "asset_type": "Finca",
            "modality": "Custodia SAE",
            "is_sae": True,
            "sae_id_activo": "458723",
            "folio_matricula": "034-9376",
            "matricula_inmobiliaria": "034-9376",
            "cedula_catastral": "2-001-000-0001-00264-0000-00000",
            "legal_status": "En Proceso 100% (Administración Temporal)",
            "department": "Antioquia",
            "municipality": "Turbo",
            "sector_vereda": "Vereda Las Garzas",
            "vereda": "Las Garzas",
            "address": "Finca Betania, Vereda Las Garzas",
            "land_area_ha": 73.0,
            "land_area_m2": 730000,
            "built_area_m2": 195,
            "topography": "Plana con excelente drenaje natural",
            "water_sources": "Caños naturales y pozo profundo",
            "access_roads": "Vía destapada transitable con salida rápida.",
            "public_services": ["Energía monofásica", "Agua de pozo", "Cobertura celular"],
            "current_use": "Pastos ganaderos",
            "potential_uses": ["Ganadero", "Agropecuario", "Inversión"],
            "existing_infrastructure": ["Casa campesina de 195 m2", "Corrales de manejo"],
            "environmental_notes": "Drenajes naturales protegidos.",
            "document_status": "Inventariado e identificado bajo custodia SAE.",
            "commercial_conditions": "Contrato de administración temporal bajo normas SAE.",
            "is_demo_data": False,
            "monthly_rent_cop": 5500000,
            "sale_price_cop": 1820000000,
            "images": [
                "https://images.unsplash.com/photo-1500076656116-558758c991c1?q=80&w=1200&auto=format&fit=crop"
            ],
            "featured_image": "https://images.unsplash.com/photo-1500076656116-558758c991c1?q=80&w=1200&auto=format&fit=crop",
            "latitude": 8.0934,
            "longitude": -76.7289,
            "altitude_msl": 10,
            "editorial_status": "published",
            "availability": "Disponible",
            "is_featured": False,
            "is_investment_opportunity": True
        },
        {
            "code": "DAR-SAE-003",
            "slug": "hacienda-si-te-acomodas-turbo",
            "title": "Hacienda Forestal Si Te Acomodas",
            "short_description": "Gran extensión de tierra de 128.4 Ha con vocación combinada ganadera y reforestación en Turbo.",
            "description": "Gran extensión de tierra con vocación combinada ganadera y de reforestación comercial. Cuenta con banco de biomasa, corredores de sombra y linderos delimitados.",
            "opportunity_analysis": "Vocación mixta ideal para esquemas silvopastoriles y proyectos de bonos de carbono.",
            "asset_type": "Finca",
            "modality": "Custodia SAE",
            "is_sae": True,
            "sae_id_activo": "463802",
            "folio_matricula": "034-9993",
            "matricula_inmobiliaria": "034-9993",
            "cedula_catastral": "2-017-000-0033-00001-0000-00000",
            "legal_status": "En Proceso 100% (Custodia Territorial)",
            "department": "Antioquia",
            "municipality": "Turbo",
            "sector_vereda": "San José de Mulatos",
            "vereda": "San José de Mulatos",
            "address": "Hacienda Si Te Acomodas, Corregimiento San José de Mulatos",
            "land_area_ha": 128.4,
            "land_area_m2": 1284000,
            "built_area_m2": 150,
            "topography": "Colinas bajas y valles fértiles",
            "water_sources": "Nacimientos hídricos propios",
            "access_roads": "Acceso veredal de uso rural afirmado.",
            "public_services": ["Sistema solar autónomo", "Agua de nacimiento"],
            "current_use": "Reforestación y pastoreo estacional",
            "potential_uses": ["Agropecuario", "Ganadero", "Inversión"],
            "existing_infrastructure": ["Campamento de control", "Cercas perimetrales"],
            "environmental_notes": "Cobertura forestal nativa en cuencas.",
            "document_status": "Custodia técnica validada por equipo SAE.",
            "commercial_conditions": "Contrato de custodia productiva regulado.",
            "is_demo_data": False,
            "monthly_rent_cop": 8900000,
            "sale_price_cop": 3200000000,
            "images": [
                "https://images.unsplash.com/photo-1527842891421-42eec6e703ea?q=80&w=1200&auto=format&fit=crop"
            ],
            "featured_image": "https://images.unsplash.com/photo-1527842891421-42eec6e703ea?q=80&w=1200&auto=format&fit=crop",
            "latitude": 8.1812,
            "longitude": -76.5410,
            "altitude_msl": 25,
            "editorial_status": "published",
            "availability": "Disponible",
            "is_featured": False,
            "is_investment_opportunity": True
        },
        {
            "code": "DAR-SAE-004",
            "slug": "mega-hacienda-la-tanela-acandi",
            "title": "Mega Hacienda La Tanela",
            "short_description": "Inmueble de 365 Hectáreas de escala territorial estratégica en Acandí, Darién Chocoano.",
            "description": "Inmueble de escala territorial estratégica en el golfo de Urabá / Darién chocoano. Gran potencial para preservación ecológica, créditos de carbono y agroforestería.",
            "opportunity_analysis": "Activo territorial bio-diverso estratégico con acceso fluvial.",
            "asset_type": "Finca",
            "modality": "Custodia SAE",
            "is_sae": True,
            "sae_id_activo": "476832",
            "folio_matricula": "180-886",
            "matricula_inmobiliaria": "180-886",
            "cedula_catastral": "180-886-SAE-DARIEN",
            "legal_status": "En Proceso 100% (Custodia Especial)",
            "department": "Chocó",
            "municipality": "Acandí",
            "sector_vereda": "Corregimiento Santa Marta",
            "vereda": "Corregimiento Santa Marta",
            "address": "Hacienda La Tanela, Sector Río Tanela",
            "land_area_ha": 365.0,
            "land_area_m2": 3650000,
            "built_area_m2": 420,
            "topography": "Plana aluvial con lomas boscosas de reserva",
            "water_sources": "Río Tanela y afluentes navegables",
            "access_roads": "Acceso fluvial navegable por el Río Tanela.",
            "public_services": ["Generación fotovoltaica 15 kW", "Agua de río filtrada"],
            "current_use": "Reserva ambiental y ganadería extensiva de búfalos",
            "potential_uses": ["Agropecuario", "Ganadero", "Turístico", "Inversión"],
            "existing_infrastructure": ["Campamento base 420 m2", "Muelle flotante sobre río Tanela"],
            "environmental_notes": "Prioridad alta para conservación ambiental y proyectos REDD+.",
            "document_status": "Custodia especial bajo inventario centralizado SAE.",
            "commercial_conditions": "Convenio o contrato de administración temporal especial.",
            "is_demo_data": False,
            "monthly_rent_cop": 15000000,
            "sale_price_cop": 7300000000,
            "images": [
                "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop"
            ],
            "featured_image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
            "latitude": 8.5132,
            "longitude": -77.0284,
            "altitude_msl": 12,
            "editorial_status": "published",
            "availability": "Disponible",
            "is_featured": False,
            "is_investment_opportunity": True
        },
        {
            "code": "DAR-SAE-005",
            "slug": "bodega-logistica-calle-103-turbo",
            "title": "Bodega Logística Calle 103",
            "short_description": "Infraestructura comercial y de almacenamiento ubicada sobre corredor urbano-industrial en Turbo.",
            "description": "Infraestructura comercial y de almacenamiento ubicada sobre corredor urbano-industrial en Turbo. Diseñada para acopio de insumos agrícolas o maquinaria.",
            "opportunity_analysis": "Excelente oportunidad de arriendo sobre vía comercial de alto flujo en Turbo.",
            "asset_type": "Bodega",
            "modality": "Arriendo",
            "is_sae": True,
            "sae_id_activo": "481882",
            "folio_matricula": "034-2627",
            "matricula_inmobiliaria": "034-2627",
            "cedula_catastral": "8371001013000800005000000000",
            "legal_status": "Disposición Temporal / Aprovechamiento",
            "department": "Antioquia",
            "municipality": "Turbo",
            "sector_vereda": "Barrio Buenos Aires",
            "vereda": "Barrio Buenos Aires",
            "address": "Calle 103 # 13 - 57",
            "land_area_m2": 450.0,
            "land_area_ha": 0.045,
            "built_area_m2": 607.0,
            "topography": "Lote industrial nivelado",
            "water_sources": "Acueducto y energía trifásica comercial",
            "access_roads": "Acceso sobre vía urbana pavimentada apta para tractocamiones.",
            "public_services": ["Energía Trifásica de 45 kVA", "Acueducto municipal", "Internet fibra óptica"],
            "current_use": "Bodega comercial desocupada",
            "potential_uses": ["Industrial", "Logístico", "Comercial"],
            "existing_infrastructure": ["Portón de acceso vehicular 5m", "Mezanina de oficinas"],
            "environmental_notes": "Licencia comercial y de almacenamiento sin restricción.",
            "document_status": "Disposición temporal aprobada por SAE.",
            "commercial_conditions": "Contrato de arrendamiento institucional directo.",
            "is_demo_data": False,
            "monthly_rent_cop": 4200000,
            "sale_price_cop": 850000000,
            "images": [
                "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop"
            ],
            "featured_image": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop",
            "latitude": 8.0967,
            "longitude": -76.7245,
            "altitude_msl": 5,
            "editorial_status": "published",
            "availability": "Disponible",
            "is_featured": False,
            "is_investment_opportunity": True
        },
        {
            "code": "DAR-BAN-006",
            "slug": "finca-bananera-la-palma-apartado",
            "title": "Finca Agroindustrial Bananera \"La Palma\"",
            "short_description": "Finca bananera en plena producción de 85 Ha con empacadora tecnificada en Apartadó.",
            "description": "Propiedad agrícola de alto rendimiento productivo con 82 hectáreas sembradas en variedad Cavendish.",
            "opportunity_analysis": "Activo con rentabilidad demostrable.",
            "asset_type": "Finca",
            "modality": "Venta",
            "sale_price_cop": 8500000000,
            "land_area_ha": 85,
            "land_area_m2": 850000,
            "built_area_m2": 1200,
            "department": "Antioquia",
            "municipality": "Apartadó",
            "sector_vereda": "Vereda Churidó",
            "latitude": 7.8421,
            "longitude": -76.6812,
            "altitude_msl": 25,
            "matricula_inmobiliaria": "034-55102",
            "cedula_catastral": "0504500000020087000",
            "topography": "Plana con drenajes profundos.",
            "access_roads": "Vía afirmada de uso agrícola.",
            "water_sources": "Río Churidó y pozo profundo.",
            "public_services": ["Energía Trifásica", "Agua potable"],
            "current_use": "Explotación agroindustrial bananera.",
            "potential_uses": ["Agropecuario", "Industrial"],
            "existing_infrastructure": ["Empacadora tecnificada", "Cable vía"],
            "legal_status": "Saneado",
            "editorial_status": "published",
            "availability": "Disponible",
            "is_featured": True,
            "is_investment_opportunity": True,
            "images": ["https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80"],
            "featured_image": "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80"
        },
        {
            "code": "DAR-LOC-007",
            "slug": "local-comercial-plaza-darien-carepa",
            "title": "Local Comercial de Esquina \"Plaza Darién\"",
            "short_description": "Local comercial en estratégica esquina de alto flujo peatonal y vehicular en Carepa.",
            "description": "Magnífica unidad comercial de 320 m2 distribuidos en planta libre en primer nivel con vitrina acristalada.",
            "opportunity_analysis": "Inmueble con altísima demanda de arrendamiento corporativo.",
            "asset_type": "Local",
            "modality": "Arriendo",
            "monthly_rent_cop": 12500000,
            "sale_price_cop": 1650000000,
            "land_area_m2": 320,
            "land_area_ha": 0.032,
            "built_area_m2": 320,
            "department": "Antioquia",
            "municipality": "Carepa",
            "sector_vereda": "Centro Calle Principal",
            "latitude": 7.7551,
            "longitude": -76.6542,
            "altitude_msl": 28,
            "matricula_inmobiliaria": "034-88301",
            "cedula_catastral": "0514701000010022000",
            "topography": "Plana urbana",
            "access_roads": "Sobre calle peatonal y comercial.",
            "public_services": ["Energía eléctrica 220V", "Acueducto y Alcantarillado"],
            "current_use": "Desocupado listo para adecuación.",
            "potential_uses": ["Comercial"],
            "existing_infrastructure": ["Persianas metálicas automatizadas"],
            "legal_status": "Saneado",
            "editorial_status": "published",
            "availability": "Disponible",
            "is_featured": False,
            "is_investment_opportunity": False,
            "images": ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80"],
            "featured_image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80"
        },
        {
            "code": "DAR-TER-008",
            "slug": "terreno-multimodal-ruta-del-mar-chigorodo",
            "title": "Terreno Multimodal \"Ruta del Mar\" en Chigorodó",
            "short_description": "Lote de 15 Hectáreas ideal para desarrollo agrologístico sobre el corredor arterial de Chigorodó.",
            "description": "Estratégica franja de tierra con topografía 100% plana ubicada a la entrada norte del municipio de Chigorodó.",
            "opportunity_analysis": "Sector en alta valorización.",
            "asset_type": "Terreno",
            "modality": "Venta",
            "sale_price_cop": 3300000000,
            "land_area_ha": 15,
            "land_area_m2": 150000,
            "built_area_m2": 0,
            "department": "Antioquia",
            "municipality": "Chigorodó",
            "sector_vereda": "Sector El Guaimaro",
            "latitude": 7.6691,
            "longitude": -76.6805,
            "altitude_msl": 34,
            "matricula_inmobiliaria": "034-33921",
            "cedula_catastral": "0517200000010056000",
            "topography": "Plana con excelente drenaje.",
            "access_roads": "Acceso directo por vía pavimentada.",
            "public_services": ["Disponibilidad de servicios urbanos"],
            "current_use": "Pastoreo extensivo.",
            "potential_uses": ["Logístico", "Industrial"],
            "existing_infrastructure": ["Cercado en alambre de púas"],
            "legal_status": "En estudio jurídico",
            "editorial_status": "published",
            "availability": "Disponible",
            "is_featured": False,
            "is_investment_opportunity": True,
            "images": ["https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=1200&q=80"],
            "featured_image": "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=1200&q=80"
        },
        {
            "code": "DAR-CAS-009",
            "slug": "casa-campestre-villa-esmeralda-mutata",
            "title": "Casa Campestre Residencial \"Villa Esmeralda\"",
            "short_description": "Espectacular propiedad de recreo de 3.500 m2 de lote en Mutatá.",
            "description": "Hermosa residencia campestre construida con finos acabados en teca y piedra natural.",
            "opportunity_analysis": "Ideal para residencia permanente o alquiler vacacional.",
            "asset_type": "Casa",
            "modality": "Venta",
            "sale_price_cop": 980000000,
            "land_area_m2": 3500,
            "land_area_ha": 0.35,
            "built_area_m2": 380,
            "department": "Antioquia",
            "municipality": "Mutatá",
            "sector_vereda": "Sector Parcelación La Selva",
            "latitude": 7.2421,
            "longitude": -76.4351,
            "altitude_msl": 180,
            "matricula_inmobiliaria": "034-22019",
            "cedula_catastral": "0548001000020011000",
            "topography": "Suave colina con vista panorámica.",
            "access_roads": "Vía interna pavimentada.",
            "public_services": ["Energía EPM", "Acueducto veredal"],
            "current_use": "Residencia campestre.",
            "potential_uses": ["Residencial", "Turístico"],
            "existing_infrastructure": ["Piscina de 50 m2", "Kiosco BBQ"],
            "legal_status": "Saneado",
            "editorial_status": "published",
            "availability": "Disponible",
            "is_featured": True,
            "is_investment_opportunity": False,
            "images": ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"],
            "featured_image": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
        },
        {
            "code": "DAR-EDI-010",
            "slug": "edificio-corporativo-torre-darien-apartado",
            "title": "Edificio Corporativo de Oficinas \"Torre Darién\"",
            "short_description": "Inmueble comercial corporativo de 4 pisos y 1.200 m2 construidos en Apartadó.",
            "description": "Moderna estructura corporativa acondicionada para sedes de aseguradoras o entidades financieras.",
            "opportunity_analysis": "Renta patrimonial estabilizada.",
            "asset_type": "Edificio",
            "modality": "Venta",
            "sale_price_cop": 7900000000,
            "monthly_rent_cop": 68000000,
            "land_area_m2": 500,
            "land_area_ha": 0.05,
            "built_area_m2": 1200,
            "department": "Antioquia",
            "municipality": "Apartadó",
            "sector_vereda": "Barrio Ortiz - Zona Comercial",
            "latitude": 7.8856,
            "longitude": -76.6292,
            "altitude_msl": 30,
            "matricula_inmobiliaria": "034-99104",
            "cedula_catastral": "0504501000010099000",
            "topography": "Plana urbana",
            "access_roads": "Sobre avenida principal.",
            "public_services": ["Energía Trifásica", "Acueducto y Alcantarillado"],
            "current_use": "Oficinas corporativas.",
            "potential_uses": ["Comercial", "Oficina"],
            "existing_infrastructure": ["Ascensor Mitsubishi", "Planta eléctrica 100 kW"],
            "legal_status": "Saneado",
            "editorial_status": "published",
            "availability": "Disponible",
            "is_featured": True,
            "is_investment_opportunity": True,
            "images": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"],
            "featured_image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
        }
    ]

    for prop in canonical_properties:
        sql = """
            INSERT INTO public.properties (
                code, slug, title, short_description, description, opportunity_analysis,
                asset_type, modality, is_sae, sae_id_activo, folio_matricula,
                sale_price_cop, monthly_rent_cop, estimated_value_cop,
                land_area_m2, land_area_ha, built_area_m2,
                department, municipality, sector_vereda, vereda, address,
                latitude, longitude, is_confidential_coords, altitude_msl,
                matricula_inmobiliaria, cedula_catastral, topography, access_roads,
                water_sources, public_services, current_use, potential_uses,
                existing_infrastructure, environmental_notes, legal_status, document_status,
                commercial_conditions, editorial_status, is_demo_data, images,
                featured_image, availability, is_featured, is_investment_opportunity, updated_at
            ) VALUES (
                %(code)s, %(slug)s, %(title)s, %(short_description)s, %(description)s, %(opportunity_analysis)s,
                %(asset_type)s, %(modality)s, %(is_sae)s, %(sae_id_activo)s, %(folio_matricula)s,
                %(sale_price_cop)s, %(monthly_rent_cop)s, %(estimated_value_cop)s,
                %(land_area_m2)s, %(land_area_ha)s, %(built_area_m2)s,
                %(department)s, %(municipality)s, %(sector_vereda)s, %(vereda)s, %(address)s,
                %(latitude)s, %(longitude)s, %(is_confidential_coords)s, %(altitude_msl)s,
                %(matricula_inmobiliaria)s, %(cedula_catastral)s, %(topography)s, %(access_roads)s,
                %(water_sources)s, %(public_services)s, %(current_use)s, %(potential_uses)s,
                %(existing_infrastructure)s, %(environmental_notes)s, %(legal_status)s, %(document_status)s,
                %(commercial_conditions)s, %(editorial_status)s, %(is_demo_data)s, %(images)s,
                %(featured_image)s, %(availability)s, %(is_featured)s, %(is_investment_opportunity)s, NOW()
            )
            ON CONFLICT (code) DO UPDATE SET
                slug = EXCLUDED.slug,
                title = EXCLUDED.title,
                short_description = EXCLUDED.short_description,
                description = EXCLUDED.description,
                opportunity_analysis = EXCLUDED.opportunity_analysis,
                asset_type = EXCLUDED.asset_type,
                modality = EXCLUDED.modality,
                is_sae = EXCLUDED.is_sae,
                sae_id_activo = EXCLUDED.sae_id_activo,
                folio_matricula = EXCLUDED.folio_matricula,
                sale_price_cop = EXCLUDED.sale_price_cop,
                monthly_rent_cop = EXCLUDED.monthly_rent_cop,
                estimated_value_cop = EXCLUDED.estimated_value_cop,
                land_area_m2 = EXCLUDED.land_area_m2,
                land_area_ha = EXCLUDED.land_area_ha,
                built_area_m2 = EXCLUDED.built_area_m2,
                department = EXCLUDED.department,
                municipality = EXCLUDED.municipality,
                sector_vereda = EXCLUDED.sector_vereda,
                vereda = EXCLUDED.vereda,
                address = EXCLUDED.address,
                latitude = EXCLUDED.latitude,
                longitude = EXCLUDED.longitude,
                is_confidential_coords = EXCLUDED.is_confidential_coords,
                altitude_msl = EXCLUDED.altitude_msl,
                matricula_inmobiliaria = EXCLUDED.matricula_inmobiliaria,
                cedula_catastral = EXCLUDED.cedula_catastral,
                topography = EXCLUDED.topography,
                access_roads = EXCLUDED.access_roads,
                water_sources = EXCLUDED.water_sources,
                public_services = EXCLUDED.public_services,
                current_use = EXCLUDED.current_use,
                potential_uses = EXCLUDED.potential_uses,
                existing_infrastructure = EXCLUDED.existing_infrastructure,
                environmental_notes = EXCLUDED.environmental_notes,
                legal_status = EXCLUDED.legal_status,
                document_status = EXCLUDED.document_status,
                commercial_conditions = EXCLUDED.commercial_conditions,
                editorial_status = EXCLUDED.editorial_status,
                is_demo_data = EXCLUDED.is_demo_data,
                images = EXCLUDED.images,
                featured_image = EXCLUDED.featured_image,
                availability = EXCLUDED.availability,
                is_featured = EXCLUDED.is_featured,
                is_investment_opportunity = EXCLUDED.is_investment_opportunity,
                updated_at = NOW();
        """
        params = {
            "code": prop["code"],
            "slug": prop["slug"],
            "title": prop["title"],
            "short_description": prop.get("short_description", ""),
            "description": prop.get("description", ""),
            "opportunity_analysis": prop.get("opportunity_analysis", ""),
            "asset_type": prop["asset_type"],
            "modality": prop["modality"],
            "is_sae": prop.get("is_sae", False),
            "sae_id_activo": prop.get("sae_id_activo"),
            "folio_matricula": prop.get("folio_matricula"),
            "sale_price_cop": prop.get("sale_price_cop"),
            "monthly_rent_cop": prop.get("monthly_rent_cop"),
            "estimated_value_cop": prop.get("estimated_value_cop"),
            "land_area_m2": prop.get("land_area_m2"),
            "land_area_ha": prop.get("land_area_ha"),
            "built_area_m2": prop.get("built_area_m2"),
            "department": prop.get("department", "Antioquia"),
            "municipality": prop.get("municipality", "Turbo"),
            "sector_vereda": prop.get("sector_vereda"),
            "vereda": prop.get("vereda"),
            "address": prop.get("address"),
            "latitude": prop.get("latitude", 8.5),
            "longitude": prop.get("longitude", -76.7),
            "is_confidential_coords": prop.get("is_confidential_coords", False),
            "altitude_msl": prop.get("altitude_msl"),
            "matricula_inmobiliaria": prop.get("matricula_inmobiliaria", ""),
            "cedula_catastral": prop.get("cedula_catastral", ""),
            "topography": prop.get("topography", ""),
            "access_roads": prop.get("access_roads", ""),
            "water_sources": prop.get("water_sources", ""),
            "public_services": prop.get("public_services", []),
            "current_use": prop.get("current_use", ""),
            "potential_uses": prop.get("potential_uses", []),
            "existing_infrastructure": prop.get("existing_infrastructure", []),
            "environmental_notes": prop.get("environmental_notes", ""),
            "legal_status": prop.get("legal_status", "Saneado"),
            "document_status": prop.get("document_status", ""),
            "commercial_conditions": prop.get("commercial_conditions", ""),
            "editorial_status": "published",
            "is_demo_data": prop.get("is_demo_data", False),
            "images": prop.get("images", []),
            "featured_image": prop.get("featured_image", ""),
            "availability": "Disponible",
            "is_featured": prop.get("is_featured", False),
            "is_investment_opportunity": prop.get("is_investment_opportunity", False)
        }
        cur.execute(sql, params)
        print(f"  -> Upserted Canónico: {prop['code']} - {prop['title']}")

    # 2. Ingest Excel Inventory from ANTIOQUIA.xlsx
    if os.path.exists(EXCEL_PATH):
        print(f"\n[2/2] Leyendo e Ingestando Inventario desde {EXCEL_PATH}...")
        df_raw = pd.read_excel(EXCEL_PATH, engine="calamine")
        print(f" -> Filas totales leídas: {len(df_raw)}")
        
        df_raw['DEPARTAMENTO_NORM'] = df_raw['DEPARTAMENTO'].apply(strip_accents)
        df_raw['MUNICIPIO_NORM'] = df_raw['MUNICIPIO'].apply(strip_accents)

        target_muni_keys = set(URABA_CANONICAL_MAP.keys())
        filtered_df = df_raw[
            (df_raw['DEPARTAMENTO_NORM'] == 'ANTIOQUIA') & 
            (df_raw['MUNICIPIO_NORM'].isin(target_muni_keys))
        ].copy()

        filtered_df['IDACTIVO'] = filtered_df['IDACTIVO'].astype(str).str.strip()
        dedup_df = filtered_df.drop_duplicates(subset=['IDACTIVO']).copy()
        print(f" -> Filas de Urabá procesadas: {len(dedup_df)}")

        batch_params = []
        for _, row in dedup_df.iterrows():
            id_act = str(row['IDACTIVO']).strip()
            code = f"DAR-EXCEL-{id_act}"
            slug = f"predio-excel-{id_act.lower()}"
            
            muni_norm = strip_accents(row['MUNICIPIO'])
            muni_canonical = URABA_CANONICAL_MAP.get(muni_norm, str(row['MUNICIPIO']).strip().title())
            dept_canonical = 'Antioquia'

            dir_val = sanitize_text(row.get('DIRECCIÓN'))
            desc_val = sanitize_text(row.get('DESCRIPCION'))
            raw_title = dir_val if dir_val else (desc_val if desc_val else f"Predio {id_act} - {muni_canonical}")
            title = sanitize_text(raw_title, f"Predio {id_act}")[:255]

            asset_type_raw = sanitize_text(row.get('CLASIFICACIÓN ACTIVO'), "Finca")
            asset_type = asset_type_raw if asset_type_raw in ["Finca", "Lote", "Terreno", "Bodega", "Edificio", "Local", "Casa"] else "Finca"

            area_m2 = sanitize_num(row.get('AREA TERRENO'))
            area_ha = area_m2 / 10000.0 if area_m2 else None
            val_com = sanitize_num(row.get('AVALUO COMERCIAL'))

            cadastral_id = sanitize_text(row.get('CÉDULA CATASTRAL'), "")
            registry_folio = sanitize_text(row.get('FOLIO DE MATRÍCULA'), "")
            legal_status = sanitize_text(row.get('ESTADO LEGAL'), "Saneado")

            lat = 8.0 + (len(batch_params) * 0.001)
            lng = -76.7 - (len(batch_params) * 0.001)

            batch_params.append((
                code, slug, title, desc_val[:200] if desc_val else f"Predio inventario SAE {id_act}",
                desc_val if desc_val else f"Predio en {muni_canonical} bajo inventario.",
                asset_type, "Custodia SAE", True, id_act, registry_folio,
                val_com, val_com, area_m2, area_ha,
                dept_canonical, muni_canonical, dir_val if dir_val else f"Vereda / Sector {muni_canonical}",
                lat, lng, registry_folio, cadastral_id, legal_status,
                'published', 'Disponible', False, False
            ))

        insert_sql = """
            INSERT INTO public.properties (
                code, slug, title, short_description, description,
                asset_type, modality, is_sae, sae_id_activo, folio_matricula,
                sale_price_cop, estimated_value_cop, land_area_m2, land_area_ha,
                department, municipality, address, latitude, longitude,
                matricula_inmobiliaria, cedula_catastral, legal_status,
                editorial_status, availability, is_featured, is_investment_opportunity, updated_at
            ) VALUES %s
            ON CONFLICT (code) DO UPDATE SET
                title = EXCLUDED.title,
                sale_price_cop = EXCLUDED.sale_price_cop,
                land_area_m2 = EXCLUDED.land_area_m2,
                land_area_ha = EXCLUDED.land_area_ha,
                editorial_status = 'published',
                availability = 'Disponible',
                updated_at = NOW();
        """
        template = "(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())"
        execute_values(cur, insert_sql, batch_params, template=template)
        print(f" -> Se procesaron e insertaron en lote {len(batch_params)} filas desde Excel.", flush=True)
    else:
        print(f" -> No se encontró {EXCEL_PATH}, continuando solo con canónicos.", flush=True)

    # Final Verification Query
    cur.execute("SELECT COUNT(*) FROM public.properties;")
    total = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM public.properties WHERE editorial_status = 'published' AND availability <> 'Archivado';")
    public_visible = cur.fetchone()[0]

    print("\n==================================================")
    print(" INGESTIÓN Y VERIFICACIÓN DE BASE DE DATOS FINAL")
    print(f" Total registros en public.properties: {total}")
    print(f" Total visibles públicamente (published & !Archivado): {public_visible}")
    print("==================================================")

    conn.close()

if __name__ == "__main__":
    main()
