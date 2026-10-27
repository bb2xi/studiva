import { useTranslations } from "next-intl";
import type { TuitionStatus } from "@/lib/discovery/types";
import { Tag } from "@/components/Tag";

export function FeeBadge({ facts }: { facts: { nonEuTuition: { status: TuitionStatus } } | null }) {
  const t = useTranslations("discovery.fee.badge");
  const status = facts?.nonEuTuition.status ?? "unknown";
  const variant = status === "none" ? "forest" : status === "unknown" ? "neutral" : "clay";
  return <Tag variant={variant}>{t(status)}</Tag>;
}
