export interface FileItem {
  id: string;
  file: File;
  isUploading: boolean;
  error?: boolean;
  progress: number;
  url?: string;
  key?: string;
  isDeleting: boolean;
  onRetry: (file: FileItem) => void;
  onDelete: (id: string) => void;
}
export interface BucketFilesType {
  Key: string;
  LastModified: string;
  ETag: string;
  ChecksumAlgorithm: string[];
  ChecksumType: string;
  Size: number;
  StorageClass: string;
  signedURL: string
}

export type Theme = "light" | "dark";
export type Tab = "files" | "buckets" | "settings";
export type FileListProps = {
  files: FileItem[];
  currentTheme: Record<string, string>;
};
