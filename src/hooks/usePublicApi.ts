import { Coupon } from "@/models";
import { useCallback } from "react";
import { useApiClient } from "./useApiClient";

export const usePublicApi = () => {
  const { apiClient } = useApiClient();

  const callGetCoupon = useCallback(
    async (authToken: string, id: string): Promise<Coupon> => {
      const resp = await apiClient.get(`/public/coupons/${id}`, {
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

  return { callGetCoupon };
};
