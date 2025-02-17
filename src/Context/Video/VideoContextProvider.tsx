"use client"

import { ReactNode, useState } from "react";
import { VideoContext } from "./VideoContext";
import { VideoStates } from "./types";

interface VideoContextProviderProps {
  children: ReactNode
}

export default function VideoContextProvider({ children }: Readonly<VideoContextProviderProps>) {
  const [videoState, setVideoState] = useState<VideoStates>(VideoStates.LOADING);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [enableDrag, setEnableDrag] = useState<boolean>(true);
  const [duration, setDuration] = useState<number>(0);
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  
  return (
   <VideoContext.Provider value={{
    videoState,
    setVideoState,
    currentTime,
    setCurrentTime,
    enableDrag, 
    setEnableDrag,
    duration, 
    setDuration,
    video,
    setVideo
   }}>
    {children}
   </VideoContext.Provider> 
  );
}