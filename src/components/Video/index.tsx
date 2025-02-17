import { VideoContextValues, VideoStates } from "@/Context/Video/types";
import useVideoContext from "@/Context/Video/VideoContext";
import VideoControl from "./VideoControl";
import VideoPlayback from "./VideoPlayback";
import VideoRange from "./VideoRange";
import style from "./style.module.css";
import { useRef } from "react";

interface VideoPrps {
  active: boolean,
  slideScreenRef: (refNode: HTMLDivElement) => void,
  videoUrl: string | null,
  postUrl: string | null
}

export default function Video({ slideScreenRef, active, videoUrl, postUrl }: Readonly<VideoPrps>) {
  const videoContext: VideoContextValues = useVideoContext();

  function handleClick(): void {
    switch (videoContext.videoState) {
      case VideoStates.STOPPED:
      case VideoStates.NOT_STARTED: {
        videoContext.setVideoState(VideoStates.PLAYING);
        return;
      }
      case VideoStates.PLAYING: {
        videoContext.setVideoState(VideoStates.STOPPED);
        return;
      }
    }
  }

  return (
    <div className="relative w-full h-full">
        <VideoPlayback active={active} videoUrl={videoUrl} postUrl={postUrl}/>
      <div className={`${style.controls} absolute flex flex-col w-full h-full`}>
        <div ref={slideScreenRef} className="flex-grow w-full h-full" onClick={handleClick}>
          <VideoControl/>
        </div>
        <div className="w-full pt-11 pb-7 px-6">
          <VideoRange/>
        </div>
      </div>
    </div>
  );
}