# Chilangos RC

> Juntos vamos. Juntos regresamos.

Casa digital de **Chilangos Riding Club**, fundado en Ciudad de México el 10 de
diciembre de 2022. El proyecto reúne la historia del club, sus integrantes,
rodadas, fotografías, formularios internos, seguridad en ruta y futuras
colaboraciones.

## El club en números

| Indicador | Registro actual |
| --- | ---: |
| Integrantes oficiales | 15 |
| Fundadores | 7 |
| Miembros | 8 |
| Rodadas documentadas | 31 |
| Kilómetros registrados | 9,790 km |
| Kilómetros documentados durante 2025 | 1,550 km |
| Kilómetros documentados durante 2026 | 880 km |
| Destinos disponibles | 53 |
| Pueblos Mágicos en el explorador | 177 |

Los kilómetros corresponden a rodadas confirmadas y consideran ida y vuelta.
Los méritos personales de kilometraje se registran por separado y dependen del
odómetro de cada integrante.

## Dominios y accesos

| Uso | URL | Acceso |
| --- | --- | --- |
| Sitio oficial en preparación | https://chilangosrc.com | Administración autorizada |
| Dominio alternativo | https://www.chilangosrc.com | Administración autorizada |
| Landing de registro | https://registro.chilangosrc.com | Público, sin inicio de sesión |
| Cuestionario para integrantes | https://registro.chilangosrc.com/cuestionario-integrantes | Público, sin inicio de sesión |
| Ficha de seguridad en ruta | https://registro.chilangosrc.com/seguridad-en-ruta | Captura para integrantes |
| Historias recibidas | https://registro.chilangosrc.com/administracion/cuestionarios | Administración autorizada |
| Fichas de seguridad recibidas | https://registro.chilangosrc.com/administracion/seguridad | Administración autorizada |
| Pruebas funcionales QA | https://registro.chilangosrc.com/administracion/pruebas | Administración autorizada |
| Cuestionario narrativo complementario | https://registro.chilangosrc.com/cuestionario | Administración autorizada |

El proyecto admite visitas públicas para que el registro funcione sin cuenta.
La página oficial, las biografías individuales, las fotografías privadas y los
paneles administrativos aplican controles adicionales dentro de la aplicación.

Que los paneles administrativos soliciten autenticación es correcto. El
cuestionario público de integrantes no debe pedir inicio de sesión.

## Qué incluye el sitio oficial

- Historia del club, filosofía riding club y fotografía original de los
  primeros fundadores.
- Directorio de **siete fundadores y ocho miembros**, ordenados alfabéticamente,
  con biografías individuales y participación de bikers y partners.
- Perfiles preparados para retratos, pasiones, hobbies, rutas favoritas,
  motocicletas actuales y anteriores, y Chilangos Awards.
- Bitácora filtrable de **31 rodadas**, contador de **9,790 kilómetros** y
  comparativo por temporada.
- Explorador de **53 destinos**, mapa de México y pasaporte de **177 Pueblos
  Mágicos**.
- Álbumes anuales, aniversarios y espacios para fotografías autorizadas.
- Méritos personales a los 5,000, 10,000, 25,000, 50,000 y 100,000 kilómetros.
- Jueves biker orientados a convivencia, camaradería y organización de rodadas.
- Guía de mantenimiento, seguridad, recomendaciones Harley y talleres de
  confianza.
- Calendario de cumpleaños sin divulgar años de nacimiento.
- Formulario para negocios interesados en colaboraciones.
- Catálogo de mercancía preparado para incorporar enlaces reales de Mercado
  Pago.
- Sitio adaptable a teléfonos y computadoras.

## Formulario de historias de integrantes

La dirección que debe compartirse con los integrantes es:

https://registro.chilangosrc.com/cuestionario-integrantes

El formulario acepta integrantes biker, partner o ambas modalidades. Permite
capturar:

- Alias, historia personal, llegada al club y padrino o madrina, cuando aplique.
- Motocicleta actual y hasta **diez motocicletas anteriores**.
- Fotografías personales, de la motocicleta actual y de motos anteriores.
- Motocicleta soñada, rutas, hobbies, películas, series y referencias biker.
- Categorías, historias y años de Chilangos Awards.
- Autorización de publicación elegida expresamente por cada integrante.

Las respuestas se guardan en la base de datos del sitio y las fotografías en
almacenamiento privado. El envío no publica automáticamente una biografía ni
manda un correo. Las respuestas se revisan desde:

https://registro.chilangosrc.com/administracion/cuestionarios

## Cuestionario narrativo complementario

La ruta `/cuestionario` es una herramienta diferente del formulario principal:

- Incluye **10 capítulos y 56 preguntas** sobre identidad, motos, rutas,
  hermandad, seguridad, sueños y filosofía.
