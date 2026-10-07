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

valle_df = df[df['DEPT_NORM'].str.contains('VALLE', na=False)]
print(f"Total filas en Valle del Cauca: {len(valle_df)}")

if len(valle_df) > 0:
    print("\nDesglose por Municipio en Valle del Cauca:")
    muni_counts = valle_df['MUNI_NORM'].value_counts()
    print(muni_counts)
else:
    print("No se encontraron filas con DEPARTAMENTO conteniendo 'VALLE'.")
    print("\nDepartamentos disponibles en la base de datos de Excel:")
    print(df['DEPT_NORM'].value_counts())
