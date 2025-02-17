import { poolConnection } from "@/lib/database";
import { novelsTable, episodesTable } from "@/lib/database/schema";
import { put } from "@vercel/blob";
import { eq, asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

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
        thumbnailUlr: novelsTable.thumbnailUrl
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

type UpdateNovel = {
  id: number,
  slug: string
}

interface UpdateNovelParams {
  params: Promise<{ slug: string }>
}

interface UpdateNovelResponse {
  status: number
}

interface UpdateNovelError {
  message: string,
  status: number
}

export async function PATCH(req: NextRequest, reqParams: UpdateNovelParams): Promise<NextResponse<UpdateNovelResponse | UpdateNovelError>> {
  const params = await reqParams.params
  const novelId: string = params.slug;

  if (!novelId) {
    return NextResponse.json<UpdateNovelError>({
      message: "the novel ID param is invalid or not provided",
      status: 400
    }, { status: 400 });
  }

  if (!novelId) {
    return NextResponse.json<UpdateNovelError>({
      message: "the novel ID param is invalid or not provided",
      status: 400
    }, { status: 400 });
  }

  const formData: FormData = await req.formData();

  const thumbnailImage: FormDataEntryValue | null = formData.get("thumbnail-image");

  if (!thumbnailImage) {
    return NextResponse.json<UpdateNovelError>({
      message: "no file was uploaded",
      status: 400
    }, { status: 400 });
  }

  const thumbnailFile = thumbnailImage as File;

  try {
    const novel: UpdateNovel[] = await poolConnection
      .select({
        id: novelsTable.id,
        slug: novelsTable.slug
      })
      .from(novelsTable)
      .limit(1)
      .where(eq(novelsTable.id, parseInt(novelId)));

    const thumbnailFileType: string = thumbnailFile.name ? thumbnailFile.name.split(".")[1] : thumbnailFile.type.split("/")[1];
    const thumbnailFileName: string = `thumbnail-${novel[0].id}-${novel[0].slug}.${thumbnailFileType}`;

    const thumbnailBlob = await put(thumbnailFileName, thumbnailFile, {
      access: "public",
      contentType: thumbnailFile.type
    });

    const updateNovel = await poolConnection.update(novelsTable)
      .set({
        thumbnailUrl: thumbnailBlob.url
      })
      .where(eq(novelsTable.id, parseInt(novelId)));

    return NextResponse.json<UpdateNovelResponse>({ status: 200 }, { status: 200 });
  } catch (error) {
    return NextResponse.json<UpdateNovelError>({
      message: (error as Error).message,
      status: 500
    }, { status: 500 });
  }
}