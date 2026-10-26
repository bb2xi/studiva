import { NextResponse } from "next/server";
import { UNIVERSITY_SLUGS } from "@/lib/universities";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELDS = new Set(["tuition", "link", "programs", "other"]);

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max) : "";
}

/** Visitor reports of outdated university data or broken official links. */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const slug = clean(body.slug, 40);
  const field = clean(body.field, 20);
  const message = clean(body.message, 1000);
  const email = clean(body.email, 200);
  const page = clean(body.page, 200);

  if (!UNIVERSITY_SLUGS.includes(slug) || !FIELDS.has(field) || (email && !EMAIL_RE.test(email))) {
    return NextResponse.json({ ok: false, error: "invalid_input" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const text = `University: ${slug}\nField: ${field}\nPage: ${page || "-"}\nReporter email: ${email || "-"}\n\n${message || "-"}`;

  if (!apiKey) {
    // Same fallback as /api/contact: until email delivery is configured the report is logged server-side.
    console.warn("[data-report] RESEND_API_KEY not set — report logged only:", { slug, field, page, email, message });
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Studiva Website <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO_EMAIL || "info@studiva.com.tr"],
        ...(email ? { reply_to: email } : {}),
        subject: `Data report — ${slug} (${field})`,
        text,
      }),
    });
    if (!res.ok) {
      console.error("[data-report] Resend API error:", res.status, await res.text());
      return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[data-report] Failed to send:", err);
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }
}
