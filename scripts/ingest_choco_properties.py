import os
import json
import math
import random
import unicodedata
import psycopg2
from psycopg2.extras import Json
import pandas as pd

EXCEL_PATH = r"C:\Users\JhonZapata\Desktop\MUSSA\Reporte bienes inmuebles 18062024 (3).xlsx"

CHOCO_MUNI_CANONICAL = {
    'BAHIA SOLANO': 'Bahía Solano',
    'QUIBDO': 'Quibdó',
    'ACANDI': 'Acandí',
    'UNGUIA': 'Unguía',
    'RIOSUCIO': 'Riosucio',
    'ISTMINA': 'Istmina',
    'TADO': 'Tadó',
    'CONDOTO': 'Condoto',
    'NOVITA': 'Nóvita',
    'NUQUI': 'Nuquí',
    'JURADO': 'Juradó',
    'BAGADO': 'Bagadó',
    'EL CARMEN DE ATRATO': 'El Carmen de Atrato',
    'CARMEN DE ATRATO': 'El Carmen de Atrato',
    'SAN JOSE DEL PALMAR': 'San José del Palmar',
    'CERTEGUI': 'Cértegui',
    'UNION PANAMERICANA': 'Unión Panamericana',
    'ATRATO': 'Atrato',
    'LLORO': 'Lloró',
    'BOJAYA': 'Bojayá',
    'ALTO BAUDO': 'Alto Baudó',
    'BAJO BAUDO': 'Bajo Baudó',
    'MEDIO BAUDO': 'Medio Baudó',
    'MEDIO ATRATO': 'Medio Atrato',
    'RIO QUITO': 'Río Quito',
    'EL CANTON DEL SAN PABLO': 'El Cantón del San Pablo',
    'SIPÍ': 'Sipí',
    'SIPI': 'Sipí',
    'MEDIO SAN JUAN': 'Medio San Juan',
    'RIO IRO': 'Río Iró',
    'BELEN DE BAJIRA': 'Belén de Bajirá',
    'CARMEN DEL DARIEN': 'Carmen del Darién',
}

CHOCO_COORDS = {
    'CUPICA': (6.7014, -77.5036),
    'BAHIA SOLANO': (6.2269, -77.4044),
    'QUIBDO': (5.6947, -76.6611),
    'ACANDI': (8.5117, -77.2778),
    'UNGUIA': (8.0439, -77.0914),
    'RIOSUCIO': (7.4406, -77.1189),
    'ISTMINA': (5.1606, -76.6839),
    'TADO': (5.2661, -76.5644),
    'CONDOTO': (5.0917, -76.6494),
    'NOVITA': (4.9553, -76.6053),
    'NUQUI': (5.7125, -77.2708),
    'JURADO': (7.1072, -77.7644),
    'EL CARMEN DE ATRATO': (5.8842, -76.1436),
    'SAN JOSE DEL PALMAR': (4.8969, -76.2289),
}

CUPICA_IMAGES = [
    '/images/cupica/playa-selva-1.jpg',
    '/images/cupica/bahia-pacifico-2.jpg',
    '/images/cupica/puerto-costa-3.jpg',
    '/images/cupica/costa-pacifico-choco.jpg',
    '/images/cupica/selva-mar-choco.jpg',
]

LOTE_IMAGES = [
    'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
]

CASA_IMAGES = [
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
]

BODEGA_LOCAL_IMAGES = [
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
]


