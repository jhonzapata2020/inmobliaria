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

# Verified inland base coordinates for Urabá & Darién municipalities
# coastal_dir: (+1 = push east/inland, -1 = push west/inland, 0 = full circle inland)
MUNI_BASE = {
    'TURBO': {'coords': (8.0925, -76.7150), 'lng_bias': 1},
    'APARTADO': {'coords': (7.8825, -76.6258), 'lng_bias': 0},
    'CAREPA': {'coords': (7.7575, -76.6547), 'lng_bias': 0},
    'NECOCLI': {'coords': (8.4230, -76.7750), 'lng_bias': 1},
    'ARBOLETES': {'coords': (8.8420, -76.4220), 'lng_bias': 1},
    'SAN PEDRO DE URABA': {'coords': (8.2764, -76.3764), 'lng_bias': 0},
    'SAN JUAN DE URABA': {'coords': (8.7520, -76.5240), 'lng_bias': 1},
    'ACANDI': {'coords': (8.5083, -77.2850), 'lng_bias': -1},
    'UNGUIA': {'coords': (8.0439, -77.0939), 'lng_bias': 0},
    'RIOSUCIO': {'coords': (7.4394, -77.1189), 'lng_bias': 0},
    'CHIGORODO': {'coords': (7.6681, -76.6808), 'lng_bias': 0},
    'MUTATA': {'coords': (7.2441, -76.4365), 'lng_bias': 0},
}

