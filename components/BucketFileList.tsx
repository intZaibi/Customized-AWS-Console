import { deleteFile } from "@/utils/apis";
import { BucketFilesType } from "@/utils/types";
import { FileText, Folder, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast, Toaster } from "sonner";

export default function BucketFileList({
  files,
  setFiles,
  currentTheme,
}: {
  files: BucketFilesType[];
  setFiles: React.Dispatch<React.SetStateAction<BucketFilesType[]>>
  currentTheme: Record<string, string>;
}) {

  const handleDelete = async (key: string) => {
    let file: BucketFilesType | undefined; 
    setFiles((prev) => {
      file = prev.find((f) => f.Key === key);
      return prev.filter((f) => f.Key !== key);
    });

    
    const promise = () => new Promise(async (resolve, reject) => {
      try {
        await deleteFile(key)
        resolve("");
      } catch (error) {
        setFiles((prev) => file ? [...prev, file] : prev);
        reject();
      }
    });

    toast.promise(promise, {
      loading: 'Loading...',
      success: () => {
        return 'File deleted successfully';
      },
      error: 'Error: file could not deleted!',
    });
  }

  return !(files.length > 0) ? (
    <div
      className={`rounded-lg border ${currentTheme.border} ${currentTheme.cardBg} p-8`}
    >
      <Toaster expand={true} richColors closeButton />
      <div className="flex flex-col items-center justify-center">
        <Folder
          size={48}
          className={`${currentTheme.textSecondary} mb-4 opacity-50`}
        />
        <h3 className={`text-lg font-medium ${currentTheme.text} mb-2`}>
          No buckets configured
        </h3>
        <p className={`${currentTheme.textSecondary} text-sm text-center`}>
          Configure your AWS credentials to view and manage S3 buckets
        </p>
      </div>
    </div>
  ) : (
    <div className="space-y-2">
      <Toaster expand={true} richColors closeButton />
      {files.map((file) => (
        <div
          key={file.Key}
          className={`flex items-center justify-between p-3 rounded-lg border ${currentTheme.border} ${currentTheme.cardBg !== "bg-white" ? "bg-slate-700/50" : "bg-slate-200/50"} transition-colors`}
        >
          <Link
            target="_blank"
            href={file.signedURL}
            className="flex items-center space-x-3"
          >
            <FileText size={20} className={currentTheme.textSecondary} />
            <div>
              <p className={`font-medium ${currentTheme.text}`}>{file.Key}</p>
              <p className={`text-xs ${currentTheme.textSecondary}`}>
                {Math.round(file.Size / 1024)} KB
              </p>
            </div>
          </Link>
          <div>
            <button
              onClick={() => handleDelete(file.Key)}
              className={`text-sm cursor-pointer ${currentTheme.textSecondary} hover:${currentTheme.text} transition-colors`}
            >
              <Trash2 className="size-5 text-red-500 hover:text-red-400 cursor-pointer" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
