/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import NextEpisode from "@/components/NextEpisode";
import Video from "@/components/Video";
import useScreenCarousel from "@/hooks/useScreenCarousel";
import LogoSVG from "@public/logo.svg";
import DotsSVG from "@public/dots.svg";
import EpisodesListSVG from "@public/episodes-list.svg"
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";

type WindowSize = {
  width: number,
  height: number
}

interface NovelEpisode {
  id: string,
  name: string
  url: string
}

interface Novel {
  id: string,
  name: string,
  slug: string,
  thumbUrl: string,
  description: string,
  episodes: NovelEpisode[]
}

enum CardType {
  CONTENT,
  ADVERTISING
}

type Card<T> = {
  type: CardType
  data?: T
}

interface NovelParams {
  slug: string
}

interface NovelProps {
  params: Promise<NovelParams>
}

export default function Novel({ params }: NovelProps) {
  const [windowSize, setWindowSize] = useState<WindowSize>({ width: 0, height: 0 });
  const [screenRef, activeIndex, next, prev, enableDrag] = useScreenCarousel<HTMLDivElement>();
  const [cards, setCards] = useState<Card<NovelEpisode>[]>([]);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const [episode, setEpisode] = useState<string>(searchParams.get("episode")?? "0");

  useEffect(() => {
    const episodes: NovelEpisode[] = [{
      id: "0",
      name: "Episódio 1",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    }, {
      id: "1",
      name: "Episódio 2",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
    }, {
      id: "2",
      name: "Episódio 3",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    }, {
      id: "3",
      name: "Episódio 4",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    }, {
      id: "4",
      name: "Episódio 5",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    }];
    
    const novels: Card<NovelEpisode>[] = []

    const slice: NovelEpisode[] = episodes.slice(episodes.indexOf(episodes.find((episodeFind) => episodeFind.id == episode)!))

    for (const episode of slice) {
      novels.push({
        type: CardType.CONTENT,
        data: episode
      });

      novels.push({
        type: CardType.ADVERTISING
      });
    }

    setCards(novels);
  }, []);

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
    if (cards.length > 0) {
      if (cards[activeIndex].type === CardType.ADVERTISING) {
        enableDrag(false);
      } else {
        enableDrag(true);
      }
    }
  }, [activeIndex]);

  return (
    <main className="relative">
      <div className="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 overflow-visible">
        <div className="absolute top-0 z-10 flex items-center bg-[#1818184d] justify-between p-3 w-full">
          <Link href={"/novels"}>
            <Image src={LogoSVG} alt="logo icon"/>
          </Link>

          <div className="relative">
            <div className="cursor-pointer" onClick={() => setIsOpenMenu(!isOpenMenu)}>
              <Image src={DotsSVG} alt="dots icon" width={32} height={32}/>
            </div>
            {isOpenMenu && (<div className="absolute min-w-48 p-3 right-0 top-14 bg-[#1818184d] rounded border-2">
              <ul>
                <li>
                  <Link href={`/novel/nome-da-novela`} className="flex gap-2">
                    <Image src={EpisodesListSVG} alt="episodes list icon" width={24} height={24}/>
                    <p>Lista de episódios</p>
                  </Link>
                </li>
              </ul>
            </div>)}
          </div>
        </div>
        <div ref={screenRef} className="screen max-w-md md:max-h-[844px] mx-auto overflow-hidden" style={{ width: windowSize.width, height: windowSize.height }}>
          {cards.length > 0 && cards.map((card, index) => 
            card.type === CardType.CONTENT ? 
            (<Video key={index} index={index} active={activeIndex === index} videoUrl={card.data!.url}/>) :
            (<NextEpisode handleClick={handleClick} key={index}/>)
          )}
        </div>
      </div>
    </main>
  );
}