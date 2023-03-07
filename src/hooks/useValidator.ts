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

  const validateCouponsDescription = useCallback((arg: string) => {
    return /^.{1,}$/.test(arg);
  }, []);

  return {
    validateProjectName,
    validateEmail,
    validatePassword,
    validateCouponsName,
    validateCouponsDescription,
  };
};
