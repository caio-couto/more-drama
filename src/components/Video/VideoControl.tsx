import Image from "next/image";

import VideoLoadingSVG from "@public/video-loading.svg";
import VideoPauseSVG from "@public/video-pause.svg";
import VideoPlaySVG from "@public/video-play.svg";
import VideoRestartSVG from "@public/video-restart.svg";
import SwipeUpWEBM from "@public/swipe-up.gif";

import { VideoContextValues, VideoStates } from "@/Context/Video/types";
import useVideoContext from "@/Context/Video/VideoContext";

export default function VideoControl() {
  const videoContext: VideoContextValues = useVideoContext();

  return (
    <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 p-3">

      {videoContext.videoIndex === 0 && videoContext.videoState !== VideoStates.PLAYING && (
      <div className="absolute w-32 h-32 top-1/2 -translate-y-1/2 -right-56 -translate-x-1/2">
        <Image src={SwipeUpWEBM} alt="swipe up" width={120} height={120} unoptimized/>
      </div>)}
      
      
      {videoContext.videoState === VideoStates.LOADING ? 
      (
        <div className="bg-gray-800 bg-opacity-40 p-3 rounded-2xl">
          <div className="animate-spin">
            <Image src={VideoLoadingSVG} alt="video loading icon" width={42} height={42}/>
          </div>
        </div>
      ):
      videoContext.videoState === VideoStates.NOT_STARTED ?
      (
        <div className="bg-gray-800 bg-opacity-40 p-3 rounded-2xl">
          <Image src={VideoPlaySVG} alt="video play icon" width={32} height={32}/>
        </div>
      ):
      videoContext.videoState === VideoStates.STOPPED && videoContext.currentTime === videoContext.duration ?
      (
        <div className="bg-gray-800 bg-opacity-40 p-3 rounded-2xl">
          <Image src={VideoRestartSVG} alt="video pause icon" width={42} height={42}/>
        </div>
      ):
      videoContext.videoState === VideoStates.STOPPED ?
      (
        <div className="bg-gray-800 bg-opacity-40 p-3 rounded-2xl">
          <Image src={VideoPauseSVG} alt="video pause icon" width={32} height={32}/>
        </div>
      ): ""}
    </div>
  );
}
