import os
import sys
import json
import math
import requests

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "https://ehfejbgzronpllbeyzqj.supabase.co")
SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

REST_URL = f"{SUPABASE_URL}/rest/v1/properties"
HEADERS = {
    "apikey": SERVICE_ROLE_KEY,
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

PLATANERA_BANANERA_IMAGES = [
    'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1596797882870-8c33deeac224?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1592417817098-8f3d69104a47?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1544986581-efac024faf62?auto=format&fit=crop&w=1200&q=80',
]

FINCA_GANADERA_IMAGES = [
    'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=1200&q=80',
]

FINCA_CAMPESTRE_IMAGES = [
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1200&q=80',
]

LOTE_TERRENO_IMAGES = [
    'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
]

CASA_IMAGES = [
    'https://images.unsplash.com/photo-160058515526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
]

APARTAMENTO_IMAGES = [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
]

BODEGA_LOCAL_EDIFICIO_IMAGES = [
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
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

def pick_images(code, asset_type, title, desc, muni):
    h = hash_str(code)
    t = (title or "").lower()
    d = (desc or "").lower()
    m = (muni or "").lower()
    a = (asset_type or "").lower()

    is_platanera = (
        "platano" in t or "plátano" in t or "banano" in t or
        "platano" in d or "plátano" in d or "banano" in d or
        m in ["turbo", "apartado", "apartadó", "carepa", "chigorodo", "chigorodó", "necocli", "necoclí"]
    )

    if "finca" in a:
        if is_platanera and h % 2 == 0:
            pool = PLATANERA_BANANERA_IMAGES
        elif h % 3 == 0:
            pool = FINCA_CAMPESTRE_IMAGES
        else:
            pool = FINCA_GANADERA_IMAGES
    elif "lote" in a or "terreno" in a:
        pool = LOTE_TERRENO_IMAGES
    elif "casa" in a:
        pool = CASA_IMAGES
    elif "apartamento" in a or "apto" in a:
        pool = APARTAMENTO_IMAGES
    elif "bodega" in a or "local" in a or "edificio" in a or "oficina" in a:
        pool = BODEGA_LOCAL_EDIFICIO_IMAGES
    elif "parqueadero" in a or "garaje" in a:
        pool = PARQUEADERO_IMAGES
    else:
        pool = PLATANERA_BANANERA_IMAGES if is_platanera else FINCA_GANADERA_IMAGES

    img1 = pool[h % len(pool)]
    img2 = pool[(h + 1) % len(pool)]
    img3 = pool[(h + 2) % len(pool)]
    return [img1, img2, img3]

def main():
    print("Fetching all properties from Supabase to assign beautiful curated images...")
    # Fetch all published properties in chunks of 500
    all_props = []
    offset = 0
    limit = 500
    while True:
        url = f"{REST_URL}?select=id,code,asset_type,title,description,municipality&editorial_status=eq.published&limit={limit}&offset={offset}"
        res = requests.get(url, headers={"apikey": SERVICE_ROLE_KEY, "Authorization": f"Bearer {SERVICE_ROLE_KEY}"})
        if res.status_code != 200 or not res.json():
            break
        data = res.json()
        all_props.extend(data)
        if len(data) < limit:
            break
        offset += limit

    print(f"Total properties to update images: {len(all_props)}")

    updated = 0
    # Batch update via PATCH
    for p in all_props:
        pid = p["id"]
        code = p.get("code") or pid
        asset_type = p.get("asset_type") or "Finca"
        title = p.get("title") or ""
        desc = p.get("description") or ""
        muni = p.get("municipality") or ""

        images = pick_images(code, asset_type, title, desc, muni)
        featured = images[0]

        patch_url = f"{REST_URL}?id=eq.{pid}"
        payload = {
            "featured_image": featured,
            "images": images
        }
        res = requests.patch(patch_url, headers=HEADERS, json=payload)
        if res.status_code in [200, 204]:
            updated += 1
            if updated % 100 == 0:
                print(f"Updated {updated}/{len(all_props)} properties...")
        else:
            print(f"Failed to update property {code}: {res.status_code}")

    print(f"\nCompleted! Successfully assigned high-render photography to {updated} properties in Supabase.")

if __name__ == "__main__":
    main()
