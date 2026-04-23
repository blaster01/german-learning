import { ProfileClient } from "./profile-client";

export default function ProfilePage() {
  return (
    <main>
      <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
      <p className="mt-1 text-muted-foreground">Your learning stats, mastery, and progress (local).</p>
      <ProfileClient />
    </main>
  );
}
