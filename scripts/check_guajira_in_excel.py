import os
import pandas as pd

files = [
    r"C:\Users\JhonZapata\Desktop\FIC\Administracion Agromar\PRIVATE_AMETH\INMOBILIARIA\SOFTWARE\activos-darien\ANTIOQUIA.xlsx",
    r"C:\Users\JhonZapata\Desktop\FIC\Administracion Agromar\PRIVATE_AMETH\tierras_cordoba_antioquia_chocó.xlsx"
]

guajira_munis = [
    'RIOHACHA', 'ALBANIA', 'BARRANCAS', 'DIBULLA', 'DISTRACCION', 'DISTRACCIÓN',
    'EL MOLINO', 'FONSECA', 'HATONUEVO', 'LA JAGUA DEL PILAR', 'MAICAO',
    'MANAURE', 'SAN JUAN DEL CESAR', 'URIBIA', 'URUMITA', 'VILLANUEVA', 'GUAJIRA', 'LA GUAJIRA'
]

for f in files:
    if os.path.exists(f):
        print(f"\nChecking file: {os.path.basename(f)}")
        df = pd.read_excel(f)
        
        # Check DEPARTAMENTO column
        dept_col = None
        muni_col = None
        for col in df.columns:
            if 'DEPARTAMENTO' in str(col).upper():
                dept_col = col
            if 'MUNICIPIO' in str(col).upper():
                muni_col = col
                
        print(f"Department Column: {dept_col}, Municipality Column: {muni_col}")
        
        if dept_col:
            guajira_dept_df = df[df[dept_col].astype(str).str.upper().str.contains('GUAJIRA', na=False)]
            print(f"Rows with DEPARTAMENTO containing 'GUAJIRA': {len(guajira_dept_df)}")
            if len(guajira_dept_df) > 0 and muni_col:
                print(guajira_dept_df[[dept_col, muni_col, 'TIPO ACTIVO' if 'TIPO ACTIVO' in df.columns else df.columns[0]]].head(10))

        if muni_col:
            muni_matches = df[df[muni_col].astype(str).str.upper().isin(guajira_munis)]
            print(f"Rows matching La Guajira municipalities in {muni_col}: {len(muni_matches)}")
            if len(muni_matches) > 0:
                print("Municipalities found:")
                print(muni_matches[muni_col].value_counts())
