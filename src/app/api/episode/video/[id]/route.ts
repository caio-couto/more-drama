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

  const videoData = formData.get("video");

  if (!videoData) {
    return NextResponse.json<MediaError>({
      message: "'video' is invalid or not provided"
    }, { status: 400 });
  }

  const videoFile: File = videoData as File;

  if (!videoFile.name || !videoFile.type) {
    return NextResponse.json<MediaError>({
      message: "'video' not provide name and/or type"
    }, { status: 400 });
  }

  const arrayBuffer = await videoFile.arrayBuffer();

  const buffer = Buffer.from(arrayBuffer);


  const [name, type]: string[] = videoFile.name.split(".");
  const fileName: string = `episode-video-${Date.now()}-${name}.${type}`;


  const videoUploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileName,
    Body: buffer,
    ContentType: videoFile.type,
  };

  const videoCommand = new PutObjectCommand(videoUploadParams);

  try {
    const pushVideo: Promise<PutObjectCommandOutput> = s3Client.send(videoCommand);

    const updateNovel = poolConnection.update(episodesTable)
      .set({
        videoUrl: `https://d310rh8f423q4b.cloudfront.net/${fileName}`
      })
      .where(eq(episodesTable.id, parseInt(novelId)));

    await Promise.all([pushVideo, updateNovel]);

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