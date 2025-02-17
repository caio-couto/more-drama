"use client"

import Image from "next/image";
import CarouselPlacehoulderPNG from "@public/carousel-placehoulder.png";

export default function ShortsLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <body className="overflow-hidden md:overflow-auto md:w-screen md:h-screen">
      <div className="shorts bg-transparent fixed md:relative bg-red-600 top-0 right-0 left-0 w-full h-full">
        {children}
      </div>
    </body>
  );
}
