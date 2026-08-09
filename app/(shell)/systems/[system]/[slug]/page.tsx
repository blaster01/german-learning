import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getSystem } from "@/lib/curriculum/systems";
import { getModuleMetaBySlug } from "@/lib/content/manifest";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LessonTileActions } from "@/components/learn/lesson-tile-actions";
import { TileMastery } from "@/components/learn/tile-mastery";

export function generateMetadata({
  params,
}: {
  params: { system: string; slug: string };
}) {
  const mod = getModuleMetaBySlug(params.slug);
  return {
    title: mod ? `${mod.title} — German Learning` : "Module — German Learning",
  };
}

export default function ModuleDetailPage({
  params,
}: {
  params: { system: string; slug: string };
}) {
  const system = getSystem(params.system);
  if (!system) notFound();

  const mod = getModuleMetaBySlug(params.slug);
  if (!mod || mod.systemId !== system.id) notFound();

  return (
    <main>
      <p className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">
          Learn
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/systems/${system.id}`} className="hover:underline">
          {system.title}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span>{mod.title}</span>
      </p>

      <Card className="mt-4 flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <TileMastery
          slug={mod.slug}
          title={mod.title}
          description={mod.description}
          tierTotals={mod.tierCounts}
        />
      </Card>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Badge variant="muted">{mod.totalCount} items</Badge>
        <Badge variant="muted">Tier 1: {mod.tierCounts[0]}</Badge>
        <Badge variant="muted">Tier 2: {mod.tierCounts[1]}</Badge>
        <Badge variant="muted">Tier 3: {mod.tierCounts[2]}</Badge>
      </div>

      <div className="mt-6">
        <LessonTileActions slug={mod.slug} />
      </div>
    </main>
  );
}
