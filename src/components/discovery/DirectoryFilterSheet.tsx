"use client";

import { useEffect, useId, useRef } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { lockPageScroll } from "@/lib/scrollLock";

/**
 * Full-screen filter panel for small screens, on a native modal <dialog>: the
 * browser makes the page behind it inert (focus stays inside), closes it on
 * Esc and returns focus to the button that opened it.
 */
export default function DirectoryFilterSheet({
  open,
  onClose,
  onClear,
  resultCount,
  scrollToId,
  children,
}: {
  open: boolean;
  onClose: () => void;
  onClear: () => void;
  resultCount: number;
  /** Section to bring into view when opening (e.g. from the "Subject" chip). */
  scrollToId?: string | null;
  children: React.ReactNode;
}) {
  const t = useTranslations("discovery.directory");
  const ref = useRef<HTMLDialogElement>(null);
  const releaseScroll = useRef<(() => void) | null>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      releaseScroll.current = lockPageScroll();
      if (scrollToId) document.getElementById(scrollToId)?.scrollIntoView({ block: "start" });
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, scrollToId]);

  useEffect(() => () => releaseScroll.current?.(), []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={() => {
        releaseScroll.current?.();
        releaseScroll.current = null;
        onClose();
      }}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-surface p-0 text-foreground backdrop:bg-black/40 open:flex open:flex-col lg:hidden"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <h2 id={titleId} className="font-display text-lg font-medium">
          {t("filters")}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("closeFilters")}
          className="flex h-11 w-11 items-center justify-center rounded-sm text-foreground-secondary hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
        >
          <X size={20} />
        </button>
      </div>
      {/* Only built while open: closed, it would double the filter markup in every page load. */}
      <div className="flex-1 overflow-y-auto px-4">{open && children}</div>
      <div className="flex gap-3 border-t border-border bg-surface px-4 py-3">
        <button
          type="button"
          onClick={onClear}
          className="min-h-11 flex-1 rounded-sm border border-border-strong px-4 text-sm font-semibold text-foreground-secondary hover:border-clay hover:text-clay-dark"
        >
          {t("clearAll")}
        </button>
        <button type="button" onClick={onClose} className="min-h-11 flex-[2] rounded-sm bg-brand-fill px-4 text-sm font-semibold text-white hover:bg-brand-fill-hover">
          {t("showResults", { count: resultCount })}
        </button>
      </div>
    </dialog>
  );
}
