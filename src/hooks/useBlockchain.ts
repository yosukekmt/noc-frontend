import { useCallback } from "react";
import {
  Chain,
  goerli,
  mainnet,
  polygon,
  polygonMumbai,
  sepolia,
} from "wagmi/chains";

export const useBlockchain = () => {
  const getAlchemyApiKey = (): string => {
    return process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!;
  };
  const getIconPathById = (chainId: number): string => {
    if (chainId === polygon.id) return "/chain_polygon.png";
    if (chainId === polygonMumbai.id) return "/chain_polygon.png";
    return "/chain_ethereum.png";
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
    getIconPathById,
    getChainById,
    getExplorerTxUrl,
    getExplorerAddressUrl,
    getOpenseaAddressUrl,
    truncateContractAddress,
  };
};
