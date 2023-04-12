import Axios from "axios";
import { useCallback } from "react";

export const useUpload = () => {
  const uploadFile = useCallback(
    async (uploadUrl: string, file: File): Promise<any> => {
      const resp = await Axios.put(uploadUrl, file, {
        headers: { "Content-Type": "binary/octet-stream" },
      });
      return resp;
    },
    []
  );

  const getImageSize = useCallback(
    (file: File): Promise<{ width: number; height: number }> => {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
          resolve({ width: image.width, height: image.height });
        };
        image.onerror = () => {
          reject(new Error("Failed to load image."));
        };
        image.src = URL.createObjectURL(file);
      });
    },
    []
  );

  return { uploadFile, getImageSize };
};
