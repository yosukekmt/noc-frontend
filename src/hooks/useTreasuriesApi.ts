import { faker } from "@faker-js/faker";
import { useCallback } from "react";
import { useApiClient } from "./useApiClient";

export type Treasury = {
  uuid: string;
  name: string;
  balance: string;
  createdAt: Date;
  updatedAt: Date;
};

export const useTreasuriesApi = () => {
  const { apiClient } = useApiClient();

  const callGetTreasuries = useCallback(
    async (authToken: string): Promise<Treasury[]> => {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      /*
      const resp = await apiClient.get("/treasuries", {
        headers: {
          Authorization: authToken,
        },
      });
      const items = resp.data.map((d: any) => {
        return {
          uuid: d.uuid,
          name: d.name,
          url: d.url,
          verificationKey: d.verificationKey,
          createdAt: new Date(d.createdAt),
          updatedAt: new Date(d.updatedAt),
        };
      });*/
      const items = [null, null, null].flatMap((n) => {
        return {
          uuid: faker.datatype.uuid(),
          name: faker.git.branch(),
          balance: faker.finance.amount(0, 1, 10, "", true),
          createdAt: faker.date.recent(),
          updatedAt: faker.date.recent(),
        };
      });
      return items;
    },
    []
  );

  const callCreateTreasury = useCallback(
    async (authToken: string, name: string): Promise<Treasury> => {
      /*
      const resp = await apiClient.post(
        "/treasuries",
        { name, url },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      const item = {
        uuid: resp.data.uuid,
        name: resp.data.name,
        url: resp.data.url,
        verificationKey: resp.data.verificationKey,
        createdAt: new Date(resp.data.createdAt),
        updatedAt: new Date(resp.data.updatedAt),
      };*/
      const item = {
        uuid: faker.datatype.uuid(),
        name: faker.git.branch(),
        balance: faker.finance.amount(0, 1, 10, "", true),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
      };
      return item;
    },
    [apiClient]
  );

  const callGetTreasury = useCallback(
    async (authToken: string, uuid: string): Promise<Treasury> => {
      /*
      const resp = await apiClient.get(`/treasuries/${uuid}`, {
        headers: {
          Authorization: authToken,
        },
      });
      const item = {
        uuid: resp.data.uuid,
        name: resp.data.name,
        url: resp.data.url,
        verificationKey: resp.data.verificationKey,
        createdAt: new Date(resp.data.createdAt),
        updatedAt: new Date(resp.data.updatedAt),
      };*/
      const item = {
        uuid: faker.datatype.uuid(),
        name: faker.git.branch(),
        balance: faker.finance.amount(0, 1, 10, "", true),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
      };
      return item;
    },
    [apiClient]
  );

  const callUpdateTreasury = useCallback(
    async (
      authToken: string,
      uuid: string,
      name: string,
      url: string
    ): Promise<Treasury> => {
      /*
      const resp = await apiClient.patch(
        `/treasuries/${uuid}`,
        { name, url },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      const item = {
        uuid: resp.data.uuid,
        name: resp.data.name,
        url: resp.data.url,
        verificationKey: resp.data.verificationKey,
        createdAt: new Date(resp.data.createdAt),
        updatedAt: new Date(resp.data.updatedAt),
      };*/
      const item = {
        uuid: faker.datatype.uuid(),
        name: faker.git.branch(),
        balance: faker.finance.amount(0, 1, 10, "", true),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
      };
      return item;
    },
    [apiClient]
  );
  const callDeleteTreasury = useCallback(
    async (authToken: string, uuid: string): Promise<void> => {
      /*
      await apiClient.delete(`/treasuries/${uuid}`, {
        headers: {
          Authorization: authToken,
        },
      });*/
      return;
    },
    [apiClient]
  );

  return {
    callGetTreasuries,
    callCreateTreasury,
    callGetTreasury,
    callUpdateTreasury,
    callDeleteTreasury,
  };
};
