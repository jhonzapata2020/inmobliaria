import os
import sys
import json
import psycopg2
from psycopg2.extras import execute_values
import pandas as pd
import numpy as np
import unicodedata
import datetime

# Connection configuration
DB_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://postgres.beliwkapymtlufcytwxi:Galimatias%402020@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require"
)

EXCEL_PATH = "ANTIOQUIA.xlsx"

# Strategic Whitelist Map: (Normalized Key) -> (Canonical Municipality, Department)
STRATEGIC_WHITELIST_MAP = {
    # Antioquia Strategic Municipalities
    'TURBO': ('Turbo', 'Antioquia'),
    'NECOCLI': ('Necoclí', 'Antioquia'),
    'APARTADO': ('Apartadó', 'Antioquia'),
    'CAREPA': ('Carepa', 'Antioquia'),
    'CHIGORODO': ('Chigorodó', 'Antioquia'),
    'ARBOLETES': ('Arboletes', 'Antioquia'),
    'MUTATA': ('Mutatá', 'Antioquia'),
    'SAN PEDRO DE URABA': ('San Pedro de Urabá', 'Antioquia'),
    'SAN JUAN DE URABA': ('San Juan de Urabá', 'Antioquia'),
    
    # Córdoba Strategic Municipalities
    'LOS CORDOBAS': ('Los Córdobas', 'Córdoba'),

    # Chocó Strategic Municipalities
    'ACANDI': ('Acandí', 'Chocó'),
    'UNGUIA': ('Unguía', 'Chocó'),
    'UNGUA': ('Unguía', 'Chocó'),
    'RIOSUCIO': ('Riosucio', 'Chocó'),
    'BAHIA SOLANO': ('Bahía Solano', 'Chocó'),
    'JURADO': ('Juradó', 'Chocó')
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
        return None if (np.isnan(n) or n <= 0) else n
    except (ValueError, TypeError):
        return None

def parse_date(val):
    if pd.isna(val) or val is None:
        return None
    if isinstance(val, (datetime.datetime, datetime.date)):
        return val.strftime('%Y-%m-%d')
    try:
        dt = pd.to_datetime(val)
        if pd.isna(dt):
            return None
        return dt.strftime('%Y-%m-%d')
    except Exception:
        return None

def find_col(df, keyword):
    for c in df.columns:
        if keyword.upper() in strip_accents(c):
            return c
    return None

def normalize_asset_type(raw_type, dir_val="", desc_val=""):
    raw_upper = strip_accents(str(raw_type))
    dir_upper = strip_accents(str(dir_val))
    desc_upper = strip_accents(str(desc_val))
    combined = f"{raw_upper} {dir_upper} {desc_upper}"

    # Priority 1: Check raw classification column
    if "APARTAMENTO" in raw_upper:
        return "Apartamento"
    if "BODEGA" in raw_upper or "GALPON" in raw_upper or "NAVE" in raw_upper:
        return "Bodega"
    if "LOCAL" in raw_upper or "CENTRO COMERCIAL" in raw_upper or "TERMINAL" in raw_upper:
        return "Local"
    if "EDIFICIO" in raw_upper or "EDIFICACION PARA HOTEL" in raw_upper or "HOTEL" in raw_upper:
        return "Edificio"
    if "OFICINA" in raw_upper:
        return "Oficina"
    if "CASA" in raw_upper or "VIVIENDA" in raw_upper or "HABITACION" in raw_upper or "CASA LOTE" in raw_upper or "CASA RECREO" in raw_upper:
        return "Casa"
    if "LOTE" in raw_upper or "TERRENO" in raw_upper or "LOTE CON CONSTRUCCION" in raw_upper or "TERRAZA" in raw_upper or "GARAJE" in raw_upper:
        return "Lote"
    if "FINCA" in raw_upper or "HACIENDA" in raw_upper or "PARCELA" in raw_upper or "PREDIO RURAL" in raw_upper or "MEJORAS AGRICOLAS" in raw_upper:
        return "Finca"

    # Priority 2: Keyword search in Combined Text
    if any(k in combined for k in ["LOCAL", "MALL", "COMERCIAL"]):
        return "Local"
    if any(k in combined for k in ["BODEGA", "ALMACEN"]):
        return "Bodega"
    if any(k in combined for k in ["APARTAMENTO", "APTO", "PH"]):
        return "Apartamento"
    if any(k in combined for k in ["CASA", "VIVIENDA", "CS "]):
        return "Casa"
    if any(k in combined for k in ["LOTE", "TERRENO", "LT "]):
        return "Lote"
    if any(k in combined for k in ["FINCA", "FCA", "HACIENDA", "AGRO", "PREDIO RURAL"]):
        return "Finca"
    if any(k in combined for k in ["EDIFICIO", "ED "]):
        return "Edificio"

    return "Finca"

def format_title(asset_type, dir_val, desc_val, id_act, muni_name):
    is_urban = asset_type in ["Casa", "Apartamento", "Local", "Bodega", "Edificio", "Oficina", "Lote"]
    
    clean_dir = sanitize_text(dir_val)
    clean_desc = sanitize_text(desc_val)

    if is_urban and clean_dir:
        if clean_dir.upper().startswith(asset_type.upper()):
            return clean_dir[:255]
        return f"{asset_type} - {clean_dir}"[:255]
    
    if clean_desc and len(clean_desc) > 3 and not clean_desc.lower().startswith("nan"):
        return clean_desc[:255]

    if clean_dir:
        return f"{asset_type} - {clean_dir}"[:255]

    return f"{asset_type} Predio {id_act} - {muni_name}"[:255]

def main():
    print("==================================================")
    print(" INGESTIÓN Y ACTUALIZACIÓN FINANCIERA EN public.properties")
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
            "commercial_appraisal_cop": 2250000000,
            "monthly_rent_estimate_cop": 6800000,
            "occupancy_status": "Desocupado",
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
            "commercial_appraisal_cop": 1820000000,
            "monthly_rent_estimate_cop": 5500000,
            "occupancy_status": "Desocupado",
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
            "commercial_appraisal_cop": 3200000000,
            "monthly_rent_estimate_cop": 8900000,
            "occupancy_status": "Ocupado",
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
            "commercial_appraisal_cop": 7300000000,
            "monthly_rent_estimate_cop": 15000000,
            "occupancy_status": "Desocupado",
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
            "title": "Bodega Logística - Calle 103 # 13 - 57",
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
            "commercial_appraisal_cop": 850000000,
            "monthly_rent_estimate_cop": 4200000,
            "occupancy_status": "Desocupado",
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
            "code": "DAR-COR-011",
            "slug": "lote-comercial-eds-troncal-ruta-74-los-cordobas",
            "title": "Lote Comercial & EDS - Troncal Ruta 74",
            "short_description": "Lote plano de 2 Ha sobre la Ruta Nacional 74. Ideal para Estación de Servicio (EDS), parador logístico de transporte pesado o centro de acopio.",
            "description": "Excelente lote comercial de 2 Hectáreas (20.000 m2) ubicado sobre el corredor vial de la Ruta Nacional 74 en Los Córdobas, Córdoba. Topografía 100% plana a ras de calzada, con frente amplio sobre la vía pavimentada. Ideal para desarrollos logísticos, estaciones de servicio (EDS), estaciones de descanso o centros de distribución agroindustrial.",
            "opportunity_analysis": "Frente a carretera troncal pavimentada de alto tráfico vehicular entre Urabá y Córdoba. Topografía plana a ras de calzada con visual despejada.",
            "asset_type": "Lote",
            "modality": "Venta",
            "sale_price_cop": 500000000,
            "estimated_value_cop": 500000000,
            "commercial_appraisal_cop": 500000000,
            "land_area_ha": 2.0,
            "land_area_m2": 20000,
            "built_area_m2": 0,
            "department": "Córdoba",
            "municipality": "Los Córdobas",
            "sector_vereda": "Sector Tienda La Victoria / Proveedora La 3",
            "address": "Sector Tienda La Victoria / Proveedora La 3, Ruta Nacional 74",
            "latitude": 8.886922,
            "longitude": -76.391691,
            "legal_status": "Saneado 100%",
            "editorial_status": "published",
            "availability": "Disponible",
            "is_featured": True,
            "is_investment_opportunity": True,
            "topography": "Plana 100% a ras de calzada",
            "access_roads": "Acceso directo sobre vía troncal pavimentada.",
            "public_services": ["Energía eléctrica", "Cobertura celular 4G"],
            "images": [
                "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop"
            ],
            "featured_image": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop"
        },
        {
            "code": "DAR-SJU-012",
            "slug": "lote-costero-comercial-playa-ruta-90-san-juan-uraba",
            "title": "Lote Costero & Comercial con Playa - Ruta 90",
            "short_description": "Predio mixto de 4 Ha con 100 m sobre Ruta 90 y 100 m lineales de orilla de playa natural sobre el Mar Caribe.",
            "description": "Ubicación privilegiada de 4 Hectáreas (40.000 m2) en San Juan de Urabá con doble vocación: frente de 100 metros sobre la Ruta Nacional 90 y salida directa de 100 metros a orilla de playa en el Mar Caribe. Configuración excepcional para proyecto ecoturístico, parador comercial de servicio o inversión patrimonial de alta valorización.",
            "opportunity_analysis": "Potencial dual: frente vial apto para Estación de Servicio o parador comercial 24h, y zona posterior costera apta para complejo ecoturístico o cabañas.",
            "asset_type": "Lote",
            "modality": "Venta",
            "sale_price_cop": 1000000000,
            "estimated_value_cop": 1000000000,
            "commercial_appraisal_cop": 1000000000,
            "land_area_ha": 4.0,
            "land_area_m2": 40000,
            "built_area_m2": 0,
            "department": "Antioquia",
            "municipality": "San Juan de Urabá",
            "sector_vereda": "Vereda Montebello / El Hoyito",
            "address": "Vereda Montebello / El Hoyito, Ruta Nacional 90",
            "latitude": 8.804340,
            "longitude": -76.500693,
            "legal_status": "Saneado 100%",
            "editorial_status": "published",
            "availability": "Disponible",
            "is_featured": True,
            "is_investment_opportunity": True,
            "topography": "Plana con suave declive costero",
            "access_roads": "Frente principal sobre Ruta Nacional 90.",
            "public_services": ["Energía eléctrica", "Cobertura celular 4G"],
            "images": [
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop"
            ],
            "featured_image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop"
        }
    ]

    for prop in canonical_properties:
        sql = """
            INSERT INTO public.properties (
                code, slug, title, short_description, description, opportunity_analysis,
                asset_type, modality, is_sae, sae_id_activo, folio_matricula,
                sale_price_cop, monthly_rent_cop, estimated_value_cop,
                commercial_appraisal_cop, monthly_rent_estimate_cop, occupancy_status,
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
                %(commercial_appraisal_cop)s, %(monthly_rent_estimate_cop)s, %(occupancy_status)s,
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
                commercial_appraisal_cop = EXCLUDED.commercial_appraisal_cop,
                monthly_rent_estimate_cop = EXCLUDED.monthly_rent_estimate_cop,
                occupancy_status = EXCLUDED.occupancy_status,
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
            "commercial_appraisal_cop": prop.get("commercial_appraisal_cop"),
            "monthly_rent_estimate_cop": prop.get("monthly_rent_estimate_cop"),
            "occupancy_status": prop.get("occupancy_status"),
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
        print(f" -> Filas totales leídas en Excel: {len(df_raw)}")
        
        # Locate exact column headers dynamically
        muni_col = find_col(df_raw, 'MUNICIPIO')
        dept_col = find_col(df_raw, 'DEPARTAMENTO')
        id_col = find_col(df_raw, 'IDACTIVO')
        class_col = find_col(df_raw, 'CLASIFICACION ACTIVO')
        dir_col = find_col(df_raw, 'DIRECCION')
        desc_col = find_col(df_raw, 'DESCRIPCION')
        vereda_col = find_col(df_raw, 'VEREDA')
        folio_col = find_col(df_raw, 'FOLIO DE MATRICULA')
        catastral_id_col = find_col(df_raw, 'CEDULA CATASTRAL')
        catastral_val_col = find_col(df_raw, 'AVALUO CATASTRAL')
        legal_col = find_col(df_raw, 'ESTADO LEGAL')
        area_m2_col = find_col(df_raw, 'AREA TERRENO')
        built_m2_col = find_col(df_raw, 'AREA CONSTRUIDA')
        
        # Financial & Operational Columns
        avaluo_col = find_col(df_raw, 'AVALUO COMERCIAL')
        renta_col = find_col(df_raw, 'ESTIMATIVO DE RENTA')
        ocupacion_col = find_col(df_raw, 'ESTADO DE OCUPACION')
        venta_col = find_col(df_raw, 'VENTA ALISTAMIENTO JURIDICO')
        visita_col = find_col(df_raw, 'FECHA ULTIMA VISITA')

        df_raw['MUNI_NORM'] = df_raw[muni_col].apply(strip_accents)

        # Filter by strategic whitelist
        filtered_df = df_raw[df_raw['MUNI_NORM'].isin(STRATEGIC_WHITELIST_MAP.keys())].copy()
        filtered_df[id_col] = filtered_df[id_col].astype(str).str.strip()
        dedup_df = filtered_df.drop_duplicates(subset=[id_col]).copy()
        print(f" -> Predios de Municipios Estratégicos (deduplicados): {len(dedup_df)}")

        batch_params = []
        for idx_count, (_, row) in enumerate(dedup_df.iterrows()):
            id_act = str(row[id_col]).strip()
            code = f"DAR-EXCEL-{id_act}"
            slug = f"predio-excel-{id_act.lower()}"
            
            muni_norm = strip_accents(row[muni_col])
            muni_canonical, dept_canonical = STRATEGIC_WHITELIST_MAP.get(muni_norm, (str(row[muni_col]).strip().title(), 'Antioquia'))

            dir_val = sanitize_text(row.get(dir_col))
            desc_val = sanitize_text(row.get(desc_col))
            vereda_val = sanitize_text(row.get(vereda_col))
            asset_type_raw = row.get(class_col)

            asset_type = normalize_asset_type(asset_type_raw, dir_val, desc_val)

            # Urban title composition logic:
            title = format_title(asset_type, dir_val, desc_val, id_act, muni_canonical)

            area_m2 = sanitize_num(row.get(area_m2_col))
            area_ha = area_m2 / 10000.0 if area_m2 else None
            built_m2 = sanitize_num(row.get(built_m2_col))

            avaluo_com = sanitize_num(row.get(avaluo_col))
            avaluo_cat = sanitize_num(row.get(catastral_val_col)) if catastral_val_col else None
            renta_est = sanitize_num(row.get(renta_col))
            occupancy_status = sanitize_text(row.get(ocupacion_col), "Desocupado")
            last_visit = parse_date(row.get(visita_col))

            venta_raw = strip_accents(str(row.get(venta_col)))

            # Financial Assignment Logic (Market Reference Policy)
            sale_price_cop = None
            monthly_rent_cop = None
            estimated_value_cop = None
            modality = "Custodia SAE"

            if avaluo_com and avaluo_com > 0:
                sale_price_cop = avaluo_com
                estimated_value_cop = avaluo_com
                if renta_est and renta_est > 0:
                    monthly_rent_cop = renta_est
                modality = "Venta"
            elif renta_est and renta_est > 0:
                monthly_rent_cop = renta_est
                estimated_value_cop = round(renta_est / 0.006, -6)
                if "NO" in venta_raw:
                    modality = "Arriendo"
                else:
                    modality = "Venta"
                    sale_price_cop = estimated_value_cop
            elif avaluo_cat and avaluo_cat > 0:
                estimated_value_cop = round(avaluo_cat * 1.8, -6)
                sale_price_cop = estimated_value_cop
                modality = "Venta"
            elif area_ha and area_ha >= 1.0:
                # Rural property with 1+ Hectares: $45M COP / Ha market reference
                estimated_value_cop = round(area_ha * 45000000, -6)
                sale_price_cop = estimated_value_cop
                modality = "Venta"
            elif built_m2 and built_m2 > 0:
                # Built area estimation: $2.5M COP / m2
                estimated_value_cop = round(built_m2 * 2500000, -6)
                sale_price_cop = estimated_value_cop
                modality = "Venta"
            elif area_m2 and area_m2 > 0:
                # Urban lot area estimation: $350k COP / m2
                estimated_value_cop = round(area_m2 * 350000, -6)
                sale_price_cop = estimated_value_cop
                modality = "Venta"
            else:
                # Fallback opportunity reference
                estimated_value_cop = 250000000
                sale_price_cop = 250000000
                modality = "Venta"

            cadastral_id = sanitize_text(row.get(catastral_id_col), "")
            registry_folio = sanitize_text(row.get(folio_col), "")
            legal_status = sanitize_text(row.get(legal_col), "Saneado")

            # Deterministic Coordinate Dispersion per municipality
            lat = 8.0 + (idx_count * 0.0005)
            lng = -76.7 - (idx_count * 0.0005)

            address_str = dir_val if dir_val else (f"Vereda {vereda_val}" if vereda_val else f"Sector {muni_canonical}")

            short_desc = desc_val[:200] if desc_val else f"{asset_type} inventariado en {muni_canonical}, {dept_canonical}."
            full_desc = desc_val if desc_val else f"{asset_type} ubicado en {muni_canonical}, bajo inventario y administración territorial."

            batch_params.append((
                code, slug, title, short_desc, full_desc,
                asset_type, modality, True, id_act, registry_folio,
                sale_price_cop, monthly_rent_cop, estimated_value_cop,
                avaluo_com, renta_est, occupancy_status, last_visit,
                area_m2, area_ha, built_m2,
                dept_canonical, muni_canonical, vereda_val if vereda_val else None, vereda_val if vereda_val else None, address_str,
                lat, lng, registry_folio, cadastral_id, legal_status,
                'published', 'Disponible', False, False
            ))

        insert_sql = """
            INSERT INTO public.properties (
                code, slug, title, short_description, description,
                asset_type, modality, is_sae, sae_id_activo, folio_matricula,
                sale_price_cop, monthly_rent_cop, estimated_value_cop,
                commercial_appraisal_cop, monthly_rent_estimate_cop, occupancy_status, last_visit_date,
                land_area_m2, land_area_ha, built_area_m2,
                department, municipality, sector_vereda, vereda, address,
                latitude, longitude, matricula_inmobiliaria, cedula_catastral, legal_status,
                editorial_status, availability, is_featured, is_investment_opportunity, updated_at
            ) VALUES %s
            ON CONFLICT (code) DO UPDATE SET
                title = EXCLUDED.title,
                short_description = EXCLUDED.short_description,
                description = EXCLUDED.description,
                asset_type = EXCLUDED.asset_type,
                modality = EXCLUDED.modality,
                sale_price_cop = EXCLUDED.sale_price_cop,
                monthly_rent_cop = EXCLUDED.monthly_rent_cop,
                estimated_value_cop = EXCLUDED.estimated_value_cop,
                commercial_appraisal_cop = EXCLUDED.commercial_appraisal_cop,
                monthly_rent_estimate_cop = EXCLUDED.monthly_rent_estimate_cop,
                occupancy_status = EXCLUDED.occupancy_status,
                last_visit_date = EXCLUDED.last_visit_date,
                land_area_m2 = EXCLUDED.land_area_m2,
                land_area_ha = EXCLUDED.land_area_ha,
                built_area_m2 = EXCLUDED.built_area_m2,
                department = EXCLUDED.department,
                municipality = EXCLUDED.municipality,
                address = EXCLUDED.address,
                editorial_status = 'published',
                availability = 'Disponible',
                updated_at = NOW();
        """
        template = "(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())"
        execute_values(cur, insert_sql, batch_params, template=template)
        print(f" -> Se procesaron e insertaron con UPSERT {len(batch_params)} predios estratégicos desde Excel.", flush=True)
    else:
        print(f" -> No se encontró {EXCEL_PATH}, continuando solo con canónicos.", flush=True)

    # 3. Final Verification & Metrics Report
    cur.execute("SELECT COUNT(*) FROM public.properties;")
    total = cur.fetchone()[0]
    
    cur.execute("SELECT COUNT(*) FROM public.properties WHERE editorial_status = 'published' AND availability <> 'Archivado';")
    public_visible = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM public.properties WHERE commercial_appraisal_cop > 0;")
    cnt_avaluo = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM public.properties WHERE monthly_rent_estimate_cop > 0 OR monthly_rent_cop > 0;")
    cnt_renta = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM public.properties WHERE sale_price_cop > 0 OR estimated_value_cop > 0;")
    cnt_sale = cur.fetchone()[0]

    cur.execute("SELECT asset_type, count(*) FROM public.properties GROUP BY asset_type ORDER BY count(*) DESC;")
    by_asset_type = cur.fetchall()

    cur.execute("SELECT municipality, count(*) FROM public.properties GROUP BY municipality ORDER BY count(*) DESC;")
    by_muni = cur.fetchall()

    cur.execute("SELECT occupancy_status, count(*) FROM public.properties GROUP BY occupancy_status ORDER BY count(*) DESC;")
    by_occupancy = cur.fetchall()

    print("\n==================================================")
    print(" MÉTRICAS FINALES DE INGESTIÓN EN PRODUCCIÓN SUPABASE")
    print("==================================================")
    print(f" Total registros persistidos en public.properties: {total}")
    print(f" Total visibles públicamente: {public_visible}")
    print(f" Predios con Avalúo Comercial (>0): {cnt_avaluo}")
    print(f" Predios con Canon de Renta (>0): {cnt_renta}")
    print(f" Predios con Valor de Referencia Comercial asignado (>0): {cnt_sale}")
    
    print("\n Desglose por Estado de Ocupación:")
    for occ, cnt in by_occupancy:
        print(f"   - {occ or 'Sin especificar'}: {cnt}")

    print("\n Desglose por Tipo de Activo (asset_type):")
    for at, cnt in by_asset_type:
        print(f"   - {at}: {cnt}")

    print("\n Desglose por Municipio Estratégico:")
    for m, cnt in by_muni:
        print(f"   - {m}: {cnt}")
    print("==================================================", flush=True)

    conn.close()

if __name__ == "__main__":
    main()
