import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Head from "next/head";
import TrackingCode from "@/components/TrackingCode";

export default function NovelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Head>
        <TrackingCode/>
      </Head>
      <body>
        <Header/>
          <main className="w-full md:w-mobile-screen-w md:mx-auto h-full">
            {children}
          </main>
        <Footer/>
      </body>
    </>
  );
}
