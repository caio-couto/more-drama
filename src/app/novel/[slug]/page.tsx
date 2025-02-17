import Advertising from "@/components/Advertising";
import NovelCard from "@/components/NovelCard";
import NovelEpisodes from "@/components/NovelEpisodes";
import NovelResume from "@/components/NovelResume";
import { poolConnection } from "@/lib/database";
import { episodesTable, novelsTable } from "@/lib/database/schema";
import { asc, eq } from "drizzle-orm";

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
    <Advertising/>
    <div className="my-10">
      <NovelCard novelName={novel.name} episodeSlug={episodes[0].slug} novelThumbUrl={novel.thumbnailUlr}/>
      <div className="mx-4 mb-5">
        <div className="max-w-fit rounded mb-4 py-2 px-4 font-semibold bg-primary">Episódios</div>
        <NovelEpisodes novelSlug={novel.slug} episodes={episodes}/>
      </div>
      <NovelResume>
        <div dangerouslySetInnerHTML={{ __html: novel.description }}></div>
      </NovelResume>
    </div>
    </>
  );
}