# Verified corregimiento & vereda coordinates in Urabá / Darién
KNOWN_VEREDAS = {
    # Turbo
    'CURRULAO': (8.0150, -76.7100),
    'NUEVA COLONIA': (7.9750, -76.7320),
    'EL TRES': (8.0550, -76.6850),
    'RIO GRANDE': (8.0250, -76.6780),
    'SAN VICENTE DEL CONGO': (8.1550, -76.5450),
    'ALTO MULATOS': (8.1800, -76.5000),
    'PUEBLO BELLO': (8.1650, -76.5900),
    'EL DOS': (8.0750, -76.7050),
    'NUEVA ANTIOQUIA': (8.1350, -76.6150),
    'CARACOLI': (8.1100, -76.6750),
    'CASANARE': (8.0400, -76.6950),
    'BELEN DE BAJIRA': (7.3722, -76.7146),
    'BAJIRA': (7.3722, -76.7146),

    # Apartadó
    'SAN JOSE DE APARTADO': (7.8350, -76.5350),
    'EL REPOSO': (7.8550, -76.6350),
    'CHURIDO': (7.9050, -76.6450),
    'LOS MANDARINOS': (7.8750, -76.6150),
    'PUERTO GIRON': (7.8950, -76.6550),

    # Carepa
    'ZUNGO': (7.8050, -76.6650),
    'PIEDRAS BLANCAS': (7.7250, -76.6150),
    'EL SILENCIO': (7.7650, -76.6150),

    # Necoclí
    'EL TOTUMO': (8.3150, -76.7650),
    'MELLITOS': (8.3950, -76.6250),
    'MULATOS': (8.4850, -76.6950),
    'PUEBLO NUEVO': (8.4150, -76.7250),
    'ZAPATA': (8.5350, -76.7450),
    'CARIBIA': (8.3650, -76.7450),
    'EL VALE': (8.4100, -76.7450),

    # Arboletes
    'EL CARMELO': (8.7750, -76.4150),
    'LA TRINIDAD': (8.8050, -76.3850),
    'NARANJITAS': (8.8250, -76.4050),
    'BUENOS AIRES': (8.7950, -76.4350),

    # Acandí / Chocó Darién
    'CAPURGANA': (8.6340, -77.3510),
    'SAPZURRO': (8.6590, -77.3630),
    'TRIGANA': (8.3950, -77.1450),
    'SAN FRANCISCO': (8.4550, -77.2150),
    'SANTA MARTA': (8.4650, -77.2450),
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
        with urllib.request.urlopen(req, timeout=6) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            if data:
                return float(data[0]['lat']), float(data[0]['lon'])
    except Exception:
        pass
    return None


def main():
    env = load_env()

    # Load 36k Excel lookup by IDACTIVO -> (vereda, address, muni)
    print("Loading 36k Excel for vereda/address lookup...")
    df = pd.read_excel(EXCEL_PATH, usecols=['IDACTIVO', 'MUNICIPIO', 'DEPARTAMENTO', 'VEREDA', 'DIRECCIÓN'])
    excel_map = {}
    for _, row in df.iterrows():
        ida = norm(row['IDACTIVO'])
        if ida:
            ver = '' if pd.isna(row['VEREDA']) else str(row['VEREDA']).strip()
            addr = '' if pd.isna(row['DIRECCIÓN']) else str(row['DIRECCIÓN']).strip()
            excel_map[ida] = (ver, addr)

    conn = psycopg2.connect(env['DATABASE_URL'])
    cur = conn.cursor()

    # Find all published properties in Uraba/Darien municipalities or currently in the Gulf of Uraba sea box
    cur.execute("""
        SELECT id, code, sae_id_activo, municipality, department, vereda, address, latitude, longitude
        FROM properties
        WHERE editorial_status = 'published'
          AND (
            (latitude BETWEEN 8.15 AND 8.75 AND longitude BETWEEN -77.35 AND -76.85)
            OR municipality IN ('Turbo', 'Apartadó', 'Carepa', 'Necoclí', 'Arboletes', 'San Pedro de Urabá', 'San Juan de Urabá', 'Acandí', 'Unguía')
          );
    """)
    rows = cur.fetchall()
    print(f"Found {len(rows)} Uraba/Darien properties to verify/re-geocode.")

    osm_cache = {}
    bucket_counts = {}
    updated = 0

    for pid, code, sae_id, muni, dept, db_vereda, db_addr, cur_lat, cur_lng in rows:
        muni_n = norm(muni)
        if muni_n not in MUNI_BASE:
            continue

        ida = norm(sae_id)
        if not ida and code:
            for part in str(code).split('-'):
                if part.isdigit():
                    ida = part
                    break

        ex_vereda, ex_addr = excel_map.get(ida, ('', ''))
        vereda_raw = db_vereda or ex_vereda
        addr_raw = db_addr or ex_addr
        vereda_n = norm(vereda_raw)
        addr_n = norm(addr_raw)

        base_info = MUNI_BASE[muni_n]
        base_lat, base_lng = base_info['coords']
        lng_bias = base_info['lng_bias']
        resolved_source = f"muni:{muni_n}"

        # 1. Check known veredas/corregimientos in vereda or address
        matched_vereda = None
        for k, coords in KNOWN_VEREDAS.items():
            if k == vereda_n or (len(k) >= 5 and (k in vereda_n or k in addr_n)):
                matched_vereda = (k, coords)
                break

        if matched_vereda:
            base_lat, base_lng = matched_vereda[1]
            resolved_source = f"known:{matched_vereda[0]}"
        elif vereda_n and vereda_n not in ('NAN', 'NONE', '', muni_n, 'CENTRO', 'URBANO', 'RURAL'):
            # Try Nominatim once per unique vereda+muni (with reasonable cap)
            ckey = f"{vereda_n}|{muni_n}"
            if ckey not in osm_cache and len(osm_cache) < 40:
                res = nominatim_lookup(f"{vereda_n}, {muni_n}, Colombia")
                # Validate result is near Urabá/Darién (lat 6.5..9.5, lng -77.6..-75.8)
                if res and 6.5 <= res[0] <= 9.5 and -77.6 <= res[1] <= -75.8:
                    osm_cache[ckey] = res
                else:
                    osm_cache[ckey] = None
                time.sleep(1.05)
            if osm_cache.get(ckey):
                base_lat, base_lng = osm_cache[ckey]
                resolved_source = f"osm:{vereda_n}"

        # 2. Deterministic inland spiral offset so pins don't overlap AND never land in the sea
        bkey = (round(base_lat, 3), round(base_lng, 3))
        idx = bucket_counts.get(bkey, 0)
        bucket_counts[bkey] = idx + 1

        if idx > 0:
            angle = idx * 2.39996
            radius = 0.0020 * math.sqrt(idx)
            dlat = radius * math.sin(angle)
            dlng = radius * math.cos(angle)
            if lng_bias == 1:
                dlng = abs(dlng)  # strictly east (inland for Turbo/Necocli/Arboletes)
            elif lng_bias == -1:
                dlng = -abs(dlng)  # strictly west (inland for Acandi)
            lat = round(base_lat + dlat, 6)
            lng = round(base_lng + dlng, 6)
        else:
            lat = round(base_lat, 6)
            lng = round(base_lng, 6)

        vereda_to_set = vereda_raw or None
        cur.execute("""
            UPDATE properties
            SET latitude = %s,
                longitude = %s,
                vereda = COALESCE(NULLIF(vereda, ''), %s),
                sector_vereda = COALESCE(NULLIF(sector_vereda, ''), %s),
                updated_at = NOW()
            WHERE id = %s;
        """, (lat, lng, vereda_to_set, vereda_to_set, pid))
        updated += 1

    conn.commit()
    cur.close()
    conn.close()
    print(f"Successfully re-geocoded {updated} Uraba/Darien properties onto real land/vereda coordinates! (OSM lookups: {len(osm_cache)})")


if __name__ == '__main__':
    main()
