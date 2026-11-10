import { createHash, timingSafeEqual } from "node:crypto";
import { get } from "@vercel/blob";

const installer = "bassh-mac-0.2.0-16-notarized.zip";
const installerBytes = 15_521_345;
const maxFormLength = 2_048;
const noStore = { "Cache-Control": "private, no-store" };

function retry(reason) {
  return new Response(null, {
    status: 303,
    headers: { ...noStore, Location: `/bassh/download#mac-download-${reason}` },
  });
}

function passwordMatches(password, expected) {
  const digest = (value) => createHash("sha256").update(value, "utf8").digest();
  return timingSafeEqual(digest(password), digest(expected));
}

export async function POST(request) {
  // Use one canonical route so the firewall applies to every password attempt.
  if (new URL(request.url).pathname !== "/api/bassh-mac-download") {
    return new Response(null, { status: 404, headers: noStore });
  }

  const expected = process.env.BASSH_MAC_DOWNLOAD_PASSWORD;
  if (!expected) return retry("unavailable");

  if (request.headers.get("content-type")?.split(";")[0] !== "application/x-www-form-urlencoded") {
    return retry("password-error");
  }

  const body = await request.text();
  if (body.length > maxFormLength) return retry("password-error");

  const passwords = new URLSearchParams(body).getAll("password");
  if (passwords.length !== 1 || !passwordMatches(passwords[0], expected)) {
    return retry("password-error");
  }

  try {
    const file = await get(installer, { access: "private" });
    if (file?.statusCode !== 200 || file.blob.size !== installerBytes) {
      await file?.stream?.cancel();
      return retry("unavailable");
    }

    return new Response(file.stream, {
      headers: {
        ...noStore,
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${installer}"`,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return retry("unavailable");
  }
}