- Conserva su borrador únicamente en el navegador del integrante.
- Permite copiar la historia completa, descargarla en Markdown o preparar una
  versión autorizada para publicación.
- No guarda sus borradores en la base de datos del formulario principal.

Para recibir respuestas persistentes y fotografías debe utilizarse
`/cuestionario-integrantes`.

## Seguridad en ruta

El formulario `/seguridad-en-ruta` permite recopilar información necesaria para
organizar rodadas y responder ante una emergencia.

- La captura incluye datos de contacto, emergencia, motocicleta y seguro.
- Un integrante sin seguro vigente se identifica como no elegible para rodar.
- Las respuestas completas solo se consultan desde el panel administrativo.
- Ningún dato de emergencia, póliza, placa o expediente médico debe publicarse
  en una biografía.

Panel administrativo:

https://registro.chilangosrc.com/administracion/seguridad

## Colaboraciones y mercancía

Las propuestas de talleres, restaurantes, bares biker, hoteles y marcas se
guardan en la base de datos mediante `/api/colaboraciones`. Actualmente no hay
un panel específico para consultarlas ni notificaciones automáticas.

Para habilitar compras reales:

1. Crear un enlace de pago por producto desde Mercado Pago.
2. Guardar la URL correspondiente en `paymentUrl`, dentro de `products` en
   `app/data/chilangos.ts`.
3. Publicar el cambio y comprobar el flujo.

Mientras `paymentUrl` esté vacío, el producto dirige a redes sociales para
consultar disponibilidad. No se muestran precios o convenios inventados.

## Pruebas funcionales con datos ficticios

El panel privado de QA permite validar los formularios contra el sitio
publicado:

https://registro.chilangosrc.com/administracion/pruebas

1. Presionar **Ejecutar prueba completa**.
2. Revisar el resultado de las **19 validaciones funcionales**.
3. Comprobar los registros creados en los paneles de historias y seguridad.
4. Presionar **Eliminar datos de esta prueba** cuando termine la revisión.

La suite crea y valida:

- Una biografía biker con diez motocicletas, fotografías y dos premios.
- Una biografía partner sin motocicleta propia.
- Dos fichas de seguridad, incluyendo un caso sin seguro vigente.
- Una propuesta ficticia de colaboración.
- Validaciones de campos obligatorios, imágenes, paneles y borradores locales.

Todos los datos dummy utilizan el prefijo `QA_CHILANGOS_`. La limpieza elimina
solamente los registros e imágenes correspondientes a esa ejecución.

Código independiente:

- Archivo: `public/pruebas-cuestionarios.js`.
- Ejecución: `runQuestionnaireQa`.
- Limpieza: `cleanupQuestionnaireQa`.
- Descarga: https://registro.chilangosrc.com/pruebas-cuestionarios.js

Las pruebas automáticas locales están en `tests/rendered-html.test.mjs` y se
ejecutan mediante `npm test`. Actualmente contemplan **28 pruebas** y utilizan
una base temporal, sin modificar información real.

## Base de datos y almacenamiento

| Información | Recurso |
| --- | --- |
| Biografías y respuestas | `questionnaire_submissions` |
| Fichas de seguridad | `ride_safety_submissions` |
| Propuestas de colaboración | `collaboration_requests` |
| Base de datos | Cloudflare D1, binding lógico `DB` |
| Fotografías privadas | Cloudflare R2, binding lógico `BUCKET` |

Los respaldos del código no contienen automáticamente las respuestas recibidas
ni las fotografías enviadas. Un mecanismo independiente de exportación y
respaldo de esos datos todavía está pendiente.

La configuración de recursos se conserva en `.openai/hosting.json`. No deben
agregarse contraseñas, tokens, credenciales ni valores secretos al repositorio.

## Archivos principales

| Archivo o carpeta | Función |
| --- | --- |
| `app/page.tsx` | Selecciona la landing pública o el sitio oficial según el dominio. |
| `app/site-access.ts` | Identifica el subdominio de registro. |
| `app/components/club-home.tsx` | Contenido completo de la página oficial. |
| `app/data/chilangos.ts` | Identidad, integrantes, rodadas, destinos y mercancía. |
| `app/data/biker-profiles.ts` | Biografías, motocicletas, partners y premios. |
| `app/data/club-life.ts` | Álbumes, fotografía fundacional, aniversarios y aliados. |
| `app/data/club-culture.ts` | Filosofía, ingreso y jueves biker. |
| `app/data/club-awards.ts` | Categorías de Chilangos Awards. |
| `app/data/club-birthdays.ts` | Calendario de cumpleaños. |
| `app/data/club-notices.ts` | Comunicados oficiales confirmados. |
| `app/data/pueblos-magicos.ts` | Pueblos, ubicaciones y visitas documentadas. |
| `app/data/questionnaire.ts` | Cuestionario narrativo de 56 preguntas. |
| `app/cuestionario-integrantes/` | Formulario principal para integrantes. |
| `app/administracion/` | Paneles privados y validación de accesos. |
| `app/api/` | Recepción de formularios, fotografías y tareas administrativas. |
| `db/schema.ts` | Estructura de las tablas del proyecto. |
| `drizzle/` | Migraciones de base de datos. |
| `public/` | Logotipos, fotografías, fuentes y código QA independiente. |
| `tests/rendered-html.test.mjs` | Suite automatizada de pruebas locales. |

