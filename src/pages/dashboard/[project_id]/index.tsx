import WithdrawDialog from "@/components/dashboard/projects/withdraw-dialog";
import WithdrawSubmittedDialog from "@/components/dashboard/projects/withdraw-submitted-dialog";
import HtmlHead from "@/components/html-head";
import { useBlockchain } from "@/hooks/useBlockchain";
import { useChainsApi } from "@/hooks/useChainsApi";
import { useFirebase } from "@/hooks/useFirebase";
import { useProjectsApi } from "@/hooks/useProjectsApi";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Chain, Project } from "@/models";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  Heading,
  Icon,
  Link,
  Skeleton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

const ProjectCell = (props: { project: Project; chain: Chain }) => {
  const { getExplorerAddressUrl } = useBlockchain();
  const requestDialog = useDisclosure();
  const requestedDialog = useDisclosure();

  const walletExplorerUrl = useMemo(() => {
    return getExplorerAddressUrl(
      props.chain.explorerUrl,
      props.project.walletAddress
    );
  }, [
    getExplorerAddressUrl,
    props.chain.explorerUrl,
    props.project.walletAddress,
  ]);

  const clickWithdraw = () => {
    requestDialog.onOpen();
  };

  const onSubmitted = () => {
    requestedDialog.onOpen();
  };
  return (
    <>
      <Card
        variant="outline"
        borderColor="tertiary.500"
        bgColor="tertiary.300"
        boxShadow="none"
        px={4}
        py={4}
        mt={2}
      >
        <Grid
          templateAreas={{
            base: `"project_name" "project_wallet" "project_withdraw"`,
            md: `"project_name project_wallet project_withdraw"`,
          }}
          gridTemplateColumns={{
            base: "100% 100% 100%",
            md: "280px calc(100% - 400px) 120px",
          }}
        >
          <GridItem area="project_name">
            <Text>{props.chain.name}</Text>
          </GridItem>
          <GridItem area="project_wallet">
            <Link href={walletExplorerUrl} isExternal>
              <Button fontWeight="light" variant="link">
                {props.project.walletAddress}
              </Button>
            </Link>
          </GridItem>
          <GridItem area="project_withdraw">
            <Button
              variant="link"
              leftIcon={<Icon as={FaExternalLinkAlt} />}
              onClick={clickWithdraw}
              mt={{ base: 4, md: 0 }}
            >
              Withdraw
            </Button>
          </GridItem>
        </Grid>
      </Card>
      <WithdrawDialog
        project={props.project}
        chain={props.chain}
        isOpen={requestDialog.isOpen}
        onClose={requestDialog.onClose}
        onOpen={requestDialog.onOpen}
        onSubmitted={onSubmitted}
      />
      <WithdrawSubmittedDialog
        project={props.project}
        chain={props.chain}
        isOpen={requestedDialog.isOpen}
        onClose={requestedDialog.onClose}
        onOpen={requestedDialog.onOpen}
      />
    </>
  );
};

export default function ProjectCampaigns() {
  const router = useRouter();
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
          <CardBody pt={0}>
            {isInitialized && item ? (
              <>
                {chains.map((chain) => {
                  return (
                    <ProjectCell
                      key={`chain_${chain.id}`}
                      project={item}
                      chain={chain}
                    />
                  );
                })}
              </>
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
