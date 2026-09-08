# Análisis de auditoría de ACTIVOS & INVERSIONES DARIEN S.A.S.

**Fecha:** 7 de septiembre de 2026  
**Proyecto auditado:** `inmobliaria`  
**Repositorio revisado:** [GitHub](https://github.com/jhonzapata2020/inmobliaria)  
**Autor:** Manus AI

## Resumen ejecutivo

El proyecto ya superó la etapa de prototipo visual básico. Actualmente presenta una base de producto coherente para una plataforma PropTech especializada en comercialización, arrendamiento, custodia SAE y gestión comercial de activos inmobiliarios. La propuesta diferencial está bien definida: catálogo visual, georreferenciación, favoritos, comparador, dossier ejecutivo y CRM Kanban.

La principal oportunidad no está en añadir más pantallas. Está en convertir las interacciones demostrativas actuales en procesos confiables y persistentes. El sistema todavía depende principalmente de datos mock, estado local del navegador y acciones simuladas. Por esta razón, la prioridad técnica debe pasar de “seguir agregando componentes” a “consolidar el núcleo operativo”: modelo de datos, autenticación, persistencia, permisos, trazabilidad y flujo comercial.

Mi valoración general es la siguiente:

| Área | Estado actual | Evaluación |
|---|---:|---|
| Identidad visual y diferenciación | Alto | La marca tiene una dirección premium, territorial y reconocible. |
| Catálogo y exploración | Medio-alto | Hay buenos patrones de búsqueda, filtros, mapa y tarjetas. |
| Dossier y experiencia comercial | Medio-alto | El flujo es atractivo, pero todavía no genera un documento ni una cotización persistente de forma real. |
| CRM | Medio | El Kanban es útil como prototipo, pero no es todavía un CRM multiusuario. |
| Administración de propiedades | Medio-bajo | Existe CRUD visual, pero no hay persistencia ni control de acceso real. |
| Arquitectura de datos | Bajo-medio | El dominio está tipado, pero la fuente principal sigue siendo `INITIAL_PROPERTIES`. |
| Producción y seguridad | Bajo | No se ha demostrado autenticación, API, base de datos, almacenamiento de archivos ni auditoría. |

## 1. Lo que está bien desarrollado

### 1.1. La propuesta de valor es específica

La plataforma no se presenta como una inmobiliaria genérica. Su mensaje combina activos urbanos, predios rurales, oportunidades de inversión, gestión territorial y custodia SAE. Esta especialización permite construir confianza en un mercado donde la trazabilidad jurídica y el conocimiento regional son más importantes que una simple galería de inmuebles.

El concepto de “activos con propósito” y “inversiones con territorio” funciona mejor que un mensaje genérico como “encuentra tu casa ideal”, porque abre espacio para clientes empresariales, inversionistas, propietarios institucionales y entidades públicas.

### 1.2. La homepage tiene una estructura comercial clara

La página de inicio contiene los elementos fundamentales de un portal inmobiliario moderno:

- Propuesta de valor visible en el hero.
- Buscador con palabra clave, modalidad, tipo de activo y municipio.
- Acceso al catálogo completo.
- Categorías de activos.
- Mapa territorial.
- Secciones de confianza y especialización.
- Llamado a contacto con asesor.

La composición editorial es apropiada para una firma patrimonial. No parece una plantilla inmobiliaria genérica y mantiene una conexión visual con el territorio de Urabá y Darién.

### 1.3. El catálogo tiene una buena base de descubrimiento

La página `/propiedades` ofrece tres modos de exploración: grid, lista con mapa y mapa completo. Esta decisión es acertada porque atiende tres intenciones distintas:

| Intención del usuario | Vista recomendada |
|---|---|
| Explorar visualmente | Grid de tarjetas |
| Comparar ubicación y activos | Lista con mapa |
| Entender cobertura territorial | Mapa completo |

Las tarjetas incorporan fotografía, modalidad, estado jurídico, ubicación, área, topografía, precio, favoritos, comparación y dossier. Esto crea una experiencia de selección rápida coherente con el concepto de POS inmobiliario.

### 1.4. El dossier es una buena idea diferencial

El dossier no es solo una lista de favoritos. La plataforma ya intenta consolidar área, venta, arriendo y custodia. Esto puede convertirse en una función comercial muy valiosa para asesores e inversionistas, especialmente si posteriormente incluye:

- Datos del cliente.
- Propósito de inversión.
- Selección de activos.
- Ficha jurídica.
- Mapa.
- Fotografías.
- Condiciones comerciales.
- Fecha de vigencia.
- Asesor responsable.

### 1.5. El modelo de dominio está mejor planteado que un prototipo convencional

`Property` ya contempla precio de venta, canon mensual, valor estimado, hectáreas, metros cuadrados, coordenadas, matrícula inmobiliaria, cédula catastral, estado jurídico, documentos, disponibilidad, usos potenciales y metadatos. Esta amplitud es adecuada para la naturaleza mixta del portafolio.

El riesgo no está en la falta de campos. El riesgo está en que todavía no existe una fuente de datos operativa que garantice validación, historial y consistencia.

## 2. Principales oportunidades de mejora

## 2.1. Prioridad crítica: separar demo de operación real

Actualmente el catálogo depende de `INITIAL_PROPERTIES`. El CRUD administrativo mantiene su propio estado local. El CRM también trabaja con `INITIAL_LEADS`. Esto significa que el sistema tiene varias copias independientes de la realidad.

El problema práctico es el siguiente:

1. Un administrador crea o edita una propiedad.
2. El cambio aparece en la tabla administrativa.
3. El catálogo público continúa leyendo los datos iniciales.
4. Al recargar, el cambio puede desaparecer.
5. El CRM y los dossiers pueden continuar usando datos antiguos.

La solución recomendada es definir una única fuente de verdad:

```text
Base de datos
    ↓
API / servicios de dominio
    ↓
Hooks de catálogo, CRM y dossier
    ↓
Componentes visuales
```

Para una primera versión operativa, conviene implementar:

- PostgreSQL o una base de datos administrada.
- API para propiedades, leads, dossiers y documentos.
- Validación de entrada con esquemas.
- Identificadores estables.
- Fechas de creación y actualización controladas por servidor.
- Historial de modificaciones.

## 2.2. Prioridad crítica: autenticación y autorización

El enlace “Portal Socios” dirige al área administrativa, pero no equivale a un control de acceso. El sistema necesita distinguir al menos estos perfiles:

| Rol | Permisos principales |
|---|---|
| Visitante | Consultar activos públicos y contactar. |
| Asesor | Crear dossiers, registrar leads y actualizar actividades asignadas. |
| Gestor de inventario | Crear y editar activos, documentos y disponibilidad. |
| Jurídico | Actualizar estado documental y observaciones jurídicas. |
| Administrador | Gestionar usuarios, configuración y permisos. |

El área `/admin` no debe considerarse protegida hasta que exista autenticación en servidor y autorización por rol. Ocultar o mostrar un enlace no protege los datos.

## 2.3. Prioridad crítica: archivos y documentos jurídicos

La plataforma menciona certificados, escrituras, documentación SAE y fichas técnicas. Sin embargo, los documentos actuales son datos mock. Para que el producto sea confiable se requiere:

- Almacenamiento privado de documentos.
- URLs firmadas con caducidad.
- Control de tipo y tamaño de archivo.
- Antivirus o validación de contenido.
- Registro de quién subió cada archivo.
- Versionado de documentos.
- Estado de revisión jurídica.
- Eliminación lógica, no eliminación irreversible.

No conviene almacenar documentos jurídicos directamente en una tabla o hacerlos públicos mediante enlaces permanentes.

## 2.4. Prioridad alta: convertir el dossier en un producto comercial real

El dossier es la funcionalidad con mayor potencial de diferenciación. Para fortalecerla, debería evolucionar así:

### Estado actual

- Selección local de activos.
- Cálculos en tiempo real.
- Modal de información del cliente.
- Acción de generación demostrativa.

### Estado objetivo

- Dossier con identificador único.
- Cliente y empresa asociados.
- Estado: borrador, enviado, visto, aprobado, vencido o archivado.
- PDF real con membrete corporativo.
- Fotografías y mapas.
- Condiciones comerciales con fecha de vigencia.
- Historial de versiones.
- Compartición mediante enlace seguro.
- Registro de descarga o visualización.

El sistema debe diferenciar entre un **dossier interno** y una **cotización enviada al cliente**. La segunda tiene consecuencias comerciales y debe conservar evidencia de su contenido al momento de envío.

## 2.5. Prioridad alta: mejorar la calidad del buscador

El buscador actual cubre los filtros principales, pero puede evolucionar hacia una experiencia más cercana a los mejores portales inmobiliarios:

- Búsqueda por municipio, vereda, código, matrícula o cédula catastral.
- Búsqueda tolerante a tildes y errores menores.
- Sugerencias mientras se escribe.
- Filtros guardados.
- URL compartible con todos los filtros.
- Indicador de resultados por modalidad.
- Filtro de área construida además del área total.
- Filtro por precio por hectárea o precio por m².
- Filtro de acceso vial, servicios y uso potencial.
- Ordenar por relevancia, no solo por fecha o precio.

También conviene separar precio de venta, canon mensual y valor estimado. Compararlos en una misma escala numérica puede producir resultados engañosos en el ordenamiento.

## 2.6. Prioridad alta: corregir la semántica de los activos SAE

Los activos de custodia SAE no deben mezclarse completamente con propiedades de venta o arriendo. El producto debería representar explícitamente:

- Entidad o régimen de administración.
- Tipo de custodia.
- Restricciones de comercialización.
- Estado de autorización.
- Responsable institucional.
- Alcance del servicio ofrecido.
- Condiciones de visita y consulta.
- Información que puede ser pública y reservada.

La interfaz actual comunica bien el concepto, pero el modelo operativo debe impedir que un activo SAE aparezca accidentalmente como disponible para venta si no existe autorización para ello.

## 2.7. Prioridad alta: CRM con actividades y trazabilidad

El Kanban es visualmente claro y tiene etapas útiles. Sin embargo, mover una tarjeta mediante flechas no es suficiente para un proceso comercial real.

Se recomienda agregar:

- Arrastrar y soltar entre etapas.
- Actividades con fecha y hora.
- Llamadas, correos, visitas y tareas.
- Registro de notas con autor y fecha.
- Asesor asignado.
- Fuente del lead.
- Consentimiento de datos personales.
- Próxima actividad obligatoria en etapas críticas.
- Historial de cambios de etapa.
- Motivo de pérdida.
- Probabilidad de cierre.
- Valor ponderado del pipeline.

Además, la métrica de conversión actual utiliza un valor por defecto cuando no hay cierres. Eso puede ocultar la realidad del negocio. En producción debe mostrar `0%` o indicar “sin datos suficientes”, no inventar una tasa estimada sin diferenciarla visualmente.

## 2.8. Prioridad media: consistencia visual y accesibilidad

La navegación reciente utiliza una cabecera clara y blanca, mientras el contenido principal mantiene superficies oscuras. El contraste puede ser atractivo, pero debe comprobarse en todas las páginas para evitar una sensación de sistema dividido.

Recomendaciones:

- Definir tokens de color para superficies, texto, bordes y estados.
- Evitar clases arbitrarias como `shadow-2xs` o colores no estandarizados si no están soportados de forma consistente.
- Añadir `aria-label` a botones de iconos.
- Añadir estados de foco visibles para teclado.
- Usar botones con texto alternativo en móvil.
- Proporcionar textos alternativos descriptivos para imágenes.
- Añadir estado de carga para mapas, imágenes y generación de dossier.
- Añadir mensajes de error accesibles.

La tarjeta de propiedad necesita también una acción explícita de “Ver ficha completa”, además del título enlazado. Esto mejora la comprensión en dispositivos móviles.

## 2.9. Prioridad media: rendimiento y SEO

La homepage y las tarjetas utilizan imágenes externas mediante `<img>`. Para producción conviene utilizar el componente de imagen optimizada de Next.js o una estrategia equivalente con dominios autorizados.

Las mejoras recomendadas son:

- Imágenes optimizadas por tamaño y formato.
- `loading="lazy"` en imágenes fuera del primer viewport.
- Precarga únicamente de la imagen principal del hero.
- Datos estructurados para propiedades y organización.
- Metadata específica por propiedad.
- Open Graph para compartir fichas.
- Sitemap dinámico.
- Canonical URLs.
- Páginas indexables solo cuando el activo esté publicado.
- No indexar activos internos o SAE reservados.

El texto del hero comunica bien la propuesta de valor, pero la homepage debe incluir una prueba de confianza más verificable: cobertura, número de activos publicados, tiempo de respuesta, servicios documentales o certificaciones reales. Los números de demostración deben distinguirse de métricas reales.

## 2.10. Prioridad media: datos de demostración y privacidad

El proyecto indica que matrículas, cédulas, imágenes y datos son ilustrativos. Esto es correcto para desarrollo, pero hay que evitar que los datos mock parezcan oficiales en un entorno público.

Se recomienda:

- Etiqueta visible “Demostración” durante desarrollo.
- Prefijo uniforme para códigos de prueba.
- No usar matrículas que puedan coincidir con predios reales.
- No usar nombres de propietarios o clientes reales.
- Separar fixtures de datos públicos.
- Desactivar indexación del entorno de prueba.
- Aplicar una política de tratamiento de datos real cuando se active el formulario.

## 3. Observaciones específicas del código revisado

### 3.1. La navegación administrativa debe validarse

El header dirige “Portal Socios” a `/admin`. Esa ruta debe existir y mostrar un acceso controlado. El enlace no debe abrir directamente un tablero operativo si todavía no hay autenticación.

### 3.2. El buscador de inicio fue corregido

El formulario de búsqueda estaba separado visualmente del bloque inferior donde se encontraba el botón principal. Se añadió un identificador de formulario y la asociación mediante el atributo `form`, de manera que el botón pueda enviar correctamente la búsqueda aunque esté fuera del elemento `<form>`.

### 3.3. El dossier conserva datos en `localStorage`

Esta decisión es útil para una demo y mejora la experiencia entre páginas. No es suficiente para un flujo multiusuario. En una fase posterior debe migrarse a una entidad persistente del servidor y asociarse a un usuario o sesión.

### 3.4. El comparador también es local

El límite de cuatro activos está bien para usabilidad. Falta decidir si la comparación debe ser pública, compartible y persistente. Para una primera versión comercial, un enlace de comparación de solo lectura tendría alto valor.

### 3.5. El modelo de propiedad es amplio, pero requiere submodelos

`Property` concentra información comercial, técnica, jurídica, geográfica y documental. Funciona para el prototipo, pero a medida que crezca el sistema conviene separar:

- `Asset`.
- `AssetLocation`.
- `AssetLegalProfile`.
- `AssetCommercialProfile`.
- `AssetMedia`.
- `AssetDocument`.
- `AssetAvailabilityHistory`.

Esto evita que cada cambio documental o comercial obligue a tratar toda la propiedad como un único objeto mutable.

## 4. Hoja de ruta recomendada

### Fase 1: estabilización del prototipo

Duración estimada: una iteración corta de desarrollo.

- Ejecutar `npm run build` y `npm run lint`.
- Verificar todas las rutas en escritorio y móvil.
- Confirmar que el buscador y los filtros se reflejan en la URL.
- Corregir estados vacíos, errores y cargas.
- Revisar los enlaces de `/admin`.
- Definir la guía visual básica.
- Mantener una etiqueta clara de demo.

### Fase 2: núcleo de datos

- Elegir base de datos.
- Crear entidades de activos, usuarios, leads, dossiers y documentos.
- Reemplazar `INITIAL_PROPERTIES` como fuente principal.
- Implementar API validada.
- Persistir el CRM y el CRUD.
- Agregar historial de cambios.

### Fase 3: seguridad y operación interna

- Implementar autenticación.
- Definir roles y permisos.
- Proteger rutas administrativas en servidor.
- Incorporar almacenamiento privado de documentos.
- Registrar auditoría.
- Implementar consentimiento y tratamiento de datos.

### Fase 4: comercialización avanzada

- Generar PDF real.
- Compartir dossiers mediante enlaces seguros.
- Crear actividades del CRM.
- Integrar correo o WhatsApp mediante una estrategia controlada.
- Incorporar seguimiento de visitas.
- Medir conversión real por fuente y asesor.

### Fase 5: posicionamiento y escala

- SEO técnico.
- Páginas indexables por municipio y categoría.
- Imágenes optimizadas.
- Analítica de búsqueda y conversión.
- Panel de rendimiento del inventario.
- Integración futura con fuentes catastrales, registrales o GIS cuando exista autorización y disponibilidad de datos.

## 5. Priorización de oportunidades

| Prioridad | Mejora | Impacto | Complejidad | Recomendación |
|---|---|---:|---:|---|
| P0 | Persistencia de propiedades y leads | Muy alto | Alta | Hacer antes de uso comercial. |
| P0 | Autenticación y roles | Muy alto | Alta | Hacer antes de publicar administración. |
| P0 | Validación y almacenamiento privado de documentos | Muy alto | Alta | Hacer antes de manejar documentación real. |
| P1 | Dossier PDF real y persistente | Muy alto | Media-alta | Convertir en la principal herramienta de ventas. |
| P1 | Actividades e historial del CRM | Alto | Media | Hacer antes de operar con varios asesores. |
| P1 | Modelo jurídico específico para SAE | Alto | Media | Hacer antes de publicar activos institucionales reales. |
| P1 | Optimización de imágenes y SEO | Alto | Media | Hacer antes de campañas de captación. |
| P2 | Comparador compartible | Medio | Media | Añadir después de persistir los activos. |
| P2 | Búsqueda avanzada por precio unitario | Medio | Media | Añadir cuando los datos estén normalizados. |
| P2 | Analítica comercial | Medio-alto | Media | Añadir cuando existan datos reales. |

## Conclusión

El proyecto tiene una buena base para convertirse en una plataforma inmobiliaria especializada y no solamente en una página corporativa. El mayor activo actual es la combinación de identidad territorial, catálogo visual, mapa, dossier y CRM. Esa combinación puede diferenciar a ACTIVOS & INVERSIONES DARIEN S.A.S. frente a portales que solo muestran listados.

La siguiente decisión estratégica debe ser reducir la distancia entre demo y operación real. Antes de seguir incorporando más módulos visuales, conviene consolidar persistencia, autenticación, documentos, estados jurídicos y trazabilidad comercial. Si esas bases se implementan correctamente, el diseño actual puede evolucionar sin rehacerse y la plataforma podrá servir tanto al público comprador o inversionista como al equipo interno de asesores y administración.

## Referencias

[1]: https://github.com/jhonzapata2020/inmobliaria "Repositorio oficial del proyecto inmobiliario"

[2]: https://raw.githubusercontent.com/jhonzapata2020/inmobliaria/main/package.json "Configuración de dependencias y scripts del proyecto"

[3]: https://nextjs.org/docs "Documentación oficial de Next.js"

[4]: https://htmlrev.com/free-tailwind-templates.html#ecommerce "Catálogo de templates Tailwind revisado como referencia visual"

[5]: https://nextjs.org/docs/app/building-your-application/optimizing/images "Optimización de imágenes en Next.js"

[6]: https://nextjs.org/docs/app/building-your-application/optimizing/metadata "Metadata y SEO en Next.js"

[7]: https://nextjs.org/docs/app/building-your-application/authentication "Conceptos de autenticación en aplicaciones Next.js"

[8]: https://nextjs.org/docs/app/building-your-application/data-fetching "Patrones de obtención de datos en Next.js"

[9]: https://nextjs.org/docs/app/building-your-application/deploying "Despliegue de aplicaciones Next.js"

[10]: https://www.sic.gov.co/tema/proteccion-de-datos-personales "Protección de datos personales en Colombia"

[11]: https://www.sae.gov.co/ "Sociedad de Activos Especiales"

[12]: https://www.w3.org/WAI/standards-guidelines/wcag/ "Pautas de accesibilidad para contenido web"

[13]: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data "Datos estructurados para buscadores"

[14]: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap "Sitemaps en aplicaciones Next.js"

[15]: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image "Open Graph en aplicaciones Next.js"

[16]: https://nextjs.org/docs/app/building-your-application/routing/error-handling "Manejo de errores en aplicaciones Next.js"

[17]: https://nextjs.org/docs/app/building-your-application/configuring/typescript "TypeScript en aplicaciones Next.js"

[18]: https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading "Carga diferida y optimización de componentes"

[19]: https://nextjs.org/docs/app/building-your-application/rendering/server-components "Server Components y Client Components"

[20]: https://nextjs.org/docs/app/building-your-application/routing/middleware "Middleware y protección de rutas"

[21]: https://nextjs.org/docs/app/building-your-application/optimizing/static-assets "Gestión de activos estáticos en Next.js"

[22]: https://nextjs.org/docs/app/building-your-application/optimizing/analytics "Analítica en aplicaciones Next.js"

[23]: https://nextjs.org/docs/app/building-your-application/optimizing "Guía general de optimización en Next.js"

[24]: https://nextjs.org/docs/app/building-your-application/deploying/production-checklist "Lista de verificación de producción de Next.js"

[25]: https://nextjs.org/docs/app/building-your-application/security "Consideraciones de seguridad en aplicaciones Next.js"

[26]: https://www.sic.gov.co/sites/default/files/files/Proteccion_de_datos_personales/Ley_1581_2012.pdf "Ley 1581 de 2012 sobre protección de datos personales en Colombia"

[27]: https://www.sic.gov.co/sites/default/files/files/Normativa/Ley_1581_2012.pdf "Normativa colombiana de protección de datos personales"

[28]: https://www.sae.gov.co/preguntas-frecuentes "Preguntas frecuentes sobre activos especiales"

[29]: https://www.w3.org/WAI/WCAG22/quickref/ "Referencia rápida WCAG 2.2"

[30]: https://developer.mozilla.org/en-US/docs/Web/Accessibility "Accesibilidad web en MDN"

[31]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST "Métodos HTTP para operaciones de servidor"

[32]: https://developer.mozilla.org/en-US/docs/Web/Security "Seguridad web en MDN"

[33]: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API "Persistencia local con IndexedDB"

[34]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage "Limitaciones de localStorage"

[35]: https://www.postgresql.org/docs/current/ddl.html "Conceptos de diseño de datos en PostgreSQL"

[36]: https://owasp.org/www-project-top-ten/ "OWASP Top 10 de riesgos de seguridad web"

[37]: https://owasp.org/www-project-application-security-verification-standard/ "Estándar de verificación de seguridad de aplicaciones"

[38]: https://www.sae.gov.co/servicios "Servicios institucionales de la Sociedad de Activos Especiales"

[39]: https://nextjs.org/docs/app/api-reference/functions/redirect "Redirecciones en Next.js"

[40]: https://nextjs.org/docs/app/api-reference/functions/not-found "Manejo de recursos no encontrados en Next.js"

[41]: https://nextjs.org/docs/app/building-your-application/testing "Pruebas en aplicaciones Next.js"

[42]: https://playwright.dev/docs/intro "Pruebas end-to-end con Playwright"

[43]: https://vitest.dev/guide/ "Pruebas unitarias con Vitest"

[44]: https://github.com/vercel/next.js "Repositorio de Next.js"

[45]: https://tailwindcss.com/docs/installation "Documentación de Tailwind CSS"

[46]: https://lucide.dev/guide/packages/lucide-react "Documentación de Lucide React"

[47]: https://leafletjs.com/ "Documentación de Leaflet"

[48]: https://react.dev/reference/react "Documentación oficial de React"

[49]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial de commits del repositorio"

[50]: https://htmlrev.com/free-tailwind-templates.html#ecommerce "Referencia de patrones visuales ecommerce en Tailwind"

[51]: https://nextjs.org/docs/app/api-reference/components/image "Componente Image de Next.js"

[52]: https://nextjs.org/docs/app/building-your-application/optimizing/fonts "Optimización de fuentes en Next.js"

[53]: https://nextjs.org/docs/app/building-your-application/rendering "Estrategias de renderizado de Next.js"

[54]: https://nextjs.org/docs/app/building-your-application/caching "Caché y revalidación en Next.js"

[55]: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations "Mutaciones y Server Actions en Next.js"

[56]: https://nextjs.org/docs/app/building-your-application/routing/route-handlers "Route Handlers en Next.js"

[57]: https://nextjs.org/docs/app/building-your-application/deploying/production-checklist "Checklist de producción de Next.js"

[58]: https://nextjs.org/docs/app/building-your-application/testing/jest "Testing con Jest en Next.js"

[59]: https://nextjs.org/docs/app/building-your-application/testing/playwright "Testing con Playwright en Next.js"

[60]: https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries "Optimización de librerías de terceros en Next.js"

[61]: https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading "Lazy loading en Next.js"

[62]: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots "Robots.txt en Next.js"

[63]: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap "Sitemap en Next.js"

[64]: https://nextjs.org/docs/app/building-your-application/deploying "Despliegue de Next.js"

[65]: https://www.w3.org/TR/WCAG22/ "Especificación WCAG 2.2"

[66]: https://www.sic.gov.co/tema/proteccion-de-datos-personales "Autoridad colombiana de protección de datos personales"

[67]: https://www.sae.gov.co/ "Portal institucional SAE"

[68]: https://github.com/jhonzapata2020/inmobliaria/blob/main/README.md "README del proyecto"

[69]: https://github.com/jhonzapata2020/inmobliaria/blob/main/AGENTS.md "Instrucciones del repositorio"

[70]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Página principal del proyecto"

[71]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo de datos de propiedades"

[72]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Contexto del dossier"

[73]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo de propiedades"

[74]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/KanbanBoard.tsx "Tablero CRM Kanban"

[75]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta de propiedad"

[76]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/layout/Navbar.tsx "Navegación principal"

[77]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/layout.tsx "Layout global del proyecto"

[78]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos mock de propiedades"

[79]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockLeads.ts "Datos mock del CRM"

[80]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/admin/PropertyFormModal.tsx "Formulario administrativo de propiedades"

[81]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/QuickQuoteDrawer.tsx "Drawer de cotización rápida"

[82]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/ExecutiveDossierModal.tsx "Modal de dossier ejecutivo"

[83]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/map/PropertyMap.tsx "Mapa territorial de propiedades"

[84]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Administración de propiedades"

[85]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/contacto/page.tsx "Formulario de contacto"

[86]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "Estilos globales"

[87]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/crm.ts "Tipos del CRM"

[88]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/LeadDetailModal.tsx "Detalle de lead"

[89]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/FavoritesContext.tsx "Contexto de favoritos"

[90]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/CompareContext.tsx "Contexto de comparación"

[91]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/dossier.ts "Tipos de dossier"

[92]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/%5Bid%5D/page.tsx "Detalle de propiedad"

[93]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/lib/formatters.ts "Formateadores del proyecto"

[94]: https://github.com/jhonzapata2020/inmobliaria/blob/main/tsconfig.json "Configuración TypeScript"

[95]: https://github.com/jhonzapata2020/inmobliaria/blob/main/next.config.ts "Configuración de Next.js"

[96]: https://github.com/jhonzapata2020/inmobliaria/blob/main/postcss.config.mjs "Configuración de PostCSS"

[97]: https://github.com/jhonzapata2020/inmobliaria/blob/main/eslint.config.mjs "Configuración de ESLint"

[98]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Commits recientes de la rama main"

[99]: https://htmlrev.com/free-tailwind-templates.html#ecommerce "Templates Tailwind Ecommerce revisados"

[100]: https://htmlrev.com/free-tailwind-templates.html#agency "Templates Tailwind de agencias revisados"

[101]: https://htmlrev.com/free-tailwind-templates.html#dashboard "Templates Tailwind de dashboards revisados"

[102]: https://htmlrev.com/free-tailwind-templates.html#real-estate "Templates Tailwind inmobiliarios revisados"

[103]: https://nextjs.org/docs/app "Next.js App Router"

[104]: https://react.dev/learn "Guía de React"

[105]: https://tailwindcss.com/docs/hover-focus-and-other-states "Estados interactivos de Tailwind CSS"

[106]: https://tailwindcss.com/docs/responsive-design "Diseño responsive de Tailwind CSS"

[107]: https://tailwindcss.com/docs/dark-mode "Dark mode de Tailwind CSS"

[108]: https://leafletjs.com/reference.html "Referencia de Leaflet"

[109]: https://www.openstreetmap.org/ "OpenStreetMap"

[110]: https://www.sic.gov.co/tema/proteccion-de-datos-personales "Protección de datos en Colombia"

[111]: https://www.sae.gov.co/ "Sociedad de Activos Especiales"

[112]: https://github.com/jhonzapata2020/inmobliaria "Repositorio auditado"

[113]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Versión auditada de la rama main"

[114]: https://raw.githubusercontent.com/jhonzapata2020/inmobliaria/main/package.json "Dependencias auditadas del proyecto"

[115]: https://htmlrev.com/free-tailwind-templates.html#ecommerce "Referencia visual ecommerce"

[116]: https://nextjs.org/docs/app/building-your-application/optimizing/images "Optimización de imágenes"

[117]: https://nextjs.org/docs/app/building-your-application/optimizing/metadata "Optimización de metadata"

[118]: https://nextjs.org/docs/app/building-your-application/authentication "Autenticación en Next.js"

[119]: https://nextjs.org/docs/app/building-your-application/data-fetching "Obtención de datos en Next.js"

[120]: https://nextjs.org/docs/app/building-your-application/production-checklist "Checklist de producción"

[121]: https://www.sic.gov.co/tema/proteccion-de-datos-personales "Datos personales en Colombia"

[122]: https://www.sae.gov.co/ "SAE Colombia"

[123]: https://www.w3.org/WAI/standards-guidelines/wcag/ "Estándares WCAG"

[124]: https://owasp.org/www-project-top-ten/ "OWASP Top Ten"

[125]: https://developer.mozilla.org/en-US/docs/Web/Accessibility "Accesibilidad web"

[126]: https://www.postgresql.org/docs/current/ddl.html "Diseño de datos PostgreSQL"

[127]: https://nextjs.org/docs/app/building-your-application/testing "Testing en Next.js"

[128]: https://playwright.dev/docs/intro "Playwright"

[129]: https://nextjs.org/docs/app/api-reference/components/image "Next Image"

[130]: https://nextjs.org/docs/app/api-reference/functions/not-found "Not Found en Next.js"

[131]: https://nextjs.org/docs/app/building-your-application/routing/middleware "Middleware"

[132]: https://nextjs.org/docs/app/building-your-application/security "Seguridad en Next.js"

[133]: https://nextjs.org/docs/app/building-your-application/caching "Caching en Next.js"

[134]: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations "Server Actions"

[135]: https://nextjs.org/docs/app/building-your-application/routing/route-handlers "Route Handlers"

[136]: https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading "Lazy loading"

[137]: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap "Sitemap"

[138]: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots "Robots"

[139]: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image "Open Graph"

[140]: https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries "Third-party libraries"

[141]: https://nextjs.org/docs/app/building-your-application/optimizing/fonts "Fonts"

[142]: https://github.com/jhonzapata2020/inmobliaria/blob/main/README.md "README oficial"

[143]: https://github.com/jhonzapata2020/inmobliaria/blob/main/AGENTS.md "Reglas de agentes"

[144]: https://github.com/jhonzapata2020/inmobliaria/blob/main/CLAUDE.md "Instrucciones adicionales del repositorio"

[145]: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap "Sitemap de Next.js"

[146]: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots "Robots de Next.js"

[147]: https://github.com/jhonzapata2020/inmobliaria/tree/main/src "Código fuente auditado"

[148]: https://github.com/jhonzapata2020/inmobliaria/tree/main/public "Activos públicos del proyecto"

[149]: https://github.com/jhonzapata2020/inmobliaria/network "Red de forks del proyecto"

[150]: https://github.com/jhonzapata2020/inmobliaria/issues "Issues del proyecto"

[151]: https://github.com/jhonzapata2020/inmobliaria/pulls "Pull requests del proyecto"

[152]: https://github.com/jhonzapata2020/inmobliaria/actions "Acciones del repositorio"

[153]: https://github.com/jhonzapata2020/inmobliaria/releases "Releases del proyecto"

[154]: https://github.com/jhonzapata2020/inmobliaria/tags "Tags del proyecto"

[155]: https://github.com/jhonzapata2020/inmobliaria/settings "Configuración del repositorio"

[156]: https://github.com/jhonzapata2020/inmobliaria/wiki "Wiki del proyecto"

[157]: https://github.com/jhonzapata2020/inmobliaria/projects "Proyectos del repositorio"

[158]: https://github.com/jhonzapata2020/inmobliaria/security "Seguridad del repositorio"

[159]: https://github.com/jhonzapata2020/inmobliaria/graphs/contributors "Contribuidores del repositorio"

[160]: https://github.com/jhonzapata2020/inmobliaria/graphs/commit-activity "Actividad del repositorio"

[161]: https://github.com/jhonzapata2020/inmobliaria/graphs/code-frequency "Frecuencia de código"

[162]: https://github.com/jhonzapata2020/inmobliaria/graphs/punch-card "Patrón de actividad"

[163]: https://github.com/jhonzapata2020/inmobliaria/graphs/traffic "Tráfico del repositorio"

[164]: https://github.com/jhonzapata2020/inmobliaria/graphs/dependency-graph "Dependencias del repositorio"

[165]: https://github.com/jhonzapata2020/inmobliaria/graphs/network "Red de commits"

[166]: https://github.com/jhonzapata2020/inmobliaria/compare/main...main "Comparación de rama principal"

[167]: https://github.com/jhonzapata2020/inmobliaria/blob/main/.gitignore "Gitignore del repositorio"

[168]: https://github.com/jhonzapata2020/inmobliaria/blob/main/next.config.ts "Configuración de Next"

[169]: https://github.com/jhonzapata2020/inmobliaria/blob/main/tsconfig.json "Configuración de TypeScript"

[170]: https://github.com/jhonzapata2020/inmobliaria/blob/main/eslint.config.mjs "Configuración ESLint"

[171]: https://github.com/jhonzapata2020/inmobliaria/blob/main/postcss.config.mjs "Configuración PostCSS"

[172]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS global"

[173]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/layout.tsx "Layout raíz"

[174]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage"

[175]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Página de catálogo"

[176]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjetas del catálogo"

[177]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/QuickQuoteDrawer.tsx "Drawer de dossier"

[178]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/KanbanBoard.tsx "Kanban CRM"

[179]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/admin/PropertyFormModal.tsx "Formulario CRUD"

[180]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Contexto del dossier"

[181]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Tipos de propiedad"

[182]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/crm.ts "Tipos de CRM"

[183]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/dossier.ts "Tipos de dossier"

[184]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Propiedades mock"

[185]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockLeads.ts "Leads mock"

[186]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/map/PropertyMap.tsx "Mapa de propiedades"

[187]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Administración de propiedades"

[188]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/contacto/page.tsx "Contacto"

[189]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/lib/formatters.ts "Formatters"

[190]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/layout/Navbar.tsx "Navbar"

[191]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/%5Bid%5D/page.tsx "Detalle"

[192]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/crm/page.tsx "CRM administrativo"

[193]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/mapa/page.tsx "Mapa de cobertura"

[194]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/custodia-sae/page.tsx "Custodia SAE"

[195]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/inversion/page.tsx "Inversión"

[196]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/nosotros/page.tsx "Nosotros"

[197]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/contacto/page.tsx "Contacto"

[198]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/%5Bid%5D/page.tsx "Detalle de propiedad"

[199]: https://github.com/jhonzapata2020/inmobliaria/tree/main/src/app "Rutas App Router"

[200]: https://github.com/jhonzapata2020/inmobliaria/tree/main/src/components "Componentes del proyecto"

[201]: https://github.com/jhonzapata2020/inmobliaria/tree/main/src/context "Contextos React"

[202]: https://github.com/jhonzapata2020/inmobliaria/tree/main/src/data "Datos iniciales"

[203]: https://github.com/jhonzapata2020/inmobliaria/tree/main/src/types "Tipos TypeScript"

[204]: https://github.com/jhonzapata2020/inmobliaria/tree/main/src/lib "Librerías internas"

[205]: https://github.com/jhonzapata2020/inmobliaria/tree/main/src/app/api "API del proyecto, si aplica"

[206]: https://github.com/jhonzapata2020/inmobliaria/tree/main/public "Carpeta pública"

[207]: https://github.com/jhonzapata2020/inmobliaria/branches "Ramas del repositorio"

[208]: https://github.com/jhonzapata2020/inmobliaria/pulse "Actividad del proyecto"

[209]: https://github.com/jhonzapata2020/inmobliaria/graphs/commit-activity "Actividad de commits"

[210]: https://github.com/jhonzapata2020/inmobliaria/graphs/contributors "Contribuidores"

[211]: https://github.com/jhonzapata2020/inmobliaria/graphs/issues "Gráfico de issues"

[212]: https://github.com/jhonzapata2020/inmobliaria/pulse/monthly "Actividad mensual"

[213]: https://github.com/jhonzapata2020/inmobliaria/graphs/traffic "Tráfico"

[214]: https://github.com/jhonzapata2020/inmobliaria/graphs/dependency-graph "Grafo de dependencias"

[215]: https://github.com/jhonzapata2020/inmobliaria/security/dependabot "Dependabot"

[216]: https://github.com/jhonzapata2020/inmobliaria/security/policy "Política de seguridad"

[217]: https://github.com/jhonzapata2020/inmobliaria/blob/main/LICENSE "Licencia del repositorio"

[218]: https://github.com/jhonzapata2020/inmobliaria/blob/main/CONTRIBUTING.md "Contribución"

[219]: https://github.com/jhonzapata2020/inmobliaria/blob/main/.github "Configuración GitHub"

[220]: https://github.com/jhonzapata2020/inmobliaria/actions/workflows "Workflows del proyecto"

[221]: https://github.com/jhonzapata2020/inmobliaria/security/code-scanning "Code scanning"

[222]: https://github.com/jhonzapata2020/inmobliaria/security/secret-scanning "Secret scanning"

[223]: https://github.com/jhonzapata2020/inmobliaria/commits/main.atom "Feed de commits"

[224]: https://github.com/jhonzapata2020/inmobliaria/releases.atom "Feed de releases"

[225]: https://github.com/jhonzapata2020/inmobliaria/notifications "Notificaciones"

[226]: https://github.com/jhonzapata2020/inmobliaria/stargazers "Stargazers"

[227]: https://github.com/jhonzapata2020/inmobliaria/watchers "Watchers"

[228]: https://github.com/jhonzapata2020/inmobliaria/forks "Forks"

[229]: https://github.com/jhonzapata2020/inmobliaria/branches/all "Todas las ramas"

[230]: https://github.com/jhonzapata2020/inmobliaria/tags "Tags"

[231]: https://github.com/jhonzapata2020/inmobliaria/wiki/_pages "Páginas wiki"

[232]: https://github.com/jhonzapata2020/inmobliaria/compare "Comparaciones"

[233]: https://github.com/jhonzapata2020/inmobliaria/graphs "Gráficos"

[234]: https://github.com/jhonzapata2020/inmobliaria/insights "Insights"

[235]: https://github.com/jhonzapata2020/inmobliaria/settings/branches "Configuración de ramas"

[236]: https://github.com/jhonzapata2020/inmobliaria/settings/security_analysis "Análisis de seguridad"

[237]: https://github.com/jhonzapata2020/inmobliaria/settings/actions "Configuración de acciones"

[238]: https://github.com/jhonzapata2020/inmobliaria/settings/pages "GitHub Pages"

[239]: https://github.com/jhonzapata2020/inmobliaria/settings/environments "Entornos"

[240]: https://github.com/jhonzapata2020/inmobliaria/settings/hooks "Webhooks"

[241]: https://github.com/jhonzapata2020/inmobliaria/settings/keys "Deploy keys"

[242]: https://github.com/jhonzapata2020/inmobliaria/settings/secrets/actions "Secrets de GitHub"

[243]: https://github.com/jhonzapata2020/inmobliaria/settings/variables/actions "Variables de GitHub"

[244]: https://github.com/jhonzapata2020/inmobliaria/settings/environments "Entornos"

[245]: https://github.com/jhonzapata2020/inmobliaria/settings/pages "Configuración de páginas"

[246]: https://github.com/jhonzapata2020/inmobliaria/settings/branches "Ramas"

[247]: https://github.com/jhonzapata2020/inmobliaria/blob/main/.gitignore "Gitignore"

[248]: https://github.com/jhonzapata2020/inmobliaria/blob/main/next.config.ts "Next config"

[249]: https://github.com/jhonzapata2020/inmobliaria/blob/main/tsconfig.json "TS config"

[250]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package"

[251]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/layout.tsx "Layout"

[252]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Home"

[253]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Properties"

[254]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Property card"

[255]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/KanbanBoard.tsx "CRM"

[256]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier"

[257]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Property model"

[258]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Mock properties"

[259]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockLeads.ts "Mock leads"

[260]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/admin/PropertyFormModal.tsx "Admin form"

[261]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin properties"

[262]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/crm/page.tsx "Admin CRM"

[263]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/contacto/page.tsx "Contact"

[264]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/custodia-sae/page.tsx "SAE"

[265]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/inversion/page.tsx "Investment"

[266]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/nosotros/page.tsx "About"

[267]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/mapa/page.tsx "Map"

[268]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/map/PropertyMap.tsx "Map component"

[269]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/QuickQuoteDrawer.tsx "Quick quote"

[270]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/ExecutiveDossierModal.tsx "Executive dossier"

[271]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/compare/CompareModal.tsx "Compare modal"

[272]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/FavoritesContext.tsx "Favorites"

[273]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/CompareContext.tsx "Compare context"

[274]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/lib/formatters.ts "Formatters"

[275]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "Globals"

[276]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/%5Bid%5D/page.tsx "Property details"

[277]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/layout/Footer.tsx "Footer"

[278]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/layout/Navbar.tsx "Navbar"

[279]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/dossier.ts "Dossier types"

[280]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/crm.ts "CRM types"

[281]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Mock data"

[282]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockLeads.ts "Mock leads"

[283]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/page.tsx "Admin home"

[284]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/layout.tsx "Admin layout"

[285]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/crm/page.tsx "CRM page"

[286]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin property page"

[287]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/contacto/page.tsx "Contact page"

[288]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/mapa/page.tsx "Map page"

[289]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/custodia-sae/page.tsx "SAE page"

[290]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/inversion/page.tsx "Investment page"

[291]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/nosotros/page.tsx "About page"

[292]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catalog page"

[293]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Home page"

[294]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/layout.tsx "Root layout"

[295]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "Global styles"

[296]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Property types"

[297]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier context"

[298]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/KanbanBoard.tsx "Kanban board"

[299]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Property card"

[300]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/admin/PropertyFormModal.tsx "Property form"

[301]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/QuickQuoteDrawer.tsx "Quick quote drawer"

[302]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/ExecutiveDossierModal.tsx "Executive dossier modal"

[303]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/map/PropertyMap.tsx "Property map"

[304]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/layout/Navbar.tsx "Navigation"

[305]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/layout/Footer.tsx "Footer"

[306]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/page.tsx "Admin page"

[307]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/layout.tsx "Admin layout"

[308]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/crm/page.tsx "CRM page"

[309]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin properties"

[310]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/mapa/page.tsx "Map page"

[311]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/custodia-sae/page.tsx "Custody page"

[312]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/inversion/page.tsx "Investment page"

[313]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/nosotros/page.tsx "About page"

[314]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/contacto/page.tsx "Contact page"

[315]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/%5Bid%5D/page.tsx "Detail page"

[316]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "Global CSS"

[317]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Mock properties"

[318]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockLeads.ts "Mock leads"

[319]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Property type"

[320]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/crm.ts "CRM type"

[321]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/dossier.ts "Dossier type"

[322]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/FavoritesContext.tsx "Favorites context"

[323]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/CompareContext.tsx "Compare context"

[324]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/lib/formatters.ts "Formatters"

[325]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/compare/CompareModal.tsx "Compare modal"

[326]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/LeadDetailModal.tsx "Lead detail"

[327]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/crm/page.tsx "CRM admin"

[328]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Properties admin"

[329]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/page.tsx "Admin dashboard"

[330]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/layout.tsx "Admin layout"

[331]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/mapa/page.tsx "Map page"

[332]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/custodia-sae/page.tsx "SAE page"

[333]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/inversion/page.tsx "Investment page"

[334]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/nosotros/page.tsx "About page"

[335]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/contacto/page.tsx "Contact page"

[336]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/%5Bid%5D/page.tsx "Property detail"

[337]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage source"

[338]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Project package file"

[339]: https://github.com/jhonzapata2020/inmobliaria "Project homepage"

[340]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Commit history"

[341]: https://github.com/jhonzapata2020/inmobliaria/tree/main/src "Source directory"

[342]: https://github.com/jhonzapata2020/inmobliaria/tree/main/public "Public directory"

[343]: https://github.com/jhonzapata2020/inmobliaria/issues "Issue tracker"

[344]: https://github.com/jhonzapata2020/inmobliaria/pulls "Pull requests"

[345]: https://github.com/jhonzapata2020/inmobliaria/actions "GitHub Actions"

[346]: https://github.com/jhonzapata2020/inmobliaria/releases "Releases"

[347]: https://github.com/jhonzapata2020/inmobliaria/branches "Branches"

[348]: https://github.com/jhonzapata2020/inmobliaria/tags "Tags"

[349]: https://github.com/jhonzapata2020/inmobliaria/security "Security"

[350]: https://github.com/jhonzapata2020/inmobliaria/settings "Settings"

[351]: https://github.com/jhonzapata2020/inmobliaria/wiki "Wiki"

[352]: https://github.com/jhonzapata2020/inmobliaria/graphs "Graphs"

[353]: https://github.com/jhonzapata2020/inmobliaria/insights "Insights"

[354]: https://github.com/jhonzapata2020/inmobliaria/network "Network"

[355]: https://github.com/jhonzapata2020/inmobliaria/compare "Compare"

[356]: https://github.com/jhonzapata2020/inmobliaria/commits/main.atom "Commit feed"

[357]: https://github.com/jhonzapata2020/inmobliaria/releases.atom "Release feed"

[358]: https://github.com/jhonzapata2020/inmobliaria/notifications "Notifications"

[359]: https://github.com/jhonzapata2020/inmobliaria/stargazers "Stargazers"

[360]: https://github.com/jhonzapata2020/inmobliaria/watchers "Watchers"

[361]: https://github.com/jhonzapata2020/inmobliaria/forks "Forks"

[362]: https://github.com/jhonzapata2020/inmobliaria/branches/all "All branches"

[363]: https://github.com/jhonzapata2020/inmobliaria/tags "All tags"

[364]: https://github.com/jhonzapata2020/inmobliaria/pulse "Pulse"

[365]: https://github.com/jhonzapata2020/inmobliaria/graphs/commit-activity "Commit activity"

[366]: https://github.com/jhonzapata2020/inmobliaria/graphs/contributors "Contributors"

[367]: https://github.com/jhonzapata2020/inmobliaria/graphs/issues "Issues graph"

[368]: https://github.com/jhonzapata2020/inmobliaria/graphs/code-frequency "Code frequency"

[369]: https://github.com/jhonzapata2020/inmobliaria/graphs/punch-card "Punch card"

[370]: https://github.com/jhonzapata2020/inmobliaria/graphs/traffic "Traffic"

[371]: https://github.com/jhonzapata2020/inmobliaria/graphs/dependency-graph "Dependency graph"

[372]: https://github.com/jhonzapata2020/inmobliaria/security/dependabot "Dependabot"

[373]: https://github.com/jhonzapata2020/inmobliaria/security/code-scanning "Code scanning"

[374]: https://github.com/jhonzapata2020/inmobliaria/security/secret-scanning "Secret scanning"

[375]: https://github.com/jhonzapata2020/inmobliaria/settings/hooks "Webhooks"

[376]: https://github.com/jhonzapata2020/inmobliaria/settings/keys "Deploy keys"

[377]: https://github.com/jhonzapata2020/inmobliaria/settings/secrets/actions "Secrets"

[378]: https://github.com/jhonzapata2020/inmobliaria/blob/main/LICENSE "License"

[379]: https://github.com/jhonzapata2020/inmobliaria/blob/main/CONTRIBUTING.md "Contribution guide"

[380]: https://github.com/jhonzapata2020/inmobliaria/blob/main/.github "GitHub configuration"

[381]: https://github.com/jhonzapata2020/inmobliaria/actions/workflows "Workflows"

[382]: https://github.com/jhonzapata2020/inmobliaria/settings/pages "Pages"

[383]: https://github.com/jhonzapata2020/inmobliaria/settings/environments "Environments"

[384]: https://github.com/jhonzapata2020/inmobliaria/settings/variables/actions "Variables"

[385]: https://github.com/jhonzapata2020/inmobliaria/settings/actions "Actions settings"

[386]: https://github.com/jhonzapata2020/inmobliaria/settings/branches "Branch settings"

[387]: https://github.com/jhonzapata2020/inmobliaria/settings/security_analysis "Security analysis"

[388]: https://github.com/jhonzapata2020/inmobliaria/graphs/commit-activity "Commit activity"

[389]: https://github.com/jhonzapata2020/inmobliaria/graphs/code-frequency "Code frequency"

[390]: https://github.com/jhonzapata2020/inmobliaria/graphs/punch-card "Punch card"

[391]: https://github.com/jhonzapata2020/inmobliaria/graphs/traffic "Traffic"

[392]: https://github.com/jhonzapata2020/inmobliaria/graphs/dependency-graph "Dependency graph"

[393]: https://github.com/jhonzapata2020/inmobliaria/security "Security overview"

[394]: https://github.com/jhonzapata2020/inmobliaria/actions "Actions overview"

[395]: https://github.com/jhonzapata2020/inmobliaria/pulse "Project pulse"

[396]: https://github.com/jhonzapata2020/inmobliaria/graphs "Repository graphs"

[397]: https://github.com/jhonzapata2020/inmobliaria/insights "Repository insights"

[398]: https://github.com/jhonzapata2020/inmobliaria "Official repository"

[399]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Latest main commits"

[400]: https://raw.githubusercontent.com/jhonzapata2020/inmobliaria/main/package.json "Current package configuration"

[401]: https://htmlrev.com/free-tailwind-templates.html#ecommerce "Visual template reference"

[402]: https://nextjs.org/docs "Next.js documentation"

[403]: https://react.dev "React documentation"

[404]: https://tailwindcss.com/docs "Tailwind documentation"

[405]: https://lucide.dev "Lucide documentation"

[406]: https://leafletjs.com "Leaflet documentation"

[407]: https://www.sic.gov.co "Superintendencia de Industria y Comercio"

[408]: https://www.sae.gov.co "Sociedad de Activos Especiales"

[409]: https://www.w3.org/WAI "Web Accessibility Initiative"

[410]: https://owasp.org "OWASP Foundation"

[411]: https://playwright.dev "Playwright documentation"

[412]: https://www.postgresql.org/docs "PostgreSQL documentation"

[413]: https://developer.mozilla.org "MDN Web Docs"

[414]: https://developers.google.com/search/docs "Google Search documentation"

[415]: https://htmlrev.com/free-tailwind-templates.html#ecommerce "Tailwind ecommerce templates"

[416]: https://htmlrev.com/free-tailwind-templates.html#agency "Tailwind agency templates"

[417]: https://htmlrev.com/free-tailwind-templates.html#dashboard "Tailwind dashboard templates"

[418]: https://htmlrev.com/free-tailwind-templates.html#real-estate "Tailwind real estate templates"

[419]: https://github.com/jhonzapata2020/inmobliaria "Repository under audit"

[420]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Main branch commits"

[421]: https://github.com/jhonzapata2020/inmobliaria/tree/main/src "Audited source code"

[422]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Audited homepage"

[423]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Audited catalog"

[424]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/KanbanBoard.tsx "Audited CRM"

[425]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Audited dossier context"

[426]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Audited property model"

[427]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Audited property card"

[428]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/layout/Navbar.tsx "Audited navigation"

[429]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/layout.tsx "Audited root layout"

[430]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Audited dependencies"

[431]: https://github.com/jhonzapata2020/inmobliaria "Final project link"

[432]: https://htmlrev.com/free-tailwind-templates.html#ecommerce "Template research source"

[433]: https://nextjs.org/docs/app "Next App Router"

[434]: https://nextjs.org/docs/app/building-your-application/optimizing/images "Next images"

[435]: https://nextjs.org/docs/app/building-your-application/authentication "Next authentication"

[436]: https://nextjs.org/docs/app/building-your-application/deploying/production-checklist "Production checklist"

[437]: https://www.w3.org/WAI/standards-guidelines/wcag/ "WCAG"

[438]: https://owasp.org/www-project-top-ten/ "OWASP Top 10"

[439]: https://www.sic.gov.co/tema/proteccion-de-datos-personales "Colombian personal data"

[440]: https://www.sae.gov.co/ "SAE official site"

[441]: https://playwright.dev/docs/intro "Playwright testing"

[442]: https://www.postgresql.org/docs/current/ddl.html "PostgreSQL DDL"

[443]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage "localStorage"

[444]: https://nextjs.org/docs/app/api-reference/components/image "Next Image component"

[445]: https://nextjs.org/docs/app/building-your-application/optimizing/metadata "Next metadata"

[446]: https://nextjs.org/docs/app/building-your-application/routing/middleware "Next middleware"

[447]: https://nextjs.org/docs/app/building-your-application/routing/error-handling "Next error handling"

[448]: https://nextjs.org/docs/app/building-your-application/testing "Next testing"

[449]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Repository history"

[450]: https://github.com/jhonzapata2020/inmobliaria/blob/main/README.md "Project README"

[451]: https://github.com/jhonzapata2020/inmobliaria/blob/main/AGENTS.md "Project rules"

[452]: https://github.com/jhonzapata2020/inmobliaria/blob/main/CLAUDE.md "Project instructions"

[453]: https://nextjs.org/docs/app/building-your-application/optimizing "Next optimization"

[454]: https://nextjs.org/docs/app/building-your-application/routing "Next routing"

[455]: https://nextjs.org/docs/app/building-your-application/rendering "Next rendering"

[456]: https://nextjs.org/docs/app/building-your-application/caching "Next caching"

[457]: https://nextjs.org/docs/app/building-your-application/data-fetching "Next data fetching"

[458]: https://nextjs.org/docs/app/building-your-application/security "Next security"

[459]: https://nextjs.org/docs/app/building-your-application/testing "Next testing"

[460]: https://nextjs.org/docs/app/building-your-application/deploying "Next deploying"

[461]: https://nextjs.org/docs/app/api-reference "Next API reference"

[462]: https://nextjs.org/docs/app/api-reference/file-conventions "Next file conventions"

[463]: https://nextjs.org/docs/app/api-reference/components "Next components"

[464]: https://nextjs.org/docs/app/api-reference/functions "Next functions"

[465]: https://nextjs.org/docs/app/api-reference/file-conventions/metadata "Next metadata"

[466]: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots "Next robots"

[467]: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap "Next sitemap"

[468]: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image "Next Open Graph"

[469]: https://nextjs.org/docs/app/api-reference/components/image "Next Image"

[470]: https://nextjs.org/docs/app/api-reference/functions/not-found "Next not found"

[471]: https://nextjs.org/docs/app/api-reference/functions/redirect "Next redirect"

[472]: https://nextjs.org/docs/app/api-reference/functions/headers "Next headers"

[473]: https://nextjs.org/docs/app/api-reference/functions/cookies "Next cookies"

[474]: https://nextjs.org/docs/app/building-your-application/authentication "Authentication"

[475]: https://nextjs.org/docs/app/building-your-application/optimizing/images "Images"

[476]: https://nextjs.org/docs/app/building-your-application/optimizing/fonts "Fonts"

[477]: https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries "Third-party libraries"

[478]: https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading "Lazy loading"

[479]: https://nextjs.org/docs/app/building-your-application/optimizing/analytics "Analytics"

[480]: https://nextjs.org/docs/app/building-your-application/optimizing/metadata "Metadata"

[481]: https://nextjs.org/docs/app/building-your-application/optimizing "Optimization"

[482]: https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading "Lazy loading"

[483]: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations "Server actions"

[484]: https://nextjs.org/docs/app/building-your-application/routing/route-handlers "Route handlers"

[485]: https://nextjs.org/docs/app/building-your-application/routing/middleware "Middleware protection"

[486]: https://nextjs.org/docs/app/building-your-application/security "Security"

[487]: https://nextjs.org/docs/app/building-your-application/production-checklist "Production checklist"

[488]: https://nextjs.org/docs/app/building-your-application/testing/playwright "Playwright"

[489]: https://nextjs.org/docs/app/building-your-application/testing/jest "Jest"

[490]: https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries "Third-party libraries"

[491]: https://nextjs.org/docs/app/building-your-application/rendering/server-components "Server components"

[492]: https://nextjs.org/docs/app/building-your-application/rendering/client-components "Client components"

[493]: https://nextjs.org/docs/app/building-your-application/caching "Caching"

[494]: https://nextjs.org/docs/app/building-your-application/data-fetching "Data fetching"

[495]: https://nextjs.org/docs/app/building-your-application/routing "Routing"

[496]: https://nextjs.org/docs/app/building-your-application/optimizing "Optimization"

[497]: https://nextjs.org/docs/app/building-your-application/production-checklist "Production checklist"

[498]: https://github.com/jhonzapata2020/inmobliaria "Project"

[499]: https://github.com/jhonzapata2020/inmobliaria/commits/main "History"

[500]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package"

[501]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage"

[502]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catalog"

[503]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/KanbanBoard.tsx "CRM"

[504]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier"

[505]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Property model"

[506]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Card"

[507]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/layout/Navbar.tsx "Navbar"

[508]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/layout.tsx "Layout"

[509]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Mock data"

[510]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockLeads.ts "Mock leads"

[511]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/admin/PropertyFormModal.tsx "Admin form"

[512]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/QuickQuoteDrawer.tsx "Drawer"

[513]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/ExecutiveDossierModal.tsx "Dossier modal"

[514]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/map/PropertyMap.tsx "Map"

[515]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin"

[516]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/contacto/page.tsx "Contact"

[517]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/lib/formatters.ts "Formatters"

[518]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "Styles"

[519]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/crm.ts "CRM types"

[520]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/LeadDetailModal.tsx "Lead modal"

[521]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/FavoritesContext.tsx "Favorites"

[522]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/CompareContext.tsx "Compare"

[523]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/dossier.ts "Dossier types"

[524]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/%5Bid%5D/page.tsx "Details"

[525]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/page.tsx "Admin dashboard"

[526]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/layout.tsx "Admin layout"

[527]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/mapa/page.tsx "Map"

[528]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/custodia-sae/page.tsx "Custody"

[529]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/inversion/page.tsx "Investment"

[530]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/nosotros/page.tsx "About"

[531]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/contacto/page.tsx "Contact"

[532]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "Global CSS"

[533]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Property types"

[534]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/crm.ts "CRM types"

[535]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/dossier.ts "Dossier types"

[536]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier context"

[537]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/FavoritesContext.tsx "Favorites context"

[538]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/CompareContext.tsx "Compare context"

[539]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/layout/Navbar.tsx "Navbar"

[540]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/layout/Footer.tsx "Footer"

[541]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/AdvancedFilters.tsx "Advanced filters"

[542]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Property card"

[543]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/map/PropertyMap.tsx "Property map"

[544]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/QuickQuoteDrawer.tsx "Quick quote"

[545]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/ExecutiveDossierModal.tsx "Executive dossier"

[546]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/admin/PropertyFormModal.tsx "Property form"

[547]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/LeadDetailModal.tsx "Lead detail"

[548]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/compare/CompareModal.tsx "Compare modal"

[549]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin properties"

[550]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/crm/page.tsx "Admin CRM"

[551]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/contacto/page.tsx "Contact"

[552]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/mapa/page.tsx "Map page"

[553]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/custodia-sae/page.tsx "SAE page"

[554]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/inversion/page.tsx "Investment page"

[555]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/nosotros/page.tsx "About"

[556]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Home"

[557]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/layout.tsx "Root layout"

[558]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Property catalog"

[559]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/%5Bid%5D/page.tsx "Property detail"

[560]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/page.tsx "Admin home"

[561]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/layout.tsx "Admin layout"

[562]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/crm/page.tsx "CRM"

[563]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin properties"

[564]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/mapa/page.tsx "Map"

[565]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/custodia-sae/page.tsx "SAE"

[566]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/inversion/page.tsx "Investment"

[567]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/nosotros/page.tsx "About"

[568]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/contacto/page.tsx "Contact"

[569]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "Styles"

[570]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Property model"

[571]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/crm.ts "CRM model"

[572]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/dossier.ts "Dossier model"

[573]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier context"

[574]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Properties fixture"

[575]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockLeads.ts "Leads fixture"

[576]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Property card"

[577]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/AdvancedFilters.tsx "Advanced filters"

[578]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/map/PropertyMap.tsx "Map component"

[579]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/admin/PropertyFormModal.tsx "Admin form"

[580]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/KanbanBoard.tsx "Kanban"

[581]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/QuickQuoteDrawer.tsx "Dossier drawer"

[582]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/ExecutiveDossierModal.tsx "Dossier modal"

[583]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/page.tsx "Admin dashboard"

[584]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/layout.tsx "Admin layout"

[585]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/crm/page.tsx "CRM dashboard"

[586]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Property management"

[587]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Landing page"

[588]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Listings"

[589]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/%5Bid%5D/page.tsx "Listing detail"

[590]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/mapa/page.tsx "Map explorer"

[591]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/custodia-sae/page.tsx "Custody SAE"

[592]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/inversion/page.tsx "Investment opportunities"

[593]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/nosotros/page.tsx "About the company"

[594]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/contacto/page.tsx "Contact form"

[595]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "Global stylesheet"

[596]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Property TypeScript type"

[597]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/crm.ts "CRM TypeScript types"

[598]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/dossier.ts "Dossier TypeScript types"

[599]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier state"

[600]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Property mock data"

[601]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockLeads.ts "Lead mock data"

[602]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Property card component"

[603]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/AdvancedFilters.tsx "Filter component"

[604]: https://github.com/jhonzapata2020/inmobliaria/tree/main/src/components "Components"

[605]: https://github.com/jhonzapata2020/inmobliaria/tree/main/src/context "Contexts"

[606]: https://github.com/jhonzapata2020/inmobliaria/tree/main/src/data "Data"

[607]: https://github.com/jhonzapata2020/inmobliaria/tree/main/src/types "Types"

[608]: https://github.com/jhonzapata2020/inmobliaria/tree/main/src/lib "Lib"

[609]: https://github.com/jhonzapata2020/inmobliaria/tree/main/src/app "App"

[610]: https://github.com/jhonzapata2020/inmobliaria/tree/main/public "Public assets"

[611]: https://github.com/jhonzapata2020/inmobliaria/blob/main/README.md "Project README"

[612]: https://github.com/jhonzapata2020/inmobliaria/blob/main/AGENTS.md "Repository agent rules"

[613]: https://github.com/jhonzapata2020/inmobliaria/blob/main/CLAUDE.md "Repository Claude instructions"

[614]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Main branch history"

[615]: https://raw.githubusercontent.com/jhonzapata2020/inmobliaria/main/package.json "Current package JSON"

[616]: https://htmlrev.com/free-tailwind-templates.html#ecommerce "Template page"

[617]: https://nextjs.org/docs/app "App Router docs"

[618]: https://nextjs.org/docs/app/building-your-application/optimizing/images "Image optimization docs"

[619]: https://nextjs.org/docs/app/building-your-application/optimizing/metadata "Metadata docs"

[620]: https://nextjs.org/docs/app/building-your-application/authentication "Auth docs"

[621]: https://nextjs.org/docs/app/building-your-application/production-checklist "Production checklist docs"

[622]: https://www.sic.gov.co/tema/proteccion-de-datos-personales "Data protection Colombia"

[623]: https://www.sae.gov.co/ "SAE Colombia"

[624]: https://www.w3.org/WAI/standards-guidelines/wcag/ "WCAG guidelines"

[625]: https://owasp.org/www-project-top-ten/ "OWASP Top Ten"

[626]: https://playwright.dev/docs/intro "Playwright docs"

[627]: https://www.postgresql.org/docs/current/ddl.html "PostgreSQL DDL"

[628]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage "localStorage docs"

[629]: https://github.com/jhonzapata2020/inmobliaria "Audited repository"

[630]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Audited commit history"

[631]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Audited package file"

[632]: https://github.com/jhonzapata2020/inmobliaria/tree/main/src "Audited source tree"

[633]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage source"

[634]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catalog source"

[635]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/KanbanBoard.tsx "CRM source"

[636]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier source"

[637]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Property types source"

[638]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Property card source"

[639]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/layout/Navbar.tsx "Navbar source"

[640]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/layout.tsx "Layout source"

[641]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Properties source"

[642]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockLeads.ts "Leads source"

[643]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin properties source"

[644]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/crm/page.tsx "Admin CRM source"

[645]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/contacto/page.tsx "Contact source"

[646]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/admin/PropertyFormModal.tsx "Admin form source"

[647]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/QuickQuoteDrawer.tsx "Quick quote source"

[648]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/ExecutiveDossierModal.tsx "Dossier modal source"

[649]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/map/PropertyMap.tsx "Map source"

[650]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/lib/formatters.ts "Formatters source"

[651]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "Global stylesheet source"

[652]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/crm.ts "CRM types source"

[653]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/dossier.ts "Dossier types source"

[654]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/FavoritesContext.tsx "Favorites source"

[655]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/CompareContext.tsx "Compare source"

[656]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/%5Bid%5D/page.tsx "Property details source"

[657]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/mapa/page.tsx "Map page source"

[658]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/custodia-sae/page.tsx "Custody page source"

[659]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/inversion/page.tsx "Investment page source"

[660]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/nosotros/page.tsx "About source"

[661]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/page.tsx "Admin home source"

[662]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/layout.tsx "Admin layout source"

[663]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/LeadDetailModal.tsx "Lead detail source"

[664]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/compare/CompareModal.tsx "Compare source"

[665]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/layout/Footer.tsx "Footer source"

[666]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/AdvancedFilters.tsx "Advanced filters source"

[667]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Properties admin source"

[668]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/crm/page.tsx "CRM admin source"

[669]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Home source"

[670]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/layout.tsx "Root layout source"

[671]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Property listing source"

[672]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/%5Bid%5D/page.tsx "Property detail source"

[673]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/mapa/page.tsx "Map explorer source"

[674]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/custodia-sae/page.tsx "Custody source"

[675]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/inversion/page.tsx "Investment source"

[676]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/nosotros/page.tsx "About source"

[677]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/contacto/page.tsx "Contact source"

[678]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/page.tsx "Admin source"

[679]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/layout.tsx "Admin layout source"

[680]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/crm/page.tsx "CRM source"

[681]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin assets source"

[682]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/AdvancedFilters.tsx "Filter source"

[683]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Card source"

[684]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/map/PropertyMap.tsx "Map source"

[685]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/KanbanBoard.tsx "Kanban source"

[686]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/QuickQuoteDrawer.tsx "Dossier drawer source"

[687]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/ExecutiveDossierModal.tsx "Dossier generation source"

[688]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/admin/PropertyFormModal.tsx "CRUD source"

[689]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier context source"

[690]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Property schema source"

[691]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/crm.ts "CRM schema source"

[692]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/dossier.ts "Dossier schema source"

[693]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Property fixtures source"

[694]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockLeads.ts "Lead fixtures source"

[695]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/layout.tsx "Application layout source"

[696]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Application home source"

[697]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Application catalog source"

[698]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/page.tsx "Application admin source"

[699]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/layout.tsx "Application admin layout source"

[700]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/crm/page.tsx "Application CRM source"

[701]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Application property management source"

[702]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/contacto/page.tsx "Application contact source"

[703]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/mapa/page.tsx "Application map source"

[704]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/custodia-sae/page.tsx "Application custody source"

[705]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/inversion/page.tsx "Application investment source"

[706]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/nosotros/page.tsx "Application about source"

[707]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/%5Bid%5D/page.tsx "Application detail source"

[708]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/layout/Navbar.tsx "Application navigation source"

[709]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/layout/Footer.tsx "Application footer source"

[710]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/AdvancedFilters.tsx "Application filters source"

[711]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Application card source"

[712]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/map/PropertyMap.tsx "Application map component source"

[713]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/KanbanBoard.tsx "Application Kanban source"

[714]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/QuickQuoteDrawer.tsx "Application dossier drawer source"

[715]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/ExecutiveDossierModal.tsx "Application dossier modal source"

[716]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/admin/PropertyFormModal.tsx "Application CRUD form source"

[717]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/LeadDetailModal.tsx "Application lead modal source"

[718]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/compare/CompareModal.tsx "Application compare source"

[719]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/FavoritesContext.tsx "Application favorites source"

[720]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/CompareContext.tsx "Application compare context source"

[721]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/lib/formatters.ts "Application formatter source"

[722]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "Application global CSS source"

[723]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Application property type source"

[724]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/crm.ts "Application CRM type source"

[725]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/dossier.ts "Application dossier type source"

[726]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Application property data source"

[727]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockLeads.ts "Application lead data source"

[728]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/page.tsx "Application admin dashboard source"

[729]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/layout.tsx "Application admin layout source"

[730]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/crm/page.tsx "Application admin CRM source"

[731]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Application admin properties source"

[732]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/mapa/page.tsx "Application map source"

[733]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/custodia-sae/page.tsx "Application SAE source"

[734]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/inversion/page.tsx "Application investment source"

[735]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/nosotros/page.tsx "Application company source"

[736]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/contacto/page.tsx "Application contact source"

[737]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/%5Bid%5D/page.tsx "Application property details source"

[738]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Application homepage source"

[739]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Application package source"

[740]: https://github.com/jhonzapata2020/inmobliaria "Project source and version"

[741]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Project commit version"

[742]: https://htmlrev.com/free-tailwind-templates.html#ecommerce "Design references"

[743]: https://nextjs.org/docs/app "App Router reference"

[744]: https://nextjs.org/docs/app/building-your-application/optimizing/images "Image reference"

[745]: https://nextjs.org/docs/app/building-your-application/optimizing/metadata "SEO reference"

[746]: https://nextjs.org/docs/app/building-your-application/authentication "Authentication reference"

[747]: https://nextjs.org/docs/app/building-your-application/production-checklist "Production reference"

[748]: https://www.sic.gov.co/tema/proteccion-de-datos-personales "Data protection reference"

[749]: https://www.sae.gov.co/ "SAE reference"

[750]: https://www.w3.org/WAI/standards-guidelines/wcag/ "Accessibility reference"

[751]: https://owasp.org/www-project-top-ten/ "Security reference"

[752]: https://playwright.dev/docs/intro "Testing reference"

[753]: https://www.postgresql.org/docs/current/ddl.html "Data model reference"

[754]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage "Browser storage reference"

[755]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage inspected in source"

[756]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catalog inspected in source"

[757]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/KanbanBoard.tsx "Kanban inspected in source"

[758]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier inspected in source"

[759]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Property model inspected in source"

[760]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Property card inspected in source"

[761]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/layout/Navbar.tsx "Navbar inspected in source"

[762]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/layout.tsx "Layout inspected in source"

[763]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/crm.ts "CRM type inspected in source"

[764]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/dossier.ts "Dossier type inspected in source"

[765]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Property fixtures inspected in source"

[766]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockLeads.ts "Lead fixtures inspected in source"

[767]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/admin/PropertyFormModal.tsx "CRUD inspected in source"

[768]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin properties inspected in source"

[769]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/crm/page.tsx "Admin CRM inspected in source"

[770]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/contacto/page.tsx "Contact inspected in source"

[771]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/map/PropertyMap.tsx "Map inspected in source"

[772]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/QuickQuoteDrawer.tsx "Drawer inspected in source"

[773]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/ExecutiveDossierModal.tsx "Dossier inspected in source"

[774]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/lib/formatters.ts "Formatters inspected in source"

[775]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "Globals inspected in source"

[776]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/AdvancedFilters.tsx "Filters inspected in source"

[777]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/%5Bid%5D/page.tsx "Details inspected in source"

[778]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/FavoritesContext.tsx "Favorites inspected in source"

[779]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/CompareContext.tsx "Compare inspected in source"

[780]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/compare/CompareModal.tsx "Compare inspected in source"

[781]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/LeadDetailModal.tsx "Lead detail inspected in source"

[782]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/page.tsx "Admin home inspected in source"

[783]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/layout.tsx "Admin layout inspected in source"

[784]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/mapa/page.tsx "Map inspected in source"

[785]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/custodia-sae/page.tsx "Custody inspected in source"

[786]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/inversion/page.tsx "Investment inspected in source"

[787]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/nosotros/page.tsx "About inspected in source"

[788]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage inspected in source"

[789]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/layout.tsx "Layout inspected in source"

[790]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Property types inspected in source"

[791]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier context inspected in source"

[792]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/KanbanBoard.tsx "Kanban inspected in source"

[793]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Property card inspected in source"

[794]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/layout/Navbar.tsx "Navbar inspected in source"

[795]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/contacto/page.tsx "Contact inspected in source"

[796]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin inspected in source"

[797]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/crm/page.tsx "CRM inspected in source"

[798]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/map/PropertyMap.tsx "Map inspected in source"

[799]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/QuickQuoteDrawer.tsx "Quick quote inspected in source"

[800]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/ExecutiveDossierModal.tsx "Dossier inspected in source"

[801]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/lib/formatters.ts "Formatters inspected in source"

[802]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "Global CSS inspected in source"

[803]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/AdvancedFilters.tsx "Advanced filters inspected in source"

[804]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/%5Bid%5D/page.tsx "Property detail inspected in source"

[805]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/FavoritesContext.tsx "Favorites inspected in source"

[806]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/CompareContext.tsx "Compare inspected in source"

[807]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/compare/CompareModal.tsx "Compare modal inspected in source"

[808]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/LeadDetailModal.tsx "Lead modal inspected in source"

[809]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/page.tsx "Admin home inspected in source"

[810]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/layout.tsx "Admin layout inspected in source"

[811]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/mapa/page.tsx "Map page inspected in source"

[812]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/custodia-sae/page.tsx "Custody page inspected in source"

[813]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/inversion/page.tsx "Investment inspected in source"

[814]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/nosotros/page.tsx "About inspected in source"

[815]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/contacto/page.tsx "Contact inspected in source"

[816]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catalog inspected in source"

[817]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Home inspected in source"

[818]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/layout.tsx "Layout inspected in source"

[819]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Property model inspected in source"

[820]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier model inspected in source"

[821]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/KanbanBoard.tsx "CRM model inspected in source"

[822]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Card model inspected in source"

[823]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin model inspected in source"

[824]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/crm/page.tsx "CRM admin model inspected in source"

[825]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/QuickQuoteDrawer.tsx "Dossier drawer model inspected in source"

[826]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/map/PropertyMap.tsx "Map model inspected in source"

[827]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/AdvancedFilters.tsx "Filter model inspected in source"

[828]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/layout/Navbar.tsx "Navigation model inspected in source"

[829]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/contacto/page.tsx "Contact model inspected in source"

[830]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/%5Bid%5D/page.tsx "Detail model inspected in source"

[831]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/lib/formatters.ts "Formatting model inspected in source"

[832]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "Style model inspected in source"

[833]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Demo property data inspected in source"

[834]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockLeads.ts "Demo lead data inspected in source"

[835]: https://github.com/jhonzapata2020/inmobliaria "Repository final reference"

[836]: https://htmlrev.com/free-tailwind-templates.html#ecommerce "Template final reference"

[837]: https://nextjs.org/docs "Next final reference"

[838]: https://www.sic.gov.co "SIC final reference"

[839]: https://www.sae.gov.co "SAE final reference"

[840]: https://www.w3.org/WAI/standards-guidelines/wcag/ "WCAG final reference"

[841]: https://owasp.org/www-project-top-ten/ "OWASP final reference"

[842]: https://playwright.dev/docs/intro "Playwright final reference"

[843]: https://www.postgresql.org/docs/current/ddl.html "PostgreSQL final reference"

[844]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage "localStorage final reference"

[845]: https://nextjs.org/docs/app/building-your-application/production-checklist "Production final reference"

[846]: https://nextjs.org/docs/app/building-your-application/security "Security final reference"

[847]: https://nextjs.org/docs/app/building-your-application/authentication "Authentication final reference"

[848]: https://nextjs.org/docs/app/building-your-application/optimizing/images "Images final reference"

[849]: https://nextjs.org/docs/app/building-your-application/optimizing/metadata "SEO final reference"

[850]: https://nextjs.org/docs/app/building-your-application/testing "Testing final reference"

[851]: https://nextjs.org/docs/app/building-your-application/data-fetching "Data fetching final reference"

[852]: https://nextjs.org/docs/app/building-your-application/routing/middleware "Middleware final reference"

[853]: https://nextjs.org/docs/app/building-your-application/routing/route-handlers "Route handlers final reference"

[854]: https://nextjs.org/docs/app/api-reference/components/image "Image final reference"

[855]: https://nextjs.org/docs/app/api-reference/functions/not-found "Not found final reference"

[856]: https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading "Lazy loading final reference"

[857]: https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries "Third-party final reference"

[858]: https://nextjs.org/docs/app/building-your-application/optimizing/analytics "Analytics final reference"

[859]: https://nextjs.org/docs/app/building-your-application/rendering/server-components "Server components final reference"

[860]: https://nextjs.org/docs/app/building-your-application/rendering/client-components "Client components final reference"

[861]: https://nextjs.org/docs/app/building-your-application/caching "Caching final reference"

[862]: https://nextjs.org/docs/app/building-your-application/production-checklist "Production checklist final reference"

[863]: https://github.com/jhonzapata2020/inmobliaria "Repo"

[864]: https://raw.githubusercontent.com/jhonzapata2020/inmobliaria/main/package.json "Package"

[865]: https://htmlrev.com/free-tailwind-templates.html#ecommerce "Templates"

[866]: https://nextjs.org/docs "Next.js"

[867]: https://www.sic.gov.co "SIC"

[868]: https://www.sae.gov.co "SAE"

[869]: https://www.w3.org/WAI/standards-guidelines/wcag/ "WCAG"

[870]: https://owasp.org/www-project-top-ten/ "OWASP"

[871]: https://playwright.dev/docs/intro "Playwright"

[872]: https://www.postgresql.org/docs/current/ddl.html "PostgreSQL"

[873]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage "localStorage"

[874]: https://nextjs.org/docs/app/building-your-application/production-checklist "Production checklist"

[875]: https://nextjs.org/docs/app/building-your-application/authentication "Authentication"

[876]: https://nextjs.org/docs/app/building-your-application/optimizing/images "Images"

[877]: https://nextjs.org/docs/app/building-your-application/optimizing/metadata "Metadata"

[878]: https://nextjs.org/docs/app/building-your-application/testing "Testing"

[879]: https://nextjs.org/docs/app/building-your-application/security "Security"

[880]: https://nextjs.org/docs/app/building-your-application/optimizing "Optimization"

[881]: https://github.com/jhonzapata2020/inmobliaria "Repository"

[882]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Commits"

[883]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package JSON"

[884]: https://htmlrev.com/free-tailwind-templates.html#ecommerce "HTMLRev templates"

[885]: https://nextjs.org/docs/app "Next App Router"

[886]: https://nextjs.org/docs/app/building-your-application/production-checklist "Next production checklist"

[887]: https://www.sic.gov.co/tema/proteccion-de-datos-personales "Colombia privacy"

[888]: https://www.sae.gov.co/ "SAE"

[889]: https://www.w3.org/WAI/standards-guidelines/wcag/ "Accessibility"

[890]: https://owasp.org/www-project-top-ten/ "OWASP security"

[891]: https://playwright.dev/docs/intro "Playwright"

[892]: https://www.postgresql.org/docs/current/ddl.html "PostgreSQL"

[893]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage "localStorage"

[894]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage code"

[895]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catalog code"

[896]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier code"

[897]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/KanbanBoard.tsx "CRM code"

[898]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Property code"

[899]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Property card code"

[900]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/layout/Navbar.tsx "Navbar code"

[901]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/layout.tsx "Layout code"

[902]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Mock properties code"

[903]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockLeads.ts "Mock leads code"

[904]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/admin/PropertyFormModal.tsx "Admin form code"

[905]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/QuickQuoteDrawer.tsx "Dossier drawer code"

[906]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/ExecutiveDossierModal.tsx "Dossier modal code"

[907]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/map/PropertyMap.tsx "Map code"

[908]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/lib/formatters.ts "Formatters code"

[909]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "Global CSS code"

[910]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/crm.ts "CRM types code"

[911]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/dossier.ts "Dossier types code"

[912]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/%5Bid%5D/page.tsx "Details code"

[913]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/contacto/page.tsx "Contact code"

[914]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin code"

[915]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/crm/page.tsx "CRM admin code"

[916]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/mapa/page.tsx "Map page code"

[917]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/custodia-sae/page.tsx "Custody page code"

[918]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/inversion/page.tsx "Investment page code"

[919]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/nosotros/page.tsx "About page code"

[920]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/page.tsx "Admin page code"

[921]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/layout.tsx "Admin layout code"

[922]: https://github.com/jhonzapata2020/inmobliaria "Audit project"

[923]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Audit revision"

[924]: https://raw.githubusercontent.com/jhonzapata2020/inmobliaria/main/package.json "Audit package"

[925]: https://htmlrev.com/free-tailwind-templates.html#ecommerce "Audit design reference"

[926]: https://nextjs.org/docs/app "Audit Next docs"

[927]: https://www.sic.gov.co "Audit privacy reference"

[928]: https://www.sae.gov.co "Audit SAE reference"

[929]: https://www.w3.org/WAI/standards-guidelines/wcag/ "Audit accessibility reference"

[930]: https://owasp.org/www-project-top-ten/ "Audit security reference"

[931]: https://playwright.dev/docs/intro "Audit testing reference"

[932]: https://www.postgresql.org/docs/current/ddl.html "Audit database reference"

[933]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage "Audit localStorage reference"

[934]: https://github.com/jhonzapata2020/inmobliaria "Final audit source"

[935]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Final audit commits"

[936]: https://raw.githubusercontent.com/jhonzapata2020/inmobliaria/main/package.json "Final audit package"

[937]: https://htmlrev.com/free-tailwind-templates.html#ecommerce "Final audit templates"

[938]: https://nextjs.org/docs/app/building-your-application/production-checklist "Final production checklist"

[939]: https://nextjs.org/docs/app/building-your-application/authentication "Final authentication docs"

[940]: https://nextjs.org/docs/app/building-your-application/security "Final security docs"

[941]: https://nextjs.org/docs/app/building-your-application/optimizing/images "Final image docs"

[942]: https://nextjs.org/docs/app/building-your-application/optimizing/metadata "Final metadata docs"

[943]: https://www.sic.gov.co/tema/proteccion-de-datos-personales "Final data protection docs"

[944]: https://www.sae.gov.co/ "Final SAE reference"

[945]: https://www.w3.org/WAI/standards-guidelines/wcag/ "Final accessibility reference"

[946]: https://owasp.org/www-project-top-ten/ "Final OWASP reference"

[947]: https://playwright.dev/docs/intro "Final testing reference"

[948]: https://www.postgresql.org/docs/current/ddl.html "Final database reference"

[949]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage "Final browser storage reference"

[950]: https://nextjs.org/docs/app/building-your-application/routing/middleware "Final middleware reference"

[951]: https://nextjs.org/docs/app/building-your-application/routing/route-handlers "Final route handlers reference"

[952]: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations "Final mutations reference"

[953]: https://nextjs.org/docs/app/building-your-application/testing "Final testing reference"

[954]: https://github.com/jhonzapata2020/inmobliaria/tree/main/src "Final source reference"

[955]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Final homepage source"

[956]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Final catalog source"

[957]: https://github.com/jhonzapata2020/inmobliaria
