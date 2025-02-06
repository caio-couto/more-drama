import Header from "@/components/Header";

export default function WatchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header/>
      <main className="">
      {children}
      </main>
    </>
  );
}
