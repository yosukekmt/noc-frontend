import { CouponHolder, PageInfo } from "@/models";
import { useCallback } from "react";
import { useApiClient } from "./useApiClient";

export const useCouponHoldersApi = () => {
  const { apiClient } = useApiClient();

  const callGetCouponHolders = useCallback(
    async (
      authToken: string,
      projectId: string,
      couponId: string,
      page: number,
      query: string | null = null
    ): Promise<{ pageInfo: PageInfo; items: CouponHolder[] }> => {
      const params: any = {
        project_id: projectId,
        coupon_id: couponId,
        page: page,
      };
      if (query) params["query"] = query;

      const resp = await apiClient.get("/coupon_holders", {
        params,
        headers: { Authorization: authToken },
      });
      const pageInfo = {
        page: resp.data.pageInfo.page,
        perPage: resp.data.pageInfo.perPage,
        total: resp.data.pageInfo.total,
        totalPages: resp.data.pageInfo.totalPages,
      };
      const items = resp.data.data.map((d: any) => {
        return {
          id: d.id,
          walletAddress: d.walletAddress,
          couponId: d.couponId,
          createdAt: new Date(d.createdAt),
          updatedAt: new Date(d.updatedAt),
        };
      });
      return { pageInfo, items };
    },
    [apiClient]
  );

  return {
    callGetCouponHolders,
  };
};
