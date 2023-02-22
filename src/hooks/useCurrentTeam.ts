import { faker } from "@faker-js/faker";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";

export type Team = {
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

const currentTeamAtom = atom<Team | null>(null);

export const useCurrentTeam = () => {
  //const { apiClient } = useApiClient();
  const [currentTeam, setCurrentTeam] = useAtom(currentTeamAtom);

  const getCurrentTeam = useCallback(
    async (authToken: string): Promise<Team> => {
      if (currentTeam) {
        return currentTeam;
      }
      /*
      const resp = await apiClient.get("/teams/current", {
        headers: {
          Authorization: authToken,
        },
      });
      const item = {
        name: resp.data.name,
        createdAt: new Date(resp.data.createdAt),
        updatedAt: new Date(resp.data.updatedAt),
      };
      */

      const item = {
        name: faker.name.fullName(),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
      };
      setCurrentTeam(item);
      return item;
    },
    []
  );

  const clearCurrentTeam = useCallback(async () => {
    setCurrentTeam(null);
  }, [setCurrentTeam]);

  return {
    getCurrentTeam,
    clearCurrentTeam,
  };
};