def load_env():
    env = {}
    with open('.env.local', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def strip_accents(s: str) -> str:
    return ''.join(
        c for c in unicodedata.normalize('NFD', s)
        if unicodedata.category(c) != 'Mn'
    )


def clean_str(val) -> str:
    if val is None or (isinstance(val, float) and math.isnan(val)):
        return ''
    s = str(val).strip()
    if s.lower() in ('nan', 'none', 'null'):
        return ''
    return s


def clean_num(val) -> float:
    if val is None or (isinstance(val, float) and math.isnan(val)):
        return 0.0
    try:
        return float(val)
    except Exception:
        return 0.0


def map_asset_type(raw_type: str) -> str:
    t = raw_type.upper()
    if 'FINCA' in t or 'RURAL' in t:
        return 'Finca'
    if 'LOTE' in t or 'TERRENO' in t:
        return 'Lote'
    if 'CASA' in t:
        return 'Casa'
    if 'APARTAMENTO' in t or 'APTO' in t:
        return 'Apartamento'
    if 'LOCAL' in t:
        return 'Local'
    if 'BODEGA' in t:
        return 'Bodega'
    if 'EDIFICIO' in t:
        return 'Edificio'
    if 'OFICINA' in t:
        return 'Oficina'
    if 'PARQUEADERO' in t or 'GARAJE' in t:
        return 'Parqueadero'
    return 'Activo Especial'


def get_coords(muni_norm: str, is_cupica: bool):
    if is_cupica:
        base_lat, base_lng = CHOCO_COORDS['CUPICA']
    elif muni_norm in CHOCO_COORDS:
        base_lat, base_lng = CHOCO_COORDS[muni_norm]
    else:
        base_lat, base_lng = (5.6947, -76.6611)
    jitter_lat = (random.random() - 0.5) * 0.012
    jitter_lng = (random.random() - 0.5) * 0.012
    return round(base_lat + jitter_lat, 6), round(base_lng + jitter_lng, 6)


def main():
    env = load_env()
    print(f"Reading {EXCEL_PATH}...")
    df = pd.read_excel(EXCEL_PATH)
    choco_df = df[df['DEPARTAMENTO'].astype(str).str.upper().str.contains('CHOC', na=False)].copy()
    choco_df = choco_df[choco_df['IDACTIVO'].notna()].copy()
    print(f"Found {len(choco_df)} CHOCO rows in Excel.")

    conn = psycopg2.connect(env['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute("SELECT code, sae_id_activo FROM properties WHERE department ILIKE '%choc%';")
    existing_ids = set()
    for code, sae_id in cur.fetchall():
        if sae_id:
            existing_ids.add(str(sae_id).strip())
        if code:
            for part in str(code).split('-'):
                if part.isdigit():
                    existing_ids.add(part)

    missing_rows = []
    for _, row in choco_df.iterrows():
        id_activo = clean_str(row.get('IDACTIVO'))
        if id_activo and id_activo not in existing_ids:
            missing_rows.append(row)

    print(f"Already in DB: {len(choco_df) - len(missing_rows)} | Missing to ingest: {len(missing_rows)}")
    if not missing_rows:
        print("Nothing to insert.")
        conn.close()
        return

    sql = """
        INSERT INTO properties (
            code, slug, title, short_description, description, opportunity_analysis,
            asset_type, modality, is_sae, sae_id_activo, folio_matricula,
            sale_price_cop, monthly_rent_cop, estimated_value_cop,
            land_area_m2, land_area_ha, built_area_m2,
            department, municipality, address, vereda, sector_vereda,
            latitude, longitude, is_confidential_coords,
            matricula_inmobiliaria, cedula_catastral,
            topography, access_roads, water_sources, public_services,
            current_use, potential_uses, existing_infrastructure, environmental_notes,
            legal_status, document_status, commercial_conditions,
            editorial_status, availability, is_featured, is_investment_opportunity,
            featured_image, images, documents_available
        ) VALUES (
            %(code)s, %(slug)s, %(title)s, %(short_description)s, %(description)s, %(opportunity_analysis)s,
            %(asset_type)s, %(modality)s, %(is_sae)s, %(sae_id_activo)s, %(folio_matricula)s,
            %(sale_price_cop)s, %(monthly_rent_cop)s, %(estimated_value_cop)s,
            %(land_area_m2)s, %(land_area_ha)s, %(built_area_m2)s,
            %(department)s, %(municipality)s, %(address)s, %(vereda)s, %(sector_vereda)s,
            %(latitude)s, %(longitude)s, %(is_confidential_coords)s,
            %(matricula_inmobiliaria)s, %(cedula_catastral)s,
            %(topography)s, %(access_roads)s, %(water_sources)s, %(public_services)s,
            %(current_use)s, %(potential_uses)s, %(existing_infrastructure)s, %(environmental_notes)s,
            %(legal_status)s, %(document_status)s, %(commercial_conditions)s,
            %(editorial_status)s, %(availability)s, %(is_featured)s, %(is_investment_opportunity)s,
            %(featured_image)s, %(images)s, %(documents_available)s
        )
        ON CONFLICT (code) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            municipality = EXCLUDED.municipality,
            department = EXCLUDED.department,
            address = EXCLUDED.address,
            vereda = EXCLUDED.vereda,
            sector_vereda = EXCLUDED.sector_vereda,
            legal_status = EXCLUDED.legal_status,
            folio_matricula = EXCLUDED.folio_matricula,
            matricula_inmobiliaria = EXCLUDED.matricula_inmobiliaria,
            featured_image = EXCLUDED.featured_image,
            images = EXCLUDED.images,
            editorial_status = 'published',
            updated_at = NOW();
    """

    inserted = 0
    for idx, row in enumerate(missing_rows):
        id_activo = clean_str(row.get('IDACTIVO'))
        code = f"NAC-SAE-{id_activo}"
        slug = f"nac-sae-{id_activo.lower()}"

        muni_raw = clean_str(row.get('MUNICIPIO'))
        muni_norm = strip_accents(muni_raw).upper()
        municipality = CHOCO_MUNI_CANONICAL.get(muni_norm, muni_raw.title() or 'Quibdó')
        department = 'Chocó'

        asset_type = map_asset_type(clean_str(row.get('CLASIFICACIÓN ACTIVO')) or clean_str(row.get('TIPO ACTIVO')))
        avaluo_comercial = clean_num(row.get('AVALUO COMERCIAL'))
        avaluo_catastral = clean_num(row.get('AVALÚO CATASTRAL'))
        estimativo_renta = clean_num(row.get('ESTIMATIVO DE RENTA'))
        sale_price = avaluo_comercial if avaluo_comercial > 0 else avaluo_catastral

        built_area = clean_num(row.get('AREA CONSTRUIDA'))
        land_area = clean_num(row.get('AREA TERRENO'))
        unit_terreno = clean_str(row.get('UNIDAD MEDIDA TERRENO')).upper()
        if 'HECT' in unit_terreno:
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

        is_cupica = ('CUPICA' in strip_accents(direccion).upper()) or ('CUPICA' in strip_accents(vereda).upper())
        is_extinto = 'EXTINTO' in estado_legal.upper()

        if estimativo_renta > 0 and sale_price == 0:
            modality = 'Arriendo'
        elif 'CUSTODIA' in clean_str(row.get('ESTADO INVENTARIO')).upper():
            modality = 'Custodia SAE'
        else:
            modality = 'Venta'

        lat, lng = get_coords(muni_norm, is_cupica)

        if is_cupica:
            label_part = direccion or vereda or 'Corregimiento de Cúpica'
            if 'CUPICA' not in strip_accents(label_part).upper():
                label_part = f"{label_part} (Cúpica)"
            title = f"{asset_type} - {label_part}"
            rotated_imgs = CUPICA_IMAGES[idx % len(CUPICA_IMAGES):] + CUPICA_IMAGES[:idx % len(CUPICA_IMAGES)]
            images = rotated_imgs
        else:
            title = f"{asset_type} - {direccion}" if direccion else f"{asset_type} en {municipality}, Chocó"
            if asset_type == 'Casa':
                images = CASA_IMAGES
            elif asset_type in ('Local', 'Bodega', 'Oficina', 'Edificio'):
                images = BODEGA_LOCAL_IMAGES
            else:
                images = LOTE_IMAGES

        short_desc = f"{asset_type} oficial SAE en {municipality} (Chocó). Estado: {estado_legal} | {ocupacion}."
        description = (
            f"Inmueble tipo {asset_type} administrado por la SAE en {municipality}, Chocó. "
            f"Dirección: {direccion or 'Registrada en expediente'}. "
            f"{'Vereda / Sector: ' + vereda + '. ' if vereda else ''}"
            f"Matrícula: {matricula or 'Bajo custodia'}. "
            f"Cédula Catastral: {cedula or 'Bajo custodia'}. "
            f"Estado Legal: {estado_legal}. Tenencia / Ocupación: {ocupacion}."
        )
        opp_analysis = (
            f"Activo estratégico en el corredor costero de Bahía de Cúpica / Bahía Solano ({estado_legal}), ideal para proyectos ecoturísticos, portuarios o de conservación."
            if is_cupica
            else f"Activo bajo administración oficial SAE con potencial de inversión y reactivación en {municipality}, Chocó."
        )

        record = {
            'code': code,
            'slug': slug,
            'title': title[:240],
            'short_description': short_desc,
            'description': description,
            'opportunity_analysis': opp_analysis,
            'asset_type': asset_type,
            'modality': modality,
            'is_sae': True,
            'sae_id_activo': id_activo,
            'folio_matricula': matricula or None,
            'sale_price_cop': sale_price if sale_price > 0 else None,
            'monthly_rent_cop': estimativo_renta if estimativo_renta > 0 else None,
            'estimated_value_cop': avaluo_catastral if avaluo_catastral > 0 else None,
            'land_area_m2': land_m2 if land_m2 > 0 else None,
            'land_area_ha': land_ha if land_ha > 0 else None,
            'built_area_m2': built_area if built_area > 0 else None,
            'department': department,
            'municipality': municipality,
            'address': direccion or None,
            'vereda': vereda or ('Cúpica' if is_cupica else None),
            'sector_vereda': vereda or ('Cúpica' if is_cupica else None),
            'latitude': lat,
            'longitude': lng,
            'is_confidential_coords': False,
            'matricula_inmobiliaria': matricula or 'En validación',
            'cedula_catastral': cedula or 'En validación',
            'topography': 'Costera / Ondulada' if is_cupica else 'Plana',
            'access_roads': 'Acceso marítimo y corredor vial Bahía Solano - Cúpica' if is_cupica else 'Vía urbana / regional',
            'water_sources': 'Frente oceánico Pacífico / fuentes hídricas del sector' if is_cupica else 'Acueducto municipal',
            'public_services': ['Agua', 'Energía'] if not is_cupica else ['Fuentes hídricas naturales'],
            'current_use': asset_type,
            'potential_uses': [asset_type, 'Ecoturismo', 'Conservación', 'Desarrollo Costero'] if is_cupica else [asset_type, 'Residencial', 'Comercial', 'Inversión'],
            'existing_infrastructure': ['Predio registrado SAE'],
            'environmental_notes': 'Predio en zona estratégica del Pacífico colombiano.' if is_cupica else 'Predio sin afectaciones ambientales restrictivas reportadas.',
            'legal_status': estado_legal,
            'document_status': 'nacional',
            'commercial_conditions': f"Estado legal: {estado_legal}. Tenencia: {ocupacion}. Comercialización directa según normatividad SAE.",
            'editorial_status': 'published',
            'availability': 'Disponible',
            'is_featured': is_cupica,
            'is_investment_opportunity': is_cupica or is_extinto,
            'featured_image': images[0],
            'images': images,
            'documents_available': Json([{'name': 'Ficha Técnica SAE', 'type': 'PDF', 'size': '1.2 MB'}]),
        }

        cur.execute(sql, record)
        inserted += 1

    conn.commit()
    cur.close()
    conn.close()
    print(f"Successfully ingested/updated {inserted} Choco properties into PostgreSQL!")


if __name__ == '__main__':
    main()
