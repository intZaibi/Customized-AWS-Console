import React from "react";
import { BucketFilesType, FileItem } from "./types";

export const uploader = async (
  signedUrl: string,
  file: FileItem,
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>
) => {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setFiles((prev) =>
          prev.map((f) => (file.file === f.file ? { ...f, progress } : f))
        );
      }
    };
    xhr.onload = () => {
      if (xhr.status === 200) {
        setFiles((prev) =>
          prev.map((f) =>
            file.file === f.file
              ? { ...f, isUploading: false, progress: 100, error: false }
              : f
          )
        );
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };
    xhr.onerror = () => {
      reject(new Error("Network error during upload"));
    };
    xhr.open("PUT", signedUrl);
    xhr.setRequestHeader("Content-Type", file.file.type);
    xhr.send(file.file);
  });
};

export const fetchFiles = async () => {
  fetch("/api/s3/getFiles")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch files");
      }
      return response.json();
    })
    .then((data) => data.files)
    .catch((error) => {
      throw error;
    });
};

export const deleteFile = async (id: string) => {
  try {
    const response = await fetch("/api/s3/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key: id }),
    });
    if (!response.ok) {
      throw new Error("Failed to delete file");
    }
    return response.json();
  } catch (error) {
    console.log(`Error deleting file:`, error);
    throw error;
  }
};

const getSignedUrl = async (fileName: string) => {
  fetch(`/api/signed-url?fileName=${encodeURIComponent(fileName)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to get signed URL");
      }
      return response.json();
    })
    .then((data) => data.signedUrl)
    .catch((error) => error);
};
