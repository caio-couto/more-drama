"use client"

import { ListSlugEpisode } from "@/app/api/episode/[slug]/route";
import VideoContextProvider from "@/Context/Video/VideoContextProvider";
import useCarousel from "@/hooks/useCarousel";
import { useState, useEffect } from "react";
import Card from "../Card";
import Video from "../Video";
import NextEpisode from "../NextEpisode";

const PAGINATION: number = 4;

interface CarouselProps {
  slug: string,
  episodes: ListSlugEpisode[]
}

enum CarouselCardType {
  VIDEO,
  ADVERTISING
}

interface CarouselCard {
  type: CarouselCardType,
  data?: ListSlugEpisode
}

export default function Carousel({ slug, episodes }: CarouselProps) {
  const [cards, setCards] = useState<CarouselCard[]>([]);
  const [screenRef, slideScreenRef, screen, cardIndex, nextSlide, prevSlide, setEnableDrag] = useCarousel<HTMLDivElement>();

  function generateCards(): void {
    const shortIndex: number = episodes.findIndex((episode) => episode.slug === slug);
    const shortsSlice: ListSlugEpisode[] = episodes.slice(shortIndex, PAGINATION < episodes.length - shortIndex ? PAGINATION : undefined);
    
    const shortCards: CarouselCard[] = [];
    
    for (const short of shortsSlice) {
      shortCards.push({
        type: CarouselCardType.VIDEO,
        data: short
      });
      
      shortCards.push({ type: CarouselCardType.ADVERTISING });
    }

    setCards(shortCards);
  }

  useEffect(() => {
    generateCards();
  }, []);

  function changePathByCurrentCardId(): void {
    if (!cards[cardIndex] || cards[cardIndex].type === CarouselCardType.ADVERTISING) { return; }

    window.history.pushState(null, "", cards[cardIndex].data!.slug);
  }
  
  useEffect(() => {
    changePathByCurrentCardId();
  }, [cardIndex]);

  function generateInfiniteScroll(): void {    
    if (!screen || cardIndex < episodes.length) { return; }     

    setCards((cards) => {
      if (cards.length < PAGINATION) { return cards; }      

      const startElement: number = episodes.indexOf(cards[cards.length - 2].data!);
      
      const endElement: number =  cards.length / 2 + PAGINATION < episodes.length ?  episodes.indexOf(cards[cards.length - 2 + PAGINATION].data!) : -1;

      if (endElement === -1) {
        const shortCards: CarouselCard[] = [];

        for (const short of episodes.slice(startElement + 1, undefined)) {
          shortCards.push({
            type: CarouselCardType.VIDEO,
            data: short
          });
          
          shortCards.push({ type: CarouselCardType.ADVERTISING });
        }

        return [...cards, ...shortCards];
      }

      const shortCards: CarouselCard[] = [];

      for (const short of episodes.slice(startElement + 1, endElement)) {
        shortCards.push({
          type: CarouselCardType.VIDEO,
          data: short
        });
        
        shortCards.push({ type: CarouselCardType.ADVERTISING });
      }
      

      return [...cards, ...shortCards];
    });
  }

  useEffect(() => {
    generateInfiniteScroll();    
  }, [screen, cardIndex]);

  function disableDragInAdvertising(): void {
    if (!cards[cardIndex]) { return };

    if (cards[cardIndex].type === CarouselCardType.VIDEO) {
      setEnableDrag(true);
    } else {
      setEnableDrag(false);
    }
  }

  useEffect(() => {
    disableDragInAdvertising();
  }, [cardIndex]);

  function handleCLick(): void {
    nextSlide();
  }

  return (
    <div className="overflow-hidden h-full">
      <div ref={screenRef} className="absolute w-full">
        {cards.map((card, index) => (
            <Card key={index} hidden={!(index <= cardIndex + 1 && index >= cardIndex - 1)}>
              { card.type === CarouselCardType.VIDEO ?
              (<VideoContextProvider>
                <>
                  <Video slideScreenRef={slideScreenRef} active={cardIndex === index} videoUrl={card.data!.videoUrl} postUrl={card.data!.thumbnailUrl}/>
                </>
              </VideoContextProvider>) :
              (<NextEpisode handleClick={handleCLick}/>)}
            </Card>
        ))}
      </div>
    </div>
  );
}