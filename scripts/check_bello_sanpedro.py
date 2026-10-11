import pandas as pd
import unicodedata

EXCEL_PATH = "ANTIOQUIA.xlsx"

def strip_accents(s):
    if not isinstance(s, str):
        return ""
    nfkd = unicodedata.normalize('NFKD', s)
    return "".join([c for c in nfkd if not unicodedata.combining(c)]).strip().upper()

df = pd.read_excel(EXCEL_PATH, engine="calamine")
dept_col = None
muni_col = None
for c in df.columns:
    if 'DEPARTAMENTO' in strip_accents(c):
        dept_col = c
    if 'MUNICIPIO' in strip_accents(c):
        muni_col = c

df['DEPT_NORM'] = df[dept_col].apply(strip_accents)
df['MUNI_NORM'] = df[muni_col].apply(strip_accents)

antioquia_df = df[df['DEPT_NORM'].str.contains('ANTIOQUIA', na=False)]
print(f"Total filas en Antioquia: {len(antioquia_df)}")

# Check for BELLO
bello_rows = antioquia_df[antioquia_df['MUNI_NORM'].str.contains('BELLO', na=False)]
print(f"Filas con BELLO en Antioquia: {len(bello_rows)}")
print(bello_rows['MUNI_NORM'].value_counts())

# Check for SAN PEDRO
san_pedro_rows = antioquia_df[antioquia_df['MUNI_NORM'].str.contains('SAN PEDRO', na=False)]
print(f"\nFilas con SAN PEDRO en Antioquia: {len(san_pedro_rows)}")
print(san_pedro_rows['MUNI_NORM'].value_counts())
