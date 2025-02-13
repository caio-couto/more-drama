import { VideoContextValues, VideoStates } from "@/Context/Video/types";
import useVideoContext from "@/Context/Video/VideoContext";
import VideoControl from "./VideoControl";
import VideoPlayback from "./VideoPlayback";
import { Dispatch, SetStateAction, useEffect } from "react";
import VideoRange from "./VideoRange";

interface VideoPrps {
  active: boolean,
  index: number,
  setEnableDrag: Dispatch<SetStateAction<boolean>>
}

export default function Video({ active, index, setEnableDrag }: Readonly<VideoPrps>) {
  const videoContext: VideoContextValues = useVideoContext();

  useEffect(() => {
    videoContext.setIndex(index);
  }, []);

  useEffect(() => {
    videoContext.setIsActive(active);
  }, [active]);

  useEffect(() => {
    setEnableDrag(videoContext.enableDrag);
  }, [videoContext.enableDrag]);

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
      <div className="">
        <VideoPlayback/>
      </div>
      <div className="absolute flex flex-col w-full h-full">
        <div className="flex-grow w-full h-full z-20" onClick={handleClick}>
          <VideoControl/>
        </div>
        <div className="w-full pt-10 pb-8">
          <VideoRange/>
        </div>
      </div>
    </div>
  );
}