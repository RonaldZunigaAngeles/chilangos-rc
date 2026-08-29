# Fotografías públicas de integrantes

Estas carpetas reciben únicamente fotografías revisadas y autorizadas para las
biografías públicas. Las imágenes enviadas desde el cuestionario permanecen en
el almacenamiento privado y no aparecen aquí automáticamente.

## Carpetas disponibles

| Grupo | Carpetas |
| --- | --- |
| Fundadores | `adri`, `austria`, `charly`, `fer`, `rafa`, `ronnie`, `rulo` |
| Integrantes | `alej`, `angel`, `fatima`, `isra`, `mac`, `richard`, `seb` |
| Prospectos | `fer-fucho`, `gi` |

## Nombres de archivo

Dentro de la carpeta de cada persona utiliza esta nomenclatura:

```text
perfil.webp
moto-actual.webp
moto-anterior-01.webp
moto-anterior-02.webp
...
moto-anterior-10.webp
historia-01.webp
historia-02.webp
award-2025.webp
```

- `perfil.webp`: retrato principal, preferentemente vertical.
- `moto-actual.webp`: motocicleta actual sin placa visible.
- `moto-anterior-01.webp` a `moto-anterior-10.webp`: garage histórico.
- `historia-01.webp`, etc.: fotografías autorizadas para su biografía.
- `award-AAAA.webp`: reconocimiento Chilango Awards, cuando exista.

Recomendación: WebP, máximo 1,600 px en el lado más largo y menos de 400 KB por
imagen. No publiques placas, domicilios, teléfonos, apellidos, fechas de
nacimiento, documentos ni ubicaciones privadas.

Después de subir las imágenes, registra sus rutas en
`app/data/biker-profiles.ts`. Ejemplo:

```ts
portrait: "/members/ronnie/perfil.webp",
motorcycles: [{
  image: "/members/ronnie/moto-actual.webp",
}],
```

## Cómo subir desde GitHub web

1. Abre `public` → `members` → carpeta del integrante.
2. Selecciona **Add file** → **Upload files**.
3. Arrastra las fotografías ya optimizadas.
4. Revisa que los nombres coincidan exactamente con esta guía.
5. Escribe una descripción breve del cambio y confirma con **Commit changes**.

Subir una fotografía a GitHub no la incorpora automáticamente a una biografía:
también debe registrarse su ruta en `app/data/biker-profiles.ts` y publicarse
una nueva versión del sitio.
