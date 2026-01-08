import { getUrl } from "@/utils/helpers";
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

