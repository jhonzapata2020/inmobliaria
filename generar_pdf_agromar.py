import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """
    Canvas personalizado de dos pasadas para incluir pie de página con número de página 
    formateado como 'Página X de Y' y encabezado formal.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        
        # Dimensiones de la página Letter
        page_width = 612
        page_height = 792
        margin = 36

        # Encabezado secundario (solo a partir de la página 2)
        if self._pageNumber > 1:
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#0F2942"))
            self.drawString(margin, page_height - 25, "AGROMAR | MEMORANDO ESTRATÉGICO DE BANCABILIDAD & ESTRUCTURACIÓN")
            
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#4A5568"))
            self.drawRightString(page_width - margin, page_height - 25, "Septiembre 2026")
            
            self.setStrokeColor(colors.HexColor("#CBD5E0"))
            self.setLineWidth(0.75)
            self.line(margin, page_height - 30, page_width - margin, page_height - 30)

        # Pie de página (en todas las páginas)
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#1B6B4A"))
        self.drawString(margin, 22, "AGROMAR")
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#718096"))
        self.drawString(margin + 50, 22, "| Plataforma de Agroexportación, Contratos Forward y Zonificación Productiva")
        
        page_text = f"Página {self._pageNumber} de {page_count}"
        self.drawRightString(page_width - margin, 22, page_text)
        
        self.setStrokeColor(colors.HexColor("#CBD5E0"))
        self.setLineWidth(0.75)
        self.line(margin, 34, page_width - margin, 34)

        self.restoreState()


def generar_pdf():
    pdf_filename = "AGROMAR_Propuesta_Agroexportacion_Forward_Tierras.pdf"
    
    # Configuración de documento con márgenes de 36 pt (0.5 pulgadas)
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=40,
        bottomMargin=45
    )

    styles = getSampleStyleSheet()
    
    # Colores Principales
    NAVY = colors.HexColor("#0F2942")
    AGRO_GREEN = colors.HexColor("#1B6B4A")
    SLATE_DARK = colors.HexColor("#2D3748")
    SLATE_LIGHT = colors.HexColor("#F7FAFC")
    BORDER_COLOR = colors.HexColor("#E2E8F0")
    GOLD_ACCENT = colors.HexColor("#D69E2E")

    # Modificación / Creación de Estilos de Texto
    styles['Normal'].textColor = SLATE_DARK
    styles['Normal'].fontSize = 9.5
    styles['Normal'].leading = 13.5
    styles['Normal'].fontName = 'Helvetica'

    body_style = styles['Normal']
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.white,
        alignment=0
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#E2E8F0")
    )

    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11.5,
        leading=15,
        textColor=NAVY,
        spaceBefore=12,
        spaceAfter=4
    )

    sub_section_heading = ParagraphStyle(
        'SubSectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=AGRO_GREEN,
        spaceBefore=8,
        spaceAfter=4
    )

    callout_text = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=NAVY
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white,
        alignment=1
    )

    table_body_bold = ParagraphStyle(
        'TableBodyBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=NAVY
    )

    table_body_normal = ParagraphStyle(
        'TableBodyNormal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=SLATE_DARK
    )

    qa_question_style = ParagraphStyle(
        'QAQuestion',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=NAVY
    )

    qa_answer_style = ParagraphStyle(
        'QAAnswer',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=SLATE_DARK
    )

    story = []

    # ---------------------------------------------------------
    # ENCABEZADO ESTRATÉGICO Y BANNER
    # ---------------------------------------------------------
    header_content = [
        [Paragraph("MEMORANDO ESTRATÉGICO DE BANCABILIDAD & ESTRUCTURACIÓN DE PROYECTOS", title_style)],
        [Spacer(1, 3)],
        [Paragraph("<b>AGROMAR:</b> Plataforma de Agroexportación, Contratos Forward y Zonificación Productiva", ParagraphStyle('SubHeader', parent=title_style, fontSize=10.5, leading=13.5, textColor=GOLD_ACCENT))],
        [Spacer(1, 4)],
        [Paragraph("<b>Subregiones Objetivos:</b> Urabá Portuario, Bajo Atrato, Belén de Bajirá, Mutatá y Córdoba. &nbsp;&nbsp;|&nbsp;&nbsp; <b>Fecha:</b> Septiembre 2026", subtitle_style)]
    ]
    
    header_table = Table(header_content, colWidths=[540])
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), NAVY),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 10))

    # ---------------------------------------------------------
    # SECCIÓN 1: TESIS COMERCIAL
    # ---------------------------------------------------------
    story.append(Paragraph("1. Tesis Comercial: Integración de Cadena & Origen de Contratos Forward", section_heading))
    story.append(HRFlowable(width="100%", thickness=1.5, color=AGRO_GREEN, spaceBefore=1, spaceAfter=6))

    tesis_p1 = (
        "<b>AGROMAR</b> se estructura como una plataforma integral de origen agrícola, articulando la tenencia "
        "legítima de tierras aptas en el noroccidente colombiano con la demanda formal de compradores "
        "institucionales internacionales y nacionales. La tesis central radica en transformar la producción agrícola "
        "en un <b>activo bancable estructurado</b> mediante la originación de contratos de venta anticipada "
        "(<i>Forward/Offtake</i>)."
    )
    story.append(Paragraph(tesis_p1, body_style))
    story.append(Spacer(1, 5))

    # Box de Highlights de la Tesis
    callout_data = [[
        Paragraph(
            "<b>Pilares Estratégicos de Integración:</b><br/>"
            "• <b>Acceso Legítimo a Suelos de Alta Aptitud:</b> Articulación de tierra bajo modelos de usufructo y alianzas sin conflictividad.<br/>"
            "• <b>Demanda Institucional Garantizada:</b> Contratos Forward con compradores clave en Plátano, Maíz, Piña MD2, Limón Tahití y Cacao.<br/>"
            "• <b>Ventaja Logística de Puerto Antioquia:</b> Reducción drástica de costos de flete terrestre y tiempos de tránsito hacia EE.UU. y Europa.",
            callout_text
        )
    ]]
    callout_table = Table(callout_data, colWidths=[540])
    callout_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), SLATE_LIGHT),
        ('BOX', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('LINELEFT', (0,0), (0,0), 3.5, AGRO_GREEN),
        ('PADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(callout_table)
    story.append(Spacer(1, 6))

    tesis_p2 = (
        "<b>Ventaja Logística Competitiva (Puerto Antioquia):</b> La entrada en operación de Puerto Antioquia en el Golfo de Urabá "
        "redefine la ecuación económica del proyecto. Reduce en más de 300 km el trayecto terrestre comparado con los puertos del "
        "Caribe tradicional (Cartagena/Barranquilla), recortando los fletes de transporte interior entre un 30% y 40%. Esta "
        "cercanía física a las zonas de producción de Urabá, Bajo Atrato, Bajirá, Mutatá y Córdoba permite consolidar una cadena "
        "de frío ininterrumpida y colocar fruta fresca en puertos de la Costa Este de EE.UU. y Europa en tiempos récord, maximizando "
        "la vida útil en anaquel y la rentabilidad por contenedor."
    )
    story.append(Paragraph(tesis_p2, body_style))
    story.append(Spacer(1, 10))

    # ---------------------------------------------------------
    # SECCIÓN 2: TABLA DE ZONIFICACIÓN PRODUCTIVA DEMOSTRADA
    # ---------------------------------------------------------
    story.append(Paragraph("2. Tabla de Zonificación Productiva Demostrada", section_heading))
    story.append(HRFlowable(width="100%", thickness=1.5, color=AGRO_GREEN, spaceBefore=1, spaceAfter=6))

    zonif_intro = (
        "La selección de cultivos responde a una estricta correspondencia entre la edafología de las subregiones, "
        "la disponibilidad de agua y los requerimientos comerciales de los compradores institucionales:"
    )
    story.append(Paragraph(zonif_intro, body_style))
    story.append(Spacer(1, 5))

    # Tabla de Zonificación
    # Total width = 540 pt -> [105, 110, 140, 185]
    table_data = [
        [
            Paragraph("Cultivo / Variedad", table_header_style),
            Paragraph("Subregiones Aptas", table_header_style),
            Paragraph("Condiciones Edafoclimáticas", table_header_style),
            Paragraph("Estructura Comercial & Forward", table_header_style)
        ],
        [
            Paragraph("<b>Plátano Hartón</b><br/>(Fresco de Exportación)", table_body_bold),
            Paragraph("Urabá Portuario y Belén de Bajirá", table_body_normal),
            Paragraph("Suelos aluviales profundos clases I y II, alta fertilidad y drenaje natural.", table_body_normal),
            Paragraph("Forward indexado a USD hacia distribuidores de EE.UU. y Europa con volumen semanal constante.", table_body_normal)
        ],
        [
            Paragraph("<b>Piña Oro Miel</b><br/>(Variedad MD2)", table_body_bold),
            Paragraph("Urabá, Mutatá y Chigorodó", table_body_normal),
            Paragraph("Grado Brix >14°, óptima radiación solar y suelos de textura franca bien drenados.", table_body_normal),
            Paragraph("Suministro programado por calendario de corte en contenedor refrigerado (Reefer).", table_body_normal)
        ],
        [
            Paragraph("<b>Maíz Tecnificado</b><br/>(Amarillo / Blanco)", table_body_bold),
            Paragraph("Mutatá, Bajirá y llanuras de Córdoba", table_body_normal),
            Paragraph("Ciclo ultra-corto de 120 días, ideal para mecanización intensiva y rotación.", table_body_normal),
            Paragraph("Forward con la industria concentrada nacional para sustitución de importaciones de granos.", table_body_normal)
        ],
        [
            Paragraph("<b>Cacao Fino de Aroma</b><br/>& Agroforestería", table_body_bold),
            Paragraph("Bajo Atrato y Mutatá", table_body_normal),
            Paragraph("Selva húmeda bajo dosel maderable, esquemas productivos 100% libre de deforestación.", table_body_normal),
            Paragraph("Offtake a 10-15 años con primas ESG bajo estricto cumplimiento de la normativa EUDR (Unión Europea).", table_body_normal)
        ],
        [
            Paragraph("<b>Limón Tahití</b><br/>(Calidad Exportación)", table_body_bold),
            Paragraph("Córdoba y Norte de Urabá", table_body_normal),
            Paragraph("Suelos francos con excelente drenaje y microclima de moderada precipitación.", table_body_normal),
            Paragraph("Cupos exportables consolidados con plantas empacadoras certificadas GlobalGAP y Fairtrade.", table_body_normal)
        ]
    ]

    zonif_table = Table(table_data, colWidths=[105, 110, 140, 185])
    zonif_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), NAVY),
        ('ALIGN', (0,0), (-1,0), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BACKGROUND', (0,1), (-1,1), colors.white),
        ('BACKGROUND', (0,2), (-1,2), SLATE_LIGHT),
        ('BACKGROUND', (0,3), (-1,3), colors.white),
        ('BACKGROUND', (0,4), (-1,4), SLATE_LIGHT),
        ('BACKGROUND', (0,5), (-1,5), colors.white),
        ('PADDING', (0,0), (-1,-1), 4.5),
    ]))
    story.append(zonif_table)
    story.append(Spacer(1, 10))

    # ---------------------------------------------------------
    # SECCIÓN 3: BLINDAJE FINANCIERO (EL CONTRATO FORWARD COMO GARANTÍA)
    # ---------------------------------------------------------
    story.append(Paragraph("3. Blindaje Financiero: El Contrato Forward como Garantía Bancable", section_heading))
    story.append(HRFlowable(width="100%", thickness=1.5, color=AGRO_GREEN, spaceBefore=1, spaceAfter=6))

    blindaje_p1 = (
        "En la estructuración de finanzas agrícolas tradicionales, la tierra suele considerarse el colateral principal; "
        "sin embargo, la tierra es un activo <b>ilíquido y complejo de ejecutar</b>. En el modelo AGROMAR, <b>el contrato "
        "forward/offtake es el verdadero colateral bancable</b> que respalda el servicio de la deuda, pues garantiza el "
        "flujo de caja futuro antes de iniciar la siembra."
    )
    story.append(Paragraph(blindaje_p1, body_style))
    story.append(Spacer(1, 5))

    # Subsección Patrimonio Autónomo y Cascada
    story.append(Paragraph("Estructura de Patrimonio Autónomo (Fiducia de Administración y Fuente de Pago)", sub_section_heading))
    
    fiducia_p = (
        "Los recursos provenientes de los compradores internacionales y nacionales no ingresan a las cuentas operativas "
        "de AGROMAR, sino que son consignados directamente en una cuenta de un <b>Patrimonio Autónomo (Fideicomiso)</b> "
        "administrado por una entidad fiduciaria vigilada. Esta fiducia ejecuta de forma automatizada la <b>Cascada de Pagos</b>:"
    )
    story.append(Paragraph(fiducia_p, body_style))
    story.append(Spacer(1, 5))

    # Cascada de pagos representada en tabla estilizada
    cascada_data = [
        [
            Paragraph("Prelación", table_header_style),
            Paragraph("Nivel de Cascada", table_header_style),
            Paragraph("Mecanismo de Cobertura y Destino de los Fondos", table_header_style)
        ],
        [
            Paragraph("<b>1° Prioridad</b>", ParagraphStyle('P1', parent=table_body_bold, textColor=colors.HexColor("#C53030"))),
            Paragraph("<b>Servicio de Deuda Bancaria</b>", table_body_bold),
            Paragraph("Pago directo de amortización de capital e intereses a las entidades financieras prestamistas.", table_body_normal)
        ],
        [
            Paragraph("<b>2° Prioridad</b>", ParagraphStyle('P2', parent=table_body_bold, textColor=colors.HexColor("#DD6B20"))),
            Paragraph("<b>Costos Operativos (OPEX)</b>", table_body_bold),
            Paragraph("Liberación de fondos estrictamente presupuestados para insumos, nómina agrícola, empaque y logística.", table_body_normal)
        ],
        [
            Paragraph("<b>3° Prioridad</b>", ParagraphStyle('P3', parent=table_body_bold, textColor=AGRO_GREEN)),
            Paragraph("<b>Dividendo / Retorno</b>", table_body_bold),
            Paragraph("Remanente liberado a los promotores e inversionistas tras verificar el cumplimiento de coberturas de deuda (DSCR > 1.30x).", table_body_normal)
        ]
    ]

    cascada_table = Table(cascada_data, colWidths=[80, 140, 320])
    cascada_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), NAVY),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BACKGROUND', (0,1), (-1,1), colors.white),
        ('BACKGROUND', (0,2), (-1,2), SLATE_LIGHT),
        ('BACKGROUND', (0,3), (-1,3), colors.white),
        ('PADDING', (0,0), (-1,-1), 4.5),
    ]))
    story.append(cascada_table)
    story.append(Spacer(1, 5))

    inmunidad_p = (
        "<b>Inmunidad a la Caída de Precios:</b> Al fijar precios mediante contratos Forward con bandas de flotación "
        "(<i>Collars</i>) o precios pisos garantizados, la plataforma desvincula los ingresos del proyecto de la volatilidad "
        "spot de los mercados de commodities, asegurando la predictibilidad total del servicio de la deuda."
    )
    story.append(Paragraph(inmunidad_p, body_style))
    story.append(Spacer(1, 10))

    # ---------------------------------------------------------
    # SECCIÓN 4: RESPUESTAS TÉCNICAS A BANCOS INTERNACIONALES
    # ---------------------------------------------------------
    story.append(Paragraph("4. Respuestas Técnicas a las 4 Preguntas de Bancos Internacionales (Blue Heaven)", section_heading))
    story.append(HRFlowable(width="100%", thickness=1.5, color=AGRO_GREEN, spaceBefore=1, spaceAfter=6))

    qa_intro = (
        "A continuación se detallan las respuestas institucionales a los cuatro vectores de riesgo evaluados "
        "por bancas de desarrollo e inversionistas internacionales:"
    )
    story.append(Paragraph(qa_intro, body_style))
    story.append(Spacer(1, 5))

    # Q&A Block 1
    q1_content = [
        [Paragraph("1. ¿Cuáles son las garantías reales del proyecto si no se hipoteca la tierra?", qa_question_style)],
        [Paragraph(
            "<b>Respuesta Estructurada:</b> Las garantías principales reposan en la <b>cesión fiduciaria irrevocable "
            "de los derechos económicos</b> derivados de los contratos forward/offtake y en la constitución de "
            "<b>garantías mobiliarias sobre la producción futura</b> y cosechas bajo la Ley 1676 de 2013 de Colombia. "
            "Adicionalmente, se pignoran las cuentas bancarias del fideicomiso y se constituyen pólizas de seguro agrícola "
            "contra eventos climáticos catastróficos y siniestros de transporte.",
            qa_answer_style
        )]
    ]
    t_q1 = Table(q1_content, colWidths=[540])
    t_q1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), SLATE_LIGHT),
        ('BOX', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('LINELEFT', (0,0), (0,0), 3, NAVY),
        ('PADDING', (0,0), (-1,-1), 5.5),
    ]))

    # Q&A Block 2
    q2_content = [
        [Paragraph("2. ¿Cómo se mitiga el riesgo de licencia social y conflictividad comunitaria?", qa_question_style)],
        [Paragraph(
            "<b>Respuesta Estructurada:</b> AGROMAR aplica un modelo de <b>licencia social compartida</b> mediante la "
            "integración de productores locales como socios estratégicos en alianzas productivas. Se formaliza el "
            "empleo agrícola con estándares de trabajo decente, asistencia técnica continua y transferencia tecnológica. "
            "La coinversión en desarrollo comunitario y la transparencia en la liquidación de precios garantizan "
            "cero paros agrícolas o bloqueos territoriales.",
            qa_answer_style
        )]
    ]
    t_q2 = Table(q2_content, colWidths=[540])
    t_q2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.white),
        ('BOX', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('LINELEFT', (0,0), (0,0), 3, AGRO_GREEN),
        ('PADDING', (0,0), (-1,-1), 5.5),
    ]))

    # Q&A Block 3
    q3_content = [
        [Paragraph("3. ¿Cuál es la tenencia jurídica de la tierra y la protección frente a pleitos de despojo?", qa_question_style)],
        [Paragraph(
            "<b>Respuesta Estructurada:</b> El proyecto opera bajo contratos de <b>usufructo, arrendamiento de largo plazo "
            "y alianzas productivas</b> sobre predios rigurosamente auditados mediante <i>Due Diligence</i> inmobiliario y "
            "estudios de títulos de 30 a 50 años. Se opera únicamente en tierras con tradición registral limpia, verificadas "
            "ante la Agencia Nacional de Tierras (ANT) y la Unidad de Restitución de Tierras (URT), certificando la "
            "ausencia absoluta de procesos de despojo o reclamos de terceros.",
            qa_answer_style
        )]
    ]
    t_q3 = Table(q3_content, colWidths=[540])
    t_q3.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), SLATE_LIGHT),
        ('BOX', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('LINELEFT', (0,0), (0,0), 3, NAVY),
        ('PADDING', (0,0), (-1,-1), 5.5),
    ]))

    # Q&A Block 4
    q4_content = [
        [Paragraph("4. ¿Cómo se mitiga la volatilidad de precios en ciclos agrícolas?", qa_question_style)],
        [Paragraph(
            "<b>Respuesta Estructurada:</b> Mediante una <b>canasta diversificada de ciclos de maduración:</b><br/>"
            "• <b>Ciclo Corto (120 días - Maíz):</b> Generación acelerada de liquidez y rotación de capital de trabajo.<br/>"
            "• <b>Flujo Continuo Semanal (Plátano y Piña MD2):</b> Ingresos constantes durante todo el año para sostener la operación.<br/>"
            "• <b>Largo Plazo ESG (Cacao Fino & Maderables):</b> Activos con primas de sostenibilidad (EUDR) y apreciación de valor.<br/>"
            "Esta matriz de diversificación equilibra la caja operativa y neutraliza el riesgo de mono-cultivo.",
            qa_answer_style
        )]
    ]
    t_q4 = Table(q4_content, colWidths=[540])
    t_q4.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.white),
        ('BOX', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('LINELEFT', (0,0), (0,0), 3, AGRO_GREEN),
        ('PADDING', (0,0), (-1,-1), 5.5),
    ]))

    story.append(KeepTogether([t_q1, Spacer(1, 5)]))
    story.append(KeepTogether([t_q2, Spacer(1, 5)]))
    story.append(KeepTogether([t_q3, Spacer(1, 5)]))
    story.append(KeepTogether([t_q4, Spacer(1, 5)]))

    # Construcción del PDF
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF exitosamente generado: {os.path.abspath(pdf_filename)}")

if __name__ == '__main__':
    generar_pdf()
