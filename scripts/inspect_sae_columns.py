import os
import pandas as pd

file_path = r"C:\Users\JhonZapata\Desktop\FIC\Administracion Agromar\PRIVATE_AMETH\INMOBILIARIA\SOFTWARE\activos-darien\ANTIOQUIA.xlsx"
df = pd.read_excel(file_path, nrows=5)
print("=== ANTIOQUIA.xlsx Columns ===")
for i, col in enumerate(df.columns):
    print(f"{i+1}. {col}")

print("\n=== First 2 Rows Sample ===")
print(df[['IDACTIVO', 'FOLIO DE MATRÍCULA', 'TIPO ACTIVO', 'DEPARTAMENTO', 'MUNICIPIO', 'DIRECCIÓN', 'ÁREA TERRENO M2']].to_dict(orient='records'))
