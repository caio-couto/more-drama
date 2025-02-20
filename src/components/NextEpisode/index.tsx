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
    <div className="w-full h-full pt-6 bg-black relative">
      <div ref={slideScreenRef} className="h-full">
        <Advertising/>
        <div className="py-5 px-4">
          <h2>What is Lorem Ipsum</h2>
          <p>
            Lorem Ipsum is simply dummy text of the printing and 
            typesetting industry. Lorem Ipsum has been the industry&apos
          </p>
        </div>
      </div>
      <div className="w-full px-2 py-3 absolute bottom-0 bg-black">
        <button onClick={handleClick} className="w-full mb-4 py-4 px-4 rounded-3xl bg-primary font-semibold cursor-pointer">
          Próximo episódio
        </button>
      </div>
    </div>
  );
}