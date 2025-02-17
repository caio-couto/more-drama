import { ListSlugEpisode, ListEpisodeSlugResponse } from "@/app/api/episode/[slug]/route";
import Carousel from "@/components/Carousel";
import CarouselHeader from "@/components/CarouselHeader";

async function getEpisodesBySlug(novelSlug: string): Promise<ListSlugEpisode[]> {
  return new Promise<ListSlugEpisode[]>((resolve, reject) => {
    fetch(`${process.env.APP_URL}/api/episode/${novelSlug}`)
    .then((data) => data.json())
    .then((data: ListEpisodeSlugResponse) => {
      resolve(data.episodes);
    })
    .catch((error) => reject(error));
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