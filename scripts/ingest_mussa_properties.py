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

REST_URL = f"{SUPABASE_URL}/rest/v1/properties"
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

CITY_COORDINATES = {
    'CALI': (3.4516, -76.5320),
    'SANTIAGO DE CALI': (3.4516, -76.5320),
    'PALMIRA': (3.5394, -76.3036),
    'BUGA': (3.9008, -76.2978),
    'GUADALAJARA DE BUGA': (3.9008, -76.2978),
    'BUENAVENTURA': (3.8801, -77.0312),
    'CARTAGO': (4.7464, -75.9117),
    'JAMUNDI': (3.2608, -76.5414),
    'JAMUNDÍ': (3.2608, -76.5414),
    'TULUA': (4.0847, -76.1956),
    'TULUÁ': (4.0847, -76.1956),
    'YUMBO': (3.5819, -76.4967),
    'CANDELARIA': (3.4078, -76.3481),
    'ROLDANILLO': (4.4144, -76.1558),
    'ZARZAL': (4.3986, -76.0722),
    'SEVILLA': (4.2661, -75.9328),

    'MEDELLIN': (6.2442, -75.5812),
    'MEDELLÍN': (6.2442, -75.5812),
    'ENVIGADO': (6.1695, -75.5873),
    'BELLO': (6.3373, -75.5579),
    'ITAGUI': (6.1731, -75.6125),
    'ITAGÜÍ': (6.1731, -75.6125),
    'SABANETA': (6.1517, -75.6163),
    'RIONEGRO': (6.1539, -75.3742),
    'APARTADO': (7.8847, -76.6269),
    'APARTADÓ': (7.8847, -76.6269),
    'TURBO': (8.0934, -76.7289),
    'NECOCLI': (8.4256, -76.7861),
    'NECOCLÍ': (8.4256, -76.7861),
    'CAREPA': (7.7570, -76.6547),
    'CHIGORODO': (7.6672, -76.6811),
    'CHIGORODÓ': (7.6672, -76.6811),
    'SONSON': (5.7114, -75.3106),
    'SONSÓN': (5.7114, -75.3106),
    'SAN PEDRO DE LOS MILAGROS': (6.4608, -75.5564),

    'BOGOTA D.C.': (4.6097, -74.0817),
    'BOGOTÁ, D.C.': (4.6097, -74.0817),
    'BOGOTA': (4.6097, -74.0817),
    'BOGOTÁ': (4.6097, -74.0817),
    'SOACHA': (4.5828, -74.2217),
    'CHIA': (4.8622, -74.0583),
    'CHÍA': (4.8622, -74.0583),
    'ZIPAQUIRA': (5.0264, -74.0042),
    'ZIPAQUIRÁ': (5.0264, -74.0042),
    'FUSAGASUGA': (4.3469, -74.3644),
    'FUSAGASUGÁ': (4.3469, -74.3644),
    'GIRARDOT': (4.3014, -74.8058),
    'FACATATIVA': (4.8142, -74.3547),
    'FACATATIVÁ': (4.8142, -74.3547),

    'MONTERIA': (8.7479, -75.8814),
    'MONTERÍA': (8.7479, -75.8814),
    'CERETE': (8.8847, -75.7903),
    'CERETÉ': (8.8847, -75.7903),
    'SAHAGUN': (8.9469, -75.4439),
    'SAHAGÚN': (8.9469, -75.4439),
    'LORICA': (9.2392, -75.8142),
    'TIERRALTA': (8.1722, -76.0592),
    'PLANETA RICA': (8.4075, -75.5839),
    'MONTELIBANO': (7.9808, -75.4206),
    'MONTELÍBANO': (7.9808, -75.4206),

    'BARRANQUILLA': (10.9685, -74.7813),
    'SOLEDAD': (10.9186, -74.7644),
    'MALAMBO': (10.8589, -74.7739),
    'PUERTO COLOMBIA': (10.9878, -74.9547),

    'CARTAGENA': (10.3910, -75.4794),
    'CARTAGENA DE INDIAS': (10.3910, -75.4794),
    'TURBACO': (10.3275, -75.4286),
    'MAGANGUE': (9.2425, -74.7547),
    'MAGANGUÉ': (9.2425, -74.7547),

    'VILLAVICENCIO': (4.1420, -73.6266),
    'ACACIAS': (3.9869, -73.7628),
    'ACACÍAS': (3.9869, -73.7628),
    'GRANADA': (3.5461, -73.7067),

    'PEREIRA': (4.8133, -75.6961),
    'DOSQUEBRADAS': (4.8344, -75.6797),
    'SANTA ROSA DE CABAL': (4.8697, -75.6214),
    'ARMENIA': (4.5339, -75.6811),
    'MANIZALES': (5.0689, -75.5174),

    'BUCARAMANGA': (7.1254, -73.1198),
    'FLORIDABLANCA': (7.0622, -73.0864),
    'GIRON': (7.0681, -73.1697),
    'GIRÓN': (7.0681, -73.1697),
    'PIEDECUESTA': (6.9886, -73.0497),
    'CUCUTA': (7.8939, -72.5078),
    'CÚCUTA': (7.8939, -72.5078),
}

