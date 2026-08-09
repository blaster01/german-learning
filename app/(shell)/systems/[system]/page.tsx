import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getModulesMetaForSystem } from "@/lib/content/manifest";
import { getSystem } from "@/lib/curriculum/systems";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function generateMetadata({ params }: { params: { system: string } }) {
  const system = getSystem(params.system);
  return {
    title: system
      ? `${system.title} — German Learning`
      : "System — German Learning",
  };
}

export default function SystemPage({ params }: { params: { system: string } }) {
  const system = getSystem(params.system);
  if (!system) notFound();
  const modules = getModulesMetaForSystem(system.id);

  return (
    <main>
      <p className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">
          Learn
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span>{system.title}</span>
      </p>
      <h1 className="text-2xl font-bold tracking-tight">{system.title}</h1>
      <p className="mt-1 text-muted-foreground">{system.description}</p>

      <ul className="mt-7 space-y-3">
        {modules.map((m) => (
          <li key={m.id}>
            <Link href={`/systems/${system.id}/${m.slug}`}>
              <Card className="flex items-center gap-4 p-4 transition hover:shadow-card-lg">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{m.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {m.description}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant="muted">{m.totalCount} items</Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
      {modules.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No modules yet for this system.
        </p>
      ) : null}
    </main>
  );
}
