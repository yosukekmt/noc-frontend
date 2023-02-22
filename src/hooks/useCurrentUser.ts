import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { useApiClient } from "./useApiClient";
import { User } from "./useUsersApi";
import { faker } from "@faker-js/faker";

const currentUserAtom = atom<User | null>(null);

export const useCurrentUser = () => {
  const { apiClient } = useApiClient();
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  const getCurrentUser = useCallback(
    async (authToken: string): Promise<User> => {
      if (currentUser) {
        return currentUser;
      } /*
      const resp = await apiClient.get("/users/current", {
        headers: {
          Authorization: authToken,
        },
      });
      const item = {
        email: resp.data.email,
        createdAt: new Date(resp.data.createdAt),
        updatedAt: new Date(resp.data.updatedAt),
      };*/
      const item = {
        email: faker.internet.email(),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
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
