import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NovelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body>
      <Header/>
      <main className="w-full md:w-mobile-screen-w md:mx-auto h-full">
      {children}
      </main>
      <Footer/>
    </body>
  );
}
