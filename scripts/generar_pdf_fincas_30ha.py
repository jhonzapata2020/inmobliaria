import math
import datetime
import unicodedata
import pandas as pd
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
)

EXCEL_PATH = r"C:\Users\JhonZapata\Desktop\MUSSA\Reporte bienes inmuebles 18062024 (3).xlsx"
OUT_PDF = "Reporte_Fincas_30Ha_Chigorodo_Mutata_Turbo.pdf"


def norm(s):
    s = '' if s is None or (isinstance(s, float) and math.isnan(s)) else str(s)
    return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn').upper().strip()


def clean_str(val, fallback='—'):
    if val is None or (isinstance(val, float) and math.isnan(val)):
        return fallback
    s = str(val).strip()
    if not s or s.lower() in ('nan', 'none', 'null', '-'):
        return fallback
    return s


def to_ha(area, unit):
    try:
        a = float(area)
    except Exception:
        return 0.0
    if math.isnan(a) or a <= 0:
        return 0.0
    u = norm(unit)
    if 'HECT' in u or u == 'HA':
        return a
    return a / 10000.0


def fmt_cop(val):
    try:
        v = float(val)
    except Exception:
        return '$0'
    if math.isnan(v) or v <= 0:
        return '$0'
    return f"${v:,.0f}".replace(',', '.')


