import { ChangeEvent, MouseEvent, useState } from "react";

import style from "./style.module.css";

interface VideoRangeProps {
  durarion: number,
  currentTime: number,
  isPaused: boolean,
  onChange?(value: number): void,
  onDragStart?(): void,
  onDragEnd?(value: number): void,
}

export default function VideoRange({ durarion, currentTime, isPaused, onChange, onDragStart, onDragEnd  }: VideoRangeProps) {  
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    if (onChange) {
      onChange(parseFloat(event.currentTarget.value));
    }
  }

  function handleMouseDown(): void {
    if (onDragStart) { onDragStart(); }
    setIsDragging(true);
  }

  function handleMouseUp(event: MouseEvent<HTMLInputElement>): void {
    if (onDragEnd) { onDragEnd(+event.currentTarget.value); }
    setIsDragging(false);
  }
  
  return (
    <div className={`relative flex-1 bg-white flex items-center rounded`}>
      <input className={`${style.slider} w-full h-${isPaused? "3":"1"} bg-transparent appearance-none`} onChange={handleChange} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} type="range" min={0} max={durarion} value={currentTime} style={{ zIndex: isDragging ? 1 : 2 }}/>
      <div className="absolute w-6 h-6 -translate-x-1 bg-primary rounded-full cursor-grab" style={{ marginLeft: `${(currentTime / durarion) * 100}%`, visibility: isPaused ? "visible" : "hidden" }}>
        <div className="absolute bottom-12 py-1 px-2 tracking-wider rounded bg-slate-600 left-1/2 -translate-x-1/2">{`${Math.round(currentTime/60)}:${Math.round(currentTime % 60)}`}</div>
      </div>
      <div className={`absolute h-${isPaused? "3":"1"} bg-primary rounded`} style={{ width: `${(currentTime / durarion) * 100}%` }}></div>
    </div>
  );
}