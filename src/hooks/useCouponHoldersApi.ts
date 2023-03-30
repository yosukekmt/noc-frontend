import { CouponHolder, NftTransfer } from "@/models";
import { useCallback } from "react";
import { useApiClient } from "./useApiClient";

export const useCouponHoldersApi = () => {
  const { apiClient } = useApiClient();

  const callGetCouponHolders = useCallback(
    async (
      authToken: string,
      projectId: string,
      couponId: string
    ): Promise<CouponHolder[]> => {
      const resp = await apiClient.get("/coupon_holders", {
        params: { project_id: projectId, coupon_id: couponId },
        headers: { Authorization: authToken },
      });
      const items = resp.data.map((d: any) => {
        return {
          id: d.id,
          walletAddress: d.walletAddress,
          couponId: d.couponId,
          createdAt: new Date(d.createdAt),
          updatedAt: new Date(d.updatedAt),
        };
      });
      return items;
    },
    [apiClient]
  );

  return {
    callGetCouponHolders,
  };
};
