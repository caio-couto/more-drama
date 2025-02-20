"use client"

import { useSyncExternalStore } from "react";

const BREAK_POINT: number = 540;
export const MAX_SCREEN_WIDTH: number = 390;
export const MAX_SCREEN_HEIGHT: number = 844;

export interface WindowSize {
  width: number,
  height: number
}

const windowSize: WindowSize = {
  width: MAX_SCREEN_WIDTH,
  height: MAX_SCREEN_HEIGHT
}

export default function useWindowSize(): WindowSize {
  const windowSize = useSyncExternalStore<WindowSize>(subscribe, getSnapshot, getServerSnapshot);

  return windowSize;
}

function getServerSnapshot(): WindowSize {
  return windowSize;
}

function getSnapshot(): WindowSize {

  if (windowSize.width !== window.innerWidth || windowSize.height !== window.innerHeight) {
    windowSize.width = window.innerWidth < BREAK_POINT ? window.innerWidth : MAX_SCREEN_WIDTH;
    windowSize.height = window.innerWidth < BREAK_POINT ? window.innerHeight : MAX_SCREEN_HEIGHT;

    return windowSize;
  }

  return windowSize;
}

function subscribe(onStoreChange: (this: Window, event: UIEvent) => void): () => void {
  window.addEventListener("resize", onStoreChange);

  return function () {
    window.removeEventListener("resize", onStoreChange);
  }
}
