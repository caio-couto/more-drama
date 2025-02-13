import { ReactNode, useState } from "react";
import { VideoContext } from "./VideoContext";
import { VideoStates } from "./types";

interface VideoContextProviderProps {
  children: ReactNode
}

export default function VideoContextProvider({ children }: Readonly<VideoContextProviderProps>) {
  const [videoState, setVideoState] = useState<VideoStates>(VideoStates.LOADING);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [enableDrag, setEnableDrag] = useState<boolean>(true);
  const [index, setIndex] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  
  return (
   <VideoContext.Provider value={{
    videoState,
    setVideoState,
    isActive,
    setIsActive,
    currentTime,
    setCurrentTime,
    enableDrag, 
    setEnableDrag,
    index,
    setIndex,
    duration, 
    setDuration,
    video,
    setVideo
   }}>
    {children}
   </VideoContext.Provider> 
  );
}