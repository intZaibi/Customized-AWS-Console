import { FileListProps } from "@/utils/types";
import { FileText } from "lucide-react";

export default function renderFileList({ files, currentTheme }: FileListProps) {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className={`w-16 h-16 ${currentTheme.textSecondary} mb-4`}>
          <FileText size={64} className="opacity-50" />
        </div>
        <h3 className={`text-lg font-medium ${currentTheme.text} mb-2`}>
          No files found
        </h3>
        <p className={`${currentTheme.textSecondary} text-sm`}>
          Upload your first file to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className={`flex items-center justify-between p-3 rounded-lg border ${currentTheme.border} ${currentTheme.cardBg} hover:bg-opacity-80 transition-colors`}
        >
          <div className="flex items-center space-x-3">
            <FileText size={20} className={currentTheme.textSecondary} />
            <div>
              <p className={`font-medium ${currentTheme.text}`}>{file.file.name}</p>
              <p className={`text-xs ${currentTheme.textSecondary}`}>
                {Math.round(file.file.size / 1024)} KB
              </p>
            </div>
              <p className={`text-xs ${currentTheme.textSecondary}`}>{file.progress}%</p>
          </div>
        </div>
      ))}
    </div>
  );
}
