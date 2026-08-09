import { PageShell } from "@/components/layout/page-shell";
import { SectionGroup } from "@/components/learn/section-group";
import { LessonTile } from "@/components/learn/lesson-tile";
import { ProfileSummaryCard } from "@/components/learn/profile-summary-card";
import { ReviewRecommendations } from "@/components/learn/review-recommendations";
import { SYSTEMS } from "@/lib/curriculum/systems";
import { getModulesForSystem } from "@/lib/content/loader";

export default function HomePage() {
  return (
    <PageShell
      rightRail={
        <div className="space-y-4">
          <ProfileSummaryCard />
          <ReviewRecommendations />
        </div>
      }
    >
      <h1 className="mb-1 text-2xl font-bold tracking-tight">
        Let&apos;s learn.
      </h1>
      <p className="mb-8 text-muted-foreground">Pick up where you left off.</p>

      {SYSTEMS.map((system) => {
        const modules = getModulesForSystem(system.id);
        if (modules.length === 0) return null;
        return (
          <SectionGroup
            key={system.id}
            title={system.title}
            description={system.description}
          >
            {modules.map((mod) => (
              <LessonTile key={mod.id} mod={mod} />
            ))}
          </SectionGroup>
        );
      })}
    </PageShell>
  );
}
