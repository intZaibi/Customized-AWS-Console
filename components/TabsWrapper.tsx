"use client";
import { FileItem } from "@/utils/types";
import { useState } from "react";
import { toast } from "sonner";
import { deleteFile, uploader } from "@/utils/apis";
import BucketTab from "./BucketTab";
import FileManagerTab from "./FileManagerTab";

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
        let file: FileItem | undefined;
        setFiles((prev) => {
          file = prev.find((f) => f.id === id);
          return prev.filter((f) => f.id !== id);
        });

        try {
          await deleteFile(id)
          toast.success('File deleted successfully')
          
        } catch (error) {
          setFiles((prev) => file ? [...prev, file] : prev);
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

  return activeTab === "files" ?
    <FileManagerTab fileManagerProps={{
      currentTheme, 
      files, 
      setFiles,
      isDragging, 
      handleDragLeave, 
      handleDragOver, 
      handleDrop, 
      handleFileUpload 
    }}/>
    :
    <BucketTab currentTheme={currentTheme} />
}
