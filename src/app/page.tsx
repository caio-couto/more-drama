import NovelCard from "@/components/NovelCard";
import { poolConnection } from "@/lib/database/connection";
import { novelsTable } from "@/lib/database/schema";

export type Novel = {
  id: number,
  name: string,
  slug: string,
  description: string,
  thumbnailUlr: string | null
};

async function getNovels(): Promise<Novel[]> {
  return new Promise<Novel[]>(async (resolve, reject) => {
    const novels: Novel[] = await poolConnection
    .select({
      id: novelsTable.id,
      name: novelsTable.name,
      slug: novelsTable.slug,
      description: novelsTable.description,
      thumbnailUlr: novelsTable.thumbnailUrl
    })
    .from(novelsTable)

    resolve(novels);
  });
}

export default async function Home() {
  const novels: Novel[] = await getNovels();

  return (
    <body className="w-screen min-h-screen flex items-center justify-center">
      <div className="">
        {novels.map((novel) => <NovelCard novelName={novel.name} key={novel.id} redirect={`/novel/${novel.slug}`} novelThumbUrl={novel.thumbnailUlr}/>)}
      </div>
    </body>
  );
}
