import psycopg2

poolers = [
    "aws-0-us-east-2.pooler.supabase.com",
    "aws-0-us-east-1.pooler.supabase.com",
    "aws-0-us-west-1.pooler.supabase.com",
    "aws-0-sa-east-1.pooler.supabase.com",
]

projects = [
    ("beliwkapymtlufcytwxi", "Galimatias%402020"),
    ("ehfejbgzronpllbeyzqj", "Galimatias%402020"),
]

for p_id, p_pass in projects:
    for host in poolers:
        url = f"postgresql://postgres.{p_id}:{p_pass}@{host}:6543/postgres?sslmode=require"
        print(f"Testing {p_id} on {host}:")
        try:
            conn = psycopg2.connect(url)
            print(" -> SUCCESS SUCCESS SUCCESS!")
            conn.close()
            print(f"WINNING URL: {url}")
            break
        except Exception as e:
            print(f" -> {e}".strip())
