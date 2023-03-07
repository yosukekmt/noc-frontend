import { Invitation } from "@/models";
import { useCallback } from "react";
import { useApiClient } from "./useApiClient";

export const useProjectUsersApi = () => {
  const { apiClient } = useApiClient();

  const callDeleteProjectUser = useCallback(
    async (
      authToken: string,
      projectId: string,
      userId: string
    ): Promise<void> => {
      await apiClient.delete(`/project_users/${projectId}-${userId}`, {
        params: { projectId, userId },
        headers: { Authorization: authToken },
      });
      return;
    },
    [apiClient]
  );

  return { callDeleteProjectUser };
};
