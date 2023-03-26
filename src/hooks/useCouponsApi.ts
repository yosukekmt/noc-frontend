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
      const items = resp.data.map((d: any) => {
        return {
          id: d.id,
          rewardType: d.rewardType,
          name: d.name,
          description: d.description,
          contractAddress: d.contractAddress,
          treasuryAddress: d.treasuryAddress,
          timezone: d.timezone,
          startAt: new Date(d.startAt),
          endAt: new Date(d.endAt),
          createdAt: new Date(d.createdAt),
          updatedAt: new Date(d.updatedAt),
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
        rewardType: "gas_fee_cashback";
        name: string;
        description: string;
        timezone: string;
        startAt: Date;
        endAt: Date;
        nftIds: string[];
      }
    ): Promise<Coupon> => {
      const resp = await apiClient.post("/coupons", data, {
        headers: {
          Authorization: authToken,
        },
      });
      const item = {
        id: resp.data.id,
        rewardType: resp.data.rewardType,
        name: resp.data.name,
        description: resp.data.description,
        contractAddress: resp.data.contractAddress,
        treasuryAddress: resp.data.treasuryAddress,
        timezone: resp.data.timezone,
        startAt: new Date(resp.data.startAt),
        endAt: new Date(resp.data.endAt),
        nftTokenId: resp.data.timezone,
        createdAt: new Date(resp.data.createdAt),
        updatedAt: new Date(resp.data.updatedAt),
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
        id: resp.data.id,
        rewardType: resp.data.rewardType,
        name: resp.data.name,
        description: resp.data.description,
        contractAddress: resp.data.contractAddress,
        treasuryAddress: resp.data.treasuryAddress,
        timezone: resp.data.timezone,
        startAt: new Date(resp.data.startAt),
        endAt: new Date(resp.data.endAt),
        createdAt: new Date(resp.data.createdAt),
        updatedAt: new Date(resp.data.updatedAt),
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

  return {
    callGetCoupons,
    callGetCoupon,
    callCreateCoupons,
    callDeleteCoupon,
  };
};
