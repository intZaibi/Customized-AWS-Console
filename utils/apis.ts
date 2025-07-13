const uploader = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Upload failed");
        }
        return response.json();
      })
      .then((data) => {
        return data;
      })
      .catch((error) => error);
  }

const fetchFiles = async () => {
  fetch("/api/files")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch files");
      }
      return response.json();
    })
    .then((data) => data.files)
    .catch((error) => error)
  }

const deleteFile = async (fileId: string) => {
  fetch(`/api/files/${fileId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete file");
      }
      return response.json();
    })
    .then((data) => data.message)
    .catch((error) => error);
}

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
}