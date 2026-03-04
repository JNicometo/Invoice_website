import { getStore } from "@netlify/blobs";

export default async (request, context) => {
  if (request.method === "OPTIONS") {
    return new Response("OK", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");

  if (!sessionId || typeof sessionId !== "string" || !sessionId.startsWith("cs_")) {
    return Response.json({ error: "Missing or invalid session_id" }, { status: 400 });
  }

  const licenses = getStore("licenses");
  const licenseKey = await licenses.get(`session_${sessionId}`, { type: "json" });

  if (!licenseKey) {
    return Response.json(
      {
        error: "License not found for this session",
        hint: "This may take a few seconds. Please refresh the page.",
      },
      { status: 404 }
    );
  }

  const licenseData = await licenses.get(licenseKey, { type: "json" });

  return Response.json({
    licenseKey,
    email: licenseData?.email || null,
    created: licenseData?.created || null,
  });
};

export const config = {
  path: "/api/get-license",
};
