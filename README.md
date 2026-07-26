# Studiva

Studiva is a Germany-focused study-abroad consultancy site (Next.js App Router + `next-intl`), covering Bachelor Studium, Master Studium, and Dual Studium (duales Studium) advising for students applying to German universities.

Available in Turkish (default) and English.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Structure

- `src/app/[locale]/` — routed pages: home, services, programs, about, contact
- `src/messages/{tr,en}.json` — all site copy, per locale
- `src/i18n/` — `next-intl` routing/navigation config
- `src/components/` — shared UI (Navbar, Footer, ContactForm, etc.)

## Notes

- The contact form is a front-end demo only (no backend submission wired up yet).
- The WhatsApp number in `src/app/[locale]/contact/page.tsx` (`WHATSAPP_NUMBER`) is a placeholder — replace it with the real business number before launch.
- Contact details in `src/messages/{tr,en}.json` (`footer`, `contact.info`) are placeholders and should be replaced with real company info before launch.
