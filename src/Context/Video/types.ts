import { Dispatch, SetStateAction } from "react";

export enum VideoStates {
  NOT_STARTED,
  PLAYING,
  STOPPED,
  LOADING
}


export interface VideoContextValues {
  videoState: VideoStates,
  setVideoState: Dispatch<SetStateAction<VideoStates>>,
  isActive: boolean,
  setIsActive: Dispatch<SetStateAction<boolean>>,
  currentTime: number,
  setCurrentTime: Dispatch<SetStateAction<number>>,
  enableDrag: boolean,
  setEnableDrag: Dispatch<SetStateAction<boolean>>,
  index: number,
  setIndex: Dispatch<SetStateAction<number>>,
  duration: number,
  setDuration: Dispatch<SetStateAction<number>>,
  video: HTMLVideoElement | null,
  setVideo: Dispatch<SetStateAction<HTMLVideoElement | null>>
}