import { useState } from "react";

import { useCallback } from "react";
import axios from "axios";

const useUploadFile = (sessionId: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);

  const handleUpload = useCallback(async (file: File | null) => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/${sessionId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [sessionId]);

  const handleFileUpload = useCallback(
    async (file: File) => {
      try {
        await handleUpload(file);
        setFileUploaded(true);
      } catch (error) {
        console.error(error);
      }
    },
    [handleUpload]
  );

  return {
    handleFileUpload,
    isUploading,
    fileUploaded,
  };
};

export default useUploadFile;
