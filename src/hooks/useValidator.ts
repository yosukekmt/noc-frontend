import { useCallback } from "react";

export const useValidator = () => {
  const validateEmail = useCallback((arg: string) => {
    return /^\w+([+.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,5})+$/.test(arg);
  }, []);

  const validatePassword = useCallback((arg: string) => {
    return /^.{6,}$/.test(arg);
  }, []);

  const validateCouponsName = useCallback((arg: string) => {
    return /^.{1,}$/.test(arg);
  }, []);

  const validateTreasuryName = useCallback((arg: string) => {
    return /^.{1,}$/.test(arg);
  }, []);

  return {
    validateEmail,
    validatePassword,
    validateCouponsName,
    validateTreasuryName,
  };
};
