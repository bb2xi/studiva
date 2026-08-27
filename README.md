# Studiva

Studiva is a study-abroad consultancy site (Next.js App Router + `next-intl`) covering Bachelor's and Master's admissions advising across 9 European countries: Germany, the UK, the Netherlands, France, Switzerland, Sweden, Belgium, Denmark, and Estonia.

Available in Turkish (default) and English.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Structure

- `src/app/[locale]/` — routed pages: home, services, programs, universities (list + `[slug]` detail), about, contact
- `src/messages/{tr,en}.json` — all site copy, per locale, including `universities.items` (61 universities with history/highlights/pros/cons) and `universities.countries` (country metadata)
- `src/lib/universityMedia.ts` — campus photos and logos per university, sourced from Wikimedia Commons under free licenses
- `src/components/UniversitiesBrowser.tsx` — client-side country filter + grid for the universities list page
- `src/i18n/` — `next-intl` routing/navigation config
- `src/components/` — shared UI (Navbar, Footer, ContactForm, etc.)

## Notes

- The contact form is a front-end demo only (no backend submission wired up yet).
- The WhatsApp number in `src/app/[locale]/contact/page.tsx` (`WHATSAPP_NUMBER`) is a placeholder — replace it with the real business number before launch.
- Contact details in `src/messages/{tr,en}.json` (`footer`, `contact.info`) are placeholders and should be replaced with real company info before launch.
