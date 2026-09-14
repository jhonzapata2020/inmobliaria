import os
import pandas as pd

files = [
    r"C:\Users\JhonZapata\Desktop\FIC\Administracion Agromar\PRIVATE_AMETH\tierras_cordoba_antioquia_chocó.xlsx",
    r"C:\Users\JhonZapata\Desktop\FIC\Administracion Agromar\PRIVATE_AMETH\INMOBILIARIA\SOFTWARE\activos-darien\ANTIOQUIA.xlsx",
    r"C:\Users\JhonZapata\Desktop\FIC\Administracion Agromar\PRIVATE_AMETH\INMOBILIARIA\Fincas\fincas_urabá_total.xlsx",
    r"C:\Users\JhonZapata\Desktop\FIC\Administracion Agromar\PRIVATE_AMETH\REPORTES\fincas_turbo.xlsx"
]

for f in files:
    if os.path.exists(f):
        try:
            xl = pd.ExcelFile(f)
            print(f"File: {os.path.basename(f)}")
            print(f"  Sheets: {xl.sheet_names}")
            for s in xl.sheet_names:
                df = xl.parse(s)
                print(f"  Sheet '{s}': {len(df)} rows, {len(df.columns)} columns")
                print(f"  Sample Columns: {list(df.columns[:10])}")
        except Exception as e:
            print(f"Error reading {f}: {e}")
    else:
        print(f"File not found: {f}")
