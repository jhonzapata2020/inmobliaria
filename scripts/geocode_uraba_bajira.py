import os
import re
import math
import time
import json
import urllib.request
import urllib.parse
import unicodedata
import psycopg2
import pandas as pd

EXCEL_PATH = r"C:\Users\JhonZapata\Desktop\MUSSA\Reporte bienes inmuebles 18062024 (3).xlsx"

# Verified base coordinates (from OpenStreetMap Nominatim / official IGAC)
KNOWN_VEREDA_COORDS = {
    # Belén de Bajirá & Los Cedros
    'BAJIRA': (7.3722, -76.7146),
    'BELEN DE BAJIRA': (7.3722, -76.7146),
    'VDA BAJIRA': (7.3722, -76.7146),
    'VDA BELEN DE BAJIRA': (7.3722, -76.7146),
    'VDA BAJIRA LOS CEDROS': (7.3910, -76.6880),
    'LOS CEDROS': (7.3910, -76.6880),

    # Mutatá veredas & corregimientos
    'CAUCHERAS': (7.3336, -76.4863),
    'PAVARANDO': (7.2776, -76.5573),
    'LA FORTUNA': (7.2950, -76.4720),
    'LA LADILLA': (7.2650, -76.4580),
    'LA PAZ': (7.2580, -76.4490),
    'LAS PALMAS': (7.2820, -76.4620),
    'CENTRO': (7.2441, -76.4365),
    'MUTATA': (7.2441, -76.4365),

    # Chigorodó veredas, corregimientos & barrios
    'CHIGORODO': (7.6681, -76.6808),
    'EL GUINEO': (7.6053, -76.6525),
    'PIEDRAS BLANCAS': (7.6980, -76.6150),
    'PIEDRAS BLANCAS -POLINES': (7.7020, -76.6080),
    'PIEDRAS BLANCAS DE POLINES': (7.7020, -76.6080),
    'POLINES': (7.7050, -76.6020),
    'CAREPITA': (7.7150, -76.6720),
    'CHIRIDO': (7.6480, -76.6950),
    'CHAMPITAS': (7.6820, -76.7120),
    'MALAGON': (7.6350, -76.6780),
    'BOHIOS': (7.6550, -76.6890),
    'EL BOSQUE': (7.6714, -76.6848),
    'KENNEDY': (7.6695, -76.6820),
    'EL COCO': (7.6620, -76.6790),
    'LA CURVA': (7.6640, -76.6840),
    'LA FE': (7.6590, -76.6760),
    'LA UNION': (7.6510, -76.6720),
    'LA UNION QUINCE': (7.6460, -76.6700),
    'VILLA DEL CARMEN': (7.6740, -76.6780),
    'ZONA EXPANSION 1': (7.6600, -76.6880),
}

MUNI_FALLBACK = {
    'MUTATA': (7.2441, -76.4365),
    'CHIGORODO': (7.6681, -76.6808),
    'TURBO': (7.3722, -76.7146),  # Turbo row here is VDA BELEN DE BAJIRA
}


def norm(s) -> str:
    s = '' if s is None or (isinstance(s, float) and math.isnan(s)) else str(s)
    s = ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')
    return s.upper().strip()


