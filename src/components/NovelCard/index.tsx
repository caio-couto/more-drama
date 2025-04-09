"use server"

import Image from "next/image";
import Link from "next/link";

import NovelCardBorderPNG from "@public/novel-card-border.png";
import VidePlaySVG from "@public/video-play.svg";

interface NovelCardProps {
  novelName: string,
  redirect: string
  novelThumbUrl: string | null
}

export default async function NovelCard({ novelName, redirect, novelThumbUrl }: NovelCardProps) {
  return (
    <div className="mb-4">
      <div className="max-w-80 mx-auto text-3xl text-primary font-semibold text-center mb-4">
        {novelName}
      </div>
      {novelThumbUrl && (
      <div className="relative">
        <Link className="" href={redirect}>
            <div className="relative w-36 h-64 rounded-[11px] overflow-hidden mx-auto">
              <Image src={NovelCardBorderPNG} className="mx-auto absolute w-full h-full" alt="novel card border" width={149} height={265}/>
              { novelThumbUrl && (<div className="">
                <Image src={novelThumbUrl} className="mx-auto" alt="novel image" width={149} height={265} priority={true} quality={100}/>
                </div>)}
            </div>
        </Link>
      </div>
      )}
    </div>
  );
}