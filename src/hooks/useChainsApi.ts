import { Chain } from "@/models";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { useApiClient } from "./useApiClient";

const chainsAtom = atom<Chain[]>([]);

export const useChainsApi = () => {
  const { apiClient } = useApiClient();
  const [chains, setChains] = useAtom(chainsAtom);

  const callGetChains = useCallback(
    async (authToken: string): Promise<Chain[]> => {
      const resp = await apiClient.get("/chains", {
        headers: { Authorization: authToken },
      });
      if (0 < chains.length) {
        return chains;
      }
      const items = resp.data.data.map((d: any) => {
        return {
          id: d.id,
          name: d.name,
          explorerUrl: d.explorerUrl,
          openseaUrl: d.openseaUrl,
        };
      });
      setChains(items);
      return items;
    },
    [apiClient, chains, setChains]
  );

  const callGetChain = useCallback(
    async (authToken: string, chainId: number): Promise<Chain | undefined> => {
      const items = await callGetChains(authToken);
      const item = items.find((c) => c.id === chainId);
      return item;
    },
    [callGetChains]
  );

  return { callGetChains, callGetChain };
};
