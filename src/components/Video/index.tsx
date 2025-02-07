import { useEffect, useRef, useState } from "react";
import VideoRange from "../VideoRange";

import VideoPlaySVG from  "@public/video-play.svg";
import VideoPauseSVG from "@public/video-pause.svg";
import VideoLodingSVG from "@public/video-loading.svg";

import Image from "next/image";

enum VideoState {
  NOT_STARTED,
  PLAYING,
  STOPPED,
  LOADING
}

interface CardProps {
  index: number,
  active: boolean,
  videoUrl: string,
}

export default function Video({ index, active, videoUrl }: CardProps) { 
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoState, setVideoState] = useState<VideoState>(VideoState.LOADING);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  function handlePause(): void {
    if (videoRef.current && !isDragging) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setVideoState(VideoState.PLAYING);
      } else {
        videoRef.current.pause();
        setVideoState(VideoState.STOPPED);
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
  }, [videoState, currentTime]);
  
  function handlePlaying(): void {
    setVideoState(VideoState.PLAYING);

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

  function handleEnableDrag(): void {
    setIsDragging(true);
  }

  function handleDisableDrag(): void {
    setIsDragging(false);
  }

  function handlePlayThrough(): void {
    setVideoState(VideoState.NOT_STARTED);
  }

  return (
    <div className={`w-full h-full relative flex flex-col justify-between`}>

      {active && (
        <div className="flex-1">
        <video ref={videoRef} className="w-full h-full mx-auto object-cover" onPlaying={handlePlaying} onCanPlayThrough={handlePlayThrough} controls={false} preload="metadata" autoPlay={index !== 0} disablePictureInPicture playsInline>
          <source className="object-cover" src={videoUrl}/>
        </video>
      </div>)}

      <div className="absolute w-full h-full flex flex-col justify-between">
        <div className="flex-1" onClick={handlePause}>
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
            {videoState === VideoState.NOT_STARTED && 
            (
              <div className="bg-[#1818184d] p-4 rounded-full">
                <Image src={VideoPlaySVG} width={48} height={48} alt="video puse icon"/>
              </div>)}
            {videoState === VideoState.STOPPED && 
            (
              <div className="bg-[#1818184d] p-4 rounded-full">
                <Image src={VideoPauseSVG} width={48} height={48} alt="video puse icon"/>
              </div>)}
            {videoState === VideoState.LOADING && 
            (
            <div className="bg-[#1818184d] p-4 rounded-full">
              <Image className="animate-spin" src={VideoLodingSVG} width={48} height={48} alt="video puse icon"/>
            </div>)}
          </div>
        </div>

        <div className={videoState === VideoState.STOPPED ? "w-11/12 mx-4 pb-4 transition-all" : "w-fulltransition-all"}>
          <div className={videoState === VideoState.STOPPED ? "h-4 flex items-center justify-center" : ""}>
            <div className={videoState === VideoState.STOPPED ? "relative w-full h-1 flex items-center bg-gray-300 transition-all" : "relative w-1-full h-1 flex items-center bg-gray-300 bottom-0 transition-all"}>
              <VideoRange durarion={duration} currentTime={currentTime} isPaused={videoState === VideoState.STOPPED} onChange={handleChange} onDragStart={handleEnableDrag} onDragEnd={handleDisableDrag}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}