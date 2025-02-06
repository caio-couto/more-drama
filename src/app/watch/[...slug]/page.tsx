"use client"

import Screen from "@/components/Screen";
import { useEffect, useState } from "react";

type WindowSize = {
  width: number,
  height: number
}

export default function Novel() {
  const [windowSize, setWindowSize] = useState<WindowSize>({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  return (
    <main className="fixed h-full top-0 overflow-visible">
      <Screen screenSize={{ width: windowSize.width, height: windowSize.height }}/>
    </main>
  );
}