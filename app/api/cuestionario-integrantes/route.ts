import { env } from "cloudflare:workers";
import { getDb } from "../../../db";
import { questionnaireSubmissions } from "../../../db/schema";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_TOTAL_IMAGE_BYTES = 32 * 1024 * 1024;
const MAX_PREVIOUS_MOTORCYCLES = 10;
const MAX_AWARDS = 5;
const allowedImageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

function field(data: FormData, name: string, maximumLength: number) {
  const value = data.get(name);
  return typeof value === "string" ? value.trim().slice(0, maximumLength) : "";
}

function image(data: FormData, name: string) {
  const value = data.get(name);
  return value instanceof File && value.size > 0 ? value : null;
}

function validateImage(file: File | null) {
  if (!file) return null;
  if (!allowedImageTypes.has(file.type)) return "Las fotografías deben ser JPG, PNG o WebP.";
  if (file.size > MAX_IMAGE_BYTES) return "Cada fotografía debe pesar máximo 8 MB.";
  return null;
}

async function storeImage(file: File, submissionId: string, kind: string) {
  if (!env.BUCKET) throw new Error("R2_UNAVAILABLE");
  const extension = allowedImageTypes.get(file.type) ?? "jpg";
  const key = `cuestionarios/${submissionId}/${kind}.${extension}`;
  await env.BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  });
  return key;
}

