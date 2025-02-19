import { poolConnection } from "@/lib/database/connection";
import { episodesTable, novelsTable } from "@/lib/database/schema";
import { put } from "@vercel/blob";
import { asc, desc, eq, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export type ListSlugEpisode = {
  id: number,
  name: string,
  slug: string,
  episode: number,
  thumbnailUrl: string | null,
  videoUrl: string | null,
  novelId: number
};

interface ListEpisodeSlugParams {
  params: Promise<{ slug: string }>
}

export interface ListEpisodeSlugResponse {
  episodes: ListSlugEpisode[]
}

interface ListEpisodeSlugError {
  message: string,
  status: number
}

export async function GET(req: NextRequest, reqParams: ListEpisodeSlugParams): Promise<NextResponse<ListEpisodeSlugResponse | ListEpisodeSlugError>> {
  const params = await reqParams.params
  const episodeSlug: string = params.slug;

  if (!episodeSlug) {
    return NextResponse.json<ListEpisodeSlugError>({
      message: "the episode ID param is invalid or not provided",
      status: 400
    }, { status: 400 });
  }

  try {
    const episodes: ListSlugEpisode[] = await poolConnection
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
      .where(or(eq(episodesTable.slug, episodeSlug), eq(episodesTable.novelId, novelsTable.id)));

    return NextResponse.json<ListEpisodeSlugResponse>({ episodes });
  } catch (error) {
    return NextResponse.json<ListEpisodeSlugError>({
      message: (error as Error).message,
      status: 500
    }, { status: 500 });
  }
}

type UpdateEpisode = {
  id: number,
  slug: string
}

interface UpdateEpisodeParams {
  params: Promise<{ slug: string }>
}

interface UpdateEpisodeResponse {
  status: number
}

interface UpdateEpisodeError {
  message: string,
  status: number
}

export async function PATCH(req: NextRequest, reqParams: UpdateEpisodeParams): Promise<NextResponse<UpdateEpisodeResponse | UpdateEpisodeError>> {
  const params = await reqParams.params
  const episodeId: string = params.slug;

  if (!episodeId) {
    return NextResponse.json<UpdateEpisodeError>({
      message: "the episode ID param is invalid or not provided",
      status: 400
    }, { status: 400 });
  }

  if (!episodeId) {
    return NextResponse.json<UpdateEpisodeError>({
      message: "the episode ID param is invalid or not provided",
      status: 400
    }, { status: 400 });
  }

  const formData: FormData = await req.formData();

  const thumbnailImage: FormDataEntryValue | null = formData.get("thumbnail-image");

  if (thumbnailImage) {
    const thumbnailFile = thumbnailImage as File;

    try {
      const episode: UpdateEpisode[] = await poolConnection.select()
        .from(episodesTable)
        .where(eq(episodesTable.id, parseInt(episodeId)));

      const thumbnailFileType: string = thumbnailFile.name ? thumbnailFile.name.split(".")[1] : thumbnailFile.type.split("/")[1];
      const thumbnailFileName: string = `thumbnail-${episode[0].id}-${episode[0].slug}.${thumbnailFileType}`;

      const thumbnailBlob = await put(thumbnailFileName, thumbnailFile, {
        access: "public",
        multipart: true,
        contentType: thumbnailFile.type
      });

      const updateEpisode = await poolConnection.update(episodesTable)
        .set({
          thumbnailUrl: thumbnailBlob.url
        })
        .where(eq(episodesTable.id, parseInt(episodeId)));

      return NextResponse.json<UpdateEpisodeResponse>({ status: 200 }, { status: 200 });
    } catch (error) {
      return NextResponse.json<UpdateEpisodeError>({
        message: (error as Error).message,
        status: 500
      }, { status: 500 });
    }
  }

  const episodeVideo: FormDataEntryValue | null = formData.get("episode-video");

  if (episodeVideo) {
    const videoFile = episodeVideo as File;

    try {
      const episode: UpdateEpisode[] = await poolConnection.select()
        .from(episodesTable)
        .where(eq(episodesTable.id, parseInt(episodeId)));

      const videoFileType: string = videoFile.name ? videoFile.name.split(".")[1] : videoFile.type.split("/")[1];
      const videoFileName: string = `thumbnail-${episode[0].id}-${episode[0].slug}.${videoFileType}`;

      const videoBlob = await put(videoFileName, videoFile, {
        access: "public",
        multipart: true,
        contentType: videoFile.type
      });

      const updateEpisode = await poolConnection.update(episodesTable)
        .set({
          videoUrl: videoBlob.url
        })
        .where(eq(episodesTable.id, parseInt(episodeId)));

      return NextResponse.json<UpdateEpisodeResponse>({ status: 200 }, { status: 200 });
    } catch (error) {
      return NextResponse.json<UpdateEpisodeError>({
        message: (error as Error).message,
        status: 500
      }, { status: 500 });
    }
  }

  return NextResponse.json<UpdateEpisodeError>({
    message: "no file was uploaded",
    status: 400
  }, { status: 400 });
}
