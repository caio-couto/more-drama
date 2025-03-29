"use client"

import VideoContextProvider from "@/Context/Video/VideoContextProvider";
import useCarousel from "@/hooks/useCarousel";
import { useState, useEffect } from "react";
import Card from "../Card";
import Video from "../Video";
import NextEpisode from "../NextEpisode";
import { Episode, Novel } from "@/app/shorts/[slug]/page";

const PAGINATION: number = 4;

interface CarouselProps {
  slug: string,
  novel: Novel
  episodes: Episode[]
}

enum CarouselCardType {
  VIDEO,
  ADVERTISING
}

interface CarouselCard {
  type: CarouselCardType,
  data?: Episode
}

export default function Carousel({ slug, novel, episodes }: CarouselProps) {
  const [cards, setCards] = useState<CarouselCard[]>([]);
  const [paginationOffset, setPaginationOffset] = useState<number>(1);
  const [screenRef, slideScreenRef, screen, cardIndex, nextSlide, prevSlide, setEnableDrag] = useCarousel<HTMLDivElement>();

  function generateCards(): void {
    const shortIndex: number = episodes.findIndex((episode) => episode.slug === slug);
    const shortsSlice: Episode[] = episodes.slice(shortIndex, PAGINATION < episodes.length - shortIndex ? shortIndex + PAGINATION : undefined);
    
    const shortCards: CarouselCard[] = [];
    
    for (const short of shortsSlice) {
      shortCards.push({
        type: CarouselCardType.VIDEO,
        data: short
      }, { type: CarouselCardType.ADVERTISING });
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
    if (!screen || (cardIndex + 1) / 2 < PAGINATION * paginationOffset || episodes.length < PAGINATION) { return; }     

    const startElement: number = episodes.indexOf(cards[cards.length - 2].data!);
    
    const endElement: number =  cards.length / 2 < episodes.length ?  episodes.indexOf(episodes[startElement + PAGINATION + 1]) : -1;
    
    setPaginationOffset((paginationOffset) => paginationOffset += 1);

    if (endElement === -1) {
      const shortCards: CarouselCard[] = [];
      
      for (const short of episodes.slice(startElement + 1, undefined)) {
        shortCards.push({
          type: CarouselCardType.VIDEO,
          data: short
        }, { type: CarouselCardType.ADVERTISING });
      }
      
      return setCards([...cards, ...shortCards]);
    }

    const shortCards: CarouselCard[] = [];

    for (const short of episodes.slice(startElement + 1, endElement)) {
      shortCards.push({
        type: CarouselCardType.VIDEO,
        data: short
      }, { type: CarouselCardType.ADVERTISING });
    }
    
    return setCards([...cards, ...shortCards]);
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
    <div className="h-full">
      <div ref={screenRef} className="absolute w-full">
        {cards.map((card, index) => (
          <Card key={index} hidden={!(index <= cardIndex + 1 && index >= cardIndex - 1) && card.type !== CarouselCardType.ADVERTISING}>
            { card.type === CarouselCardType.VIDEO ?
            (<VideoContextProvider>
              <Video slideScreenRef={cardIndex === index ? slideScreenRef : undefined} active={cardIndex === index} videoUrl={card.data!.videoUrl} postUrl={card.data!.thumbnailUrl}/>
            </VideoContextProvider>) :
            (<NextEpisode slideScreenRef={cardIndex === index ? slideScreenRef : undefined} active={cardIndex === index} novel={novel} handleClick={handleCLick}/>)}
          </Card>
        ))}
      </div>
    </div>
  );
}