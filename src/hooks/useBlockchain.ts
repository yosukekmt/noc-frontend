import {
  Ethereum,
  Goerli,
  Mumbai,
  Polygon,
  Sepolia,
} from "@thirdweb-dev/chains";
import { useCallback, useMemo } from "react";

const BLOCKCHAIN_NETWORK = process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK;

export const useBlockchain = () => {
  const network = useMemo(() => {
    if (BLOCKCHAIN_NETWORK === "mainnet") {
      return Ethereum;
    }
    if (BLOCKCHAIN_NETWORK === "goerli") {
      return Goerli;
    }
    if (BLOCKCHAIN_NETWORK === "polygon") {
      return Polygon;
    }
    if (BLOCKCHAIN_NETWORK === "mumbai") {
      return Mumbai;
    }
    return Sepolia;
  }, []);
  const openseaUrl = useMemo(() => {
    if (BLOCKCHAIN_NETWORK === "mainnet") {
      return "https://opensea.io/assets/ethereum";
    }
    if (BLOCKCHAIN_NETWORK === "goerli") {
      return "https://testnets.opensea.io/assets/goeril";
    }
    if (BLOCKCHAIN_NETWORK === "polygon") {
      return "https://opensea.io/assets/matic";
    }
    if (BLOCKCHAIN_NETWORK === "mumbai") {
      return "https://testnets.opensea.io/assets/mumbai";
    }
    return "https://testnets.opensea.io/assets/sepolia";
  }, []);

  const getExplorerTxUrl = useCallback(
    (txHash: string): string => {
      return `${network.explorers[0].url}/tx/${txHash}`;
    },
    [network.explorers]
  );
  const getExplorerAddressUrl = useCallback(
    (address: string): string => {
      return `${network.explorers[0].url}/address/${address}`;
    },
    [network.explorers]
  );

  const getOpenseaAddressUrl = useCallback(
    (address: string): string => {
      return `${openseaUrl}/${address}`;
    },
    [openseaUrl]
  );

  const truncateContractAddress = useCallback((arg: string) => {
    const match = arg.match(/^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/);
    if (!match) return arg;
    return `${match[1]}…${match[2]}`;
  }, []);

  return {
    network,
    getExplorerTxUrl,
    getExplorerAddressUrl,
    getOpenseaAddressUrl,
    truncateContractAddress,
  };
};
