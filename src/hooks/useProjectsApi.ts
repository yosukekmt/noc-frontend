import { Project } from "@/models";
import { useCallback } from "react";
import { useApiClient } from "./useApiClient";

export const useProjectsApi = () => {
  const { apiClient } = useApiClient();

  const callGetProjects = useCallback(
    async (authToken: string): Promise<Project[]> => {
      const resp = await apiClient.get("/projects", {
        headers: { Authorization: authToken },
      });
      const items = resp.data.data.map((d: any) => {
        return {
          id: d.id,
          name: d.name,
          walletAddress: d.walletAddress,
          createdAt: new Date(d.createdAt),
          updatedAt: new Date(d.updatedAt),
        };
      });
      return items;
    },
    [apiClient]
  );

  const callGetProject = useCallback(
    async (authToken: string, id: string): Promise<Project> => {
      const resp = await apiClient.get(`/projects/${id}`, {
        headers: { Authorization: authToken },
      });
      const item = {
        id: resp.data.data.id,
        name: resp.data.data.name,
        walletAddress: resp.data.data.walletAddress,
        createdAt: new Date(resp.data.data.createdAt),
        updatedAt: new Date(resp.data.data.updatedAt),
      };
      return item;
    },
    [apiClient]
  );

  const callCreateProject = useCallback(
    async (authToken: string, data: { name: string }): Promise<Project> => {
      const resp = await apiClient.post("/projects", data, {
        headers: { Authorization: authToken },
      });
      const item = {
        id: resp.data.data.id,
        name: resp.data.data.name,
        walletAddress: resp.data.data.walletAddress,
        createdAt: new Date(resp.data.data.createdAt),
        updatedAt: new Date(resp.data.data.updatedAt),
      };
      return item;
    },
    [apiClient]
  );

  const callUpdateProject = useCallback(
    async (
      authToken: string,
      id: string,
      data: { name: string }
    ): Promise<Project> => {
      const resp = await apiClient.patch(`/projects/${id}/`, data, {
        headers: { Authorization: authToken },
      });
      const item = {
        id: resp.data.data.id,
        name: resp.data.data.name,
        walletAddress: resp.data.data.walletAddress,
        createdAt: new Date(resp.data.data.createdAt),
        updatedAt: new Date(resp.data.data.updatedAt),
      };
      return item;
    },
    [apiClient]
  );

  const callDeleteProject = useCallback(
    async (authToken: string, id: string): Promise<void> => {
      await apiClient.delete(`/projects/${id}`, {
        headers: { Authorization: authToken },
      });
      return;
    },
    [apiClient]
  );

  const callWithdraw = useCallback(
    async (
      authToken: string,
      id: string,
      chainId: number,
      walletAddress: string
    ): Promise<void> => {
      const data = { chainId, walletAddress };
      await apiClient.put(`/projects/${id}/withdraw`, data, {
        headers: { Authorization: authToken },
      });
      return;
    },
    [apiClient]
  );

  return {
    callGetProjects,
    callGetProject,
    callCreateProject,
    callUpdateProject,
    callDeleteProject,
    callWithdraw,
  };
};
