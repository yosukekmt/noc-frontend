import { useCallback } from "react";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const useUrl = () => {
  const getMintUrl = useCallback((id: string) => {
    return `${baseURL}/${id}`;
  }, []);

  return { getMintUrl };
};
