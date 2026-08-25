# Chilangos RC

Sitio oficial del riding club Chilangos RC, fundado en Ciudad de México el 10
de diciembre de 2022.

## Qué incluye

- Historia e identidad del club.
- Directorio de siete fundadores, 14 integrantes oficiales y dos prospectos.
- Biografías individuales en `/integrantes/ronnie`, `/integrantes/adri` y las
  rutas equivalentes para cada integrante oficial.
- Retratos biker, pasiones, hobbies, edad opcional e historia autorizada.
- Garage personal con fotografías de motocicletas actuales y anteriores.
- Filosofía de convivencia, libertad, familia y seguridad de un riding club.
- Proceso de ingreso, padrino, votación y 5,000 kilómetros compartidos.
- Odómetro animado con kilometraje real, temporadas y siguiente meta.
- Reconocimientos individuales a los 5, 10, 25, 50 y 100 mil kilómetros.
- Encuentros de jueves biker, convivencia familiar y planeación de rodadas.
- Álbumes anuales del club entre 2022 y 2026.
- Álbumes independientes de los aniversarios 2023, 2024 y 2025.
- Espacios preparados para la fotografía original de fundadores, el parche y
  el chaleco oficial.
- Bitácora filtrable con 22 rodadas históricas.
- Rutas destacadas con acceso directo a Google Maps.
- Explorador con 50 destinos y filtro de pueblos mágicos.
- Pasaporte interactivo con los 177 Pueblos Mágicos de México, estados y visitas verificadas.
- Mapa geográfico con marcadores reales de rodadas y destinos pendientes agrupados por estado.
- Garage técnico con presión de llantas, servicios Harley, lavado, acabados y productos.
- Sección de colaboraciones para talleres, restaurantes y negocios aliados.
- Chilangos Awards.
- Cuestionario narrativo para conocer la historia biker de cada integrante.
- Catálogo de mercancía preparado para enlaces de Mercado Pago.
- Enlaces oficiales de Instagram y Facebook.
- Diseño adaptable a celulares y computadoras.

## Redes sociales oficiales

- Instagram: https://www.instagram.com/chilangosrc/
- Facebook: https://www.facebook.com/chilangosrcmexico

## Actualizar contenido

La información editable está en `app/data/chilangos.ts`:

- `founders`, `crew` y `prospects`: fundadores, integrantes y prospectos.
- `membershipKilometers`: kilómetros compartidos necesarios para el ingreso.
- `individualPatchMilestones`: reconocimientos por kilometraje individual.
- `rides`: rodadas, fechas, destinos y kilómetros.
- `destinations`: catálogo de destinos.
- `products`: artículos y enlaces de pago.
- `club`: dominio y cuentas oficiales.
- `app/data/club-life.ts`: álbumes, rutas destacadas, consejos y categorías
  de colaboración.
- `app/data/biker-profiles.ts`: biografías, padrinos, partners, motocicletas y
  fotografías autorizadas de cada integrante.
- `app/data/club-culture.ts`: convivencia, proceso de ingreso y jueves biker.
- `app/data/pueblos-magicos.ts`: padrón de 177 pueblos, coordenadas regionales y
  visitas identificadas únicamente desde las rodadas documentadas.
- `app/data/harley-guide.ts`: guía de mantenimiento, productos y fuentes
  oficiales de Harley-Davidson.

No publiques teléfonos, domicilios, placas, pólizas, expedientes médicos,
contactos de emergencia ni otros datos personales del archivo original.

## Fotografías, biografías y aliados

- Las fotografías se guardan por año en `public/albums/` y se registran en
  `app/data/club-life.ts`; consulta `public/albums/README.md` para ver el formato.
- Los retratos y las motocicletas se organizan dentro de `public/members/`;
  consulta `public/members/README.md`.
- Las fotografías de aniversarios se guardan dentro de `public/anniversaries/`;
  consulta `public/anniversaries/README.md`.
- La fotografía fundacional, el parche y el chaleco se colocan dentro de
  `public/heritage/`; consulta `public/heritage/README.md`.
- Las biografías de integrantes permanecen pendientes hasta recibir respuestas
  y autorización mediante `/cuestionario`.
- Los negocios aliados no aparecen como convenios activos hasta contar con un
  acuerdo real y verificable.
