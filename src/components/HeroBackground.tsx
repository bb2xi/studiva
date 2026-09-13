"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient animated background for the hero section: three blurred gradient
 * blobs that drift on their own (pure CSS transform loops) and additionally
 * respond to pointer position via a translate offset written as CSS custom
 * properties. Only ever animates `transform`/`opacity` so it stays on the
 * GPU compositor thread. Pointer tracking is skipped on touch devices and
 * the whole thing is inert under `prefers-reduced-motion`.
 */
export default function HeroBackground() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (reduceMotion || isCoarsePointer) return;

    function handlePointerMove(event: PointerEvent) {
      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        const rect = wrapper!.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        wrapper!.style.setProperty("--mx", x.toFixed(3));
        wrapper!.style.setProperty("--my", y.toFixed(3));
      });
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden [--mx:0] [--my:0]"
    >
      <div
        className="absolute -left-1/4 -top-1/4 h-[60vw] w-[60vw] max-h-[560px] max-w-[560px] rounded-full opacity-40 blur-[90px] will-change-transform"
        style={{
          background: "radial-gradient(circle, #0068ff 0%, transparent 70%)",
          animation: "blob-float-1 22s ease-in-out infinite",
          transform: "translate3d(calc(var(--mx) * 40px), calc(var(--my) * 40px), 0)",
        }}
      />
      <div
        className="absolute -right-1/4 top-0 h-[55vw] w-[55vw] max-h-[520px] max-w-[520px] rounded-full opacity-30 blur-[100px] will-change-transform"
        style={{
          background: "radial-gradient(circle, #002a66 0%, transparent 70%)",
          animation: "blob-float-2 28s ease-in-out infinite",
          transform: "translate3d(calc(var(--mx) * -30px), calc(var(--my) * 30px), 0)",
        }}
      />
      <div
        className="absolute bottom-[-20%] left-1/3 h-[45vw] w-[45vw] max-h-[420px] max-w-[420px] rounded-full opacity-25 blur-[90px] will-change-transform"
        style={{
          background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)",
          animation: "blob-float-3 25s ease-in-out infinite",
          transform: "translate3d(calc(var(--mx) * 25px), calc(var(--my) * -25px), 0)",
        }}
      />
    </div>
  );
}
