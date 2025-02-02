"use server"

export default async function NovelResume({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-4 py-5 text-sm text-foreground-secondary">
      {children}
    </div>
  );
}