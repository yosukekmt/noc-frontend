import { Nft } from "@/models";
import { useCallback } from "react";
import { useApiClient } from "./useApiClient";

export const useNftsApi = () => {
  const { apiClient } = useApiClient();

  const callGetNft = useCallback(
    async (authToken: string, contractAddress: string): Promise<Nft> => {
      const resp = await apiClient.get(`/nfts/${contractAddress}`, {
        headers: { Authorization: authToken },
      });
      const item = {
        id: resp.data.id,
        name: resp.data.name,
        contractAddress: resp.data.contractAddress,
        createdAt: new Date(resp.data.createdAt),
        updatedAt: new Date(resp.data.updatedAt),
      };
      return item;
    },
    [apiClient]
  );

  return {
    callGetNft,
  };
};
