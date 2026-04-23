import { notFound } from "next/navigation";
import { getModuleBySlug } from "@/lib/content/loader";
import type { SessionMode } from "@/lib/session/module-playlist";
import { SessionModeClient } from "./session-client";

const VALID_MODES = new Set<string>(["new", "mixed", "review"]);

export default function SessionModePage({
  params,
}: {
  params: { slug: string; mode: string };
}) {
  if (!VALID_MODES.has(params.mode)) notFound();
  const mod = getModuleBySlug(params.slug);
  if (!mod) notFound();

  return (
    <SessionModeClient
      slug={params.slug}
      mode={params.mode as SessionMode}
      moduleTitle={mod.title}
    />
  );
}
