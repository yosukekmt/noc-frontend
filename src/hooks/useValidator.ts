import { useCallback } from "react";

export const useValidator = () => {
  const validateProjectName = useCallback((arg: string) => {
    return /^.{1,}$/.test(arg);
  }, []);

  const validateEmail = useCallback((arg: string) => {
    return /^\w+([+.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,5})+$/.test(arg);
  }, []);

  const validatePassword = useCallback((arg: string) => {
    return /^.{6,}$/.test(arg);
  }, []);

  const validateCouponsName = useCallback((arg: string) => {
    return /^.{1,}$/.test(arg);
  }, []);

  const validateCouponSupply = useCallback((arg: number) => {
    return 0 < arg && arg <= 10000;
  }, []);

  const validateCouponsDescription = useCallback((arg: string) => {
    return /^.{1,}$/.test(arg);
  }, []);

  const validateContractAddress = useCallback((arg: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(arg);
  }, []);

  return {
    validateProjectName,
    validateEmail,
    validatePassword,
    validateCouponsName,
    validateCouponsDescription,
    validateCouponSupply,
    validateContractAddress,
  };
};
