import { getDb } from "../../../db";
import { collaborationRequests } from "../../../db/schema";

type CollaborationPayload = {
  contactName?: unknown;
  businessName?: unknown;
  businessType?: unknown;
  location?: unknown;
  email?: unknown;
  phone?: unknown;
  instagram?: unknown;
  proposal?: unknown;
  website?: unknown;
};

function field(value: unknown, maximumLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maximumLength) : "";
}

export async function POST(request: Request) {
  let payload: CollaborationPayload;

  try {
    payload = await request.json() as CollaborationPayload;
  } catch {
    return Response.json({ error: "No pudimos leer tu solicitud. Inténtalo nuevamente." }, { status: 400 });
  }

  if (field(payload.website, 100)) {
    return Response.json({ received: true }, { status: 201 });
  }

  const contactName = field(payload.contactName, 100);
  const businessName = field(payload.businessName, 140);
  const businessType = field(payload.businessType, 100);
  const location = field(payload.location, 160);
  const email = field(payload.email, 180);
  const phone = field(payload.phone, 35);
  const instagram = field(payload.instagram, 100);
  const proposal = field(payload.proposal, 2500);

  if (!contactName || !businessName || !businessType || !location || !proposal) {
    return Response.json({ error: "Completa los datos de tu negocio y cuéntanos tu propuesta." }, { status: 400 });
  }

  if (!email && !phone) {
    return Response.json({ error: "Comparte un correo o WhatsApp para que podamos contactarte." }, { status: 400 });
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Revisa tu correo electrónico antes de enviar la solicitud." }, { status: 400 });
  }

  try {
    await getDb().insert(collaborationRequests).values({
      id: crypto.randomUUID(),
      contactName,
      businessName,
      businessType,
      location,
      email: email || null,
      phone: phone || null,
      instagram: instagram || null,
      proposal,
    });

    return Response.json({ received: true }, { status: 201 });
  } catch {
    return Response.json({ error: "No pudimos guardar tu propuesta. Inténtalo más tarde." }, { status: 500 });
  }
}
