import os
import sys
import psycopg2

DB_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://postgres.beliwkapymtlufcytwxi:Galimatias%402020@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require"
)

MIGRATIONS = [
    os.path.join(os.path.dirname(__file__), "..", "supabase", "migrations", "20260914000001_portal_socios_schema.sql"),
    os.path.join(os.path.dirname(__file__), "..", "supabase", "migrations", "20260914000002_flexible_commissions_and_partner_profile.sql"),
]

def run_migrations():
    print(f"Connecting to database: {DB_URL[:35]}...")
    conn = psycopg2.connect(DB_URL)
    conn.autocommit = True
    cursor = conn.cursor()

    for mfile in MIGRATIONS:
        if os.path.exists(mfile):
            print(f"Executing migration {os.path.basename(mfile)}...")
            with open(mfile, "r", encoding="utf-8") as f:
                sql = f.read()
            cursor.execute(sql)
            print(f"Migration {os.path.basename(mfile)} executed successfully!")

    cursor.close()
    conn.close()

if __name__ == "__main__":
    run_migrations()
