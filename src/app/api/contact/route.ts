import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const country = typeof body.country === "string" ? body.country.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const consent = body.consent === true;

  if (!name || !EMAIL_RE.test(email) || !consent) {
    return NextResponse.json({ ok: false, error: "invalid_input" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toAddress = process.env.CONTACT_TO_EMAIL || "info@studiva.com.tr";

  if (!apiKey) {
    // Not configured yet. Set RESEND_API_KEY (and optionally CONTACT_TO_EMAIL /
    // CONTACT_FROM_EMAIL) in the environment to actually deliver submissions —
    // until then, log server-side so a lead is at least not silently lost.
    console.warn("[contact] RESEND_API_KEY not set — submission logged only, not emailed:", {
      name,
      email,
      phone,
      country,
      message,
    });
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Studiva Website <onboarding@resend.dev>",
        to: [toAddress],
        reply_to: email,
        subject: `Yeni ön görüşme talebi — ${name}`,
        text: `Ad Soyad: ${name}\nE-posta: ${email}\nTelefon: ${phone || "-"}\nProgram Türü: ${country || "-"}\n\nMesaj:\n${message || "-"}`,
      }),
    });

    if (!res.ok) {
      console.error("[contact] Resend API error:", res.status, await res.text());
      return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[contact] Failed to send via Resend:", err);
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }
}
