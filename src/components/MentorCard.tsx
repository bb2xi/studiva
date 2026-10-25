import { Users } from "lucide-react";

export function MentorCard({
  name,
  role,
  photoUrl,
}: {
  name: string;
  role: string;
  photoUrl?: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-sm border border-border p-5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photoUrl}
        alt={name}
        loading="lazy"
        className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-clay-light"
      />
      <div>
        <div className="font-display text-base font-medium text-foreground">{name}</div>
        <div className="font-sans text-xs font-semibold uppercase tracking-wide text-clay">{role}</div>
      </div>
    </div>
  );
}

export function MentorCardComingSoon({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 rounded-sm border border-dashed border-border-strong p-5">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-clay-light text-clay">
        <Users size={22} />
      </div>
      <p className="font-display text-sm italic leading-snug text-foreground-secondary">{label}</p>
    </div>
  );
}
