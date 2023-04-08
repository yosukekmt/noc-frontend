import { Coupon, Nft, Chain } from "@/models";
import { useCallback } from "react";
import { useApiClient } from "./useApiClient";

export const usePublicApi = () => {
  const { apiClient } = useApiClient();

  const callGetCoupon = useCallback(
    async (id: string): Promise<Coupon> => {
      const resp = await apiClient.get(`/public/coupons/${id}`);
      const item = {
        id: resp.data.data.id,
        rewardType: resp.data.data.rewardType,
        name: resp.data.data.name,
        description: resp.data.data.description,
        contractAddress: resp.data.data.contractAddress,
        nftTokenId: resp.data.data.nftTokenId,
        treasuryAddress: resp.data.data.treasuryAddress,
        timezone: resp.data.data.timezone,
        startAt: new Date(resp.data.data.startAt),
        endAt: new Date(resp.data.data.endAt),
        createdAt: new Date(resp.data.data.createdAt),
        updatedAt: new Date(resp.data.data.updatedAt),
        chainId: resp.data.data.chainId,
      };
      return item;
    },
    [apiClient]
  );

  const callGetChain = useCallback(
    async (id: string): Promise<Chain> => {
      const resp = await apiClient.get(`/public/chains/${id}`);
      const item = {
        id: resp.data.data.id,
        name: resp.data.data.name,
        explorerUrl: resp.data.data.explorerUrl,
        openseaUrl: resp.data.data.openseaUrl,
      };
      return item;
    },
    [apiClient]
  );

  const callGetNfts = useCallback(
    async (couponId: string): Promise<Nft[]> => {
      const resp = await apiClient.get("/public/nfts", {
        params: { coupon_id: couponId },
      });
      const items = resp.data.data.map((d: any) => {
        return {
          id: d.id,
          name: d.name,
          contractAddress: d.contractAddress,
          createdAt: new Date(d.createdAt),
          updatedAt: new Date(d.updatedAt),
          chainId: resp.data.chainId,
        };
      });
      return items;
    },
    [apiClient]
  );
  return { callGetCoupon, callGetChain, callGetNfts };
};
