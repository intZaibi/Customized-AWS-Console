"use client";
import { FileItem } from "@/utils/types";
import { Folder, RefreshCw, Upload } from "lucide-react";
import { useState } from "react";
import renderFileList from "./FileList";
import { toast, Toaster } from "sonner";
import { deleteFile, uploader } from "@/utils/apis";

export default function tabs({
  activeTab,
  currentTheme,
}: {
  activeTab: string;
  currentTheme: Record<string, string>;
}) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (droppedFiles: File[]) => {

    if (droppedFiles.length === 0) return;

    let errors = []

    if (droppedFiles.length > 2){
      errors.push("You can only upload up to 2 files at a time.");
      droppedFiles.filter((_, index) => index <= 1);
    }

    if (droppedFiles.some(file => !["image/jpeg", "image/png", "image/jpg", "image/webp", "image/avif", "application/pdf"].includes(file.type))){
      errors.push("Only image files are allowed.");
      droppedFiles = droppedFiles.filter(file => ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/avif", "application/pdf"].includes(file.type));
    }
    // if file size is greater than 5MB, alert user
    if (droppedFiles.some(file => file.size > 5 * 1024 * 1024)){
      errors.push("File size must be less than 5MB.");
      droppedFiles = droppedFiles.filter(file => file.size <= 5 * 1024 * 1024);
    }

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
    }

    const newFiles: FileItem[] = droppedFiles.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      file: file,
      isUploading: false,
      progress: 0,
      isDeleting: false,
      error: false,
      url: URL.createObjectURL(file),
      onDelete: async (id) => {
        try {
          await deleteFile(id, setFiles)
          toast.success('File deleted successfully')
        } catch (error) {
          toast.error('Error: file could not deleted!')
        }
      },
      onRetry: (file: FileItem) => {if (file) uploadFiles(file);}
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((file) => {
      uploadFiles(file);
      toast.success(`File ${file.file.name} added successfully!`);
    })
  }

  // handler for upload button
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(Array.from(event.target.files || []));
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // file handler for drag and drop
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    
    handleFiles(Array.from(event.dataTransfer.files));
  };

  const uploadFiles = async (file: FileItem) => {
    setFiles((prev) =>
      prev.map((f) => (file.file === f.file) ? { ...f, isUploading: true } : f)
    );

    try {
      // get signed URL from backend
      const resp = await fetch("/api/s3/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contentType: file.file.type, key: file.id }),
      })
      if (!resp.ok) {
        throw new Error("Failed to get signed URL");
      }
      const { signedUrl } = await resp.json();

      await uploader(signedUrl, file, setFiles); // upload the file to S3 from client
      
      setFiles((prev) =>
        prev.map((f) =>
          file.file === f.file ? { ...f, isUploading: false, progress: 100, error: false } : f
        )
      );

      toast.success(`File ${file.file.name} uploaded successfully!`);
    
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) => (file.file === f.file) ? { ...f, error: true, isUploading: false, progress: 0 } : f)
      );
      toast.error(`Failed to upload ${file.file.name}: ${error}`);
      return;
    }
  }

  switch (activeTab) {
    case "files":
      return (
        <div className="space-y-6">
          <Toaster expand={true} richColors closeButton/>
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
              onClick={() => window.location.reload()}
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
            <div className="p-4">{renderFileList({ files, currentTheme })}</div>
          </div>
        </div>
      );
    case "buckets":
      return (
        <div className="space-y-6">
          <Toaster expand={true} richColors closeButton/>
          <div>
            <h2 className={`text-2xl font-bold ${currentTheme.text}`}>
              S3 Buckets
            </h2>
            <p className={`${currentTheme.textSecondary} mt-1`}>
              Manage your S3 buckets and permissions
            </p>
          </div>
          <div
            className={`rounded-lg border ${currentTheme.border} ${currentTheme.cardBg} p-8`}
          >
            <div className="flex flex-col items-center justify-center">
              <Folder
                size={48}
                className={`${currentTheme.textSecondary} mb-4 opacity-50`}
              />
              <h3 className={`text-lg font-medium ${currentTheme.text} mb-2`}>
                No buckets configured
              </h3>
              <p
                className={`${currentTheme.textSecondary} text-sm text-center`}
              >
                Configure your AWS credentials to view and manage S3 buckets
              </p>
            </div>
          </div>
        </div>
      );
    default:
      return <></>;
  }
}
