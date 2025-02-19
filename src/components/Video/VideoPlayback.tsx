import { SyntheticEvent, useEffect, useRef } from "react";

import style from "./style.module.css";

import { VideoContextValues, VideoStates } from "@/Context/Video/types";
import useVideoContext from "@/Context/Video/VideoContext";

interface VideoPlaybackProps {
  active: boolean,
  videoUrl: string | null,
  postUrl: string | null
}

export default function VideoPlayback({ active, videoUrl, postUrl }: VideoPlaybackProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoContext: VideoContextValues = useVideoContext();

  useEffect(() => {
    if (!videoRef) { return; }

    function pauseVideoWhenBlurWindow(): void {
      videoContext.setVideoState(VideoStates.STOPPED);
    }

    function playVideoWhenFocusWindow(): void {
      videoContext.setVideoState(VideoStates.PLAYING);
    }

    window.addEventListener("blur", () => pauseVideoWhenBlurWindow());
    window.addEventListener("focus", () => playVideoWhenFocusWindow());

    return function() {
      window.removeEventListener("blur", () => pauseVideoWhenBlurWindow());
      window.removeEventListener("focus", () => playVideoWhenFocusWindow());
    };
  }, [videoRef]);

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

    if (videoContext.currentTime === videoContext.duration) {
      videoContext.setVideoState(VideoStates.STOPPED);
    }
    
    return function() { 
      return clearInterval(interval);
    }
  }, [videoContext.currentTime]);

  function pausePlayInactiveVideo() {
    if (!videoRef.current) { return; }

    if (active) {
      return videoContext.setVideoState(VideoStates.PLAYING);
    }

    videoContext.setVideoState(VideoStates.STOPPED);
  }

  useEffect(() => {
    pausePlayInactiveVideo();
  }, [active]);

  function handlePlayerState(): void {
    if (!videoRef.current) { return; }

    switch (videoContext.videoState) {
      case VideoStates.PLAYING: {
        if (!active) { return; }

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
  }, [videoContext.videoState, active]);

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
        autoPlay={false}
        poster={postUrl ?? "https://www.videoplaceholder.com/static/BigBuckBunny-4979b146b7d4a6c16ae8badfe426fb6e.jpg"}>
        {videoUrl && (<source className="object-cover" src={videoUrl} type="video/webm"/>)}
      </video>
    </div>
  );
}