DEPARTMENT_COORDINATES = {
    'VALLE DEL CAUCA': (3.4516, -76.5320),
    'ANTIOQUIA': (6.2442, -75.5812),
    'BOGOTA D.C.': (4.6097, -74.0817),
    'BOGOTÁ, D.C.': (4.6097, -74.0817),
    'CUNDINAMARCA': (4.7110, -74.0721),
    'CORDOBA': (8.7479, -75.8814),
    'CÓRDOBA': (8.7479, -75.8814),
    'ATLANTICO': (10.9685, -74.7813),
    'ATLÁNTICO': (10.9685, -74.7813),
    'BOLIVAR': (10.3910, -75.4794),
    'BOLÍVAR': (10.3910, -75.4794),
    'META': (4.1420, -73.6266),
    'RISARALDA': (4.8133, -75.6961),
    'NORTE DE SANTANDER': (7.8939, -72.5078),
    'BOYACA': (5.5353, -73.3678),
    'BOYACÁ': (5.5353, -73.3678),
    'SANTANDER': (7.1254, -73.1198),
    'TOLIMA': (4.4389, -75.2322),
    'CALDAS': (5.0689, -75.5174),
    'QUINDIO': (4.5339, -75.6811),
    'QUINDÍO': (4.5339, -75.6811),
    'CESAR': (10.4631, -73.2532),
    'MAGDALENA': (11.2408, -74.1990),
    'HUILA': (2.9273, -75.2819),
    'CAUCA': (2.4419, -76.6063),
    'NARINO': (1.2136, -77.2811),
    'NARIÑO': (1.2136, -77.2811),
    'SUCRE': (9.3047, -75.3978),
    'CHOCO': (5.6919, -76.6583),
    'CHOCÓ': (5.6919, -76.6583),
    'LA GUAJIRA': (11.5444, -72.9072),
}

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
    elif "APARTAMENTO" in t or "APTO" in t:
        return "Apartamento"
    elif "LOCAL" in t:
        return "Local"
    elif "BODEGA" in t:
        return "Bodega"
    elif "EDIFICIO" in t:
        return "Edificio"
    elif "OFICINA" in t:
        return "Oficina"
    elif "PARQUEADERO" in t or "GARAJE" in t:
        return "Parqueadero"
    return "Activo Especial"

def get_coords(municipality, department):
    m_clean = clean_str(municipality).upper()
    d_clean = clean_str(department).upper()
    
    base_lat, base_lng = 4.6097, -74.0817
    
    if m_clean in CITY_COORDINATES:
        base_lat, base_lng = CITY_COORDINATES[m_clean]
    elif d_clean in DEPARTMENT_COORDINATES:
        base_lat, base_lng = DEPARTMENT_COORDINATES[d_clean]
        
    jitter_lat = (random.random() - 0.5) * 0.015
    jitter_lng = (random.random() - 0.5) * 0.015
    
    return round(base_lat + jitter_lat, 6), round(base_lng + jitter_lng, 6)

