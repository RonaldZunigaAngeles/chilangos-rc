import { getDb } from "../../../db";
import { rideSafetySubmissions } from "../../../db/schema";

type SafetyPayload = Record<string, unknown>;

function field(payload: SafetyPayload, name: string, maximumLength: number) {
  const value = payload[name];
  return typeof value === "string" ? value.trim().slice(0, maximumLength) : "";
}

export async function POST(request: Request) {
  let payload: SafetyPayload;
  try {
    payload = await request.json() as SafetyPayload;
  } catch {
    return Response.json({ error: "No pudimos leer la ficha. Inténtalo nuevamente." }, { status: 400 });
  }

  if (field(payload, "website", 100)) return Response.json({ received: true }, { status: 201 });

  const fullName = field(payload, "fullName", 140);
  const alias = field(payload, "alias", 80);
  const phone = field(payload, "phone", 35);
  const email = field(payload, "email", 180);
  const birthDate = field(payload, "birthDate", 10);
  const bloodType = field(payload, "bloodType", 20);
  const medicalNotes = field(payload, "medicalNotes", 1200);
  const emergencyContactName = field(payload, "emergencyContactName", 140);
  const emergencyContactPhone = field(payload, "emergencyContactPhone", 35);
  const healthInstitution = field(payload, "healthInstitution", 180);
  const insuranceActive = field(payload, "insuranceActive", 2);
  const motorcycleModel = field(payload, "motorcycleModel", 160);
  const motorcycleYear = field(payload, "motorcycleYear", 4);
  const engineCc = field(payload, "engineCc", 8);
  const plates = field(payload, "plates", 20);
  const policyDetails = field(payload, "policyDetails", 800);
  const consent = field(payload, "consent", 10);

  if (!fullName || !alias || !phone || !birthDate || !emergencyContactName || !emergencyContactPhone || !motorcycleModel || !consent) {
    return Response.json({ error: "Completa todos los campos requeridos y acepta el aviso de privacidad." }, { status: 400 });
  }
  if (!/^(si|no)$/.test(insuranceActive)) return Response.json({ error: "Indica si tu seguro de motocicleta está vigente." }, { status: 400 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return Response.json({ error: "Revisa la fecha de nacimiento." }, { status: 400 });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: "Revisa el correo electrónico." }, { status: 400 });

  try {
    await getDb().insert(rideSafetySubmissions).values({
      id: crypto.randomUUID(), fullName, alias, phone, email: email || null, birthDate,
      bloodType: bloodType || null, medicalNotes: medicalNotes || null,
      emergencyContactName, emergencyContactPhone, healthInstitution: healthInstitution || null,
      insuranceActive, motorcycleModel, motorcycleYear: motorcycleYear || null,
      engineCc: engineCc || null, plates: plates || null, policyDetails: policyDetails || null,
      consent,
    });
    return Response.json({ received: true }, { status: 201 });
  } catch {
    return Response.json({ error: "No pudimos guardar la ficha. Inténtalo más tarde." }, { status: 500 });
  }
}
