import { poolConnection } from "@/lib/database/connection";
import { episodesTable, novelsTable } from "@/lib/database/schema";
import { s3Client } from "@/lib/storage/connection";
import { PutObjectCommand, PutObjectCommandOutput } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { PageConfig } from "next";
import { NextRequest, NextResponse } from "next/server";

interface MediaParams {
  params: Promise<{ id: string }>
}

interface MediaResponse {
  status: string
}

interface MediaError {
  message: string
}

export async function PATCH(req: NextRequest, reqParams: MediaParams): Promise<NextResponse<MediaResponse | MediaError>> {
  const params = await reqParams.params;

  const novelId: string = params.id;

  if (!novelId) {
    return NextResponse.json<MediaError>({
      message: "episode ID is invalid or not provided",
    }, { status: 400 });
  }

  const formData = await req.formData();

  const thumbnailData = formData.get("thumbnail");

  if (!thumbnailData) {
    return NextResponse.json<MediaError>({
      message: "'thumbnail' is invalid or not provided"
    }, { status: 400 });
  }

  const thumbnailFile: File = thumbnailData as File;

  if (!thumbnailFile.name || !thumbnailFile.type) {
    return NextResponse.json<MediaError>({
      message: "'thumbnail' not provide name and/or type"
    }, { status: 400 });
  }

  const arrayBuffer = await thumbnailFile.arrayBuffer();

  const buffer = Buffer.from(arrayBuffer);

  const [name, type]: string[] = thumbnailFile.name.split(".");
  const fileName: string = `episode-thumbnail-${Date.now()}-${name}.${type}`;


  const thumbnailUploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileName,
    Body: buffer,
    ContentType: thumbnailFile.type,
  };

  const thumbnailCommand = new PutObjectCommand(thumbnailUploadParams);

  try {
    const pushThumbnail: Promise<PutObjectCommandOutput> = s3Client.send(thumbnailCommand);

    const updateNovel = poolConnection.update(episodesTable)
      .set({
        thumbnailUrl: `https://d310rh8f423q4b.cloudfront.net/${fileName}`
      })
      .where(eq(episodesTable.id, parseInt(novelId)));

    await Promise.all([pushThumbnail, updateNovel]);

    return NextResponse.json<MediaResponse>({
      status: "sucess"
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json<MediaError>({
      message: (error as Error).message
    }, { status: 500 });
  }
}

export const config: PageConfig = {
  api: {
    bodyParser: false
  },
}
