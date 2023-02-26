import { faker } from "@faker-js/faker";
import { useCallback } from "react";
import { useApiClient } from "./useApiClient";

export type Coupon = {
  uuid: string;
  name: string;
  address: string;
  targetAddress: string;
  startAt: Date;
  duration: string;
  createdAt: Date;
  updatedAt: Date;
};

export const useCouponsApi = () => {
  const { apiClient } = useApiClient();

  const callGetCoupons = useCallback(
    async (authToken: string): Promise<Coupon[]> => {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      /*
      const resp = await apiClient.get("/coupons", {
        headers: {
          Authorization: authToken,
        },
      });
      const items = resp.data.map((d: any) => {
        return {
          uuid: d.uuid,
          name: d.name,
          secretKey: null,
          createdAt: new Date(d.createdAt),
          updatedAt: new Date(d.updatedAt),
        };
      });*/
      const items = [null, null, null].flatMap((n): Coupon => {
        return {
          uuid: faker.datatype.uuid(),
          name: faker.git.branch(),
          address: faker.finance.ethereumAddress(),
          targetAddress: faker.finance.ethereumAddress(),
          startAt: faker.date.soon(),
          duration: [
            "1d",
            "2d",
            "3d",
            "1w",
            "2w",
            "3w",
            "1m",
            "2m",
            "3m",
            "6m",
            "1y",
          ][Math.floor(Math.random() * 11)],
          createdAt: faker.date.recent(),
          updatedAt: faker.date.recent(),
        };
      });
      return items;
    },
    []
  );

  const callCreateCoupons = useCallback(
    async (authToken: string, name: string): Promise<Coupon> => {
      /*
      const resp = await apiClient.post(
        "/coupons",
        { name },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      const item = {
        uuid: resp.data.uuid,
        name: resp.data.name,
        secretKey: null,
        createdAt: new Date(resp.data.createdAt),
        updatedAt: new Date(resp.data.updatedAt),
      };*/
      const item = {
        uuid: faker.datatype.uuid(),
        name: faker.git.branch(),
        address: faker.finance.ethereumAddress(),
        targetAddress: faker.finance.ethereumAddress(),
        startAt: faker.date.soon(),
        duration: [
          "1d",
          "2d",
          "3d",
          "1w",
          "2w",
          "3w",
          "1m",
          "2m",
          "3m",
          "6m",
          "1y",
        ][Math.floor(Math.random() * 11)],
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
      };
      return item;
    },
    [apiClient]
  );

  const callGetCoupon = useCallback(
    async (authToken: string, uuid: string): Promise<Coupon> => {
      /*
      const resp = await apiClient.get(`/coupons/${uuid}`, {
        headers: {
          Authorization: authToken,
        },
      });
      const item = {
        uuid: resp.data.uuid,
        name: resp.data.name,
        secretKey: resp.data.secretKey,
        createdAt: new Date(resp.data.createdAt),
        updatedAt: new Date(resp.data.updatedAt),
      };*/
      const item = {
        uuid: faker.datatype.uuid(),
        name: faker.git.branch(),
        address: faker.finance.ethereumAddress(),
        targetAddress: faker.finance.ethereumAddress(),
        startAt: faker.date.soon(),
        duration: [
          "1d",
          "2d",
          "3d",
          "1w",
          "2w",
          "3w",
          "1m",
          "2m",
          "3m",
          "6m",
          "1y",
        ][Math.floor(Math.random() * 11)],
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
      };
      return item;
    },
    [apiClient]
  );

  const callDeleteCoupon = useCallback(
    async (authToken: string, uuid: string): Promise<void> => {
      /*
      await apiClient.delete(`/coupons/${uuid}`, {
        headers: {
          Authorization: authToken,
        },
      });
      return;
      */
    },
    [apiClient]
  );

  return {
    callGetCoupons,
    callGetCoupon,
    callCreateCoupons,
    callDeleteCoupon,
  };
};
