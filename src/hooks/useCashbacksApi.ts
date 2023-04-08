import { Cashback, CouponHolder, NftTransfer } from "@/models";
import { useCallback } from "react";
import { useApiClient } from "./useApiClient";

export const useCashbacksApi = () => {
  const { apiClient } = useApiClient();

  const callGetCashbacks = useCallback(
    async (
      authToken: string,
      projectId: string,
      couponId: string,
      page: number
    ): Promise<Cashback[]> => {
      const resp = await apiClient.get("/cashbacks", {
        params: { project_id: projectId, coupon_id: couponId, page: page },
        headers: { Authorization: authToken },
      });
      const items = resp.data.data.map((d: any) => {
        return {
          id: d.id,
          treasuryAddress: d.treasuryAddress,
          walletAddress: d.walletAddress,
          amountWei: d.amountWei,
          txHash: d.txHash,
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
    callGetCashbacks,
  };
};
