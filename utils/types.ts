export interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: string;
  modified?: string;
}

export type Theme = "light" | "dark";
export type Tab = "files" | "buckets" | "settings";
export type FileListProps = {
  files: FileItem[];
  currentTheme: Record<string, string>;
};
