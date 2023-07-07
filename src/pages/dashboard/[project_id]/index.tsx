import ChainCell from "@/components/dashboard/coupons/chain-cell";
import HtmlHead from "@/components/html-head";
import { useChainsApi } from "@/hooks/useChainsApi";
import { useFirebase } from "@/hooks/useFirebase";
import { useProjectsApi } from "@/hooks/useProjectsApi";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Chain, Project } from "@/models";
import {
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  Heading,
  Skeleton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function ProjectCampaigns() {
  const router = useRouter();
  const cellType = useBreakpointValue<"grid" | "row">({
    base: "grid",
    md: "row",
  });
  const { project_id } = router.query;
  const { callGetChains } = useChainsApi();
  const { callGetProject } = useProjectsApi();
  const [chains, setChains] = useState<Chain[]>([]);
  const [item, setItem] = useState<Project | undefined>(undefined);
  const { authToken, isFirebaseInitialized } = useFirebase();
  const [isInitialized, setIsInitialized] = useState(false);

  const projectId = useMemo(() => {
    return project_id && (project_id as string);
  }, [project_id]);

  const getChains = useCallback(
    async (authToken: string): Promise<void> => {
      const items = await callGetChains(authToken);
      setChains(items);
    },
    [callGetChains]
  );

  const getProject = useCallback(
    async (authToken: string, projectId: string): Promise<void> => {
      const item = await callGetProject(authToken, projectId);
      setItem(item);
    },
    [callGetProject]
  );

  useEffect(() => {
    if (!isFirebaseInitialized) return;
    if (!authToken) return;

    (async () => {
      await getChains(authToken);
    })();
  }, [authToken, getChains, isFirebaseInitialized]);

  useEffect(() => {
    if (!isFirebaseInitialized) return;
    if (!authToken) return;
    if (!projectId) return;

    (async () => {
      await getProject(authToken, projectId);
      setIsInitialized(true);
    })();
  }, [authToken, getProject, isFirebaseInitialized, projectId]);

  return (
    <>
      <HtmlHead />
      <DashboardLayout projectId={projectId}>
        <Card variant="outline">
          <CardHeader>
            <Heading as="h3" fontSize="2xl" fontWeight="bold">
              Treasury
            </Heading>
          </CardHeader>
          <CardBody>
            {isInitialized && item && cellType ? (
              <Grid templateColumns="repeat(12, 1fr)" gap={2}>
                {chains.map((chain) => {
                  return (
                    <GridItem colSpan={12} key={`chain_${chain.id}`}>
                      <ChainCell
                        project={item}
                        chain={chain}
                        cellType={cellType!}
                      />
                    </GridItem>
                  );
                })}
              </Grid>
            ) : (
              <>
                <Skeleton h={4} mt={2} />
                <Skeleton h={4} mt={2} />
                <Skeleton h={4} mt={2} />
              </>
            )}
          </CardBody>
        </Card>
      </DashboardLayout>
    </>
  );
}
