import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getModuleBySlug } from "@/lib/content/loader";
import { getSystem } from "@/lib/curriculum/systems";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TIERS = [1, 2, 3] as const;

const CEFR_FOR_TIER: Record<number, string> = { 1: "B1", 2: "B2", 3: "C1" };

export default function ModulePage({
  params,
}: {
  params: { system: string; module: string };
}) {
  const system = getSystem(params.system);
  const mod = getModuleBySlug(params.module);
  if (!system || !mod || mod.systemId !== system.id) notFound();

  return (
    <main>
      <p className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">Systems</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/systems/${system.id}`} className="hover:underline">{system.title}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span>{mod.title}</span>
      </p>
      <h1 className="text-2xl font-bold tracking-tight">{mod.title}</h1>
      <p className="mt-1 text-muted-foreground">{mod.description}</p>

      <section className="mt-7">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">Choose a tier</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {TIERS.map((tier) => {
            const count = mod.tiers[tier].length;
            return (
              <Card key={tier} className="flex flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold">Tier {tier}</p>
                  <Badge variant="muted">{CEFR_FOR_TIER[tier]}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{count} exercises</p>
                <Link
                  href={`/session/${mod.slug}/${tier}`}
                  className={cn(buttonVariants({ variant: "primary", size: "default" }), "mt-auto w-full justify-center")}
                >
                  Start
                </Link>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}
