import os
import sys
import psycopg2

DB_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://postgres.beliwkapymtlufcytwxi:Galimatias%402020@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require"
)

MIGRATION_FILE = os.path.join(
    os.path.dirname(__file__), "..", "supabase", "migrations", "20260914000001_portal_socios_schema.sql"
)

def run_migration():
    print(f"Connecting to database: {DB_URL[:35]}...")
    conn = psycopg2.connect(DB_URL)
    conn.autocommit = True
    cursor = conn.cursor()

    with open(MIGRATION_FILE, "r", encoding="utf-8") as f:
        sql = f.read()

    print("Executing migration 20260914000001_portal_socios_schema.sql...")
    cursor.execute(sql)
    print("Migration executed successfully!")
    cursor.close()
    conn.close()

if __name__ == "__main__":
    run_migration()
