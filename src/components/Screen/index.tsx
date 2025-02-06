/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import Video from "../Video";
import { useCallback, useEffect, useState, MouseEvent as ReactMouseEvent } from "react";
import NextEpisode from "../NextEpisode";

const DRAG_RESISTANCE: number = 8;

enum CardType {
  CONTENT,
  ADVERTISING
}

type Card<T> = {
  type: CardType
  data?: T
}

type ScreenSize = {
  width: number,
  height: number
}

interface ScreenProps {
  screenSize: ScreenSize 
}

export default function Screen({ screenSize }: ScreenProps) {
  const [screen, setScreen] = useState<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [enableDrag, setEnableDrag] = useState<boolean>(true);
  const [dragDistance, setDragDistance] = useState<number>(0);
  const [prevTouchPosition, setPrevTouchPosition] = useState<number>(0);
  const [screenHeight, setScreenHeight] = useState<number>(0);
  const [scrollPosition, setScrollPosition] = useState<number>(0)
  const [activeView, setActiveView] = useState<number>(0);

  const [cards, setCards] = useState<Card<string>[]>([{
    type: CardType.CONTENT,
    data: "blue"
  }, {
    type: CardType.ADVERTISING,
  }, {
    type: CardType.CONTENT,
    data: "yellow"
  }, {
    type: CardType.ADVERTISING,
  }, {
    type: CardType.CONTENT,
    data: "green"
  }, {
    type: CardType.ADVERTISING,
  }, {
    type: CardType.CONTENT,
    data: "red"
  }, {
    type: CardType.ADVERTISING,
  }, {
    type: CardType.CONTENT,
    data: "violet"
  }]);

  const ref = useCallback((refNode: HTMLDivElement) => {
    if (refNode) {
      setScreen(refNode);
    }
  }, []);

  function handleMouseDown(): void {
    setIsDragging(true);
  }

  function handleMouseUp(): void {
    setIsDragging(false);
  }

  function handleMouseMove(event: MouseEvent): void {
    if (!isDragging) { return; }
    setDragDistance((distance) => distance + event.movementY);
  }

  // handle mouse event listeners
  useEffect(() => {
    if (screen && enableDrag) {
      screen.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);
      screen.addEventListener("mousemove", handleMouseMove);
    }

    return function() {
      if (screen) {
        screen.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mouseup", handleMouseUp);
        screen.removeEventListener("mousemove", handleMouseMove);
      }
    }
  }, [isDragging, screen, enableDrag]);

  function handleTouchStart(event: TouchEvent): void {
    setPrevTouchPosition(event.touches[0].clientY);
    setIsDragging(true);
  }

  function handleTouchEnd(): void {
    setIsDragging(false);
  }

  function handleTouchMove(event: TouchEvent) {
    const newTouchPosition: number = event.changedTouches[0].clientY;
    
    if (isDragging) {
      setDragDistance((distance) => distance + newTouchPosition - prevTouchPosition);
    }

    setPrevTouchPosition(newTouchPosition);
  }

  useEffect(() => {
    if (screen) {
      screen.addEventListener('touchstart', handleTouchStart);
      screen.addEventListener('touchend', handleTouchEnd);
      screen.addEventListener('touchmove', handleTouchMove);
    }
    
    return function() {
      if (screen) {
        screen.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchend', handleTouchEnd);
        screen.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [isDragging, screen, prevTouchPosition]);

  // Set Screen Height
  const getScreenHeight = useCallback(() => {
    if (screen) {
      setScreenHeight(screen.getBoundingClientRect().height);
    }
  }, [screen]);

  function handleResize(): void {
    getScreenHeight();
  }

  useEffect(() => {
    getScreenHeight();
    window.addEventListener("resize", handleResize);

    return function() {
      window.removeEventListener("resize", handleResize);
    }
  }, [getScreenHeight, screen]);

 const dragResistance: number = screenHeight / DRAG_RESISTANCE;

 function scrollPositionCheck(position: number): number {
  if (!screen) { return 0; }

  if (position <= 0) {
    setActiveView(0);
    return 0;
  } else if (position >= screen.scrollHeight - screenHeight) {
    setActiveView(Math.round(screen.scrollHeight - screenHeight) / screenHeight);
    return screen.scrollHeight - screenHeight;
  } else {
    setActiveView(Math.round(position / screenHeight));
    return position;
  }
 }

 useEffect(() => {  
  if (isDragging) { return; }

  if (-dragDistance > dragResistance) {
    setScrollPosition((scrollPosition) => scrollPositionCheck(scrollPosition + screenHeight));

    if (screen && activeView !== screen.childElementCount - 1) {
      setEnableDrag(false);
    }
  } else if (dragDistance > dragResistance) {
    setScrollPosition((scrollPosition) => scrollPositionCheck(scrollPosition - screenHeight));
    
    setEnableDrag(false);
  }
  setDragDistance(0);
 }, [isDragging, activeView]);

 useEffect(() => {
  if (!screen) { return; }

  if (isDragging) {
    screen.scrollTo({ top: scrollPosition - dragDistance });
  } else {
    screen.scrollTo({ top: scrollPosition, behavior: "smooth" });
  }
 }, [dragDistance, isDragging, screen, scrollPosition]);

 function handleClick(_event: ReactMouseEvent<HTMLButtonElement>): void {
  setScrollPosition((scrollPosition) => scrollPositionCheck(scrollPosition + screenHeight));
  setEnableDrag(true);
 }

  return (
    <div ref={ref} className="screen overflow-hidden transition-transform" style={{ width: screenSize.width, height: screenSize.height }}>
      {cards.map((card, index) => 
        card.type === CardType.CONTENT ? 
        (<Video key={index} index={index} active={activeView === index}/>) :
        (<NextEpisode handleClick={handleClick} key={index}/>)
      )}
    </div>
  );
}
