"use server"

import Image from "next/image";
import Link from "next/link";

import NovelCardBorderPNG from "@public/novel-card-border.png";
import VidePlaySVG from "@public/video-play.svg";

interface NovelCardProps {
  novelName: string,
  episodeSlug: string
  novelThumbUrl: string | null
}

export default async function NovelCard({ novelName, episodeSlug, novelThumbUrl }: NovelCardProps) {
  return (
    <div className="mb-10">
      <div className="max-w-72 mx-auto text-2xl font-semibold text-center mb-4">
        {novelName}
      </div>
      <div className="relative">
        <Link className="" href={`/shorts/${episodeSlug}`}>
          <div className="min-w-[350px] min-h-[320px] mx-auto z-10">
            { novelThumbUrl && (<Image src={novelThumbUrl} className="mx-auto" alt="novel image" width={220} height={300} priority={true} quality={100}/>)}
            <div className="absolute w-[350px] -top-1.5 left-1/2 -translate-x-1/2">
              <Image src={NovelCardBorderPNG} className="mx-auto" alt="novel card border" width={350} height={320}/>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 p-3 rounded-full bg-[#1818184d] -translate-x-1/2">
              <Image src={VidePlaySVG} className="mx-auto" alt="novel card border" width={32} height={32}/>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}