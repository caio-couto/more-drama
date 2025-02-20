import { ListSlugEpisode } from "@/app/api/episode/[slug]/route";
import Carousel from "@/components/Carousel";
import CarouselHeader from "@/components/CarouselHeader";
import useWindowSize, { MAX_SCREEN_HEIGHT, WindowSize } from "@/hooks/useWindowSize";
import { poolConnection } from "@/lib/database/connection";
import { episodesTable, novelsTable } from "@/lib/database/schema";
import { asc, eq, or } from "drizzle-orm";
import { ResolvingMetadata, Metadata } from "next";

type StaticEpisode = {
  slug: string
}

export function generateStaticParams(): Promise<StaticEpisode[]> {
  return new Promise((resolve, reject) => {
    poolConnection
    .select({
      slug: episodesTable.slug
    })
    .from(episodesTable)
    .then((episodes: StaticEpisode[]) => { resolve(episodes) })
    .catch((error) => reject(error));
  });
}

type Props = {
  params: Promise<StaticEpisode>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

type MetadataEpisode = {
  name: string,
  thumbnailUrl: string | null
}

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata ): Promise<Metadata> {
  const slug: string = (await params).slug;
 
  return new Promise<Metadata>((resolve, reject) => {
    poolConnection 
    .select({
      name: episodesTable.name,
      thumbnailUrl: episodesTable.thumbnailUrl
    })
    .from(episodesTable)
    .where(eq(episodesTable.slug, slug))
    .then(async (episode: MetadataEpisode[]) => {
      const previousImages = (await parent).openGraph?.images || [];
     
      const metadata: Metadata =  {
        title: episode[0].name,
        openGraph: {
          images: episode[0].thumbnailUrl ?[episode[0].thumbnailUrl, ...previousImages] : [...previousImages],
        },
      }

      resolve(metadata);
    })
    .catch((error) => reject(error));
  });
}

export type Episode = {
  id: number;
  name: string;
  slug: string;
  episode: number;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  novelId: number;
}

async function getEpisodesBySlug(episodeSlug: string): Promise<Episode[]> {
  return new Promise<Episode[]>(async (resolve, reject) => {
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
    .then((episodes: Episode[]) => { resolve(episodes); });
  });
}

export type Novel = {
  name: string,
  description: string,
  slug: string,
  thumbnailUrl: string | null
}

async function getNovelByEpisodeSlug(episodeSlug: string): Promise<Novel> {
  return new Promise<Novel>(async (resolve, reject) => {
    poolConnection
    .select({
      name: novelsTable.name,
      description: novelsTable.description,
      slug: novelsTable.slug,
      thumbnailUrl: novelsTable.thumbnailUrl,
    })
    .from(novelsTable)
    .innerJoin(episodesTable, eq(novelsTable.id, episodesTable.novelId))
    .where(eq(episodesTable.slug, episodeSlug))
    .then((novel: Novel[]) => resolve(novel[0]))
    .catch((error) => reject(error));
  });
}

interface ShortVideoProps {
  params: Promise<{ slug: string }>
}

export default async function ShortVideo({ params }: ShortVideoProps) {
  const { slug } = await params;

  const episodes: ListSlugEpisode[] = await getEpisodesBySlug(slug);
  const novel: Novel = await getNovelByEpisodeSlug(slug);

  return (
    <div className="relative overflow-hidden bg-black top-0 left-0 right-0 bottom-0 pb-0  md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 md:max-w-mobile-screen-w h-full md:max-h-mobile-screen-h" style={{ height: MAX_SCREEN_HEIGHT }}>
      <CarouselHeader novel={novel} />
      <div className="bg-transparent overflow-hidden">
        <Carousel slug={slug} novel={novel} episodes={episodes}/>
      </div>
    </div>
  );
}