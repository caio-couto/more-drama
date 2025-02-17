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

const BREAK_POINT: number = 540;
const MAX_SCREEN_WIDTH: number = 390;
const MAX_SCREEN_HEIGHT: number = 844;

export default function useWindowSize(): WindowSize {
  const windowSize = useSyncExternalStore<WindowSize>(subscribe, getSnapshot, getServerSnapshot);

  return windowSize;
}

function getServerSnapshot(): WindowSize {
  return {
    width: MAX_SCREEN_WIDTH,
    height: MAX_SCREEN_HEIGHT
  };
}

function getSnapshot(): WindowSize {
  if (windowSize.width !== window.innerWidth || windowSize.height !== window.innerHeight) {
    windowSize.width = window.innerWidth < BREAK_POINT ? window.innerWidth : MAX_SCREEN_WIDTH;
    windowSize.height = window.innerWidth < BREAK_POINT ? window.innerHeight : MAX_SCREEN_HEIGHT;

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
