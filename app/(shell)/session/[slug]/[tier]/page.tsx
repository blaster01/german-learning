import { notFound } from "next/navigation";
import { getItemsForModuleTier, getModuleBySlug, type TierIndex } from "@/lib/content/loader";
import { SessionPageClient } from "./session-client";

export default function SessionPage({ params }: { params: { slug: string; tier: string } }) {
  const tierNum = Number.parseInt(params.tier, 10);
  if (![1, 2, 3].includes(tierNum)) notFound();
  const tier = tierNum as TierIndex;
  const mod = getModuleBySlug(params.slug);
  if (!mod) notFound();
  const items = getItemsForModuleTier(params.slug, tier);

  return (
    <SessionPageClient
      slug={params.slug}
      tier={tier}
      items={items}
      systemId={mod.systemId}
      moduleTitle={mod.title}
    />
  );
}
