import { User } from "@/models";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { useApiClient } from "./useApiClient";

const currentUserAtom = atom<User | null>(null);

export const useCurrentUserApi = () => {
  const { apiClient } = useApiClient();
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  const getCurrentUser = useCallback(
    async (authToken: string): Promise<User> => {
      if (currentUser) {
        return currentUser;
      }
      const resp = await apiClient.get("/users/current", {
        headers: {
          Authorization: authToken,
        },
      });
      const item = {
        id: resp.data.data.id,
        email: resp.data.data.email,
        createdAt: new Date(resp.data.data.createdAt),
        updatedAt: new Date(resp.data.data.updatedAt),
      };
      setCurrentUser(item);
      return item;
    },
    [apiClient, currentUser, setCurrentUser]
  );

  const clearCurrentUser = useCallback(async () => {
    setCurrentUser(null);
  }, [setCurrentUser]);

  return {
    getCurrentUser,
    clearCurrentUser,
  };
};
