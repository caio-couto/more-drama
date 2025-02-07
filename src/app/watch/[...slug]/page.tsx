/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import NextEpisode from "@/components/NextEpisode";
import Video from "@/components/Video";
import useScreenCarousel from "@/hooks/useScreenCarousel";
import { useEffect, useState } from "react";

type WindowSize = {
  width: number,
  height: number
}

enum CardType {
  CONTENT,
  ADVERTISING
}

type Card<T> = {
  type: CardType
  data?: T
}

export default function Novel() {
  const [windowSize, setWindowSize] = useState<WindowSize>({ width: 0, height: 0 });
  const [screenRef, activeIndex, next, prev, enableDrag] = useScreenCarousel<HTMLDivElement>();

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


  function handleClick(): void {
  next()
  enableDrag(true);
  }

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  useEffect(() => {
    if (cards[activeIndex].type === CardType.ADVERTISING) {
      enableDrag(false);
    } else {
      enableDrag(true);
    }
  }, [activeIndex]);

  return (
    <main className="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 overflow-visible">
      <div ref={screenRef} className="screen max-w-md md:max-h-[844px] mx-auto overflow-hidden" style={{ width: windowSize.width, height: windowSize.height }}>
      {cards.map((card, index) => 
        card.type === CardType.CONTENT ? 
        (<Video key={index} index={index} active={activeIndex === index}/>) :
        (<NextEpisode handleClick={handleClick} key={index}/>)
      )}
    </div>
    </main>
  );
}