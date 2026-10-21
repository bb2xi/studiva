export default function Container({
  children,
  className = "",
  bleed = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** Lets photography/feature sections run wider than the standard reading
   * container, per the editorial "narrow for reading, wide for imagery"
   * spacing rule. */
  bleed?: boolean;
}) {
  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${bleed ? "max-w-7xl" : "max-w-6xl"} ${className}`}>
      {children}
    </div>
  );
}
