# Álbumes de Chilangos RC

Guarda las fotografías originales del club en carpetas organizadas por año:

- `public/albums/2022/`
- `public/albums/2023/`
- `public/albums/2024/`
- `public/albums/2025/`
- `public/albums/2026/`

Después registra cada fotografía en la propiedad `photos` del año correspondiente
dentro de `app/data/club-life.ts`:

```ts
photos: [
  {
    src: "/albums/2024/rodada-chachalacas.jpg",
    title: "Rodada a Chachalacas",
    description: "Integrantes de Chilangos RC durante la rodada a Chachalacas.",
  },
],
```

Publica únicamente fotografías autorizadas. Evita placas visibles, domicilios,
ubicaciones privadas y datos personales de los integrantes.
