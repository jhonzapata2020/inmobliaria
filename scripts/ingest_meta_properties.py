import os
import sys
import json
import math
import random
import requests
import pandas as pd

EXCEL_PATH = r"C:\Users\JhonZapata\Desktop\MUSSA\Reporte bienes inmuebles 18062024 (3).xlsx"
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "https://ehfejbgzronpllbeyzqj.supabase.co")
SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

REST_URL = f"{SUPABASE_URL}/rest/v1/properties?on_conflict=code"
HEADERS = {
    "apikey": SERVICE_ROLE_KEY,
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

VALID_DB_COLUMNS = {
    'access_roads', 'address', 'altitude_msl', 'asset_type', 'availability', 
    'built_area_m2', 'cedula_catastral', 'code', 'commercial_conditions', 
    'current_use', 'department', 'description', 'document_status', 
    'documents_available', 'editorial_status', 'environmental_notes', 
    'estimated_value_cop', 'existing_infrastructure', 'featured_image', 
    'folio_matricula', 'images', 'is_confidential_coords', 'is_demo_data', 
    'is_featured', 'is_investment_opportunity', 'is_sae', 'land_area_ha', 
    'land_area_m2', 'latitude', 'legal_status', 'longitude', 
    'matricula_inmobiliaria', 'modality', 'monthly_rent_cop', 'municipality', 
    'opportunity_analysis', 'potential_uses', 'public_services', 
    'sae_id_activo', 'sale_price_cop', 'sector_vereda', 'short_description', 
    'slug', 'title', 'topography', 'vereda', 'video_url', 'virtual_tour_url', 
    'water_sources'
}

META_MUNICIPALITIES_COORDS = {
    'VILLAVICENCIO': (4.1420, -73.6266),
    'ACACIAS': (3.9869, -73.7628),
    'ACACÍAS': (3.9869, -73.7628),
    'PUERTO LOPEZ': (4.0847, -72.9558),
    'PUERTO LÓPEZ': (4.0847, -72.9558),
    'RESTREPO': (4.2508, -73.5658),
    'SAN MARTIN': (3.6961, -73.6989),
    'SAN MARTÍN': (3.6961, -73.6989),
    'FUENTE DE ORO': (3.4619, -73.6214),
    'PUERTO LLERAS': (3.2758, -73.3742),
    'GRANADA': (3.5461, -73.7067),
    'VISTAHERMOSA': (3.1239, -73.7514),
    'PUERTO RICO': (2.9394, -73.2086),
    'SAN CARLOS DE GUAROA': (3.7119, -73.2458),
    'GUAMAL': (3.8808, -73.7658),
    'CUMARAL': (4.2711, -73.4869),
    'CABUYARO': (4.2831, -72.7936),
    'CASTILLA LA NUEVA': (3.8267, -73.6872),
    'LEJANIAS': (3.5264, -74.0239),
    'LEJANÍAS': (3.5264, -74.0239),
    'MESETAS': (3.3831, -74.0439),
    'MAPIRIPAN': (2.8894, -72.1314),
    'MAPIRIPÁN': (2.8894, -72.1314),
    'LA MACARENA': (2.1831, -73.7869),
    'BARRANCA DE UPIA': (4.5028, -72.9758),
    'BARRANCA DE UPÍA': (4.5028, -72.9758),
    'SAN JUANITO': (4.4539, -73.6739),
    'EL CALVARIO': (4.3547, -73.7128),
    'EL CASTILLO': (3.5639, -73.7917),
    'EL DORADO': (3.7128, -73.8347),
    'URIBE': (3.2419, -74.3539),
    'PUERTO CONCORDIA': (2.6167, -72.7569),
    'PUERTO GAITAN': (4.3139, -72.0817),
    'PUERTO GAITÁN': (4.3139, -72.0817),
}

FINCA_GANADERA_IMAGES = [
    'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=1200&q=80',
]

FINCA_CAMPESTRE_IMAGES = [
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
]

LOTE_TERRENO_IMAGES = [
    'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1200&q=80',
]

CASA_IMAGES = [
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1200&q=80',
]

APARTAMENTO_IMAGES = [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=1200&q=80',
]

BODEGA_LOCAL_EDIFICIO_IMAGES = [
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
]

PARQUEADERO_IMAGES = [
    'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
]

def hash_str(s):
    h = 0
    for c in s:
        h = (h * 31 + ord(c)) & 0xFFFFFFFF
    return abs(h)

def pick_images(code, asset_type):
    h = hash_str(code)
    a = (asset_type or "").lower()

    if "finca" in a:
        pool = FINCA_CAMPESTRE_IMAGES if h % 3 == 0 else FINCA_GANADERA_IMAGES
    elif "lote" in a or "terreno" in a:
        pool = LOTE_TERRENO_IMAGES
    elif "casa" in a:
        pool = CASA_IMAGES
    elif "apartamento" in a or "apto" in a or "habitaci" in a:
        pool = APARTAMENTO_IMAGES
    elif "bodega" in a or "local" in a or "edificio" in a or "oficina" in a or "dep" in a:
        pool = BODEGA_LOCAL_EDIFICIO_IMAGES
    elif "parqueadero" in a or "garaje" in a:
        pool = PARQUEADERO_IMAGES
    else:
        pool = FINCA_GANADERA_IMAGES

    img1 = pool[h % len(pool)]
    img2 = pool[(h + 1) % len(pool)]
    img3 = pool[(h + 2) % len(pool)]
    return [img1, img2, img3]

def clean_str(val):
    if pd.isna(val) or val is None:
        return ""
    s = str(val).strip()
    return "" if s.lower() == "nan" else s

def clean_num(val, default=0.0):
    if pd.isna(val) or val is None:
        return default
    try:
        n = float(val)
        return default if math.isnan(n) or math.isinf(n) else n
    except:
        return default

def map_asset_type(raw_type):
    t = clean_str(raw_type).upper()
    if "FINCA" in t or "RURAL" in t:
        return "Finca"
    elif "LOTE" in t or "TERRENO" in t:
        return "Lote"
    elif "CASA" in t:
        return "Casa"
    elif "APARTAMENTO" in t or "APTO" in t or "HABITACI" in t:
        return "Apartamento"
    elif "LOCAL" in t:
        return "Local"
    elif "BODEGA" in t or "DEP" in t:
        return "Bodega"
    elif "EDIFICIO" in t:
        return "Edificio"
    elif "OFICINA" in t:
        return "Oficina"
    elif "PARQUEADERO" in t or "GARAJE" in t:
        return "Parqueadero"
    return "Activo Especial"

def get_coords(municipality):
    m_clean = clean_str(municipality).upper()
    base_lat, base_lng = (4.1420, -73.6266) # Default Villavicencio

    if m_clean in META_MUNICIPALITIES_COORDS:
        base_lat, base_lng = META_MUNICIPALITIES_COORDS[m_clean]

    jitter_lat = (random.random() - 0.5) * 0.015
    jitter_lng = (random.random() - 0.5) * 0.015
    return round(base_lat + jitter_lat, 6), round(base_lng + jitter_lng, 6)

def main():
    print(f"Reading national Excel file from {EXCEL_PATH}...")
    df = pd.read_excel(EXCEL_PATH)
    
    meta_df = df[df['DEPARTAMENTO'].astype(str).str.upper().str.strip() == 'META'].copy()
    meta_df = meta_df[meta_df['IDACTIVO'].notna()].copy()
    print(f"Found {len(meta_df)} properties in META.")

    records = []
    for _, row in meta_df.iterrows():
        id_activo = clean_str(row.get('IDACTIVO'))
        code = f"NAC-SAE-{id_activo}"
        slug = f"nac-sae-{id_activo.lower()}"

        muni_raw = clean_str(row.get('MUNICIPIO'))
        municipality = muni_raw.title()
        department = "Meta"

        asset_type = map_asset_type(row.get('CLASIFICACIÓN ACTIVO') or row.get('TIPO ACTIVO'))

        avaluo_comercial = clean_num(row.get('AVALUO COMERCIAL'))
        avaluo_catastral = clean_num(row.get('AVALÚO CATASTRAL'))
        estimativo_renta = clean_num(row.get('ESTIMATIVO DE RENTA'))
        sale_price = avaluo_comercial if avaluo_comercial > 0 else avaluo_catastral

        built_area = clean_num(row.get('AREA CONSTRUIDA'))
        land_area = clean_num(row.get('AREA TERRENO'))
        unit_terreno = clean_str(row.get('UNIDAD MEDIDA TERRENO')).upper()

        if "HECT" in unit_terreno:
            land_ha = land_area
            land_m2 = land_area * 10000.0
        else:
            land_m2 = land_area
            land_ha = round(land_area / 10000.0, 4) if land_area > 0 else 0.0

        ocupacion = clean_str(row.get('ESTADO DE OCUPACION')) or 'Sin especificar'
        estado_legal = clean_str(row.get('ESTADO LEGAL')) or 'Activo SAE'

        direccion = clean_str(row.get('DIRECCIÓN'))
        vereda = clean_str(row.get('VEREDA'))
        matricula = clean_str(row.get('FOLIO DE MATRÍCULA'))
        cedula = clean_str(row.get('CÉDULA CATASTRAL'))

        if estimativo_renta > 0 and sale_price == 0:
            modality = "Arriendo"
        elif "CUSTODIA" in clean_str(row.get('ESTADO INVENTARIO')).upper():
            modality = "Custodia SAE"
        else:
            modality = "Venta"

        lat, lng = get_coords(muni_raw)

        title = f"{asset_type} en {municipality}, Meta"
        short_desc = f"{asset_type} oficial SAE en {municipality} (Meta). Estado: {ocupacion}."
        description = (
            f"Inmueble tipo {asset_type} administrado por la SAE en {municipality}, Meta. "
            f"Dirección: {direccion or 'Registrada en expediente'}. "
            f"Matrícula: {matricula or 'Bajo custodia'}. "
            f"Cédula Catastral: {cedula or 'Bajo custodia'}. "
            f"Tenencia / Ocupación: {ocupacion}."
        )
        opp_analysis = f"Activo bajo administración oficial SAE con excelente potencial en {municipality}, Meta."

        images = pick_images(code, asset_type)

        prop_record = {
            "code": code,
            "slug": slug,
            "title": title,
            "short_description": short_desc,
            "description": description,
            "opportunity_analysis": opp_analysis,
            "asset_type": asset_type,
            "modality": modality,
            "is_sae": True,
            "sae_id_activo": id_activo,
            "folio_matricula": matricula or None,
            "sale_price_cop": sale_price if sale_price > 0 else None,
            "monthly_rent_cop": estimativo_renta if estimativo_renta > 0 else None,
            "estimated_value_cop": avaluo_catastral if avaluo_catastral > 0 else None,
            "land_area_m2": land_m2 if land_m2 > 0 else None,
            "land_area_ha": land_ha if land_ha > 0 else None,
            "built_area_m2": built_area if built_area > 0 else None,
            "department": department,
            "municipality": municipality,
            "address": direccion or None,
            "vereda": vereda or None,
            "latitude": lat,
            "longitude": lng,
            "is_confidential_coords": False,
            "matricula_inmobiliaria": matricula or "En validación",
            "cedula_catastral": cedula or "En validación",
            "topography": "Plana",
            "access_roads": "Vía principal / acceso regional",
            "water_sources": "Red municipal / fuentes locales",
            "public_services": ["Agua", "Energía", "Alcantarillado"],
            "current_use": asset_type,
            "potential_uses": [asset_type, "Ganadería", "Agroforestal", "Comercial", "Inversión"],
            "existing_infrastructure": ["Estructura principal construida", "Cerramiento"],
            "environmental_notes": "Predio sin afectaciones ambientales restrictivas reportadas.",
            "legal_status": estado_legal,
            "document_status": "nacional",
            "commercial_conditions": f"Tenencia: {ocupacion}. Venta / comercialización directa según normatividad SAE.",
            "editorial_status": "published",
            "availability": "Disponible",
            "is_featured": False,
            "is_investment_opportunity": True if (sale_price > 0 and avaluo_comercial > avaluo_catastral) else False,
            "featured_image": images[0],
            "images": images,
            "documents_available": [
                {"name": "Ficha Técnica SAE Meta", "type": "PDF", "size": "1.2 MB"}
            ]
        }

        clean_record = {k: v for k, v in prop_record.items() if k in VALID_DB_COLUMNS}
        records.append(clean_record)

    print(f"Prepared {len(records)} records from Meta to insert into Supabase.")

    batch_size = 50
    inserted = 0
    total_batches = (len(records) + batch_size - 1) // batch_size

    for i in range(0, len(records), batch_size):
        batch = records[i:i + batch_size]
        batch_num = (i // batch_size) + 1
        res = requests.post(REST_URL, headers=HEADERS, json=batch)
        if res.status_code in [200, 201]:
            inserted += len(batch)
            if batch_num % 5 == 0 or batch_num == total_batches:
                print(f"Batch {batch_num}/{total_batches} inserted ({inserted}/{len(records)}).")
        else:
            print(f"Batch {batch_num}/{total_batches} failed with status {res.status_code}: {res.text[:120]}")

    print(f"\nIngestion of Meta completed! Successfully ingested/updated {inserted} properties from Meta in Supabase.")

if __name__ == "__main__":
    main()