def load_env():
    env = {}
    with open('.env.local', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def nominatim_lookup(query: str):
    url = 'https://nominatim.openstreetmap.org/search?' + urllib.parse.urlencode({
        'q': query,
        'format': 'json',
        'limit': 1,
        'countrycodes': 'co',
    })
    req = urllib.request.Request(url, headers={'User-Agent': 'ActivosDarienGeocoder/1.0'})
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            if data:
                return float(data[0]['lat']), float(data[0]['lon'])
    except Exception:
        pass
    return None


def resolve_coords(muni_n: str, vereda_n: str, dir_n: str, osm_cache: dict):
    # 1. Explicit Bajirá in address or vereda
    if 'BAJIR' in vereda_n or 'BAJIR' in dir_n:
        if 'CEDRO' in vereda_n or 'CEDRO' in dir_n:
            return KNOWN_VEREDA_COORDS['LOS CEDROS'], 'vereda:LOS CEDROS'
        return KNOWN_VEREDA_COORDS['BELEN DE BAJIRA'], 'vereda:BELEN DE BAJIRA'

    # 2. Check vereda in known table
    if vereda_n in KNOWN_VEREDA_COORDS:
        return KNOWN_VEREDA_COORDS[vereda_n], f'vereda:{vereda_n}'

    # 3. Check keywords inside address (e.g. "VEREDA EL GUINEO", "ALTO CANAGUAY")
    for key, coords in KNOWN_VEREDA_COORDS.items():
        if len(key) >= 5 and key in dir_n:
            return coords, f'addr:{key}'

    # 4. Try Nominatim OSM for unknown vereda
    if vereda_n and vereda_n not in ('NAN', 'NONE', ''):
        cache_key = f"{vereda_n}|{muni_n}"
        if cache_key not in osm_cache:
            res = nominatim_lookup(f"{vereda_n}, {muni_n}, Antioquia, Colombia")
            osm_cache[cache_key] = res
            time.sleep(1.05)
        if osm_cache[cache_key]:
            return osm_cache[cache_key], f'osm:{vereda_n}'

    # 5. Highway KM offset if mentioned (e.g. "KM 1 VI CHIGORODO MEDELLIN")
    km_match = re.search(r'KM\s*(\d+(?:[.,]\d+)?)', dir_n)
    base = MUNI_FALLBACK.get(muni_n, (7.4, -76.6))
    if km_match:
        km = float(km_match.group(1).replace(',', '.'))
        # ~0.009 deg per km; south along Troncal de Uraba towards Medellin
        direction = -1.0 if ('MEDELLIN' in dir_n or 'MUTATA' in dir_n) else 1.0
        return (base[0] + direction * min(km, 25) * 0.0085, base[1] + 0.002 * direction), f'km:{km}'

    return base, f'muni:{muni_n}'


def main():
    env = load_env()
    df = pd.read_excel(EXCEL_PATH)
    df['MUNI_N'] = df['MUNICIPIO'].apply(norm)
    df['DIR_N'] = df['DIRECCIÓN'].apply(norm)
    df['VER_N'] = df['VEREDA'].apply(norm)

    sub = df[
        df['MUNI_N'].str.contains('MUTAT')
        | df['MUNI_N'].str.contains('CHIGOROD')
        | df['MUNI_N'].str.contains('BAJIR')
        | df['DIR_N'].str.contains('BAJIR')
        | df['VER_N'].str.contains('BAJIR')
    ].copy()

    conn = psycopg2.connect(env['DATABASE_URL'])
    cur = conn.cursor()

    osm_cache = {}
    bucket_counts = {}
    updated = 0

    for _, row in sub.iterrows():
        ida = norm(row['IDACTIVO'])
        if not ida:
            continue
        muni_n = row['MUNI_N']
        vereda_raw = '' if pd.isna(row.get('VEREDA')) else str(row.get('VEREDA')).strip()
        vereda_n = row['VER_N']
        dir_n = row['DIR_N']

        (base_lat, base_lng), source = resolve_coords(muni_n, vereda_n, dir_n, osm_cache)

        # Deterministic spiral offset (~200-450m) so pins in same vereda don't overlap
        bkey = (round(base_lat, 4), round(base_lng, 4))
        idx = bucket_counts.get(bkey, 0)
        bucket_counts[bkey] = idx + 1

        if idx > 0:
            angle = idx * 2.39996  # golden angle
            radius = 0.0022 * math.sqrt(idx)
            lat = round(base_lat + radius * math.sin(angle), 6)
            lng = round(base_lng + radius * math.cos(angle), 6)
        else:
            lat = round(base_lat, 6)
            lng = round(base_lng, 6)

        vereda_to_set = vereda_raw or ('BELÉN DE BAJIRÁ' if 'BAJIR' in dir_n else None)

        cur.execute("""
            UPDATE properties
            SET latitude = %s,
                longitude = %s,
                vereda = COALESCE(NULLIF(vereda, ''), %s),
                sector_vereda = COALESCE(NULLIF(sector_vereda, ''), %s),
                updated_at = NOW()
            WHERE sae_id_activo = %s
               OR code = %s
               OR code = %s;
        """, (lat, lng, vereda_to_set, vereda_to_set, ida, f'DAR-EXCEL-{ida}', f'NAC-SAE-{ida}'))

        if cur.rowcount > 0:
            updated += cur.rowcount
            print(f"  {ida} ({muni_n} | {vereda_raw or 'N/A'} | {dir_n[:30]}) -> ({lat}, {lng}) [{source}]")

    conn.commit()
    cur.close()
    conn.close()
    print(f"\nDone! Updated coordinates/vereda for {updated} property rows.")


if __name__ == '__main__':
    main()
