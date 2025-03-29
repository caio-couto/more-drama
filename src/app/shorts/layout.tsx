import TrackingCode from "@/components/TrackingCode";

export default function ShortsLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <>
      <head>
        <TrackingCode/>
      </head>
      <body className="overflow-hidden md:overflow-auto md:w-screen md:h-screen">
        <div className="shorts bg-transparent fixed md:relative bg-red-600 top-0 right-0 left-0 w-full h-full">
          {children}
        </div>
      </body>
    </>
  );
}
