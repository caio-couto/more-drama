"use client"

import Header from "@/components/header";

export default function ShortsLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <div className="relative">
      <Header/>
      <div className="fixed top-0 left-0 right-0 bottom-0 pb-0">
        <div className="w-full h-full">
        {children}
        </div>
      </div>
    </div>
  );
}
