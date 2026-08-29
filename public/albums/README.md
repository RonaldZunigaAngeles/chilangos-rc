# Portadas de álbumes anuales

Para mantener ligera la página, cada año utiliza una sola portada local. El
álbum completo permanece en Facebook mediante un enlace público.

```text
public/albums/2022/portada.webp
public/albums/2023/portada.webp
public/albums/2024/portada.webp
public/albums/2025/portada.webp
public/albums/2026/portada.webp
```

En `app/data/club-life.ts`, registra la portada como primer elemento de
`photos` y pega el enlace público en `facebookUrl`:

```ts
photos: [
  {
    src: "/albums/2024/portada.webp",
    title: "Temporada 2024",
    description: "Portada autorizada del archivo Chilango 2024.",
  },
],
facebookUrl: "https://www.facebook.com/media/set/?set=...",
```

Usa WebP, máximo 1,600 px y menos de 400 KB. Comprueba el enlace de Facebook en
una ventana privada y conserva un respaldo independiente de los originales.
