"use client"

import { VideoContextValues } from "@/Context/Video/types";
import useVideoContext from "@/Context/Video/VideoContext";
import useWindowSize, { WindowSize } from "@/hooks/useWindowSize";
import { useEffect } from "react";

interface CardProps {
  slideIndex: number,
  hidden: boolean,
  children: React.ReactNode
} 

export default function Card({ slideIndex, hidden, children }: Readonly<CardProps>) {
  const windowSize: WindowSize = useWindowSize();
  const videoContext: VideoContextValues = useVideoContext();

  useEffect(() => {
    videoContext.setVideoIndex(slideIndex);
  }, []);

  return (
    <div className={`w-full`} style={{ height: windowSize.height }}>
      { !hidden && children}
    </div>  
  );
}