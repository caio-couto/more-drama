import { Context, createContext, useContext } from "react";
import { VideoContextValues } from "./types";

export const VideoContext: Context<VideoContextValues> = createContext<VideoContextValues>({} as VideoContextValues);

export default function useVideoContext(): VideoContextValues {
  return useContext<VideoContextValues>(VideoContext);
}