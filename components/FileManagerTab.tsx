import { RefreshCw, Upload } from "lucide-react";
import { Toaster } from "sonner";
import { FileItem } from "@/utils/types";
import FileList from "./FileList";
import React, { Dispatch, SetStateAction } from "react";

interface FileManagerTabProps {
  fileManagerProps: {
    currentTheme: Record<string, string>;
    files: FileItem[];
    isDragging: boolean;
    setFiles: Dispatch<SetStateAction<FileItem[]>>;
    handleDragLeave: () => void;
    handleDragOver: (event: React.DragEvent) => void;
    handleDrop: (event: React.DragEvent) => void;
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
}

export default function FileManagerTab({
  fileManagerProps,
}: FileManagerTabProps) {

  const {
    currentTheme,
    files,
    setFiles,
    isDragging,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileUpload,
  } = fileManagerProps;

  return (
    <div className="space-y-6">
      <Toaster expand={true} richColors closeButton />
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${currentTheme.text}`}>
            File Management
          </h2>
          <p className={`${currentTheme.textSecondary} mt-1`}>
            Upload, manage, and organize your S3 files
          </p>
        </div>
        <button
          onClick={() => setFiles([])}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${currentTheme.buttonSecondary} border`}
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
          isDragging
            ? "border-blue-400 bg-blue-500/20 dark:bg-blue-900/20"
            : `${currentTheme.border} ${currentTheme.cardBg}`
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`text-sm ${currentTheme.text}`}>
              Files ({files.length})
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${currentTheme.button}`}
            >
              <Upload size={16} />
              <span>Upload</span>
            </label>
          </div>
        </div>
      </div>

      <div
        className={`rounded-lg border ${currentTheme.border} ${currentTheme.cardBg}`}
      >
        <div className="p-4">
          <FileList files={files} currentTheme={currentTheme}/>
        </div>
      </div>
    </div>
  );
}
