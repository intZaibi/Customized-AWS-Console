const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
  
  const {contentType, key, accessKeyId, accessKeySecret} = await req.json();
  
  if ((!accessKeyId || !accessKeySecret) && (!process.env.AWS_REGION || !process.env.AWS_S3_ACCESS_KEY_ID || !process.env.AWS_S3_SECRET_ACCESS_KEY || !process.env.AWS_S3_BUCKET_NAME)) {
    console.error("Missing AWS environment variables");
    return new NextResponse("Internal Server Error", { status: 500 });
  }

  try {
    const signedUrl = await getUrl(key, contentType);
    
    return NextResponse.json({ signedUrl }, { status: 200 });

  } catch (error) {
    console.error("Error in upload route:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
    
  }
}

export const getUrl = async (key: string, contentType?: string) => {

  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || "",
    }
  });

  if (!contentType){
    const getObject = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key
    })

    try {
      const signedUrl = await getSignedUrl(s3, getObject);
      return signedUrl
      
    } catch (error) {
      console.error("Error getting signed URL:", error);
      throw new Error("Failed to get signed URL");
    }
  }

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
