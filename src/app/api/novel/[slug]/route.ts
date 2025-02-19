import { poolConnection } from "@/lib/database/connection";
import { novelsTable, episodesTable } from "@/lib/database/schema";
import { eq, asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export type ListNovel = Omit<typeof novelsTable.$inferSelect, "createdAt" | "updatedAt">;

export type ListEpisode = {
  episode: number,
  slug: string
}

interface ListNovelParams {
  params: Promise<{ slug: string }>
}

export interface ListNovelResponse {
  novel: ListNovel,
  episodes: ListEpisode[]
}

interface ListNovelError {
  message: string,
  status: number
}

export async function GET(req: NextRequest, reqParams: ListNovelParams): Promise<NextResponse<ListNovelResponse | ListNovelError>> {
  const params = await reqParams.params
  const noveSlug: string = params.slug;

  if (!noveSlug) {
    return NextResponse.json<ListNovelError>({
      message: "the novel ID param is invalid or not provided",
      status: 400
    }, { status: 400 });
  }

  try {
    const novel: ListNovel[] = await poolConnection
      .select({
        id: novelsTable.id,
        name: novelsTable.name,
        slug: novelsTable.slug,
        description: novelsTable.description,
        thumbnailUrl: novelsTable.thumbnailUrl
      })
      .from(novelsTable)
      .where(eq(novelsTable.slug, noveSlug));

    const episodes: ListEpisode[] = await poolConnection
      .select({
        episode: episodesTable.episode,
        slug: episodesTable.slug
      })
      .from(episodesTable)
      .orderBy(asc((episodesTable.episode)), asc(episodesTable.season))
      .where((eq(episodesTable.novelId, novel[0].id)));

    return NextResponse.json<ListNovelResponse>({ novel: novel[0], episodes });
  } catch (error) {
    return NextResponse.json<ListNovelError>({
      message: (error as Error).message,
      status: 500
    }, { status: 500 });
  }
}

interface DeleteNovelParams {
  params: Promise<{ slug: string }>
}

interface DeleteNovelResponse {
  status: number
}

interface DeleteNovelError {
  message: string,
  status: number
}

export async function DELETE(req: NextRequest, reqParams: DeleteNovelParams): Promise<NextResponse<DeleteNovelResponse | DeleteNovelError>> {
  const params = await reqParams.params
  const noveSlug: string = params.slug;

  if (!noveSlug) {
    return NextResponse.json<ListNovelError>({
      message: "the novel ID param is invalid or not provided",
      status: 400
    }, { status: 400 });
  }

  try {
    const deleteNovel = await poolConnection.delete(novelsTable)
      .where(eq(novelsTable.id, parseInt(noveSlug)));

    return NextResponse.json<DeleteNovelResponse>({ status: 200 }, { status: 200 });
  } catch (error) {
    return NextResponse.json<DeleteNovelError>({
      message: (error as Error).message,
      status: 500
    }, { status: 500 });
  }
}