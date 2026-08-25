import { headers } from "next/headers";

const REGISTRATION_HOSTNAME = "registro.chilangosrc.com";

export async function isRegistrationHostname() {
  const hostname = (await headers())
    .get("host")
    ?.trim()
    .toLocaleLowerCase("en-US")
    .split(":")[0];

  return hostname === REGISTRATION_HOSTNAME;
}
