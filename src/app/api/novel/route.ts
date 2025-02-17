import { poolConnection } from "@/lib/database";
import { novelsTable } from "@/lib/database/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export type ListNovelSlugs = {
  slug: string
};

export interface ListNovelSlugsResponse {
  novels: ListNovelSlugs[]
}

interface ListNovelSlugsError {
  message: string,
  status: number
}

export async function GET(req: NextRequest): Promise<NextResponse<ListNovelSlugsResponse | ListNovelSlugsError>> {
  try {
    const novels: ListNovelSlugs[] = await poolConnection
      .select({
        slug: novelsTable.slug
      })
      .from(novelsTable);

    return NextResponse.json<ListNovelSlugsResponse>({ novels });
  } catch (error) {
    return NextResponse.json<ListNovelSlugsError>({
      message: (error as Error).message,
      status: 500
    }, { status: 500 });
  }
}

type SaveNovel = typeof novelsTable.$inferInsert;

interface SaveNovelValues {
  name?: string,
  description?: string
}

interface SaveNovelResponse {
  status: number
}

interface SaveNovelError {
  message: string,
  status: number
}

export async function POST(req: NextRequest): Promise<NextResponse<SaveNovelResponse | SaveNovelError>> {
  const bodyJson = await req.json();

  const { name, description }: SaveNovelValues = bodyJson;

  if (!name) {
    return NextResponse.json<SaveNovelError>({
      message: "the name is invalid or not provided",
      status: 400
    }, { status: 400 });
  }

  if (!description) {
    return NextResponse.json<SaveNovelError>({
      message: "the description is invalid or not provided",
      status: 400
    }, { status: 400 });
  }

  const values: SaveNovel = {
    name,
    description,
    slug: slugify(name)
  }

  try {
    await poolConnection
      .insert(novelsTable)
      .values(values);

    return NextResponse.json<SaveNovelResponse>({ status: 202 }, { status: 202 });

  } catch (error) {
    return NextResponse.json<SaveNovelError>({
      message: (error as Error).message,
      status: 500
    }, { status: 500 });
  }
}

interface DeleteNovelResponse {
  status: number
}

interface DeleteNovelError {
  message: string,
  status: number
}

export async function DELETE(req: NextRequest): Promise<NextResponse<DeleteNovelResponse | DeleteNovelError>> {
  const novelId: string | null = req.nextUrl.searchParams.get("novelId");

  if (!novelId) {
    return NextResponse.json<DeleteNovelError>({
      message: "the novel ID param is invalid or not provided",
      status: 400
    }, { status: 400 });
  }

  try {
    const deleteNovel = await poolConnection.delete(novelsTable)
      .where(eq(novelsTable.id, parseInt(novelId)));

    return NextResponse.json<DeleteNovelResponse>({ status: 200 }, { status: 200 });
  } catch (error) {
    return NextResponse.json<DeleteNovelError>({
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
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}