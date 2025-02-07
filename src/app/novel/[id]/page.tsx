import Advertising from "@/components/Advertising";
import NovelCard from "@/components/NovelCard";
import NovelEpisodes from "@/components/NovelEpisodes";
import NovelResume from "@/components/NovelResume";

interface NovelEpisode {
  id: string,
  name: string
  url: string
}

interface Novel {
  id: string,
  name: string,
  slug: string,
  thumbUrl: string,
  description: string,
  episodes: NovelEpisode[]
}

export async function generateStaticParams() {
  const novel: Novel[] = [{
    id: "0",
    name: "Não desafie a senhora Bilionária",
    slug: "nao-desafie-a-senhora-bilionaria",
    thumbUrl: "https://placehold.co/250x350",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione cupiditate distinctio voluptates repellat aspernatur beatae labore. Facilis, excepturi harum debitis sint incidunt corrupti aut cum molestias vero maiores ipsa accusantium!",
    episodes: [{
      id: "0",
      name: "Episódio 1",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    }, {
      id: "1",
      name: "Episódio 2",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    }, {
      id: "2",
      name: "Episódio 3",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    }, {
      id: "3",
      name: "Episódio 4",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    }, {
      id: "4",
      name: "Episódio 5",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    },]
  }]
  
  return novel;
}

async function getNovel(novelId: string): Promise<Novel> {
  const novels: Novel[] = [{
    id: "0",
    name: "Não desafie a senhora Bilionária",
    slug: "nao-desafie-a-senhora-bilionaria",
    thumbUrl: "https://placehold.co/250x350",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione cupiditate distinctio voluptates repellat aspernatur beatae labore. Facilis, excepturi harum debitis sint incidunt corrupti aut cum molestias vero maiores ipsa accusantium!",
    episodes: [{
      id: "0",
      name: "Episódio 1",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    }, {
      id: "1",
      name: "Episódio 2",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    }, {
      id: "2",
      name: "Episódio 3",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    }, {
      id: "3",
      name: "Episódio 4",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    }, {
      id: "4",
      name: "Episódio 5",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    }, {
      id: "5",
      name: "Episódio 6",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    }, {
      id: "6",
      name: "Episódio 7",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    }, {
      id: "7",
      name: "Episódio 8",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    }, {
      id: "8",
      name: "Episódio 9",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    }]
  }]

  
  return new Promise((resolve, reject) => {
    const novel: Novel | undefined = novels.find((novel) => novel.id == novelId);

    if (novel) {
      resolve(novel);
    } else {
      reject(new Error("Não foi possível encontrar a novela"))
    }
  });
}

export default async function Novel() {
  const novel: Novel = await getNovel("0");

  return (
    <>
    <Advertising/>
    <div className="my-10">
      <NovelCard novelName={novel.name} novelSlug={novel.slug} novelThumbUrl={novel.thumbUrl}/>
      <div className="mx-4 mb-5">
        <div className="max-w-fit rounded mb-4 py-2 px-4 font-semibold bg-primary">Episódios</div>
        <NovelEpisodes novelSlug={novel.slug} episodes={novel.episodes}/>
      </div>
      <NovelResume>
        {novel.description}
      </NovelResume>
    </div>
    </>
  );
}
