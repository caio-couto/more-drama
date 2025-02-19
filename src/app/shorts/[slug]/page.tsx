import { ListSlugEpisode, ListEpisodeSlugResponse } from "@/app/api/episode/[slug]/route";
import Carousel from "@/components/Carousel";
import CarouselHeader from "@/components/CarouselHeader";
import { poolConnection } from "@/lib/database/connection";
import { episodesTable, novelsTable } from "@/lib/database/schema";
import { asc, eq, or } from "drizzle-orm";

interface StaticEpisodes {
  slug: string
}

export function generateStaticParams(): Promise<StaticEpisodes[]> {
  return new Promise((resolve, reject) => {
    poolConnection
    .select({
      slug: episodesTable.slug
    })
    .from(episodesTable)
    .then((episodes: StaticEpisodes[]) => { resolve(episodes) })
    .catch((error) => reject(error));
  });
}

async function getEpisodesBySlug(episodeSlug: string): Promise<ListSlugEpisode[]> {
  return new Promise<ListSlugEpisode[]>(async (resolve, reject) => {
    poolConnection
    .select({
      id: episodesTable.id,
      name: episodesTable.name,
      slug: episodesTable.slug,
      episode: episodesTable.episode,
      thumbnailUrl: episodesTable.thumbnailUrl,
      videoUrl: episodesTable.videoUrl,
      novelId: episodesTable.novelId
    })
    .from(episodesTable)
    .innerJoin(novelsTable, eq(episodesTable.novelId, novelsTable.id))
    .orderBy(asc(episodesTable.episode))
    .where(or(eq(episodesTable.slug, episodeSlug), eq(episodesTable.novelId, novelsTable.id)))
    .then((episodes: ListSlugEpisode[]) => { resolve(episodes); });
  });
}

interface ShortVideoProps {
  params: Promise<{ slug: string }>
}

export default async function ShortVideo({ params }: ShortVideoProps) {
  const { slug } = await params;
  const episodes: ListSlugEpisode[] = await getEpisodesBySlug(slug);

  return (
    <>
      <CarouselHeader/>
      <div className="fixed bg-transparent top-0 left-0 right-0 bottom-0 pb-0 w-full md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 md:w-mobile-screen-w h-full md:h-mobile-screen-h overflow-hidden">
        <Carousel slug={slug} episodes={episodes}/>
      </div>
    </>
  );
}