# Aniversarios de Chilangos RC

Organiza las fotografías autorizadas por aniversario:

```text
public/anniversaries/2023/primer-aniversario-01.jpg
public/anniversaries/2024/segundo-aniversario-01.jpg
public/anniversaries/2025/tercer-aniversario-01.jpg
```

Registra después cada fotografía dentro de `anniversaryAlbums` en
`app/data/club-life.ts`:

```ts
photos: [{
  src: "/anniversaries/2024/segundo-aniversario-01.jpg",
  title: "Segundo aniversario Chilangos RC",
  description: "Fotografía autorizada de integrantes durante el aniversario.",
}],
```

Evita placas visibles, ubicaciones privadas y fotografías sin autorización.