## Actualizar contenidos

- Integrantes: modificar `founders` y `crew` en `app/data/chilangos.ts`, y
  actualizar los perfiles de `app/data/biker-profiles.ts`.
- Biografías: incorporar solo información expresamente autorizada.
- Rodadas: agregar registros a `rides`; el contador de kilómetros se actualiza
  automáticamente.
- Próxima rodada: completar `nextRide` únicamente cuando existan datos
  confirmados.
- Destinos: actualizar `destinations`.
- Méritos: revisar `individualPatchMilestones`; los kilómetros personales no
  sustituyen el registro de rodadas oficiales.
- Jueves biker: editar `app/data/club-culture.ts`.
- Álbumes, aniversarios y fotografía fundacional: editar
  `app/data/club-life.ts` y organizar imágenes dentro de `public/`.
- Cumpleaños: actualizar `app/data/club-birthdays.ts`.
- Premios: actualizar `app/data/club-awards.ts` y los perfiles autorizados.
- Comunicados: registrar únicamente información confirmada en
  `app/data/club-notices.ts`.

No publicar teléfonos personales, domicilios particulares, placas, pólizas,
expedientes médicos, contactos de emergencia ni ubicaciones sensibles.

## Dominio y DNS

El dominio se administra desde Namecheap mediante los siguientes registros:

| Tipo | Host | Destino |
| --- | --- | --- |
| A | `@` | `162.159.143.30` |
| A | `@` | `172.66.3.26` |
| CNAME | `www` | `custom-domains.chatgpt.site.` |
| CNAME | `registro` | `custom-domains.chatgpt.site.` |

Los registros TXT existentes verifican el dominio y sus subdominios. Deben
conservarse, pero sus valores no se documentan en el repositorio.

No deben mantenerse redirecciones antiguas que entren en conflicto con el DNS.
Los dominios activos cuentan con HTTPS sin contratar certificados adicionales.

## GitHub y publicación

Repositorio privado:

https://github.com/RonnieRagnar/ChilangosRC

El sitio publicado se construye desde el repositorio operativo administrado por
Sites. GitHub funciona como respaldo independiente y **no se sincroniza
automáticamente** con cada cambio publicado.

Después de cambios relevantes:

1. Obtener la versión completa actualizada del proyecto.
2. Subir a GitHub los archivos modificados, conservando `.openai`.
3. Confirmar que las carpetas `app`, `public`, `db`, `drizzle` y `tests` estén
   actualizadas cuando corresponda.
4. Comprobar que el repositorio permanezca privado.

Subir archivos a GitHub no publica por sí solo una nueva versión del sitio, y
publicar cambios en Sites no actualiza automáticamente GitHub.

## Desarrollo local

Requiere Node.js **22.13 o superior**. En Windows, los scripts que utilizan Bash
pueden requerir Git Bash o WSL.

```bash
npm ci
npm run dev
npm run build
npm test
npm run lint
```

- `npm ci`: instala dependencias.
- `npm run dev`: inicia el entorno local.
- `npm run build`: genera una compilación de producción.
- `npm test`: compila y ejecuta las pruebas automatizadas.
- `npm run lint`: valida las reglas de calidad del código.

Algunas funciones locales necesitan bindings compatibles con D1 y R2. Para
comprobar el guardado real de formularios, utilizar el panel QA publicado.

## Pendientes identificados

- Sincronizar GitHub después de cada cambio relevante.
- Incorporar fotografías reales y biografías autorizadas de los integrantes.
- Crear un panel administrativo para solicitudes de colaboración.
- Agregar notificaciones cuando se reciba un formulario.
- Definir respaldos seguros de respuestas y fotografías privadas.
- Incorporar enlaces de pago reales para mercancía.
- Retirar la protección del sitio oficial únicamente cuando se autorice su
  lanzamiento, conservando privados los paneles y la información sensible.

## Redes sociales oficiales

- Instagram: https://www.instagram.com/chilangosrc/
- Facebook: https://www.facebook.com/chilangosrcmexico

---

**Chilangos RC · Ciudad de México · Juntos vamos, juntos regresamos.**
