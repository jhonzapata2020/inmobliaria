import sys
import os
import pandas as pd
import numpy as np
import unicodedata
import sqlalchemy as sa

# Configuration & Constants
EXCEL_PATH = "ANTIOQUIA.xlsx"
DB_URI = "postgresql+psycopg2://postgres.ehfejbgzronpllbeyzqj:Galimatias%402020@aws-0-us-west-2.pooler.supabase.com:6543/postgres?sslmode=require"
TARGET_SCHEMA = "darien"
TARGET_TABLE = "properties"
CHUNK_SIZE = 100

URABA_CANONICAL_MAP = {
    'TURBO': 'TURBO',
    'NECOCLI': 'NECOCLÍ',
    'APARTADO': 'APARTADÓ',
    'CAREPA': 'CAREPA',
    'CHIGORODO': 'CHIGORODÓ',
    'SAN PEDRO DE URABA': 'SAN PEDRO DE URABÁ',
    'ARBOLETES': 'ARBOLETES',
    'SAN JUAN DE URABA': 'SAN JUAN DE URABÁ',
    'MUTATA': 'MUTATÁ',
    'MURINDO': 'MURINDÓ',
    'VIGIA DEL FUERTE': 'VIGÍA DEL FUERTE'
}

def strip_accents(s):
    if not isinstance(s, str):
        return ""
    s_clean = s.replace('\ufffd', '')
    nfkd = unicodedata.normalize('NFKD', s_clean)
    return "".join([c for c in nfkd if not unicodedata.combining(c)]).strip().upper()

def sanitize_text(val, max_len=None):
    if pd.isna(val) or val is None:
        return None
    s = str(val).strip()
    if s == "" or s.lower() == "nan" or s.lower() == "none":
        return None
    replacements = {
        '\ufffd': '',
        'HECTREAS': 'HECTÁREAS',
        'HECTÁREAS': 'HECTÁREAS',
        'CULA': 'CÉDULA',
        'MATRCULA': 'MATRÍCULA',
        'CLASIFICACIN': 'CLASIFICACIÓN',
        'DIRECCIN': 'DIRECCIÓN',
        'DESCRIPCIN': 'DESCRIPCIÓN',
        'JURDICO': 'JURÍDICO',
        'FSICO': 'FÍSICO',
        'LTIMA': 'ÚLTIMA',
    }
    for k, v in replacements.items():
        s = s.replace(k, v)
    s = s.strip()
    if max_len and len(s) > max_len:
        s = s[:max_len].strip()
    return s

def sanitize_numeric(val):
    if pd.isna(val) or val is None:
        return 0.0
    try:
        n = float(val)
        return 0.0 if np.isnan(n) else n
    except (ValueError, TypeError):
        return 0.0