def main():
    df = pd.read_excel(EXCEL_PATH)
    df['MUNI_N'] = df['MUNICIPIO'].apply(norm)
    df['DEPT_N'] = df['DEPARTAMENTO'].apply(norm)

    sub = df[(df['DEPT_N'] == 'ANTIOQUIA') & (df['MUNI_N'].isin(['CHIGORODO', 'MUTATA', 'TURBO']))].copy()
    sub['HA'] = [to_ha(a, u) for a, u in zip(sub['AREA TERRENO'], sub['UNIDAD MEDIDA TERRENO'])]
    big = sub[sub['HA'] >= 30.0].sort_values(['MUNI_N', 'HA'], ascending=[True, False]).copy()

    doc = SimpleDocTemplate(
        OUT_PDF,
        pagesize=landscape(letter),
        leftMargin=0.4 * inch,
        rightMargin=0.4 * inch,
        topMargin=0.45 * inch,
        bottomMargin=0.45 * inch,
        title="Reporte de Fincas y Lotes >= 30 Ha — Chigorodó, Mutatá y Turbo",
    )

    styles = getSampleStyleSheet()
    brand_green = colors.HexColor("#1E3A2F")
    brand_gold = colors.HexColor("#C6A15B")
    soft_bg = colors.HexColor("#F8F7F2")
    alt_row = colors.HexColor("#F4F6F4")
    border_col = colors.HexColor("#D6D3C9")

    title_style = ParagraphStyle(
        'TitleCustom', parent=styles['Heading1'],
        fontName='Helvetica-Bold', fontSize=16, textColor=brand_green, spaceAfter=4
    )
    sub_style = ParagraphStyle(
        'SubCustom', parent=styles['Normal'],
        fontName='Helvetica', fontSize=9, textColor=colors.HexColor("#555555"), spaceAfter=10
    )
    sec_style = ParagraphStyle(
        'SecCustom', parent=styles['Heading2'],
        fontName='Helvetica-Bold', fontSize=11.5, textColor=brand_green, spaceBefore=10, spaceAfter=6
    )
    cell_style = ParagraphStyle(
        'Cell', parent=styles['Normal'],
        fontName='Helvetica', fontSize=7.3, leading=9.2, textColor=colors.HexColor("#222222")
    )
    cell_bold = ParagraphStyle(
        'CellBold', parent=cell_style, fontName='Helvetica-Bold'
    )

    story = []
    today_str = datetime.datetime.now().strftime("%d/%m/%Y %H:%M")

    story.append(Paragraph("ACTIVOS & INVERSIONES DARIÉN S.A.S.", ParagraphStyle(
        'Kicker', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, textColor=brand_gold, spaceAfter=2
    )))
    story.append(Paragraph("Reporte Ejecutivo de Fincas y Lotes ≥ 30 Hectáreas", title_style))
    story.append(Paragraph(
        f"Municipios: Chigorodó, Mutatá y Turbo (Antioquia) · Fuente: Base SAE 36,291 registros · Generado: {today_str}",
        sub_style
    ))

    # Summary Table
    total_ha = big['HA'].sum()
    desoc_cnt = (big['ESTADO DE OCUPACION'].astype(str).str.upper() == 'DESOCUPADO').sum()
    extinto_cnt = big['ESTADO LEGAL'].astype(str).str.upper().str.contains('EXTINTO', na=False).sum()
    arrend_cnt = (big['ESTADO DE OCUPACION'].astype(str).str.upper() == 'ARRENDADO').sum()

    summary_data = [
        ['Municipio', 'Predios ≥ 30 Ha', 'Total Hectáreas', 'Desocupados', 'Extinto 100%', 'Arrendados'],
    ]
    for m_key, m_label in [('CHIGORODO', 'Chigorodó'), ('MUTATA', 'Mutatá'), ('TURBO', 'Turbo')]:
        m_df = big[big['MUNI_N'] == m_key]
        summary_data.append([
            m_label,
            str(len(m_df)),
            f"{m_df['HA'].sum():,.2f} Ha",
            str((m_df['ESTADO DE OCUPACION'].astype(str).str.upper() == 'DESOCUPADO').sum()),
            str(m_df['ESTADO LEGAL'].astype(str).str.upper().str.contains('EXTINTO', na=False).sum()),
            str((m_df['ESTADO DE OCUPACION'].astype(str).str.upper() == 'ARRENDADO').sum()),
        ])
    summary_data.append([
        'TOTAL CONSOLIDADO', str(len(big)), f"{total_ha:,.2f} Ha",
        str(desoc_cnt), str(extinto_cnt), str(arrend_cnt)
    ])

    sum_table = Table(summary_data, colWidths=[1.8*inch, 1.3*inch, 1.5*inch, 1.3*inch, 1.3*inch, 1.3*inch])
    sum_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), brand_green),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8.5),
        ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('BACKGROUND', (0, -1), (-1, -1), soft_bg),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('GRID', (0, 0), (-1, -1), 0.5, border_col),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(sum_table)
    story.append(Spacer(1, 10))

    col_widths = [0.58*inch, 0.85*inch, 2.15*inch, 1.45*inch, 0.68*inch, 1.05*inch, 1.02*inch, 1.15*inch, 0.85*inch]

    for idx_m, (m_key, m_label) in enumerate([('CHIGORODO', '1. Chigorodó'), ('MUTATA', '2. Mutatá'), ('TURBO', '3. Turbo')]):
        m_df = big[big['MUNI_N'] == m_key]
        if idx_m == 2:
            story.append(PageBreak())
        story.append(Paragraph(f"{m_label} ({len(m_df)} predios · {m_df['HA'].sum():,.2f} Ha)", sec_style))

        rows = [[
            'ID SAE', 'Matrícula', 'Nombre / Dirección', 'Vereda',
            'Área (Ha)', 'Avalúo Catastral', 'Arriendo Est./mes', 'Estado Legal', 'Ocupación'
        ]]

        for _, r in m_df.iterrows():
            ida = clean_str(r['IDACTIVO'])
            mat = clean_str(r['FOLIO DE MATRÍCULA'])
            dir_s = clean_str(r['DIRECCIÓN'])
            ver_s = clean_str(r['VEREDA'])
            ha_s = f"{r['HA']:,.2f}"
            cat_s = fmt_cop(r['AVALÚO CATASTRAL'])
            ren_s = fmt_cop(r['ESTIMATIVO DE RENTA'])
            leg_s = clean_str(r['ESTADO LEGAL'])
            ocu_s = clean_str(r['ESTADO DE OCUPACION'], 'Sin dato')

            leg_p = Paragraph(
                f"<b><font color='#065F46'>{leg_s}</font></b>" if 'EXTINTO' in leg_s.upper() else leg_s,
                cell_style
            )
            ocu_p = Paragraph(
                f"<b><font color='#047857'>{ocu_s}</font></b>" if ocu_s.upper() == 'DESOCUPADO' else ocu_s,
                cell_style
            )

            rows.append([
                Paragraph(ida, cell_bold),
                Paragraph(mat, cell_bold),
                Paragraph(dir_s, cell_style),
                Paragraph(ver_s, cell_style),
                Paragraph(ha_s, ParagraphStyle('Right', parent=cell_bold, alignment=2)),
                Paragraph(cat_s, ParagraphStyle('RightC', parent=cell_style, alignment=2)),
                Paragraph(ren_s, ParagraphStyle('RightR', parent=cell_style, alignment=2)),
                leg_p,
                ocu_p,
            ])

        tbl = Table(rows, colWidths=col_widths, repeatRows=1)
        tbl.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), brand_green),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 7.5),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, alt_row]),
            ('GRID', (0, 0), (-1, -1), 0.35, border_col),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('LEFTPADDING', (0, 0), (-1, -1), 4),
            ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ]))
        story.append(tbl)
        story.append(Spacer(1, 10))

    doc.build(story)
    print(f"PDF generado exitosamente: {OUT_PDF} ({len(big)} predios)")


if __name__ == '__main__':
    main()
