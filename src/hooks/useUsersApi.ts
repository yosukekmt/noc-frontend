import { useCallback } from "react";
import { useApiClient } from "./useApiClient";
import { faker } from "@faker-js/faker";

export type User = {
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export const useUsersApi = () => {
  const { apiClient } = useApiClient();

  const callGetUsers = useCallback(
    async (authToken: string): Promise<User[]> => {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      /*
      const resp = await apiClient.get("/users", {
        headers: {
          Authorization: authToken,
        },
      });
      const items = resp.data.map((d: any) => {
        return {
          email: d.email,
          createdAt: new Date(d.createdAt),
          updatedAt: new Date(d.updatedAt),
        };
      });*/
      const items = [null, null, null].flatMap((n) => {
        return {
          email: faker.internet.email(),
          createdAt: faker.date.recent(),
          updatedAt: faker.date.recent(),
        };
      });
      return items;
    },
    [apiClient]
  );

  const callCreateUser = useCallback(
    async (authToken: string, email: string): Promise<User> => {
      /*
      const resp = await apiClient.post(
        "/users",
        { email },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
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
      return item;
    },
    [apiClient]
  );

  const callDeleteUser = useCallback(
    async (authToken: string, email: string): Promise<void> => {
      /*
      await apiClient.delete(`/users/${email}`, {
        headers: {
          Authorization: authToken,
        },
      });*/
      return;
    },
    [apiClient]
  );

  return {
    callGetUsers,
    callCreateUser,
    callDeleteUser,
  };
};
