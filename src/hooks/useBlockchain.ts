import { useCallback } from "react";

export const useBlockchain = () => {
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
    getExplorerTxUrl,
    getExplorerAddressUrl,
    getOpenseaAddressUrl,
    truncateContractAddress,
  };
};
