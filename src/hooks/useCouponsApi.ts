import { Coupon } from "@/models";
import { useCallback } from "react";
import { useApiClient } from "./useApiClient";

export const useCouponsApi = () => {
  const { apiClient } = useApiClient();

  const callGetCoupons = useCallback(
    async (authToken: string, projectId: string): Promise<Coupon[]> => {
      const resp = await apiClient.get("/coupons", {
        params: { project_id: projectId },
        headers: { Authorization: authToken },
      });
      const items = resp.data.data.map((d: any) => {
        return {
          id: d.id,
          rewardType: d.rewardType,
          name: d.name,
          description: d.description,
          supply: d.supply,
          imageUrl: d.imageUrl,
          contractAddress: d.contractAddress,
          nftTokenId: d.nftTokenId,
          timezone: d.timezone,
          startAt: new Date(d.startAt),
          endAt: new Date(d.endAt),
          createdAt: new Date(d.createdAt),
          updatedAt: new Date(d.updatedAt),
          invalidatedAt: d.invalidatedAt && new Date(d.invalidatedAt),
          chainId: d.chainId,
        };
      });
      return items;
    },
    [apiClient]
  );

  const callCreateCoupons = useCallback(
    async (
      authToken: string,
      data: {
        projectId: string;
        chainId: number;
        rewardType: "cashback_gas" | "cashback_005";
        name: string;
        description: string;
        supply: number;
        timezone: string;
        startAt: Date;
        endAt: Date;
        nftIds: string[];
        imageUrl: string;
      }
    ): Promise<Coupon> => {
      const resp = await apiClient.post("/coupons", data, {
        headers: {
          Authorization: authToken,
        },
      });
      const item = {
        id: resp.data.data.id,
        rewardType: resp.data.data.rewardType,
        name: resp.data.data.name,
        description: resp.data.data.description,
        supply: resp.data.data.supply,
        imageUrl: resp.data.data.imageUrl,
        contractAddress: resp.data.data.contractAddress,
        nftTokenId: resp.data.data.nftTokenId,
        treasuryAddress: resp.data.data.treasuryAddress,
        timezone: resp.data.data.timezone,
        startAt: new Date(resp.data.data.startAt),
        endAt: new Date(resp.data.data.endAt),
        createdAt: new Date(resp.data.data.createdAt),
        updatedAt: new Date(resp.data.data.updatedAt),
        invalidatedAt:
          resp.data.data.invalidatedAt &&
          new Date(resp.data.data.invalidatedAt),
        chainId: resp.data.data.chainId,
      };
      return item;
    },
    [apiClient]
  );

  const callGetCoupon = useCallback(
    async (
      authToken: string,
      projectId: string,
      id: string
    ): Promise<Coupon> => {
      const resp = await apiClient.get(`/coupons/${id}`, {
        params: { project_id: projectId },
        headers: { Authorization: authToken },
      });
      const item = {
        id: resp.data.data.id,
        rewardType: resp.data.data.rewardType,
        name: resp.data.data.name,
        description: resp.data.data.description,
        supply: resp.data.data.supply,
        imageUrl: resp.data.data.imageUrl,
        contractAddress: resp.data.data.contractAddress,
        nftTokenId: resp.data.data.nftTokenId,
        treasuryAddress: resp.data.data.treasuryAddress,
        timezone: resp.data.data.timezone,
        startAt: new Date(resp.data.data.startAt),
        endAt: new Date(resp.data.data.endAt),
        createdAt: new Date(resp.data.data.createdAt),
        updatedAt: new Date(resp.data.data.updatedAt),
        invalidatedAt:
          resp.data.data.invalidatedAt &&
          new Date(resp.data.data.invalidatedAt),
        chainId: resp.data.data.chainId,
      };
      return item;
    },
    [apiClient]
  );

  const callDeleteCoupon = useCallback(
    async (authToken: string, projectId: string, id: string): Promise<void> => {
      await apiClient.delete(`/coupons/${id}`, {
        params: { project_id: projectId },
        headers: { Authorization: authToken },
      });
      return;
    },
    [apiClient]
  );

  const callGetUploadUrl = useCallback(
    async (
      authToken: string,
      projectId: string,
      mimeType: string
    ): Promise<{ getUrl: string; uploadUrl: string }> => {
      const resp = await apiClient.get("/coupons/upload_url", {
        params: { project_id: projectId, mime_type: mimeType },
        headers: { Authorization: authToken },
      });
      console.log(resp);
      console.log(resp.data);
      return resp.data.data as { getUrl: string; uploadUrl: string };
    },
    [apiClient]
  );

  const getStatus = useCallback(
    (
      item: Coupon
    ):
      | "processing"
      | "scheduled"
      | "ongoing"
      | "finished"
      | "failed"
      | "invalidated" => {
      if (!!item.invalidatedAt) {
        return "invalidated";
      }
      const isReady = !!item.contractAddress && !!item.nftTokenId;
      const currentTime = new Date().getTime();
      if (!isReady) {
        const processThreashold = 20 * 60 * 1000; // 20 minutes
        const duration = currentTime - item.createdAt.getTime();
        if (processThreashold < duration) {
          //
          // 20 minutes or more
          //
          return "failed";
        } else {
          return "processing";
        }
      }
      if (item.endAt.getTime() < currentTime) {
        return "finished";
      }
      if (currentTime < item.startAt.getTime()) {
        return "scheduled";
      }
      return "ongoing";
    },
    []
  );

  return {
    callGetCoupons,
    callGetCoupon,
    callCreateCoupons,
    callDeleteCoupon,
    callGetUploadUrl,
    getStatus,
  };
};
