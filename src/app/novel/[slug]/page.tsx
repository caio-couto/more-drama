import Advertising from "@/components/Advertising";
import NovelCard from "@/components/NovelCard";
import NovelEpisodes from "@/components/NovelEpisodes";
import NovelResume from "@/components/NovelResume";
import { poolConnection } from "@/lib/database/connection";
import { episodesTable, novelsTable } from "@/lib/database/schema";
import { asc, eq } from "drizzle-orm";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import NovelCardBorderPNG from "@public/novel-card-border.png";

interface StaticNovels {
  slug: string
}

export function generateStaticParams(): Promise<StaticNovels[]> {
  return new Promise((resolve, reject) => {
    poolConnection
    .select({
      slug: novelsTable.slug
    })
    .from(novelsTable)
    .then((novels: StaticNovels[]) => { resolve(novels); })
    .catch((error) => { reject(error); });
  });
}

type Props = {
  params: Promise<StaticNovels>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

type MetadataEpisode = {
  name: string,
  description: string,
  thumbnailUrl: string | null
}

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata ): Promise<Metadata> {
  const slug: string = (await params).slug;
 
  return new Promise<Metadata>((resolve, reject) => {
    poolConnection 
    .select({
      name: novelsTable.name,
      description: novelsTable.description,
      thumbnailUrl: novelsTable.thumbnailUrl
    })
    .from(novelsTable)
    .where(eq(novelsTable.slug, slug))
    .then(async (episode: MetadataEpisode[]) => {
      const previousImages = (await parent).openGraph?.images || [];
     
      const metadata: Metadata =  {
        title: episode[0].name,
        description: episode[0].description,
        openGraph: {
          images: episode[0].thumbnailUrl ?[episode[0].thumbnailUrl, ...previousImages] : [...previousImages],
        },
      }

      resolve(metadata);
    })
    .catch((error) => reject(error));
  });

}

export type ListNovel = {
  id: number,
  name: string,
  slug: string,
  description: string,
  thumbnailUlr: string | null
};

export type ListEpisode = {
  episode: number,
  slug: string
}

export interface ListNovelResponse {
  novel: ListNovel,
  episodes: ListEpisode[]
}

async function getNovel(novelSlug: string): Promise<ListNovelResponse> {
  return new Promise<ListNovelResponse>( async (resolve, reject) => {
    const novel: ListNovel[] = await poolConnection
      .select({
        id: novelsTable.id,
        name: novelsTable.name,
        slug: novelsTable.slug,
        description: novelsTable.description,
        thumbnailUlr: novelsTable.thumbnailUrl
      })
      .from(novelsTable)
      .where(eq(novelsTable.slug, novelSlug));

    const episodes: ListEpisode[] = await poolConnection
      .select({
        episode: episodesTable.episode,
        slug: episodesTable.slug
       })
      .from(episodesTable)
      .orderBy(asc((episodesTable.episode)), asc(episodesTable.season))
      .where((eq(episodesTable.novelId, novel[0].id)));

      resolve({ novel: novel[0], episodes });
  });
}

interface NovelProps {
  params: Promise<{ slug: string }>
}

export default async function Novel({ params }: NovelProps) {
  const { slug } = await params;

  const { novel, episodes }: ListNovelResponse = await getNovel(slug);

  return (
    <>
      <div className="my-2">
        <div className="mx-4 mb-5 text-center">
          <NovelCard novelName={novel.name} redirect={`shorts/${episodes[0].slug}`} novelThumbUrl={null}/>
          <p>Assista a seguir o mini drama {novel.name} com {episodes.length} episódios:</p>
        </div>
        <Advertising/>
        <Link className="" href={`/shorts/${episodes[0].slug}`}>
          <div className="relative w-36 h-64 overflow-hidden mx-auto">
            { novel.thumbnailUlr && (<div className="">
              <Image src={novel.thumbnailUlr} className="mx-auto" alt="novel image" width={156} height={265} priority={true} quality={100}/>
              </div>)}
          </div>
        </Link>
        <div className="mx-4 mb-5">
          <div className="max-w-fit rounded mb-4 mt-6 py-2 px-4 font-semibold bg-primary">Episódios</div>
          <NovelEpisodes novelSlug={novel.slug} episodes={episodes}/>
        </div>
        <NovelResume>
          <div dangerouslySetInnerHTML={{ __html: novel.description }}></div>
        </NovelResume>
      </div>
    </>
  );
}