def main():
    print("==================================================")
    print(" INGESTIÓN DE PREDIOS A SUPABASE (darien.properties)")
    print("==================================================")
    
    if not os.path.exists(EXCEL_PATH):
        print(f"Error: No se encontró el archivo {EXCEL_PATH} en el directorio raíz.")
        sys.exit(1)
        
    print(f"\n[1/4] Leyendo archivo Excel: {EXCEL_PATH}...")
    df_raw = pd.read_excel(EXCEL_PATH, engine="calamine")
    print(f" -> Total filas leídas del Excel: {len(df_raw)}")
    
    print("\n[2/4] Filtrando por DEPARTAMENTO='ANTIOQUIA' y Municipios de Urabá...")
    df_raw['DEPARTAMENTO_NORM'] = df_raw['DEPARTAMENTO'].apply(strip_accents)
    df_raw['MUNICIPIO_NORM'] = df_raw['MUNICIPIO'].apply(strip_accents)

    target_muni_keys = set(URABA_CANONICAL_MAP.keys())
    filtered_df = df_raw[
        (df_raw['DEPARTAMENTO_NORM'] == 'ANTIOQUIA') & 
        (df_raw['MUNICIPIO_NORM'].isin(target_muni_keys))
    ].copy()

    print(f" -> Filas filtradas (Urabá): {len(filtered_df)}")

    # Deduplication on IDACTIVO
    filtered_df['IDACTIVO'] = filtered_df['IDACTIVO'].astype(str).str.strip()
    dedup_df = filtered_df.drop_duplicates(subset=['IDACTIVO']).copy()
    print(f" -> Registros únicos por id_activo: {len(dedup_df)}")

    print("\n[3/4] Saneando y mapeando campos al esquema de darien.properties...")
    records = []
    for _, row in dedup_df.iterrows():
        id_act = str(row['IDACTIVO']).strip()
        muni_norm = strip_accents(row['MUNICIPIO'])
        muni_canonical = URABA_CANONICAL_MAP.get(muni_norm, str(row['MUNICIPIO']).strip().upper())
        dept_canonical = 'ANTIOQUIA'

        dir_val = sanitize_text(row['DIRECCIÓN']) # Full text for address
        desc_val = sanitize_text(row['DESCRIPCION'])

        # title: DIRECCIÓN o DESCRIPCION si está vacía (máximo 255 caracteres para varchar(255))
        raw_title = dir_val if dir_val else (desc_val if desc_val else f"PREDIO {id_act} - {muni_canonical}")
        title = sanitize_text(raw_title, max_len=255)

        prop_type = sanitize_text(row['CLASIFICACIÓN ACTIVO'], max_len=255)
        subtype = sanitize_text(row['SUBTIPO ACTIVO'], max_len=255)
        vereda = sanitize_text(row['VEREDA'], max_len=255)
        address = dir_val
        area_terrain = sanitize_numeric(row['AREA TERRENO'])
        unit_measure = sanitize_text(row['UNIDAD MEDIDA TERRENO'], max_len=255)
        commercial_value = sanitize_numeric(row['AVALUO COMERCIAL'])
        cadastral_id = sanitize_text(row['CÉDULA CATASTRAL'], max_len=255)
        registry_folio = sanitize_text(row['FOLIO DE MATRÍCULA'], max_len=255)
        legal_status = sanitize_text(row['ESTADO LEGAL'], max_len=255)
        occupation_status = sanitize_text(row['ESTADO DE OCUPACION'], max_len=255)
        status = 'disponible'

        records.append({
            'id_activo': id_act,
            'title': title,
            'property_type': prop_type,
            'subtype': subtype,
            'department': dept_canonical,
            'municipality': muni_canonical,
            'vereda': vereda,
            'address': address,
            'area_terrain': area_terrain,
            'unit_measure': unit_measure,
            'commercial_value': commercial_value,
            'cadastral_id': cadastral_id,
            'registry_folio': registry_folio,
            'legal_status': legal_status,
            'occupation_status': occupation_status,
            'status': status
        })

    transformed_df = pd.DataFrame(records)
    print(f" -> Registros procesados y listos: {len(transformed_df)}")

    print(f"\n[4/4] Conectando a Supabase e insertando por lotes (chunksize={CHUNK_SIZE})...")
    engine = sa.create_engine(DB_URI)

    with engine.begin() as connection:
        transformed_df.to_sql(
            name=TARGET_TABLE,
            schema=TARGET_SCHEMA,
            con=connection,
            if_exists='append',
            index=False,
            chunksize=CHUNK_SIZE,
            method='multi'
        )

    # Verification query
    with engine.connect() as conn:
        res = conn.execute(sa.text(f"SELECT COUNT(*) FROM {TARGET_SCHEMA}.{TARGET_TABLE};"))
        total_loaded = res.scalar()

    print("\n==================================================")
    print(" INGESTIÓN COMPLETADA EXITOSAMENTE!")
    print(f" Total de filas registradas en {TARGET_SCHEMA}.{TARGET_TABLE}: {total_loaded}")
    print("==================================================")

if __name__ == "__main__":
    main()
