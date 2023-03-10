import { useCallback } from "react";

export const useUtil = () => {
  const truncateContractAddress = useCallback((arg: string) => {
    const match = arg.match(/^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/);
    if (!match) return arg;
    return `${match[1]}…${match[2]}`;
  }, []);

  return {
    truncateContractAddress,
  };
};
