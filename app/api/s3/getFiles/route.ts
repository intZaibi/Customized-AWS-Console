import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { getUrl } from "@/utils/helpers";

export async function GET() {
  if (
    !process.env.AWS_REGION ||
    !process.env.AWS_S3_ACCESS_KEY_ID ||
    !process.env.AWS_S3_SECRET_ACCESS_KEY ||
    !process.env.AWS_S3_BUCKET_NAME
  ) {
    console.error("Missing AWS environment variables");
    return new NextResponse("Internal Server Error", { status: 500 });
  }

  try {
    const objects = await listBucketObjects(); // List all objects in the bucket
    
    // For each object, get the signed URL
    const data = objects.map(async(f) => { 
      const URL = await getUrl(f.Key || "");
      if (!URL) {
        console.error(`Failed to get URL for key: ${f.Key}`);
        return f;
      }
      return {...f, signedURL: URL}
    });
    
    const resolvedData = await Promise.all(data);
    return NextResponse.json({ files: resolvedData }, { status: 200 });
  
  } catch (error) {
    console.error("Error listing S3 objects:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  
  }
}


export async function POST(req: Request) {

  const { key } = await req.json();
  if (!key)
    return new NextResponse("Key is required", { status: 400 });
  
  if (
    !process.env.AWS_REGION ||
    !process.env.AWS_S3_ACCESS_KEY_ID ||
    !process.env.AWS_S3_SECRET_ACCESS_KEY ||
    !process.env.AWS_S3_BUCKET_NAME
  ) {
    console.error("Missing AWS environment variables");
    return new NextResponse("Internal Server Error", { status: 500 });
  }

  try {
    const objects = await getUrl(key);
    return NextResponse.json({ objects }, { status: 200 });
  } catch (error) {
    console.error("Error listing S3 objects:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

async function listBucketObjects() {
  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
    },
  });

  const listCommand = new ListObjectsV2Command({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
  });

  const response = await s3.send(listCommand);
  return response.Contents || [];
}


