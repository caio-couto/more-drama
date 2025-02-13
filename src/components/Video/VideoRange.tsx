import { ChangeEvent, MouseEvent, TouchEvent, useContext, useEffect, useState } from "react";

import style from "./style.module.css";
import { VideoContextValues, VideoStates } from "@/Context/Video/types";
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
    console.log("touch end")
    disableDrag(parseFloat(event.currentTarget.value));
  }

  return (
    <div className={"bottom-0 w-11/12 mx-4 my-2"}>
      <div className={"h-4 flex items-center justify-center"}>
          <div className={"relative flex-1"}>
            <input type="range" className={`relative ${style.slider} w-full h-3 bg-transparent appearance-none overflow-hidden text-blue-600 cursor-pointer`} 
            onChange={handleChange} 
            onMouseDown={handleMouseDown} 
            onTouchStart={handleTouchSatart} 
            onMouseUp={handleMouseUp} 
            onTouchEnd={handleTouchEnd} 
            min={0} 
            max={videoContext.duration} 
            value={videoContext.currentTime}/>
          </div>
      </div>
    </div>
  );
}