import { Invitation, User } from "@/models";
import { useCallback } from "react";
import { useApiClient } from "./useApiClient";

export const useUsersApi = () => {
  const { apiClient } = useApiClient();

  const callGetUsers = useCallback(
    async (authToken: string, projectId: string): Promise<User[]> => {
      const resp = await apiClient.get("/users", {
        params: { project_id: projectId },
        headers: { Authorization: authToken },
      });
      const items = resp.data.data.map((d: any) => {
        return {
          id: d.id,
          email: d.email,
          createdAt: new Date(d.createdAt),
          updatedAt: new Date(d.updatedAt),
        };
      });
      console.log("items");
      console.log(items);
      return items;
    },
    [apiClient]
  );
  return {
    callGetUsers,
  };
};
