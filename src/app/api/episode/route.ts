import { poolConnection } from "@/lib/database";
import { episodesTable } from "@/lib/database/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export type ListEpisode = Omit<typeof episodesTable.$inferSelect, "createdAt" | "updatedAt">;

export interface ListEpisodeResponse {
  episodes: ListEpisode[]
}

interface ListEpisodeError {
  message: string,
  status: number
}

export async function GET(req: NextRequest): Promise<NextResponse<ListEpisodeResponse | ListEpisodeError>> {
  const novelId: string | null = req.nextUrl.searchParams.get("novelId");

  if (!novelId) {
    return NextResponse.json<DeleteEpisodeError>({
      message: "the novel ID param is invalid or not provided",
      status: 400
    }, { status: 400 });
  }

  try {
    const episodes: ListEpisode[] = await poolConnection
      .select({
        id: episodesTable.id,
        name: episodesTable.name,
        slug: episodesTable.slug,
        season: episodesTable.season,
        episode: episodesTable.episode,
        thumbnailUrl: episodesTable.thumbnailUrl,
        videoUrl: episodesTable.videoUrl,
        novelId: episodesTable.novelId
      })
      .from(episodesTable)
      .where(eq(episodesTable.novelId, parseInt(novelId)));

    return NextResponse.json<ListEpisodeResponse>({ episodes });
  } catch (error) {
    return NextResponse.json<ListEpisodeError>({
      message: (error as Error).message,
      status: 500
    }, { status: 500 });
  }
}

type SaveEpisode = typeof episodesTable.$inferInsert;

interface SaveEpisodeValues {
  name?: string,
  season?: number,
  episode?: number
  novelId?: number
}

interface SaveEpisodeResponse {
  status: number
}

interface SaveEpisodeError {
  message: string,
  status: number
}

export async function POST(req: NextRequest): Promise<NextResponse<SaveEpisodeResponse | SaveEpisodeError>> {
  const bodyJson = await req.json();

  const { name, season, episode, novelId }: SaveEpisodeValues = bodyJson;

  if (!name) {
    return NextResponse.json<SaveEpisodeError>({
      message: "the name is invalid or not provided",
      status: 400
    }, { status: 400 });
  }

  if (!season) {
    return NextResponse.json<SaveEpisodeError>({
      message: "the season is invalid or not provided",
      status: 400
    }, { status: 400 });
  }

  if (!episode) {
    return NextResponse.json<SaveEpisodeError>({
      message: "the episode is invalid or not provided",
      status: 400
    }, { status: 400 });
  }

  if (!novelId) {
    return NextResponse.json<SaveEpisodeError>({
      message: "the novel ID is invalid or not provided",
      status: 400
    }, { status: 400 });
  }

  const values: SaveEpisode = {
    name,
    slug: slugify(name),
    episode,
    season,
    novelId: novelId
  }

  try {
    await poolConnection
      .insert(episodesTable)
      .values(values);

    return NextResponse.json<SaveEpisodeResponse>({ status: 202 }, { status: 202 });

  } catch (error) {
    return NextResponse.json<SaveEpisodeError>({
      message: (error as Error).message,
      status: 500
    }, { status: 500 });
  }
}

interface DeleteEpisodeResponse {
  status: number
}

interface DeleteEpisodeError {
  message: string,
  status: number
}

export async function DELETE(req: NextRequest): Promise<NextResponse<DeleteEpisodeResponse | DeleteEpisodeError>> {
  const novelId: string | null = req.nextUrl.searchParams.get("novelId");

  if (!novelId) {
    return NextResponse.json<DeleteEpisodeError>({
      message: "the novel ID param is invalid or not provided",
      status: 400
    }, { status: 400 });
  }

  try {
    const deleteEpisode = await poolConnection.delete(episodesTable)
      .where(eq(episodesTable.id, parseInt(novelId)));

    return NextResponse.json<DeleteEpisodeResponse>({ status: 200 }, { status: 200 });
  } catch (error) {
    return NextResponse.json<DeleteEpisodeError>({
      message: (error as Error).message,
      status: 500
    }, { status: 500 });
  }
}

function slugify(str: string): string {
  return String(str)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "500000kb"
    }
  },
}