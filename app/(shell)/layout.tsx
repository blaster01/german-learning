export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      id="main-content"
      className="mx-auto max-w-4xl px-4 py-8 pb-28 lg:pb-8"
    >
      {children}
    </main>
  );
}