- Milwaukee Bar Tlaxcala se identifica como espacio con presencia de los
  colores del club, sin anunciar descuentos o patrocinios inexistentes.
- El kilometraje proviene de las rodadas históricas documentadas; no utiliza
  ubicación ni rastreo de los integrantes.
- Los 5,000 kilómetros para el ingreso se recorren con el grupo. Los distintivos
  por kilometraje personal incluyen también rodadas individuales.
- La ceremonia, los materiales internos y las ubicaciones exactas de reuniones
  permanecen privados; no se publican en el sitio.
- Un pueblo aparece como visitado solamente cuando está mencionado en `rides`;
  agregarlo al catálogo de destinos no constituye evidencia de visita.
- Los marcadores numerados del mapa agrupan pueblos pendientes por estado. Solo
  los pueblos visitados muestran una ubicación individual aproximada.
- La presión de llantas se compara contra valores ingresados por cada biker a
  partir de su manual; nunca se inventan cifras universales.
- El mapa utiliza Leaflet y mapas de OpenStreetMap, cargados únicamente en el
  navegador y con atribución visible.

## Cuestionario para integrantes

La versión interactiva vive en `/cuestionario` y el cuestionario completo se
documenta en `docs/cuestionario-integrantes.md`. Las preguntas y sus textos se
editan desde `app/data/questionnaire.ts`.

- Recorre 10 capítulos y 56 preguntas sobre identidad, orígenes, motocicletas,
  rutas, hermandad, seguridad, sueños y filosofía de vida.
- Solo solicita como obligatorios el nombre de ruta y la autorización de uso.
- Guarda el borrador únicamente en el navegador del integrante.
- Permite marcar individualmente las respuestas autorizadas para publicación.
- Puede copiar la historia completa, descargarla en Markdown o copiar solo el
  perfil público autorizado.
- No envía información a servidores ni utiliza una base de datos.
- En dispositivos compartidos debe eliminarse el borrador después de exportarlo.

### Activar Mercado Pago

1. Crea un link para cada producto desde Mercado Pago.
2. Pega la URL completa en `paymentUrl` dentro de `products`.
3. Guarda y publica el cambio.

Cuando `paymentUrl` está vacío, el botón dirige a Instagram para consultar la
disponibilidad. No se muestran precios inventados ni cobros ficticios.

## Publicar con GitHub y Cloudflare Pages

1. Sube este proyecto a un repositorio privado de GitHub.
2. En Cloudflare, abre **Workers & Pages → Create application → Pages → Connect
   to Git**.
3. Selecciona el repositorio del proyecto y configura:

   - Framework preset: `None`.
   - Build command: `npm run build:pages`.
   - Build output directory: `dist/client`.
   - Environment variable: `NODE_VERSION=22`.

4. Ejecuta el primer despliegue.
5. Agrega `chilangosrc.com` y `www.chilangosrc.com` en **Custom domains**.

El comando `build:pages` genera una versión HTML estática con los componentes
interactivos y todos los recursos necesarios; no requiere servidores de pago.

## Conectar el dominio registrado en Namecheap

Para usar el dominio principal `chilangosrc.com` con Cloudflare Pages:

1. En Cloudflare, agrega `chilangosrc.com` como sitio y elige el plan gratuito.
2. Copia los dos nameservers asignados por Cloudflare. Son distintos para cada
   cuenta, por lo que no deben inventarse.
3. En Namecheap, abre **Domain List → chilangosrc.com → Manage → Domain**.
4. En **Nameservers**, selecciona **Custom DNS**.
5. Pega los dos nameservers entregados por Cloudflare y guarda.
6. Elimina la redirección existente de `chilangosrc.com` hacia
   `http://www.chilangosrc.com/`; debe evitarse porque interfiere con el sitio.
7. Desactiva **Parking Page** si permanece habilitado.
8. Espera la validación DNS y confirma ambos dominios en Cloudflare Pages.

No necesitas comprar hosting de Namecheap, PremiumDNS, certificados SSL ni
correo corporativo para publicar esta página.

## Comandos

```bash
npm ci
npm run dev
npm run build:pages
npm test
```

Las imágenes principales son ilustrativas y deben sustituirse por fotografías
reales del club y el logotipo oficial cuando estén disponibles.
