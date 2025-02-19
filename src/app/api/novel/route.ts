import { poolConnection } from "@/lib/database/connection";
import { novelsTable } from "@/lib/database/schema";
import { NextRequest, NextResponse } from "next/server";

export type ListNovel = Omit<typeof novelsTable.$inferSelect, "id" | "createdAt" | "updatedAt">;

export interface ListNovelResponse {
  novels: ListNovel[]
}

interface ListNovelError {
  message: string,
  status: number
}

export async function GET(req: NextRequest): Promise<NextResponse<ListNovelResponse | ListNovelError>> {
  try {
    const novels: ListNovel[] = await poolConnection
      .select({
        name: novelsTable.name,
        slug: novelsTable.slug,
        thumbnailUrl: novelsTable.thumbnailUrl,
        description: novelsTable.description
      })
      .from(novelsTable);

    return NextResponse.json<ListNovelResponse>({ novels });
  } catch (error) {
    return NextResponse.json<ListNovelError>({
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