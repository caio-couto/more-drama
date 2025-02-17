import { ListNovelResponse } from "@/app/api/novel/[slug]/route";
import Advertising from "@/components/Advertising";
import NovelCard from "@/components/NovelCard";
import NovelEpisodes from "@/components/NovelEpisodes";
import NovelResume from "@/components/NovelResume";

async function getNovel(novelSlug: string): Promise<ListNovelResponse> {
  return new Promise<ListNovelResponse>((resolve, reject) => {
    fetch(`${process.env.APP_URL}/api/novel/${novelSlug}`)
    .then((data) => data.json())
    .then((data: ListNovelResponse) => {
      resolve(data);
    })
    .catch((error) => reject(error));
  });
}

interface NovelProps {
  params: Promise<{ slug: string }>
}

export default async function Novel({ params }: NovelProps) {
  const { slug } = await params;

  const { novel, episodes }: ListNovelResponse = await getNovel(slug);

  console.log(novel, episodes);

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
