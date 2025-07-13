export interface FileItem {
    id: string;
    file: File;
    isUploading: boolean;
    error?: boolean;
    progress: number;
    url?: string;
    key?: string;
    isDeleting: boolean;
  }

export type Theme = "light" | "dark";
export type Tab = "files" | "buckets" | "settings";
export type FileListProps = {
  files: FileItem[];
  currentTheme: Record<string, string>;
};
