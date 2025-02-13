import { SyntheticEvent, useEffect, useRef } from "react";

import style from "./style.module.css";

import { VideoContextValues, VideoStates } from "@/Context/Video/types";
import useVideoContext from "@/Context/Video/VideoContext";

export default function VideoPlayback() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoContext: VideoContextValues = useVideoContext();

  useEffect(() => {
    if (!videoRef.current) { return; }

    if (!videoContext.video) {
      videoContext.setVideo(videoRef.current);
    }
  }, [videoRef.current]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current) {
        videoContext.setCurrentTime(videoRef.current.currentTime);
      }
    }, 100);
    
    return function() { 
      return clearInterval(interval);
    }
  }, [videoContext.currentTime]);

  function pausePlayInactiveVideo() {
    if (!videoRef.current) { return; }

    if (videoContext.isActive) {
      videoContext.setVideoState(VideoStates.PLAYING);

      return;
    }

    videoContext.setVideoState(VideoStates.STOPPED);
  }

  useEffect(() => {
    pausePlayInactiveVideo();
  }, [videoContext.isActive]);

  function handlePlayerState(): void {
    if (!videoRef.current) { return; }

    switch (videoContext.videoState) {
      case VideoStates.PLAYING: {
        videoRef.current.play()
        .catch(() => {
          videoContext.setVideoState(VideoStates.NOT_STARTED)
        });
        return;
      }
      case VideoStates.STOPPED: {
        videoRef.current.pause();
        return;
      }
    }
  }

  useEffect(() => {
    handlePlayerState();
  }, [videoContext.videoState]);

  function handleLoadStart(): void {
    videoContext.setVideoState(VideoStates.LOADING);
  }

  function handleWaiting(): void {
    videoContext.setVideoState(VideoStates.LOADING);
  }

  function handleCanPlayThrough(): void {
    videoContext.setVideoState(VideoStates.PLAYING);
  }
  
  function handleDurationChange(event: SyntheticEvent<HTMLVideoElement>): void {
    videoContext.setDuration(event.currentTarget.duration);
  }

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full">
      <video ref={videoRef} className={`${style.player} player w-full h-full mx-auto object-cover`}
        onLoadStart={handleLoadStart}
        onWaiting={handleWaiting}
        onCanPlayThrough={handleCanPlayThrough}
        onDurationChange={handleDurationChange}
        preload="metadata" 
        disablePictureInPicture 
        playsInline
        poster="https://www.videoplaceholder.com/static/BigBuckBunny-4979b146b7d4a6c16ae8badfe426fb6e.jpg">
        <source className="object-cover" src={"https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"} type="video/mp4"/>
      </video>
    </div>
  );
}