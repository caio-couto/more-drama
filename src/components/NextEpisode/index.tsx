import Link from "next/link";
import { MouseEvent, useEffect } from "react";
import Advertising from "../Advertising";
import { Novel } from "@/app/shorts/[slug]/page";

interface NextEpisodeProps {
  slideScreenRef: ((refNode: HTMLDivElement) => void) | undefined,
  active: boolean,
  novel: Novel,
  handleClick(event: MouseEvent<HTMLButtonElement>): void
}

export default function NextEpisode({ slideScreenRef, active, novel, handleClick  }: NextEpisodeProps) {
  return (
    <div className="w-full h-full pt-14 bg-black relative">
      <div ref={slideScreenRef} className="relative top-1/2">
        <div className="px-4">
          <h2 className="font-semibold text-lg mb-2">Você está assistindo:</h2>
          <p>
            Não desafie a senhora Bilionária: Uma poderosa empresária que busca 
            vingança após ser abandonada, casando-se impulsivamente com o chefe de seu ex.
          </p>
        </div>
      <div className="w-full px-2 py-3 bg-black mt-12">
        <button data-av-rewarded="true" onClick={handleClick} className="w-full mb-4 py-4 px-4 rounded-3xl bg-primary font-semibold cursor-pointer">
          Próximo episódio
        </button>
      </div>
      </div>
    </div>
  );
}