"use server"

import Link from "next/link";

interface NovelEpisode {
  id: string,
  name: string
  url: string
}

interface NovelEpisodesProps {
  novelSlug: string,
  episodes: NovelEpisode[]
}

export default async function NovelEpisodes({ novelSlug, episodes }: NovelEpisodesProps) {
  return (
    <div className="grid grid-cols-6 gap-y-3 gap-x-1">
      {episodes.map((episode, index) => index === 0? 
      (<Link key={index} href={`/watch/${novelSlug}/?episode=${episode.id}`} className="w-12 h-12 text-center font-semibold rounded bg-primary py-1 leading-10">{index + 1}</Link>) : 
      (<Link key={index} href={`/watch/${novelSlug}/?episode=${episode.id}`} className="w-12 h-12 text-center font-semibold rounded bg-background-secondary py-1 leading-10">{index + 1}</Link>))}
    </div>
  );
}