"use server"

import { ListEpisode } from "@/app/api/novel/[slug]/route";
import Link from "next/link";

interface NovelEpisodesProps {
  novelSlug: string,
  episodes: ListEpisode[]
}

export default async function NovelEpisodes({ episodes }: NovelEpisodesProps) {
  return (
    <div className="grid grid-cols-6 gap-y-3 gap-x-1">
      {episodes.map((episode, index) => index === 0? 
      (<Link key={index} href={`/shorts/${episode.slug}`} className="w-12 h-12 text-center font-semibold rounded bg-primary py-1 leading-10">{index + 1}</Link>) : 
      (<Link key={index} href={`/shorts/${episode.slug}`} className="w-12 h-12 text-center font-semibold rounded bg-background-secondary py-1 leading-10">{index + 1}</Link>))}
    </div>
  );
}