import { ChangeEvent, MouseEvent, TouchEvent, useEffect, useState } from "react";

import style from "./style.module.css";

import { VideoContextValues } from "@/Context/Video/types";
import useVideoContext from "@/Context/Video/VideoContext";

export default function VideoRange() {
  const videoContext: VideoContextValues = useVideoContext();
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    if (isDragging) {
      videoContext.setEnableDrag(false); 
    } else {
      videoContext.setEnableDrag(true); 
    }
  }, [isDragging]);
  
  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    if (!videoContext.video) { return; }
    
    videoContext.video.currentTime = parseFloat(event.currentTarget.value);
  }

  function enableDrag(): void {
    setIsDragging(true);
  }

  function disableDrag(value: number): void {
    setIsDragging(false);

    if (!videoContext.video) { return; }

    videoContext.video.currentTime = value;
  }

  function handleMouseDown(): void {
    enableDrag();
  }

  function handleTouchSatart(): void {
    enableDrag();
  }

  function handleMouseUp(event: MouseEvent<HTMLInputElement>): void {
    disableDrag(parseFloat(event.currentTarget.value));
  }

  function handleTouchEnd(event: TouchEvent<HTMLInputElement>): void {
    disableDrag(parseFloat(event.currentTarget.value));
  }

  return (
    <div className={"relative flex-1"}>
      <input type="range" className={`relative ${style.slider} w-full h-2 bg-transparent appearance-none overflow-hidden text-primary cursor-pointer`} 
      onChange={handleChange} 
      onMouseDown={handleMouseDown} 
      onTouchStart={handleTouchSatart} 
      onMouseUp={handleMouseUp} 
      onTouchEnd={handleTouchEnd} 
      min={0} 
      max={Math.round(videoContext.duration)} 
      value={Math.round(videoContext.currentTime)}/>
    </div>
  );
}