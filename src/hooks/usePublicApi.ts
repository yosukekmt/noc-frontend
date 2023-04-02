import { Coupon, Nft, Chain } from "@/models";
import { useCallback } from "react";
import { useApiClient } from "./useApiClient";

export const usePublicApi = () => {
  const { apiClient } = useApiClient();

  const callGetCoupon = useCallback(
    async (id: string): Promise<Coupon> => {
      const resp = await apiClient.get(`/public/coupons/${id}`);
      const item = {
        id: resp.data.id,
        rewardType: resp.data.rewardType,
        name: resp.data.name,
        description: resp.data.description,
        contractAddress: resp.data.contractAddress,
        nftTokenId: resp.data.nftTokenId,
        treasuryAddress: resp.data.treasuryAddress,
        timezone: resp.data.timezone,
        startAt: new Date(resp.data.startAt),
        endAt: new Date(resp.data.endAt),
        createdAt: new Date(resp.data.createdAt),
        updatedAt: new Date(resp.data.updatedAt),
        chainId: resp.data.chainId,
      };
      return item;
    },
    [apiClient]
  );

  const callGetChain = useCallback(
    async (id: string): Promise<Chain> => {
      const resp = await apiClient.get(`/public/chains/${id}`);
      const item = {
        id: resp.data.id,
        name: resp.data.name,
        explorerUrl: resp.data.explorerUrl,
        openseaUrl: resp.data.openseaUrl,
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
      const items = resp.data.map((d: any) => {
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
