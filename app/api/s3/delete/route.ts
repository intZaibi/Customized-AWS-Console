const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const { key, accessKeyId, accessKeySecret } = await req.json();

  if (
    (!accessKeyId || !accessKeySecret) &&
    (!process.env.AWS_REGION ||
      !process.env.AWS_S3_ACCESS_KEY_ID ||
      !process.env.AWS_S3_SECRET_ACCESS_KEY ||
      !process.env.AWS_S3_BUCKET_NAME)
  ) {
    console.log("Missing AWS environment variables or access keys");
    return new NextResponse("Internal Server Error", { status: 500 });
  }

  try {
    await deleteFile(key, accessKeyId, accessKeySecret);
    return NextResponse.json({ message: "File deleted successfully" }, { status: 200 });
  } catch (error) {
    console.log("Error in delete route:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

async function deleteFile(key: string, accessKeyId?: string, accessKeySecret?: string) {
  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: accessKeyId && accessKeySecret
      ? { accessKeyId, secretAccessKey: accessKeySecret }
      : {
          accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || "",
        },
  });

  const deleteObjectCommand = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  });

  try {
    await s3.send(deleteObjectCommand);
  } catch (error) {
    console.log("Error deleting file from S3:", error);
    throw new Error(`Failed to delete file: ${error}`);
  }
}