export async function POST(request: Request) {
  let data: FormData;

  try {
    data = await request.formData();
  } catch {
    return Response.json({ error: "No pudimos leer tus respuestas. Inténtalo nuevamente." }, { status: 400 });
  }

  if (field(data, "empresa", 100)) {
    return Response.json({ received: true }, { status: 201 });
  }

  const alias = field(data, "alias", 80);
  if (!alias) {
    return Response.json({ error: "Escribe el apodo o nombre con el que te conoce la banda." }, { status: 400 });
  }

  const publicationConsent = field(data, "autorizacionPublicacion", 40);
  if (!publicationConsent) {
    return Response.json({ error: "Selecciona cómo autorizas que usemos tu historia." }, { status: 400 });
  }

  const profilePhoto = image(data, "foto");
  const motorcyclePhoto = image(data, "fotoMoto");
  const previousMotorcyclePhotos = Array.from(
    { length: MAX_PREVIOUS_MOTORCYCLES },
    (_, index) => image(data, `motoAnteriorFoto${index}`),
  );
  const allImages = [profilePhoto, motorcyclePhoto, ...previousMotorcyclePhotos].filter((file): file is File => Boolean(file));
  const imageError = allImages.map(validateImage).find(Boolean) ?? null;
  if (imageError) return Response.json({ error: imageError }, { status: 400 });
  if (allImages.reduce((total, file) => total + file.size, 0) > MAX_TOTAL_IMAGE_BYTES) {
    return Response.json({ error: "En conjunto, tus fotografías deben pesar máximo 32 MB." }, { status: 400 });
  }

  const submissionId = crypto.randomUUID();
  const storedKeys: string[] = [];

  try {
    const profilePhotoKey = profilePhoto
      ? await storeImage(profilePhoto, submissionId, "perfil")
      : null;
    if (profilePhotoKey) storedKeys.push(profilePhotoKey);

    const motorcyclePhotoKey = motorcyclePhoto
      ? await storeImage(motorcyclePhoto, submissionId, "moto-actual")
      : null;
    if (motorcyclePhotoKey) storedKeys.push(motorcyclePhotoKey);

    const previousMotorcycles = [];
    for (let index = 0; index < MAX_PREVIOUS_MOTORCYCLES; index += 1) {
      const photo = previousMotorcyclePhotos[index];
      const photoKey = photo
        ? await storeImage(photo, submissionId, `moto-anterior-${String(index + 1).padStart(2, "0")}`)
        : null;
      if (photoKey) storedKeys.push(photoKey);

      const motorcycle = {
        brand: field(data, `motoAnteriorMarca${index}`, 100),
        model: field(data, `motoAnteriorModelo${index}`, 120),
        year: field(data, `motoAnteriorAnio${index}`, 30),
        period: field(data, `motoAnteriorPeriodo${index}`, 100),
        name: field(data, `motoAnteriorNombre${index}`, 100),
        story: field(data, `motoAnteriorHistoria${index}`, 1800),
        photoKey,
      };

      if (Object.values(motorcycle).some(Boolean)) previousMotorcycles.push(motorcycle);
    }

    const awards = [];
    for (let index = 0; index < MAX_AWARDS; index += 1) {
      const category = field(data, `premioCategoria${index}`, 150);
      const customName = field(data, `premioNombre${index}`, 150);
      const title = customName || (category === "Otra categoría" ? "" : category);
      const year = field(data, `premioAnio${index}`, 4);
      const story = field(data, `premioHistoria${index}`, 1000);
      if (title || year || story) awards.push({ title, year, story });
    }

    const answers = {
      memberType: field(data, "tipoIntegrante", 30),
      joinedClub: field(data, "desdeCuandoClub", 100),
      ridesWith: field(data, "conQuienRuedas", 100),
      inicios: field(data, "inicios", 3000),
      biografia: field(data, "biografia", 5000),
      llegadaClub: field(data, "llegadaClub", 2500),
      significadoClub: field(data, "significadoClub", 2500),
      filosofia: field(data, "filosofia", 500),
      experienciaPartner: field(data, "experienciaPartner", 2500),
      currentMotorcycle: {
        brand: field(data, "motoMarca", 100),
        model: field(data, "motoModelo", 120),
        year: field(data, "motoAnio", 30),
        color: field(data, "motoColor", 60),
        engine: field(data, "motoMotor", 100),
        name: field(data, "motoNombre", 100),
        since: field(data, "motoDesde", 80),
        story: field(data, "historiaMoto", 2500),
        photoKey: motorcyclePhotoKey,
      },
      previousMotorcycles,
      dreamMotorcycle: {
        brand: field(data, "motoSuenosMarca", 100),
        model: field(data, "motoSuenosModelo", 120),
        story: field(data, "motoSuenosHistoria", 1800),
      },
      bikerCulture: {
        favoriteMovie: field(data, "peliculaFavorita", 250),
        favoriteSeries: field(data, "serieFavorita", 250),
        character: field(data, "personajeBiker", 200),
        iconicMotorcycle: field(data, "motoIconica", 250),
        roadSong: field(data, "cancionRuta", 250),
        style: field(data, "estiloBiker", 250),
        favoriteScene: field(data, "escenaFavorita", 1800),
      },
      rutaFavorita: field(data, "rutaFavorita", 250),
      rutaSonada: field(data, "rutaSonada", 250),
      paradaFavorita: field(data, "paradaFavorita", 250),
      indispensableRodada: field(data, "indispensableRodada", 250),
      pasiones: field(data, "pasiones", 500),
      hobbies: field(data, "hobbies", 500),
      anecdotaBanda: field(data, "anecdotaBanda", 2500),
      awards,
      aporteClub: field(data, "aporteClub", 1800),
      mensajeBanda: field(data, "mensajeBanda", 1800),
      notas: field(data, "notas", 2500),
      publicationConsent,
    };

    await getDb().insert(questionnaireSubmissions).values({
      id: submissionId,
      alias,
      fullName: field(data, "nombreCompleto", 160) || null,
      age: field(data, "edad", 3) || null,
      phone: field(data, "whatsapp", 35) || null,
      sponsor: field(data, "padrino", 100) || null,
      answersJson: JSON.stringify(answers),
      profilePhotoKey,
      motorcyclePhotoKey,
    });

    return Response.json({ received: true }, { status: 201 });
  } catch {
    if (env.BUCKET) {
      await Promise.allSettled(storedKeys.map((key) => env.BUCKET.delete(key)));
    }
    return Response.json({ error: "No pudimos guardar tu historia. Inténtalo más tarde." }, { status: 500 });
  }
}
