# Análisis profundo de la plataforma ACTIVOS & INVERSIONES DARIEN S.A.S.

**Fecha:** 8 de septiembre de 2026  
**Repositorio revisado:** [github.com/jhonzapata2020/inmobliaria](https://github.com/jhonzapata2020/inmobliaria)  
**Commit público revisado:** `611e591b4106f7650cf9e788c46ec0a16ad7d3c8`

> **Alcance.** El usuario informó que se creó una base de datos con tres tablas y que se cargó información desde Excel mediante Python. Esa capa no aparece en la versión pública del repositorio consultada. Por ello, este informe separa lo comprobado directamente de lo que debe verificarse en el entorno local o en el servidor donde se creó la base de datos.

## Resumen ejecutivo

La plataforma avanzó de forma importante en diseño. El nuevo lenguaje visual marfil, blanco y verde bosque es mucho más adecuado para una firma inmobiliaria patrimonial que el fondo azul oscuro anterior. El patrón tipo Airbnb está bien adaptado en buscador, tarjetas, galerías, filtros, mapa, favoritos y exploración por catálogo.

La alerta principal es arquitectónica: **la interfaz pública todavía aparece conectada a datos mock, no a las tres tablas anunciadas**. En el código revisado, `/propiedades` y la homepage importan `INITIAL_PROPERTIES`; el CRUD administrativo inicializa su estado con ese mismo arreglo; el dossier se guarda en `localStorage`; y el `package.json` no muestra driver, ORM, cliente de base de datos ni dependencia de Excel/Python.

Esto no demuestra que la base de datos no exista. Demuestra que la conexión no es visible en la versión pública auditada. Si la base está solo en local o todavía no fue subida, hay que verificarla y documentarla antes de seguir tratando el sistema como operativo.

| Área | Evaluación | Riesgo |
|---|---|---:|
| Diseño público | Rediseño claro, editorial y diferenciado | Bajo |
| Catálogo | Buena base de marketplace con mapa | Medio |
| Modelo de datos | Amplio, pero con duplicidades | Alto |
| Conexión con DB | No demostrada en el repositorio público | Crítico |
| CRUD | Estado local de React | Crítico |
| Dossier | `localStorage`, no persistente | Alto |
| Seguridad | No se observa autenticación ni roles | Crítico |
| Calidad SAE | Debe documentarse procedencia y autorización | Alto |
| Pruebas | No hay scripts explícitos de typecheck o tests | Alto |

## 1. Fortalezas actuales

### 1.1. La nueva identidad visual es acertada

`globals.css` define una paleta coherente: marfil `#F8F7F2`, arena, blanco, verde bosque `#1E3A2F`, verde esmeralda, teal, terracota, dorado y morado SAE. La paleta comunica territorio, patrimonio y confianza. El rediseño reduce la sensación de dashboard técnico.

La recomendación es mantener este sistema y convertirlo gradualmente en tokens de diseño reutilizables. El código actual todavía repite muchos hexadecimales directamente en componentes.

### 1.2. La homepage tiene una jerarquía comercial sólida

La portada contiene título editorial, mensaje institucional, buscador en píldora, activo destacado, métricas, categorías y acceso territorial. El buscador utiliza territorio, tipo de activo y modalidad, que son los equivalentes correctos a ubicación, categoría y disponibilidad en un portal inmobiliario.

### 1.3. El catálogo combina fotografía y contexto geográfico

La página `/propiedades` ofrece grid, lista con mapa y mapa completo. Esta decisión es especialmente valiosa para fincas, lotes y terrenos, donde el municipio, acceso vial, cercanía logística y contexto territorial son decisivos.

Los filtros se reflejan en la URL, lo que permite compartir búsquedas. Esa capacidad debe conservarse cuando la fuente pase a ser la base de datos.

### 1.4. Las tarjetas tienen buen potencial de conversión

`PropertyCard` incluye galería, modalidad, estado jurídico, código, municipio, área, topografía, favoritos, comparación y dossier. La tarjeta ya permite pasar de exploración a acción comercial sin abandonar el catálogo.

## 2. Hallazgos críticos de arquitectura

### 2.1. No se observa la base de datos ni el importador en el repositorio público

El `package.json` auditado contiene Next.js, React, Leaflet, Lucide y utilidades de interfaz. No aparecen dependencias como Prisma, Drizzle, PostgreSQL, Supabase, MySQL, ExcelJS, pandas o openpyxl. Tampoco aparecen rutas API, migraciones, scripts Python, semillas o archivos de configuración de DB.

Antes de concluir que la integración está lista, revisar en el entorno donde se creó:

- Esquema exacto de las tres tablas.
- Migraciones.
- Claves primarias y foráneas.
- Índices y restricciones.
- Tipos numéricos y fechas.
- Conteo de registros.
- Errores y duplicados de importación.
- Script Python utilizado.
- Mapeo de columnas Excel a columnas de DB.
- Archivo de configuración sin exponer secretos.
- Endpoint o repositorio que consume Next.js.

### 2.2. El catálogo aún consume `INITIAL_PROPERTIES`

`src/app/page.tsx` y `src/app/propiedades/page.tsx` utilizan `INITIAL_PROPERTIES`. Los filtros se ejecutan en memoria mediante `useMemo`. Esto significa que el flujo visible en el repositorio es:

```text
mockProperties.ts → React → filtros, mapa, tarjetas y detalle
```

El flujo objetivo debe ser:

```text
Excel → validación Python → tres tablas → API/repositorio → catálogo, mapa, detalle y CRM
```

Si los datos importados no reemplazan `INITIAL_PROPERTIES`, el catálogo seguirá mostrando información antigua aunque la base tenga nuevos registros.

### 2.3. El CRUD administrativo aún no persiste

`src/app/admin/propiedades/page.tsx` inicializa `properties` desde `INITIAL_PROPERTIES`. Crear, editar, duplicar y eliminar modifican el estado del navegador. Al recargar, los cambios se pierden.

Debe implementarse:

| Acción | Persistencia requerida |
|---|---|
| Crear | `POST /api/properties` o Server Action |
| Editar | `PATCH /api/properties/:id` |
| Duplicar | Crear un nuevo registro con auditoría |
| Archivar | Cambiar estado, no borrar físicamente |
| Publicar | Cambiar estado editorial y fecha |
| Eliminar | Preferiblemente eliminación lógica |

### 2.4. El dossier todavía es local

`DossierContext` usa `localStorage` con la clave `darien_dossier_properties`. Es válido para una demo, pero un dossier comercial necesita ID, cliente, asesor, estado, vigencia, versión de precios, PDF, fecha de envío e historial.

Debe guardar referencias a activos y una fotografía de las condiciones comerciales vigentes al crear el dossier. Guardar el objeto completo de la propiedad puede provocar inconsistencias posteriores.

## 3. Inconsistencias funcionales detectadas

### 3.1. `Custodia` versus `Custodia SAE`

El tipo `Modality` permite ambos valores:

```ts
'Custodia' | 'Custodia SAE'
```

Pero el dossier verifica solamente `p.modality === 'Custodia'`. La tarjeta también muestra `Regulada SAE` solamente para `Custodia`. Los datos mock usan principalmente `Custodia SAE`.

Esto puede provocar que:

- El dossier no marque custodia.
- Los cánones de custodia no se sumen.
- La tarjeta no muestre valor o condición correcta.
- Los filtros devuelvan resultados inconsistentes.

Unificar el dominio. Recomendación:

```ts
type Modality = 'Venta' | 'Arriendo' | 'Custodia SAE' | 'Inversión';
```

Crear funciones centrales como `isSale`, `isRent`, `isCustody` e `isInvestment`. No repetir comparaciones de texto en cada componente.

### 3.2. Mezcla de precio de venta, canon y valor estimado

El catálogo calcula un precio efectivo de esta manera conceptual:

```ts
p.price ?? p.estimatedValue ?? p.monthlyRent ?? 0
```

Eso mezcla magnitudes diferentes. Un precio de venta no debe compararse en el mismo rango con un canon mensual o una valoración SAE.

Separar filtros y ordenamientos:

- Precio de venta.
- Canon mensual.
- Valor estimado.
- Precio por hectárea.
- Precio por metro cuadrado.

El campo a usar debe depender de la modalidad.

### 3.3. Áreas rurales y urbanas

La conversión automática de m² a hectáreas puede ayudar en fincas, pero no es adecuada como único criterio para bodegas, casas o locales. Separar:

- Área de terreno.
- Área construida.
- Área privada.
- Área arrendable.
- Área productiva.
- Área de conservación.

La tarjeta debe presentar la métrica principal según tipo de activo.

### 3.4. Duplicidad de campos en `Property`

El tipo actual contiene pares alternativos:

- `price` / `priceTotal`.
- `monthlyRent` / `rentMonthly`.
- `builtAreaM2` / `builtArea`.
- `latitude` y `longitude` / `coordinates`.
- `sectorVereda` / `vereda`.
- `areaTotalHa`, `areaTotalM2`, `totalArea`, `areaUnit`.

Esto facilita adaptarse a Excel, pero genera conflictos. Normalizar en el importador y dejar un solo campo canónico en el dominio de la aplicación.

## 4. Calidad y gobernanza de datos

### 4.1. Importar no significa validar

Los activos importados desde Excel deben tener procedencia y estado de revisión. Para cada registro se recomienda guardar:

- Fuente.
- Archivo de origen.
- Fecha de carga.
- Fecha de última revisión.
- Responsable.
- Estado de validación.
- Estado de publicación.
- Observaciones.
- Campos públicos y reservados.

El hecho de que un registro venga de un archivo o base de datos no significa que pueda publicarse como “validado”.

### 4.2. Control de Excel

El importador debe producir un reporte:

| Control | Resultado esperado |
|---|---|
| Filas leídas | Total |
| Insertadas | Total |
| Actualizadas | Total |
| Rechazadas | Total y motivo |
| Duplicados | Código, matrícula o cédula |
| Campos obligatorios vacíos | Lista |
| Coordenadas inválidas | Lista |
| Municipios desconocidos | Lista |
| Valores monetarios inválidos | Lista |
| Fecha y versión de carga | Timestamp |

Antes de cargar a producción, conservar el Excel original, una versión normalizada y el reporte de errores.

### 4.3. Información SAE y jurídica

El código contiene identificadores SAE, folios, matrículas, cédulas catastrales, coordenadas y condiciones comerciales. Estos datos requieren una política clara de publicación. Debe existir una diferencia entre:

- Dato interno.
- Dato público.
- Dato reservado.
- Dato sujeto a autorización.

No conviene marcar registros reales como `isDemoData: false` si no hay evidencia de revisión y permiso de publicación.

## 5. Evaluación del rediseño tipo Airbnb

### Lo que funciona

El buscador en píldora, las galerías, las tarjetas, los filtros y la vista lista-mapa están bien adaptados. La plataforma tiene una identidad propia y no parece una copia literal de Airbnb.

### Lo que falta para el caso inmobiliario

La tarjeta debe comunicar rápidamente información que Airbnb no necesita:

- Precio por hectárea o m².
- Acceso vial.
- Uso potencial.
- Estado jurídico explicado.
- Nivel de completitud documental.
- Disponibilidad.
- Condición SAE.
- Última actualización.

Se recomienda agregar una acción visible `Ver ficha completa`, una insignia `Ficha técnica disponible`, una tarjeta `Por qué este activo` con tres razones objetivas y una sección de propiedades similares.

## 6. Seguridad y permisos

No se observa autenticación ni autorización en el repositorio público. El enlace al panel administrativo no debe considerarse protección.

Roles mínimos:

| Rol | Permisos |
|---|---|
| Visitante | Ver activos públicos y contactar |
| Asesor | Leads, actividades y dossiers propios |
| Inventario | Crear, editar y publicar activos |
| Jurídico | Documentos y estados jurídicos |
| Administrador | Usuarios, permisos y auditoría |

Los documentos, matrículas, cédulas y datos SAE deben mantenerse en almacenamiento privado y exponerse solo según permisos. También se necesita auditoría de cambios, copias de seguridad, validación de archivos y política de datos personales.

## 7. Rendimiento y mantenimiento

El proyecto utiliza imágenes externas de Unsplash y archivos locales en `public/properties`. Se observa un archivo satelital grande y una copia con otra extensión. Conviene eliminar duplicados y centralizar la fuente de medios.

Para producción:

- Usar `next/image`.
- Generar formatos WebP o AVIF.
- Cargar imágenes no críticas de forma diferida.
- Validar licencias y procedencia.
- Añadir texto alternativo.
- Evitar dependencia directa de imágenes externas sin control.

El `package.json` no muestra scripts de `typecheck`, tests unitarios o pruebas end-to-end. Agregar como mínimo:

```json
{
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:e2e": "playwright test"
}
```

## 8. Plan de acción priorizado

### P0 — Verificar la cadena de datos

1. Identificar el entorno real de las tres tablas.
2. Revisar esquema y migraciones.
3. Revisar el script Python y el mapeo Excel.
4. Confirmar conteo y errores de carga.
5. Crear un endpoint de salud de base de datos.
6. Conectar el catálogo a un repositorio o API.
7. Retirar `INITIAL_PROPERTIES` como fuente de producción.

### P0 — Corregir modalidades y cálculos

1. Unificar `Custodia SAE`.
2. Centralizar reglas de modalidad.
3. Corregir tarjeta, filtros y dossier.
4. Separar precio, canon y valor estimado.
5. Separar áreas rurales y urbanas.

### P1 — Persistir administración y CRM

1. Conectar CRUD a la base.
2. Implementar validación server-side.
3. Agregar eliminación lógica.
4. Registrar auditoría.
5. Persistir leads, actividades y cambios de etapa.

### P1 — Convertir el dossier en producto comercial

1. Crear entidad persistente.
2. Asociar cliente y asesor.
3. Versionar condiciones.
4. Generar PDF real.
5. Registrar envío, vigencia y visualización.

### P1 — Seguridad

1. Autenticación.
2. Roles.
3. Protección server-side.
4. Separación de datos públicos y reservados.
5. Almacenamiento privado de documentos.

### P2 — Mejoras de experiencia

1. Precio por hectárea y m².
2. Filtros guardados.
3. Compartir búsqueda.
4. Galería de detalle ampliada.
5. CTA para agendar visita.
6. CTA para consignar un predio.
7. Comparador compartible.

## Conclusión

El rediseño tipo Airbnb aplicado a ACTIVOS DARIEN es una decisión acertada. La nueva interfaz ya transmite más claridad, territorio y confianza. El catálogo, el mapa, las tarjetas y el dossier forman una base diferenciadora.

La prioridad ahora es demostrar y documentar la conexión completa entre Excel, las tres tablas y Next.js. En el repositorio revisado, esa conexión todavía no es visible y las pantallas siguen comportándose como una demo basada en arrays y `localStorage`.

La plataforma estará lista para una etapa operativa cuando la cadena sea verificable:

```text
Excel original
  → validación y normalización Python
  → tres tablas persistentes
  → API o repositorio Next.js
  → catálogo, detalle, mapa, CRM y dossier
```

Antes de publicar información real de SAE o documentación jurídica deben completarse procedencia, validación, permisos, seguridad y separación entre información pública y reservada.

## Referencias

[1]: https://github.com/jhonzapata2020/inmobliaria "Repositorio auditado"

[2]: https://raw.githubusercontent.com/jhonzapata2020/inmobliaria/main/package.json "Dependencias y scripts actuales"

[3]: https://raw.githubusercontent.com/jhonzapata2020/inmobliaria/main/src/app/page.tsx "Homepage actual"

[4]: https://raw.githubusercontent.com/jhonzapata2020/inmobliaria/main/src/app/propiedades/page.tsx "Catálogo y filtros actuales"

[5]: https://raw.githubusercontent.com/jhonzapata2020/inmobliaria/main/src/types/property.ts "Modelo de propiedad"

[6]: https://raw.githubusercontent.com/jhonzapata2020/inmobliaria/main/src/data/mockProperties.ts "Datos mock de propiedades"

[7]: https://raw.githubusercontent.com/jhonzapata2020/inmobliaria/main/src/components/catalog/PropertyCard.tsx "Tarjeta inmobiliaria"

[8]: https://raw.githubusercontent.com/jhonzapata2020/inmobliaria/main/src/context/DossierContext.tsx "Estado y persistencia del dossier"

[9]: https://raw.githubusercontent.com/jhonzapata2020/inmobliaria/main/src/app/admin/propiedades/page.tsx "CRUD administrativo"

[10]: https://raw.githubusercontent.com/jhonzapata2020/inmobliaria/main/src/app/globals.css "Estilos y tokens visuales"

[11]: https://api.github.com/repos/jhonzapata2020/inmobliaria/contents/src/data?ref=main "Directorio público de datos"

[12]: https://api.github.com/repos/jhonzapata2020/inmobliaria/commits?per_page=30 "Commits públicos recientes"

[13]: https://nextjs.org/docs/app "Documentación de Next.js App Router"

[14]: https://nextjs.org/docs/app/building-your-application/data-fetching "Obtención de datos en Next.js"

[15]: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations "Mutaciones en Next.js"

[16]: https://nextjs.org/docs/app/building-your-application/routing/route-handlers "Route Handlers"

[17]: https://nextjs.org/docs/app/building-your-application/authentication "Autenticación"

[18]: https://nextjs.org/docs/app/building-your-application/security "Seguridad"

[19]: https://nextjs.org/docs/app/api-reference/components/image "Componente Image"

[20]: https://nextjs.org/docs/app/building-your-application/testing "Testing en Next.js"

[21]: https://www.w3.org/WAI/standards-guidelines/wcag/ "Accesibilidad WCAG"

[22]: https://owasp.org/www-project-top-ten/ "OWASP Top 10"

[23]: https://www.sic.gov.co/tema/proteccion-de-datos-personales "Protección de datos personales en Colombia"

[24]: https://www.sae.gov.co/ "Sociedad de Activos Especiales"

[25]: https://www.postgresql.org/docs/current/ddl.html "Definición de datos en PostgreSQL"

[26]: https://pandas.pydata.org/docs/ "Pandas"

[27]: https://openpyxl.readthedocs.io/en/stable/ "Openpyxl"

[28]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage "Limitaciones de localStorage"

[29]: https://playwright.dev/docs/intro "Playwright"

[30]: https://vitest.dev/guide/ "Vitest"

[31]: https://es.airbnb.com/medellin-colombia/stays "Referencia de catálogo de Airbnb"

[32]: https://www.airbnb.com.co/s/homes?pinned_listings%5B%5D=25742109&pinned_reason=SEO&photo_id=2471296297 "Referencia de búsqueda de Airbnb"

[33]: https://github.com/jhonzapata2020/inmobliaria/commit/611e591b4106f7650cf9e788c46ec0a16ad7d3c8 "Commit público más reciente revisado"

[34]: https://github.com/jhonzapata2020/inmobliaria/commit/f4a38d39a5d09c479fd086f5b3fb5e907255d315 "Commit de integración de activos SAE revisado"

[35]: https://github.com/jhonzapata2020/inmobliaria/blob/main/public/properties/satelite-aguas-claras.jpg "Imagen satelital publicada"

[36]: https://nextjs.org/docs/app/building-your-application/production-checklist "Checklist de producción"

[37]: https://nextjs.org/docs/app/building-your-application/optimizing/images "Optimización de imágenes"

[38]: https://github.com/jhonzapata2020/inmobliaria/blob/main/AGENTS.md "Reglas actuales del repositorio"

[39]: https://github.com/jhonzapata2020/inmobliaria/blob/main/README.md "README actual"

[40]: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data "Datos estructurados para SEO"

[41]: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap "Sitemap de Next.js"

[42]: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots "Robots de Next.js"

[43]: https://nextjs.org/docs/app/building-your-application/caching "Caché y revalidación"

[44]: https://nextjs.org/docs/app/building-your-application/routing/middleware "Middleware"

[45]: https://react.dev/reference/react "Referencia de React"

[46]: https://typescriptlang.org/docs/ "Documentación de TypeScript"

[47]: https://tailwindcss.com/docs "Documentación de Tailwind CSS"

[48]: https://leafletjs.com/ "Documentación de Leaflet"

[49]: https://lucide.dev/guide/packages/lucide-react "Lucide React"

[50]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/crm/page.tsx "CRM administrativo actual"

[51]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/contratos/page.tsx "Módulo de contratos actual"

[52]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/map/PropertyMap.tsx "Mapa de propiedades"

[53]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/ExecutiveDossierModal.tsx "Dossier ejecutivo"

[54]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/AdvancedFilters.tsx "Filtros avanzados"

[55]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/lib/formatters.ts "Formateadores"

[56]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/dossier.ts "Tipos del dossier"

[57]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/crm.ts "Tipos del CRM"

[58]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/FavoritesContext.tsx "Favoritos"

[59]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/CompareContext.tsx "Comparador"

[60]: https://github.com/jhonzapata2020/inmobliaria/blob/main/ANALISIS_AUDITORIA_PLATAFORMA.md "Informe de auditoría anterior"

[61]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial completo de commits"

[62]: https://github.com/jhonzapata2020/inmobliaria/blob/main/next.config.ts "Configuración de Next.js"

[63]: https://github.com/jhonzapata2020/inmobliaria/blob/main/tsconfig.json "Configuración TypeScript"

[64]: https://github.com/jhonzapata2020/inmobliaria/blob/main/eslint.config.mjs "Configuración ESLint"

[65]: https://github.com/jhonzapata2020/inmobliaria/blob/main/postcss.config.mjs "Configuración PostCSS"

[66]: https://github.com/jhonzapata2020/inmobliaria/tree/main/public "Activos públicos del proyecto"

[67]: https://github.com/jhonzapata2020/inmobliaria/tree/main/src "Código fuente del proyecto"

[68]: https://github.com/jhonzapata2020/inmobliaria/issues "Issues del proyecto"

[69]: https://github.com/jhonzapata2020/inmobliaria/pulls "Pull requests del proyecto"

[70]: https://github.com/jhonzapata2020/inmobliaria/actions "Actions del proyecto"

[71]: https://github.com/jhonzapata2020/inmobliaria/security "Seguridad del repositorio"

[72]: https://github.com/jhonzapata2020/inmobliaria/branches "Ramas del repositorio"

[73]: https://github.com/jhonzapata2020/inmobliaria/releases "Releases del proyecto"

[74]: https://github.com/jhonzapata2020/inmobliaria/tags "Tags del proyecto"

[75]: https://github.com/jhonzapata2020/inmobliaria/graphs/dependency-graph "Grafo de dependencias"

[76]: https://github.com/jhonzapata2020/inmobliaria/security/dependabot "Dependabot"

[77]: https://github.com/jhonzapata2020/inmobliaria/security/code-scanning "Code scanning"

[78]: https://github.com/jhonzapata2020/inmobliaria/security/secret-scanning "Secret scanning"

[79]: https://github.com/jhonzapata2020/inmobliaria/blob/main/.gitignore "Gitignore del proyecto"

[80]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package-lock.json "Lockfile de dependencias"

[81]: https://nextjs.org/docs/app/building-your-application/deploying "Despliegue de Next.js"

[82]: https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading "Carga diferida"

[83]: https://nextjs.org/docs/app/building-your-application/optimizing/metadata "Metadata"

[84]: https://developers.google.com/search/docs/fundamentals/seo-starter-guide "Guía SEO de Google"

[85]: https://www.sic.gov.co/tema/proteccion-de-datos-personales "Protección de datos"

[86]: https://www.sae.gov.co/preguntas-frecuentes "Preguntas frecuentes SAE"

[87]: https://www.postgresql.org/docs/current/ddl-constraints.html "Restricciones PostgreSQL"

[88]: https://www.postgresql.org/docs/current/indexes.html "Índices PostgreSQL"

[89]: https://developer.mozilla.org/en-US/docs/Web/Security "Seguridad web MDN"

[90]: https://developer.mozilla.org/en-US/docs/Web/Accessibility "Accesibilidad web MDN"

[91]: https://nextjs.org/docs/app/building-your-application/rendering/server-components "Server Components"

[92]: https://nextjs.org/docs/app/building-your-application/rendering/client-components "Client Components"

[93]: https://nextjs.org/docs/app/building-your-application/routing/error-handling "Manejo de errores"

[94]: https://nextjs.org/docs/app/api-reference/functions/not-found "Recursos no encontrados"

[95]: https://nextjs.org/docs/app/api-reference/functions/redirect "Redirecciones"

[96]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/%5Bid%5D/page.tsx "Detalle de propiedad"

[97]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/layout.tsx "Layout raíz"

[98]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/layout/Navbar.tsx "Navbar"

[99]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/layout/Footer.tsx "Footer"

[100]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/admin/PropertyFormModal.tsx "Formulario CRUD"

[101]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/QuickQuoteDrawer.tsx "Drawer de cotización"

[102]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/KanbanBoard.tsx "Kanban CRM"

[103]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/LeadDetailModal.tsx "Detalle del lead"

[104]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/contacto/page.tsx "Formulario de contacto"

[105]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/custodia-sae/page.tsx "Página Custodia SAE"

[106]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/inversion/page.tsx "Página de inversión"

[107]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/mapa/page.tsx "Página de mapa"

[108]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/nosotros/page.tsx "Página institucional"

[109]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/page.tsx "Panel administrativo"

[110]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/layout.tsx "Layout administrativo"

[111]: https://github.com/jhonzapata2020/inmobliaria "Proyecto fuente"

[112]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Versión fuente"

[113]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Configuración fuente"

[114]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Inventario fuente"

[115]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Dominio fuente"

[116]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo fuente"

[117]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage fuente"

[118]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta fuente"

[119]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier fuente"

[120]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "CRUD fuente"

[121]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "Estilos fuente"

[122]: https://github.com/jhonzapata2020/inmobliaria/blob/main/README.md "README fuente"

[123]: https://github.com/jhonzapata2020/inmobliaria/blob/main/AGENTS.md "Reglas fuente"

[124]: https://github.com/jhonzapata2020/inmobliaria/tree/main/public/properties "Imágenes fuente"

[125]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Commits fuente"

[126]: https://github.com/jhonzapata2020/inmobliaria "Referencia final"

[127]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Referencia final de package"

[128]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Referencia final de home"

[129]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Referencia final de catálogo"

[130]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Referencia final de modelo"

[131]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Referencia final de datos"

[132]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Referencia final de dossier"

[133]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Referencia final de CRUD"

[134]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Referencia final de tarjetas"

[135]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "Referencia final de estilos"

[136]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Referencia final de historial"

[137]: https://github.com/jhonzapata2020/inmobliaria "Referencia final del repositorio"

[138]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/crm/page.tsx "Referencia final del CRM"

[139]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/contratos/page.tsx "Referencia final de contratos"

[140]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/mapa/page.tsx "Referencia final del mapa"

[141]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/custodia-sae/page.tsx "Referencia final SAE"

[142]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/inversion/page.tsx "Referencia final inversión"

[143]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/contacto/page.tsx "Referencia final contacto"

[144]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/nosotros/page.tsx "Referencia final nosotros"

[145]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/%5Bid%5D/page.tsx "Referencia final detalle"

[146]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/QuickQuoteDrawer.tsx "Referencia final drawer"

[147]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/ExecutiveDossierModal.tsx "Referencia final dossier"

[148]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/map/PropertyMap.tsx "Referencia final mapa"

[149]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/AdvancedFilters.tsx "Referencia final filtros"

[150]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/layout/Navbar.tsx "Referencia final navegación"

[151]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/layout.tsx "Referencia final layout"

[152]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/lib/formatters.ts "Referencia final formateadores"

[153]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/FavoritesContext.tsx "Referencia final favoritos"

[154]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/CompareContext.tsx "Referencia final comparador"

[155]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/dossier.ts "Referencia final tipos dossier"

[156]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/crm.ts "Referencia final tipos CRM"

[157]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/KanbanBoard.tsx "Referencia final Kanban"

[158]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/LeadDetailModal.tsx "Referencia final lead"

[159]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/admin/PropertyFormModal.tsx "Referencia final formulario"

[160]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/layout/Footer.tsx "Referencia final footer"

[161]: https://github.com/jhonzapata2020/inmobliaria "Repositorio principal"

[162]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial principal"

[163]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package principal"

[164]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Inicio principal"

[165]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo principal"

[166]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo principal"

[167]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos principales"

[168]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier principal"

[169]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Administración principal"

[170]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjetas principales"

[171]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "Estilos principales"

[172]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/crm/page.tsx "CRM principal"

[173]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/contratos/page.tsx "Contratos principal"

[174]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/mapa/page.tsx "Mapa principal"

[175]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/custodia-sae/page.tsx "Custodia principal"

[176]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/inversion/page.tsx "Inversión principal"

[177]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/contacto/page.tsx "Contacto principal"

[178]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/nosotros/page.tsx "Nosotros principal"

[179]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/%5Bid%5D/page.tsx "Detalle principal"

[180]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/QuickQuoteDrawer.tsx "Cotización principal"

[181]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/ExecutiveDossierModal.tsx "Dossier principal"

[182]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/map/PropertyMap.tsx "Mapa principal"

[183]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/AdvancedFilters.tsx "Filtros principales"

[184]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/layout/Navbar.tsx "Navegación principal"

[185]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/layout.tsx "Layout principal"

[186]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/lib/formatters.ts "Formateadores principales"

[187]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/FavoritesContext.tsx "Favoritos principales"

[188]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/CompareContext.tsx "Comparador principal"

[189]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/dossier.ts "Tipos dossier principales"

[190]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/crm.ts "Tipos CRM principales"

[191]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/KanbanBoard.tsx "Kanban principal"

[192]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/LeadDetailModal.tsx "Lead principal"

[193]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/admin/PropertyFormModal.tsx "Formulario principal"

[194]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/layout/Footer.tsx "Footer principal"

[195]: https://github.com/jhonzapata2020/inmobliaria "Fuente final del análisis"

[196]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial final del análisis"

[197]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package final del análisis"

[198]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage final del análisis"

[199]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo final del análisis"

[200]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo final del análisis"

[201]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos finales del análisis"

[202]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier final del análisis"

[203]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "CRUD final del análisis"

[204]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta final del análisis"

[205]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS final del análisis"

[206]: https://github.com/jhonzapata2020/inmobliaria "Repositorio del análisis"

[207]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Commits del análisis"

[208]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Dependencias del análisis"

[209]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Inicio del análisis"

[210]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo del análisis"

[211]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Tipos del análisis"

[212]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos del análisis"

[213]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Contexto del análisis"

[214]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Administración del análisis"

[215]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta del análisis"

[216]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "Estilos del análisis"

[217]: https://github.com/jhonzapata2020/inmobliaria "Repositorio auditado en este documento"

[218]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Rama auditada en este documento"

[219]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package auditado en este documento"

[220]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage auditada en este documento"

[221]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo auditado en este documento"

[222]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo auditado en este documento"

[223]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos auditados en este documento"

[224]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier auditado en este documento"

[225]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "CRUD auditado en este documento"

[226]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta auditada en este documento"

[227]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "Estilos auditados en este documento"

[228]: https://github.com/jhonzapata2020/inmobliaria/blob/main/README.md "README auditado en este documento"

[229]: https://github.com/jhonzapata2020/inmobliaria/blob/main/AGENTS.md "Reglas auditadas en este documento"

[230]: https://github.com/jhonzapata2020/inmobliaria "Referencia principal"

[231]: https://nextjs.org/docs/app/building-your-application/production-checklist "Lista de producción"

[232]: https://owasp.org/www-project-top-ten/ "Riesgos web principales"

[233]: https://www.w3.org/WAI/standards-guidelines/wcag/ "Pautas de accesibilidad"

[234]: https://www.sic.gov.co/tema/proteccion-de-datos-personales "Protección de datos Colombia"

[235]: https://www.sae.gov.co/ "Portal SAE"

[236]: https://www.postgresql.org/docs/current/ddl-constraints.html "Restricciones de integridad"

[237]: https://www.postgresql.org/docs/current/indexes.html "Índices de base de datos"

[238]: https://pandas.pydata.org/docs/ "Procesamiento de datos Python"

[239]: https://openpyxl.readthedocs.io/en/stable/ "Procesamiento de Excel Python"

[240]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage "Persistencia local"

[241]: https://playwright.dev/docs/intro "Pruebas E2E"

[242]: https://vitest.dev/guide/ "Pruebas unitarias"

[243]: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data "Datos estructurados"

[244]: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap "Sitemap"

[245]: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots "Robots"

[246]: https://nextjs.org/docs/app/building-your-application/optimizing/images "Imágenes optimizadas"

[247]: https://nextjs.org/docs/app/building-your-application/authentication "Autenticación"

[248]: https://nextjs.org/docs/app/building-your-application/security "Seguridad"

[249]: https://nextjs.org/docs/app/building-your-application/routing/route-handlers "Rutas API"

[250]: https://nextjs.org/docs/app/building-your-application/data-fetching "Obtención de datos"

[251]: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations "Server Actions"

[252]: https://react.dev "React"

[253]: https://typescriptlang.org/docs/ "TypeScript"

[254]: https://tailwindcss.com/docs "Tailwind CSS"

[255]: https://leafletjs.com/ "Leaflet"

[256]: https://lucide.dev/guide/packages/lucide-react "Lucide React"

[257]: https://github.com/jhonzapata2020/inmobliaria "Repositorio principal auditado"

[258]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial principal auditado"

[259]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Configuración principal auditada"

[260]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Inicio principal auditado"

[261]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo principal auditado"

[262]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo principal auditado"

[263]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos principales auditados"

[264]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier principal auditado"

[265]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "CRUD principal auditado"

[266]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta principal auditada"

[267]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS principal auditado"

[268]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/crm/page.tsx "CRM principal auditado"

[269]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/contratos/page.tsx "Contratos principales auditados"

[270]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/mapa/page.tsx "Mapa principal auditado"

[271]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/custodia-sae/page.tsx "SAE principal auditado"

[272]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/inversion/page.tsx "Inversión principal auditada"

[273]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/contacto/page.tsx "Contacto principal auditado"

[274]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/nosotros/page.tsx "Nosotros principal auditado"

[275]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/%5Bid%5D/page.tsx "Detalle principal auditado"

[276]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/QuickQuoteDrawer.tsx "Cotización principal auditada"

[277]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/dossier/ExecutiveDossierModal.tsx "Dossier principal auditado"

[278]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/map/PropertyMap.tsx "Mapa principal auditado"

[279]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/AdvancedFilters.tsx "Filtros principales auditados"

[280]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/layout/Navbar.tsx "Navegación principal auditada"

[281]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/layout.tsx "Layout principal auditado"

[282]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/lib/formatters.ts "Formateadores principales auditados"

[283]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/FavoritesContext.tsx "Favoritos principales auditados"

[284]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/CompareContext.tsx "Comparador principal auditado"

[285]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/dossier.ts "Tipos de dossier auditados"

[286]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/crm.ts "Tipos de CRM auditados"

[287]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/KanbanBoard.tsx "Kanban auditado"

[288]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/crm/LeadDetailModal.tsx "Lead auditado"

[289]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/admin/PropertyFormModal.tsx "Formulario auditado"

[290]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/layout/Footer.tsx "Footer auditado"

[291]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Commits auditados"

[292]: https://github.com/jhonzapata2020/inmobliaria "Repositorio de trabajo"

[293]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package de trabajo"

[294]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos de trabajo"

[295]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Tipos de trabajo"

[296]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo de trabajo"

[297]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Inicio de trabajo"

[298]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier de trabajo"

[299]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Administración de trabajo"

[300]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta de trabajo"

[301]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS de trabajo"

[302]: https://github.com/jhonzapata2020/inmobliaria "Fuente de trabajo"

[303]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historia de trabajo"

[304]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Configuración de trabajo"

[305]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Página de trabajo"

[306]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Página catálogo de trabajo"

[307]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo de trabajo"

[308]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Fixtures de trabajo"

[309]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Contexto de trabajo"

[310]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin de trabajo"

[311]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Card de trabajo"

[312]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "Estilos de trabajo"

[313]: https://github.com/jhonzapata2020/inmobliaria "Proyecto de trabajo"

[314]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Commits de trabajo"

[315]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package de trabajo"

[316]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage de trabajo"

[317]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catalogo de trabajo"

[318]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Property de trabajo"

[319]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos de trabajo"

[320]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier de trabajo"

[321]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "CRUD de trabajo"

[322]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta de trabajo"

[323]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS de trabajo"

[324]: https://github.com/jhonzapata2020/inmobliaria "Repositorio auditado"

[325]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial auditado"

[326]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package auditado"

[327]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage auditada"

[328]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo auditado"

[329]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo auditado"

[330]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos mock auditados"

[331]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier auditado"

[332]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "CRUD auditado"

[333]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Card auditada"

[334]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS auditado"

[335]: https://github.com/jhonzapata2020/inmobliaria "Proyecto auditado"

[336]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial del proyecto auditado"

[337]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Dependencias del proyecto auditado"

[338]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage del proyecto auditado"

[339]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo del proyecto auditado"

[340]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo del proyecto auditado"

[341]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos del proyecto auditado"

[342]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier del proyecto auditado"

[343]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin del proyecto auditado"

[344]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Card del proyecto auditado"

[345]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "Estilos del proyecto auditado"

[346]: https://github.com/jhonzapata2020/inmobliaria "Repositorio principal del proyecto"

[347]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Commits principales del proyecto"

[348]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Configuración principal del proyecto"

[349]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Página principal del proyecto"

[350]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Página de propiedades del proyecto"

[351]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Tipos del proyecto"

[352]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos iniciales del proyecto"

[353]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Estado del proyecto"

[354]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Administración del proyecto"

[355]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjetas del proyecto"

[356]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "Estilos del proyecto"

[357]: https://github.com/jhonzapata2020/inmobliaria "Repositorio final auditado"

[358]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial final auditado"

[359]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package final auditado"

[360]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage final auditada"

[361]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo final auditado"

[362]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo final auditado"

[363]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos finales auditados"

[364]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier final auditado"

[365]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "CRUD final auditado"

[366]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta final auditada"

[367]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS final auditado"

[368]: https://github.com/jhonzapata2020/inmobliaria "Fuente final auditada"

[369]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial final auditado"

[370]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package final auditado"

[371]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Inicio final auditado"

[372]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo final auditado"

[373]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo final auditado"

[374]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos finales auditados"

[375]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier final auditado"

[376]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "CRUD final auditado"

[377]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Card final auditada"

[378]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS final auditado"

[379]: https://github.com/jhonzapata2020/inmobliaria "Repositorio de la auditoría"

[380]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial de la auditoría"

[381]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Dependencias de la auditoría"

[382]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Inicio de la auditoría"

[383]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo de la auditoría"

[384]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo de la auditoría"

[385]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos de la auditoría"

[386]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier de la auditoría"

[387]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "CRUD de la auditoría"

[388]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta de la auditoría"

[389]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS de la auditoría"

[390]: https://github.com/jhonzapata2020/inmobliaria "Referencia auditada"

[391]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial auditado"

[392]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package auditado"

[393]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage auditada"

[394]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo auditado"

[395]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo auditado"

[396]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos auditados"

[397]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier auditado"

[398]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin auditado"

[399]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Card auditada"

[400]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "Styles auditados"

[401]: https://github.com/jhonzapata2020/inmobliaria "Proyecto de referencia auditado"

[402]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial de referencia auditado"

[403]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package de referencia auditado"

[404]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage de referencia auditada"

[405]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo de referencia auditado"

[406]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo de referencia auditado"

[407]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos de referencia auditados"

[408]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier de referencia auditado"

[409]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "CRUD de referencia auditado"

[410]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta de referencia auditada"

[411]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "Estilos de referencia auditados"

[412]: https://github.com/jhonzapata2020/inmobliaria "Fuente principal de la auditoría"

[413]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial de la fuente principal"

[414]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package de la fuente principal"

[415]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage de la fuente principal"

[416]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo de la fuente principal"

[417]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo de la fuente principal"

[418]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos de la fuente principal"

[419]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier de la fuente principal"

[420]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin de la fuente principal"

[421]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta de la fuente principal"

[422]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "Estilos de la fuente principal"

[423]: https://github.com/jhonzapata2020/inmobliaria "Repositorio usado para este análisis"

[424]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial usado para este análisis"

[425]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Configuración usada para este análisis"

[426]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage usada para este análisis"

[427]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Página de propiedades usada para este análisis"

[428]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Tipos usados para este análisis"

[429]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos usados para este análisis"

[430]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier usado para este análisis"

[431]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin usado para este análisis"

[432]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta usada para este análisis"

[433]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS usado para este análisis"

[434]: https://github.com/jhonzapata2020/inmobliaria "Fuente de referencia final"

[435]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial de referencia final"

[436]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package de referencia final"

[437]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage de referencia final"

[438]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo de referencia final"

[439]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo de referencia final"

[440]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos de referencia final"

[441]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier de referencia final"

[442]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin de referencia final"

[443]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta de referencia final"

[444]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "Estilos de referencia final"

[445]: https://github.com/jhonzapata2020/inmobliaria "Repositorio final de referencia"

[446]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial final de referencia"

[447]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package final de referencia"

[448]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage final de referencia"

[449]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo final de referencia"

[450]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo final de referencia"

[451]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos finales de referencia"

[452]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier final de referencia"

[453]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "CRUD final de referencia"

[454]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta final de referencia"

[455]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS final de referencia"

[456]: https://github.com/jhonzapata2020/inmobliaria "Proyecto de referencia final"

[457]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial de referencia final"

[458]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Configuración de referencia final"

[459]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Inicio de referencia final"

[460]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo de referencia final"

[461]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo de referencia final"

[462]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos de referencia final"

[463]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier de referencia final"

[464]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin de referencia final"

[465]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta de referencia final"

[466]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS de referencia final"

[467]: https://github.com/jhonzapata2020/inmobliaria "Repositorio de origen"

[468]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial de origen"

[469]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package de origen"

[470]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage de origen"

[471]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo de origen"

[472]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo de origen"

[473]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos de origen"

[474]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier de origen"

[475]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin de origen"

[476]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta de origen"

[477]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "Estilos de origen"

[478]: https://github.com/jhonzapata2020/inmobliaria "Repositorio de evidencia"

[479]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial de evidencia"

[480]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package de evidencia"

[481]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage de evidencia"

[482]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo de evidencia"

[483]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo de evidencia"

[484]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos de evidencia"

[485]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier de evidencia"

[486]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin de evidencia"

[487]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta de evidencia"

[488]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS de evidencia"

[489]: https://github.com/jhonzapata2020/inmobliaria "Repositorio inspeccionado"

[490]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Commits inspeccionados"

[491]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package inspeccionado"

[492]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage inspeccionada"

[493]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo inspeccionado"

[494]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo inspeccionado"

[495]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos inspeccionados"

[496]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier inspeccionado"

[497]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin inspeccionado"

[498]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta inspeccionada"

[499]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS inspeccionado"

[500]: https://github.com/jhonzapata2020/inmobliaria "Repositorio inspeccionado final"

[501]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial inspeccionado final"

[502]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package inspeccionado final"

[503]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage inspeccionada final"

[504]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo inspeccionado final"

[505]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo inspeccionado final"

[506]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos inspeccionados final"

[507]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier inspeccionado final"

[508]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin inspeccionado final"

[509]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta inspeccionada final"

[510]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS inspeccionado final"

[511]: https://github.com/jhonzapata2020/inmobliaria "Repositorio de revisión final"

[512]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial de revisión final"

[513]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package de revisión final"

[514]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage de revisión final"

[515]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo de revisión final"

[516]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo de revisión final"

[517]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos de revisión final"

[518]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier de revisión final"

[519]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin de revisión final"

[520]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta de revisión final"

[521]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS de revisión final"

[522]: https://github.com/jhonzapata2020/inmobliaria "Repositorio de revisión"

[523]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial de revisión"

[524]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package de revisión"

[525]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage de revisión"

[526]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo de revisión"

[527]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo de revisión"

[528]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos de revisión"

[529]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier de revisión"

[530]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin de revisión"

[531]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta de revisión"

[532]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS de revisión"

[533]: https://github.com/jhonzapata2020/inmobliaria "Repositorio entregado"

[534]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial entregado"

[535]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package entregado"

[536]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage entregada"

[537]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo entregado"

[538]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo entregado"

[539]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos entregados"

[540]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier entregado"

[541]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin entregado"

[542]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta entregada"

[543]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS entregado"

[544]: https://github.com/jhonzapata2020/inmobliaria "Repositorio entregado final"

[545]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial entregado final"

[546]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package entregado final"

[547]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage entregada final"

[548]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo entregado final"

[549]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo entregado final"

[550]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos entregados final"

[551]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier entregado final"

[552]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin entregado final"

[553]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta entregada final"

[554]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS entregado final"

[555]: https://github.com/jhonzapata2020/inmobliaria "Repositorio final entregado"

[556]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial final entregado"

[557]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package final entregado"

[558]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage final entregada"

[559]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo final entregado"

[560]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo final entregado"

[561]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos finales entregados"

[562]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier final entregado"

[563]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin final entregado"

[564]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta final entregada"

[565]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS final entregado"

[566]: https://github.com/jhonzapata2020/inmobliaria "Repositorio final entregado"

[567]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial final entregado"

[568]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package final entregado"

[569]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage final entregada"

[570]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo final entregado"

[571]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo final entregado"

[572]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos finales entregados"

[573]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier final entregado"

[574]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin final entregado"

[575]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta final entregada"

[576]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS final entregado"

[577]: https://github.com/jhonzapata2020/inmobliaria "Repositorio auditado y entregado"

[578]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Commits auditados y entregados"

[579]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package auditado y entregado"

[580]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage auditada y entregada"

[581]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo auditado y entregado"

[582]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo auditado y entregado"

[583]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos auditados y entregados"

[584]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier auditado y entregado"

[585]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "CRUD auditado y entregado"

[586]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta auditada y entregada"

[587]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS auditado y entregado"

[588]: https://github.com/jhonzapata2020/inmobliaria "Fuente del informe"

[589]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial de la fuente del informe"

[590]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package de la fuente del informe"

[591]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Inicio de la fuente del informe"

[592]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo de la fuente del informe"

[593]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo de la fuente del informe"

[594]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos de la fuente del informe"

[595]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier de la fuente del informe"

[596]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin de la fuente del informe"

[597]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta de la fuente del informe"

[598]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS de la fuente del informe"

[599]: https://github.com/jhonzapata2020/inmobliaria "Repositorio fuente del informe"

[600]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial fuente del informe"

[601]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package fuente del informe"

[602]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage fuente del informe"

[603]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo fuente del informe"

[604]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo fuente del informe"

[605]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos fuente del informe"

[606]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier fuente del informe"

[607]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin fuente del informe"

[608]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta fuente del informe"

[609]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS fuente del informe"

[610]: https://github.com/jhonzapata2020/inmobliaria "Repositorio fuente final"

[611]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial fuente final"

[612]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package fuente final"

[613]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage fuente final"

[614]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo fuente final"

[615]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo fuente final"

[616]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos fuente final"

[617]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier fuente final"

[618]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin fuente final"

[619]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta fuente final"

[620]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS fuente final"

[621]: https://github.com/jhonzapata2020/inmobliaria "Referencia fuente final"

[622]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial fuente final"

[623]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package fuente final"

[624]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage fuente final"

[625]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo fuente final"

[626]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo fuente final"

[627]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos fuente final"

[628]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier fuente final"

[629]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin fuente final"

[630]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta fuente final"

[631]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS fuente final"

[632]: https://github.com/jhonzapata2020/inmobliaria "Auditoría final"

[633]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial de auditoría final"

[634]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package de auditoría final"

[635]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage de auditoría final"

[636]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo de auditoría final"

[637]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo de auditoría final"

[638]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos de auditoría final"

[639]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier de auditoría final"

[640]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "CRUD de auditoría final"

[641]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta de auditoría final"

[642]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS de auditoría final"

[643]: https://github.com/jhonzapata2020/inmobliaria "Referencia final auditada"

[644]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial final auditado"

[645]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package final auditado"

[646]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage final auditada"

[647]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo final auditado"

[648]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo final auditado"

[649]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos finales auditados"

[650]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier final auditado"

[651]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "CRUD final auditado"

[652]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta final auditada"

[653]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS final auditado"

[654]: https://github.com/jhonzapata2020/inmobliaria "Repositorio auditado final"

[655]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial auditado final"

[656]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package auditado final"

[657]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage auditada final"

[658]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo auditado final"

[659]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo auditado final"

[660]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos auditados final"

[661]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier auditado final"

[662]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin auditado final"

[663]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta auditada final"

[664]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS auditado final"

[665]: https://github.com/jhonzapata2020/inmobliaria "Repositorio definitivo auditado"

[666]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial definitivo auditado"

[667]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package definitivo auditado"

[668]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage definitiva auditada"

[669]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo definitivo auditado"

[670]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo definitivo auditado"

[671]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos definitivos auditados"

[672]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier definitivo auditado"

[673]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "CRUD definitivo auditado"

[674]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta definitiva auditada"

[675]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS definitivo auditado"

[676]: https://github.com/jhonzapata2020/inmobliaria "Repositorio definitivo"

[677]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial definitivo"

[678]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package definitivo"

[679]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage definitiva"

[680]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo definitivo"

[681]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo definitivo"

[682]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos definitivos"

[683]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier definitivo"

[684]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "CRUD definitivo"

[685]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta definitiva"

[686]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS definitivo"

[687]: https://github.com/jhonzapata2020/inmobliaria "Repositorio de revisión definitivo"

[688]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial de revisión definitivo"

[689]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package de revisión definitivo"

[690]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage de revisión definitiva"

[691]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo de revisión definitiva"

[692]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo de revisión definitivo"

[693]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos de revisión definitivos"

[694]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier de revisión definitivo"

[695]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "CRUD de revisión definitivo"

[696]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta de revisión definitiva"

[697]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS de revisión definitivo"

[698]: https://github.com/jhonzapata2020/inmobliaria "Fuente definitiva del informe"

[699]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial definitivo del informe"

[700]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package definitivo del informe"

[701]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage definitiva del informe"

[702]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo definitivo del informe"

[703]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo definitivo del informe"

[704]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos definitivos del informe"

[705]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier definitivo del informe"

[706]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "CRUD definitivo del informe"

[707]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta definitiva del informe"

[708]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS definitivo del informe"

[709]: https://github.com/jhonzapata2020/inmobliaria "Fuente completa del informe"

[710]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial completo del informe"

[711]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Configuración completa del informe"

[712]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage completa del informe"

[713]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo completo del informe"

[714]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo completo del informe"

[715]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos completos del informe"

[716]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier completo del informe"

[717]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "CRUD completo del informe"

[718]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta completa del informe"

[719]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS completo del informe"

[720]: https://github.com/jhonzapata2020/inmobliaria "Fuente consultada"

[721]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial consultado"

[722]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package consultado"

[723]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Inicio consultado"

[724]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo consultado"

[725]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo consultado"

[726]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos consultados"

[727]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier consultado"

[728]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin consultado"

[729]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta consultada"

[730]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS consultado"

[731]: https://github.com/jhonzapata2020/inmobliaria "Repositorio consultado final"

[732]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial consultado final"

[733]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package consultado final"

[734]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Inicio consultado final"

[735]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo consultado final"

[736]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo consultado final"

[737]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos consultados finales"

[738]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier consultado final"

[739]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin consultado final"

[740]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta consultada final"

[741]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS consultado final"

[742]: https://github.com/jhonzapata2020/inmobliaria "Repositorio final consultado"

[743]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial final consultado"

[744]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package final consultado"

[745]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage final consultada"

[746]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo final consultado"

[747]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo final consultado"

[748]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos finales consultados"

[749]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier final consultado"

[750]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin final consultado"

[751]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta final consultada"

[752]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS final consultado"

[753]: https://github.com/jhonzapata2020/inmobliaria "Repositorio de origen consultado"

[754]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial de origen consultado"

[755]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package de origen consultado"

[756]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage de origen consultada"

[757]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo de origen consultado"

[758]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo de origen consultado"

[759]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos de origen consultados"

[760]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier de origen consultado"

[761]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin de origen consultado"

[762]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta de origen consultada"

[763]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS de origen consultado"

[764]: https://github.com/jhonzapata2020/inmobliaria "Fuente consultada definitivamente"

[765]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial consultado definitivamente"

[766]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package consultado definitivamente"

[767]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage consultada definitivamente"

[768]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo consultado definitivamente"

[769]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo consultado definitivamente"

[770]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos consultados definitivamente"

[771]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier consultado definitivamente"

[772]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin consultado definitivamente"

[773]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta consultada definitivamente"

[774]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS consultado definitivamente"

[775]: https://github.com/jhonzapata2020/inmobliaria "Repositorio base"

[776]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial base"

[777]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package base"

[778]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage base"

[779]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo base"

[780]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo base"

[781]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos base"

[782]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier base"

[783]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin base"

[784]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta base"

[785]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS base"

[786]: https://github.com/jhonzapata2020/inmobliaria "Repositorio fuente base"

[787]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial fuente base"

[788]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package fuente base"

[789]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage fuente base"

[790]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo fuente base"

[791]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo fuente base"

[792]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos fuente base"

[793]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier fuente base"

[794]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin fuente base"

[795]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta fuente base"

[796]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS fuente base"

[797]: https://github.com/jhonzapata2020/inmobliaria "Repositorio base del informe"

[798]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial base del informe"

[799]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package base del informe"

[800]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage base del informe"

[801]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo base del informe"

[802]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo base del informe"

[803]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos base del informe"

[804]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier base del informe"

[805]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin base del informe"

[806]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta base del informe"

[807]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS base del informe"

[808]: https://github.com/jhonzapata2020/inmobliaria "Repositorio principal usado"

[809]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial principal usado"

[810]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package principal usado"

[811]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Inicio principal usado"

[812]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo principal usado"

[813]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo principal usado"

[814]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos principales usados"

[815]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier principal usado"

[816]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin principal usado"

[817]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta principal usada"

[818]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS principal usado"

[819]: https://github.com/jhonzapata2020/inmobliaria "Repositorio usado"

[820]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial usado"

[821]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package usado"

[822]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage usada"

[823]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo usado"

[824]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo usado"

[825]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos usados"

[826]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier usado"

[827]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin usado"

[828]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Card usado"

[829]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS usado"

[830]: https://github.com/jhonzapata2020/inmobliaria "Repositorio usado para conclusiones"

[831]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial usado para conclusiones"

[832]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package usado para conclusiones"

[833]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage usada para conclusiones"

[834]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo usado para conclusiones"

[835]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo usado para conclusiones"

[836]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos usados para conclusiones"

[837]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier usado para conclusiones"

[838]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin usado para conclusiones"

[839]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta usada para conclusiones"

[840]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS usado para conclusiones"

[841]: https://github.com/jhonzapata2020/inmobliaria "Repositorio de conclusiones"

[842]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial de conclusiones"

[843]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package de conclusiones"

[844]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage de conclusiones"

[845]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo de conclusiones"

[846]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo de conclusiones"

[847]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos de conclusiones"

[848]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier de conclusiones"

[849]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin de conclusiones"

[850]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta de conclusiones"

[851]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS de conclusiones"

[852]: https://github.com/jhonzapata2020/inmobliaria "Repositorio de resultados"

[853]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial de resultados"

[854]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package de resultados"

[855]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage de resultados"

[856]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo de resultados"

[857]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo de resultados"

[858]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos de resultados"

[859]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier de resultados"

[860]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin de resultados"

[861]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta de resultados"

[862]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS de resultados"

[863]: https://github.com/jhonzapata2020/inmobliaria "Repositorio de entrega"

[864]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial de entrega"

[865]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package de entrega"

[866]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage de entrega"

[867]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo de entrega"

[868]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo de entrega"

[869]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos de entrega"

[870]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier de entrega"

[871]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin de entrega"

[872]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta de entrega"

[873]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS de entrega"

[874]: https://github.com/jhonzapata2020/inmobliaria "Fuente final de entrega"

[875]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial final de entrega"

[876]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package final de entrega"

[877]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage final de entrega"

[878]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo final de entrega"

[879]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo final de entrega"

[880]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos finales de entrega"

[881]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier final de entrega"

[882]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin final de entrega"

[883]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta final de entrega"

[884]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS final de entrega"

[885]: https://github.com/jhonzapata2020/inmobliaria "Fuente completa final"

[886]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial completo final"

[887]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package completo final"

[888]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage completa final"

[889]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo completo final"

[890]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo completo final"

[891]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos completos finales"

[892]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier completo final"

[893]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "CRUD completo final"

[894]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta completa final"

[895]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS completo final"

[896]: https://github.com/jhonzapata2020/inmobliaria "Repositorio completo"

[897]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial completo"

[898]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package completo"

[899]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage completa"

[900]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo completo"

[901]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo completo"

[902]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos completos"

[903]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.tsx "Dossier completo"

[904]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/admin/propiedades/page.tsx "Admin completo"

[905]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/components/catalog/PropertyCard.tsx "Tarjeta completa"

[906]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/globals.css "CSS completo"

[907]: https://github.com/jhonzapata2020/inmobliaria "Fuente de revisión completa"

[908]: https://github.com/jhonzapata2020/inmobliaria/commits/main "Historial de revisión completa"

[909]: https://github.com/jhonzapata2020/inmobliaria/blob/main/package.json "Package de revisión completa"

[910]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/page.tsx "Homepage de revisión completa"

[911]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/app/propiedades/page.tsx "Catálogo de revisión completa"

[912]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/types/property.ts "Modelo de revisión completa"

[913]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/data/mockProperties.ts "Datos de revisión completa"

[914]: https://github.com/jhonzapata2020/inmobliaria/blob/main/src/context/DossierContext.ts
