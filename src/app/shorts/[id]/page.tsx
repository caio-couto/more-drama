"use client"

import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

import Card from "@/components/Card";
import Video from "@/components/Video";
import useCarousel from "@/hooks/useCarousel";
import VideoContextProvider from "@/Context/Video/VideoContextProvider";

const PAGINATION: number = 4;
const colors: string[] = ["blue", "red", "green", "violet", "yellow", "orange", "brown", "cyan", "magenta", "crimson", "pink", "gray", "gold", "indigo"];

export default function ShortVideo() {
  const pathName = usePathname();
  const [cards, setCards] = useState<string[]>([]);
  const [screenRef, screen, cardIndex, nextSlide, prevSlide, setEnableDrag] = useCarousel<HTMLDivElement>();

  function generateCardsById() {
    const shortsId: string = pathName.split("/")[2];
    const shortIndex: number = colors.indexOf(shortsId);
    const sliceColors: string[] = colors.slice(shortIndex, shortIndex + PAGINATION);
    setCards(sliceColors);
  }

  useEffect(() => { 
    generateCardsById();
  }, []);
  
  function changePathByCurrentCardId(): void {
    if (cards[cardIndex]) {
      window.history.pushState(null, "", cards[cardIndex]);
    }
  }

  useEffect(() => {
    changePathByCurrentCardId();
  }, [cardIndex, cards]);

  function generateInfiniteScroll(): void {
    if (!screen || cardIndex < screen.childElementCount - 1) { return; }

    setCards((cards) => {
      const startElement: number = colors.indexOf(cards[cards.length - 1]);
      const endElement: number = colors.indexOf(colors[cards.length - 1 + PAGINATION]);

      if (endElement === -1) {
        return [...cards, ...colors.slice(startElement + 1, undefined)];
      }

      return [...cards, ...colors.slice(startElement + 1, endElement)];
    });
  }

  useEffect(() => {
    generateInfiniteScroll();
  }, [screen, cardIndex]);

  function handleNextClick(): void {
    nextSlide();
  }

  function handlPrevClick(): void {
    prevSlide();
  }

  return (
      <div className="overflow-hidden h-full">
        <button className="absolute w-fit right-0 top-1/2 bg-fuchsia-500 z-20" onClick={handleNextClick}>Next</button>
        <button className="absolute w-fit left-0 top-1/2 bg-fuchsia-500 z-20" onClick={handlPrevClick}>Prev</button>
        <div ref={screenRef} className="absolute w-full">
          { cards.map((color, index) => (
            <Card key={index} active={index === cardIndex} hidden={!(index <= cardIndex + 1 && index >= cardIndex - 1)}>
              <VideoContextProvider>
                <Video active={index === cardIndex} index={index} setEnableDrag={setEnableDrag}/>
              </VideoContextProvider>
            </Card>
          )) }
        </div>
      </div>
  );
}