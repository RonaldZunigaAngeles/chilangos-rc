# Chilangos RC

Sitio oficial del riding club Chilangos RC, fundado en Ciudad de México el 10
de diciembre de 2022.

## Qué incluye

- Historia e identidad del club.
- Fundadores y miembros registrados.
- Bitácora filtrable con 22 rodadas históricas.
- Explorador con 50 destinos y filtro de pueblos mágicos.
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

- `founders` y `crew`: integrantes y motocicletas.
- `rides`: rodadas, fechas, destinos y kilómetros.
- `destinations`: catálogo de destinos.
- `products`: artículos y enlaces de pago.
- `club`: dominio y cuentas oficiales.

No publiques teléfonos, domicilios, placas, pólizas, expedientes médicos,
contactos de emergencia ni otros datos personales del archivo original.

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
