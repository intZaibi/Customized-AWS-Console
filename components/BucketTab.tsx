import { BucketFilesType } from "@/utils/types";
import { useState } from "react";
import { Toaster } from "sonner";
import BucketFileList from "./BucketFileList";

const demoFiles = [
    {
      "Key": "file-1752376133627-0",
      "LastModified": "2025-07-13T03:08:59.000Z",
      "ETag": "\"962e3b980e3dcb23fb18d088bc0e75f1\"",
      "ChecksumAlgorithm": [
        "CRC64NVME"
      ],
      "ChecksumType": "FULL_OBJECT",
      "Size": 250563,
      "StorageClass": "STANDARD",
      "signedURL": "https://s3.ap-southeast-2.amazonaws.com/zaibi.dev.test/file-1752376133627-0?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA2YICAPERXJOBORKC%2F20250713%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Date=20250713T063621Z&X-Amz-Expires=900&X-Amz-Signature=db2bf393d4b8249b0253014f529c2fea80e178b93a309fbc403daaf58c9a388b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
    },
    {
      "Key": "file-1752377507650-0",
      "LastModified": "2025-07-13T03:31:53.000Z",
      "ETag": "\"f7dd7385f8d72be0e48732d770263146\"",
      "ChecksumAlgorithm": [
        "CRC64NVME"
      ],
      "ChecksumType": "FULL_OBJECT",
      "Size": 243883,
      "StorageClass": "STANDARD",
      "signedURL": "https://s3.ap-southeast-2.amazonaws.com/zaibi.dev.test/file-1752377507650-0?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA2YICAPERXJOBORKC%2F20250713%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Date=20250713T063621Z&X-Amz-Expires=900&X-Amz-Signature=922a6a1f5bd53a88706ca8e40e909556c44348cdb6aefca7fcf825e491c422c7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
    },
    {
      "Key": "file-1752377742883-0",
      "LastModified": "2025-07-13T03:35:44.000Z",
      "ETag": "\"24901047d8ab950563c4b76bcd00575f\"",
      "ChecksumAlgorithm": [
        "CRC64NVME"
      ],
      "ChecksumType": "FULL_OBJECT",
      "Size": 49376,
      "StorageClass": "STANDARD",
      "signedURL": "https://s3.ap-southeast-2.amazonaws.com/zaibi.dev.test/file-1752377742883-0?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA2YICAPERXJOBORKC%2F20250713%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Date=20250713T063621Z&X-Amz-Expires=900&X-Amz-Signature=77280ec824a56739d32628d65174507291e7221b87aa2a26a90dd2419144b0fa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
    }
  ]

export default function BucketTab({
  currentTheme,
}: {
  currentTheme: Record<string, string>;
}) {

  const [files, setFiles] = useState<BucketFilesType[]>(demoFiles);

  return (
    <div className="space-y-6">
      <Toaster expand={true} richColors closeButton />
      <div>
        <h2 className={`text-2xl font-bold ${currentTheme.text}`}>
          S3 Buckets
        </h2>
        <p className={`${currentTheme.textSecondary} mt-1`}>
          Manage your S3 buckets and permissions
        </p>
      </div>
      <BucketFileList files={files} setFiles={setFiles} currentTheme={currentTheme}/>
    </div>
  );
}
