import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NovelLayout({
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
      <Footer/>
    </>
  );
}
