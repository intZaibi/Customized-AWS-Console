const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

export async function POST(req:Request) {

  const {contentType, key} = await req.json();

  try {
    const signedUrl = await getUrl(key, contentType);
    console.log("Signed URL:", signedUrl);
    return NextResponse.json({ signedUrl }, { status: 200 });

  } catch (error) {
    console.error("Error in upload route:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
    
  }
}

async function getUrl(key: string, contentType: string) {

  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  });

  const getObject = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    ContentType: contentType
  })

  try {
    const signedUrl = await getSignedUrl(s3, getObject);
    return signedUrl
    
  } catch (error) {
    console.error("Error getting signed URL:", error);
    throw new Error("Failed to get signed URL");
  }
}
