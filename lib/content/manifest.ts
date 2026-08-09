/**
 * Client-safe content metadata. Import from here (not content/registry.ts)
 * in any "use client" component — this file re-exports only the generated
 * manifest (titles/descriptions/counts + id-prefix map), never the full
 * exercise item arrays.
 */
export {
  CONTENT_MODULE_META,
  type ContentModuleMeta,
} from "@/content/manifest.generated";
import { CONTENT_MODULE_META } from "@/content/manifest.generated";

export function getModuleMetaBySlug(slug: string) {
  return CONTENT_MODULE_META.find((m) => m.slug === slug);
}

export function getModulesMetaForSystem(systemId: string) {
  return CONTENT_MODULE_META.filter((m) => m.systemId === systemId);
}

/**
 * Derive a content item's module + tier purely from its id, using the
 * id-prefix map — no need to load the item itself. Ids are minted as
 * "{idPrefix}-t{tier}-{seq}" by scripts/generate-content.ts.
 */
export function moduleSlugAndTierForItemId(
  itemId: string,
): { slug: string; tier: 1 | 2 | 3 } | undefined {
  const m = itemId.match(/^(.+)-t([123])-\d+$/);
  if (!m) return undefined;
  const [, prefix, tierStr] = m;
  const mod = CONTENT_MODULE_META.find((mm) => mm.idPrefix === prefix);
  if (!mod) return undefined;
  return { slug: mod.slug, tier: Number(tierStr) as 1 | 2 | 3 };
}

export function moduleSlugForItemId(itemId: string): string | undefined {
  return moduleSlugAndTierForItemId(itemId)?.slug;
}
