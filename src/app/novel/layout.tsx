import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrackingCode from "@/components/TrackingCode";

export default function NovelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <head>
        <TrackingCode/>
      </head>
      <body>
        <Header/>
          <main className="w-full md:w-mobile-screen-w md:mx-auto h-full">
            {children}
          </main>
        <Footer/>
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5FXMSXND"height="0" width="0" style={{ display: "none", visibility: "hidden" }}></iframe></noscript>
      </body>
    </>
  );
}
