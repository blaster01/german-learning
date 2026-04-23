import type { SystemId } from "@/lib/curriculum/systems";

export type ModuleMeta = {
  id: string;
  slug: string;
  systemId: SystemId;
  title: string;
  description: string;
};
