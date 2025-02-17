import Link from "next/link";
import { MouseEvent } from "react";
import Advertising from "../Advertising";

interface NextEpisodeProps {
  handleClick(event: MouseEvent<HTMLButtonElement>): void
}

export default function NextEpisode({ handleClick  }: NextEpisodeProps) {
  return (
    <div className="w-full h-full pt-6 bg-black">
      <Advertising/>
      <div className="py-5 px-4">
        <h2>What is Lorem Ipsum</h2>
        <p>
          Lorem Ipsum is simply dummy text of the printing and 
          typesetting industry. Lorem Ipsum has been the industry&apos;s 
          standard dummy text ever since the 1500s, when an unknown 
          printer took a galley of type and scrambled it to 
          make a type specimen book.
        </p>
      </div>
      <div className="mx-2">
        <button onClick={handleClick} className="w-full mb-4 py-4 px-4 rounded-3xl bg-primary font-semibold cursor-pointer">
          Próximo episódio
        </button>
        <Link className="block text-center underline" href={"/"}>Todos os episódios</Link>
      </div>
    </div>
  );
}