def main():
    print(f"Reading national Excel file from {EXCEL_PATH}...")
    df = pd.read_excel(EXCEL_PATH)
    print(f"Loaded {len(df)} rows from Excel.")
    
    df = df[df['IDACTIVO'].notna()].copy()
    
    target_depts = [
        ('VALLE DEL CAUCA', 250),
        ('ANTIOQUIA', 200),
        ('BOGOTA D.C.', 150),
        ('CUNDINAMARCA', 100),
        ('CORDOBA', 80),
        ('ATLANTICO', 80),
        ('BOLIVAR', 50),
        ('META', 50),
        ('RISARALDA', 40),
    ]
    
    selected_indices = []
    for dept_name, count in target_depts:
        dept_rows = df[df['DEPARTAMENTO'].astype(str).str.upper().str.contains(dept_name, na=False)]
        sample_count = min(len(dept_rows), count)
        if sample_count > 0:
            selected_indices.extend(dept_rows.head(sample_count).index.tolist())
            
    remaining = df.drop(index=selected_indices, errors='ignore')
    if len(selected_indices) < 1000 and len(remaining) > 0:
        extra_count = 1000 - len(selected_indices)
        selected_indices.extend(remaining.head(extra_count).index.tolist())
        
    curated_df = df.loc[selected_indices].copy()
    print(f"Selected {len(curated_df)} curated national properties for ingestion.")
    
    records_to_insert = []
    
    for _, row in curated_df.iterrows():
        id_activo = clean_str(row.get('IDACTIVO'))
        code = f"NAC-SAE-{id_activo}"
        slug = f"nac-sae-{id_activo.lower()}"
        
        muni_raw = clean_str(row.get('MUNICIPIO'))
        dept_raw = clean_str(row.get('DEPARTAMENTO'))
        
        municipality = muni_raw.title()
        department = dept_raw.title()
        
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
            
        lat, lng = get_coords(muni_raw, dept_raw)
        
        title = f"{asset_type} en {municipality}, {department}"
        short_desc = f"{asset_type} oficial SAE en {municipality} ({department}). Estado: {ocupacion}."
        description = (
            f"Inmueble tipo {asset_type} administrado por la SAE en {municipality}, {department}. "
            f"Dirección: {direccion or 'Registrada en expediente'}. "
            f"Matrícula: {matricula or 'Bajo custodia'}. "
            f"Cédula Catastral: {cedula or 'Bajo custodia'}. "
            f"Tenencia / Ocupación: {ocupacion}."
        )
        opp_analysis = f"Activo bajo administración oficial SAE con alto potencial de inversión y reactivación productiva en {municipality}."
        
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
            "access_roads": "Vía pavimentada / acceso urbano y regional",
            "water_sources": "Red de acueducto municipal / fuentes del sector",
            "public_services": ["Agua", "Energía", "Alcantarillado"],
            "current_use": asset_type,
            "potential_uses": [asset_type, "Comercial", "Residencial", "Inversión"],
            "existing_infrastructure": ["Estructura principal construida", "Cerramiento"],
            "environmental_notes": "Predio sin afectaciones ambientales restrictivas reportadas.",
            "legal_status": estado_legal,
            "document_status": "nacional",
            "commercial_conditions": f"Tenencia: {ocupacion}. Venta / comercialización directa según normatividad vigente SAE.",
            "editorial_status": "published",
            "availability": "Disponible",
            "is_featured": False,
            "is_investment_opportunity": True if (sale_price > 0 and avaluo_comercial > avaluo_catastral) else False,
            "images": [
                "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80"
            ],
            "documents_available": [
                {"name": "Ficha Técnica SAE", "type": "PDF", "size": "1.2 MB"}
            ]
        }
        
        # Filter only exact valid DB columns
        clean_record = {k: v for k, v in prop_record.items() if k in VALID_DB_COLUMNS}
        records_to_insert.append(clean_record)
        
    print(f"Prepared {len(records_to_insert)} records to insert into Supabase.")
    
    batch_size = 50
    inserted_count = 0
    total_batches = (len(records_to_insert) + batch_size - 1) // batch_size
    
    for i in range(0, len(records_to_insert), batch_size):
        batch = records_to_insert[i:i + batch_size]
        batch_num = (i // batch_size) + 1
        
        res = requests.post(REST_URL, headers=HEADERS, json=batch)
        if res.status_code in [200, 201]:
            inserted_count += len(batch)
            print(f"Batch {batch_num}/{total_batches} inserted successfully ({inserted_count}/{len(records_to_insert)}).")
        else:
            print(f"Batch {batch_num}/{total_batches} failed with status {res.status_code}: {res.text}")
            
    print(f"\nIngestion complete! Successfully ingested {inserted_count} national properties into Supabase.")

if __name__ == "__main__":
    main()
