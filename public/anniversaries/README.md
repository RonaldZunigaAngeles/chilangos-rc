# Portadas de aniversarios

Cada aniversario utiliza una portada local y un enlace al álbum público de
Facebook:

```text
public/anniversaries/2023/portada.webp
public/anniversaries/2024/portada.webp
public/anniversaries/2025/portada.webp
```

Registra después cada fotografía dentro de `anniversaryAlbums` en
`app/data/club-life.ts`:

```ts
photos: [{
  src: "/anniversaries/2024/portada.webp",
  title: "Segundo aniversario Chilangos RC",
  description: "Portada autorizada del segundo aniversario.",
}],
facebookUrl: "https://www.facebook.com/media/set/?set=...",
```

Usa WebP, máximo 1,600 px y menos de 400 KB. Evita placas visibles, ubicaciones
privadas y fotografías sin autorización.
