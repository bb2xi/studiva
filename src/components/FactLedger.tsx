import type { ReactNode } from "react";

export type LedgerRow = {
  label: string;
  value: ReactNode;
  highlight?: boolean;
};

export function FactLedger({ rows, className = "" }: { rows: LedgerRow[]; className?: string }) {
  return (
    <dl className={`divide-y divide-border ${className}`}>
      {rows.map((row, i) => (
        <div key={i} className="flex items-baseline justify-between gap-4 py-3 first:pt-0 last:pb-0">
          <dt className="font-sans text-xs font-semibold uppercase tracking-wide text-foreground-secondary">
            {row.label}
          </dt>
          <dd
            className={
              row.highlight
                ? "font-data text-right text-lg font-bold tabular-nums text-accent-dark"
                : "font-data text-right text-sm font-medium tabular-nums text-foreground"
            }
          >
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
