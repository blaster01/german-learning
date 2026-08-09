import { SettingsClient } from "./settings-client";

export const metadata = {
  title: "Settings — German Learning",
  description: "Daily goal, theme, and local data backup.",
};

export default function SettingsPage() {
  return (
    <div className="mt-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your daily goal and progress data, stored locally in this browser.
        </p>
      </div>
      <SettingsClient />
    </div>
  );
}
