export default function ShellLoading() {
  return (
    <div
      className="animate-pulse space-y-4 py-6"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="h-6 w-40 rounded-full bg-muted" />
      <div className="h-24 w-full rounded-2xl bg-muted" />
      <div className="h-24 w-full rounded-2xl bg-muted" />
      <div className="h-24 w-full rounded-2xl bg-muted" />
    </div>
  );
}
