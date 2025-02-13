"use client"

import { useSyncExternalStore } from "react";

export interface WindowSize {
  width: number,
  height: number
}

const windowSize: WindowSize = {
  width: 0,
  height: 0
}

export default function useWindowSize(): WindowSize {
  const windowSize = useSyncExternalStore<WindowSize>(subscribe, getSnapshot, undefined);

  return windowSize;
}

function getSnapshot(): WindowSize {
  if (windowSize.width !== window.innerWidth || windowSize.height !== window.innerHeight) {
    windowSize.width = window.innerWidth;
    windowSize.height = window.innerHeight;

    return windowSize;
  }

  return windowSize;
}

function subscribe(onStoreChange: () => void): () => void {
  window.addEventListener("resize", onStoreChange);

  return function () {
    window.removeEventListener("resize", onStoreChange);
  }
}
