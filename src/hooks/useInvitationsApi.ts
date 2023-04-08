import { Invitation } from "@/models";
import { useCallback } from "react";
import { useApiClient } from "./useApiClient";

export const useInvitationsApi = () => {
  const { apiClient } = useApiClient();

  const callGetInvitations = useCallback(
    async (authToken: string, projectId: string): Promise<Invitation[]> => {
      const resp = await apiClient.get("/invitations", {
        params: { project_id: projectId },
        headers: { Authorization: authToken },
      });
      const items = resp.data.data.map((d: any) => {
        return {
          id: d.id,
          email: d.email,
          sentAt: d.sentAt && new Date(d.sentAt),
          acceptedAt: d.acceptedAt && new Date(d.acceptedAt),
          createdAt: new Date(d.createdAt),
          updatedAt: new Date(d.updatedAt),
        };
      });
      return items;
    },
    [apiClient]
  );

  const callCreateInvitation = useCallback(
    async (
      authToken: string,
      data: { projectId: string; email: string }
    ): Promise<Invitation> => {
      const resp = await apiClient.post("/invitations", data, {
        headers: { Authorization: authToken },
      });
      const item = {
        id: resp.data.id,
        email: resp.data.email,
        sentAt: resp.data.sentAt && new Date(resp.data.sentAt),
        acceptedAt: resp.data.acceptedAt && new Date(resp.data.acceptedAt),
        createdAt: new Date(resp.data.createdAt),
        updatedAt: new Date(resp.data.updatedAt),
      };
      return item;
    },
    [apiClient]
  );

  const callDeleteInvitation = useCallback(
    async (authToken: string, projectId: string, id: string): Promise<void> => {
      await apiClient.delete(`/invitations/${id}`, {
        params: { project_id: projectId },
        headers: { Authorization: authToken },
      });
      return;
    },
    [apiClient]
  );

  return {
    callGetInvitations,
    callCreateInvitation,
    callDeleteInvitation,
  };
};
