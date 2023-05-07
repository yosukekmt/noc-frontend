import { useCallback } from "react";
import {
  mainnet,
  goerli,
  sepolia,
  polygon,
  polygonMumbai,
  Chain,
} from "wagmi/chains";

export const useBlockchain = () => {
  const getAlchemyApiKey = (): string => {
    return process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!;
  };

  const getChainById = (chainId: number): Chain => {
    if (chainId === mainnet.id) return mainnet;
    if (chainId === sepolia.id) return sepolia;
    if (chainId === polygon.id) return polygon;
    if (chainId === polygonMumbai.id) return polygonMumbai;

    return goerli;
  };

  const getExplorerTxUrl = useCallback(
    (url: string, txHash: string): string => {
      return `${url}/tx/${txHash}`;
    },
    []
  );
  const getExplorerAddressUrl = useCallback(
    (url: string, address: string): string => {
      return `${url}/address/${address}`;
    },
    []
  );

  const getOpenseaAddressUrl = useCallback(
    (url: string, address: string): string => {
      return `${url}/${address}`;
    },
    []
  );

  const truncateContractAddress = useCallback((arg: string) => {
    const match = arg.match(/^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/);
    if (!match) return arg;
    return `${match[1]}…${match[2]}`;
  }, []);

  return {
    getAlchemyApiKey,
    getChainById,
    getExplorerTxUrl,
    getExplorerAddressUrl,
    getOpenseaAddressUrl,
    truncateContractAddress,
  };
};
