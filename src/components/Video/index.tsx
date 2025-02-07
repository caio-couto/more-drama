import { useEffect, useRef, useState } from "react";
import VideoRange from "../VideoRange";

import VideoPauseSVG from "@public/video-pause.svg";
import Image from "next/image";

interface CardProps {
  index: number,
  active: boolean,
}

export default function Video({ index, active, }: CardProps) { 
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  function handleClick(): void {
    if (videoRef.current && !isDragging) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPaused(false);
      } else {
        videoRef.current.pause();
        setIsPaused(true);
      }
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime);
      }
    }, 100);
    
    return function() { 
      return clearInterval(interval);
    }
  }, [isPaused, currentTime]);
  
  function handlePlaying(): void {
    setIsPaused(false);

    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }

  function handleChange(videoCurrentTime: number): void {
    if (videoRef.current) {
      setIsDragging(true)
      videoRef.current.currentTime = videoCurrentTime;
    }

    setIsDragging(false);
  }

  function handleDragStart(): void {
    setIsDragging(true);
  }

  function handleDragEnd(): void {
    setIsDragging(false);
  }

  return (
    <div className={`w-full h-full relative flex flex-col justify-between`} onClick={handleClick}>
      {active && (
      <div className="flex-1">
        <video ref={videoRef} className="w-full h-full mx-auto object-cover" onPlaying={handlePlaying} controls={false} preload="none" autoPlay={index !== 0} disablePictureInPicture playsInline>
          <source className="object-cover" src={"https://videos.pexels.com/video-files/6752408/6752408-uhd_1440_2732_25fps.mp4"}/>
        </video>
      </div>)}

      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
        {isPaused && (<Image src={VideoPauseSVG} width={48} height={48} alt="video puse icon"/>)}
      </div>

      <div className={isPaused ? "flex-1 w-11/12 absolute bottom-0  mx-4 pb-4 transition-all" : "w-full absolute bottom-0 transition-all"}>
        <div className={isPaused ? "h-4 flex items-center justify-center" : ""}>
          <div className={isPaused ? "relative w-full h-1 flex items-center bg-gray-300 transition-all" : "relative w-1-full h-1 flex items-center bg-gray-300 bottom-0 transition-all"}>
            <VideoRange durarion={duration} currentTime={currentTime} isPaused={isPaused} onChange={handleChange} onDragStart={handleDragStart} onDragEnd={handleDragEnd}/>
          </div>
        </div>
      </div>
    </div>
  );
}