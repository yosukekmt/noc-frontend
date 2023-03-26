import { NftTransfer } from "@/models";
import { useCallback } from "react";
import { useApiClient } from "./useApiClient";

export const useNftTransfersApi = () => {
  const { apiClient } = useApiClient();

  const callGetNftTransfers = useCallback(
    async (authToken: string, nftIds: string[]): Promise<NftTransfer[]> => {
      const resp = await apiClient.get("/nft_transfers", {
        params: { nft_ids: nftIds },
        headers: { Authorization: authToken },
      });
      const items = resp.data.map((d: any) => {
        return {
          id: d.id,
          txHash: d.txHash,
          fromAddress: d.fromAddress,
          toAddress: d.toAddress,
          valueWei: d.valueWei,
          gasPrice: d.gasPrice,
          gasLimit: d.gasLimit,
          nftId: d.nftId,
          blockProducedAt: d.blockProducedAt && new Date(d.blockProducedAt),
          createdAt: new Date(d.createdAt),
          updatedAt: new Date(d.updatedAt),
        };
      });
      return items;
    },
    [apiClient]
  );

  return {
    callGetNftTransfers,
  };
};
