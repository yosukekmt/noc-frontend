import WithdrawSubmittedDialog from "@/components/dashboard/projects/withdraw-submitted-dialog";
import WithdrawDialog from "@/components/dashboard/projects/withdraw-dialog";
import HtmlHead from "@/components/html-head";
import { useBlockchain } from "@/hooks/useBlockchain";
import { useChainsApi } from "@/hooks/useChainsApi";
import { useFirebase } from "@/hooks/useFirebase";
import { useProjectsApi } from "@/hooks/useProjectsApi";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Chain, Project } from "@/models";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Grid,
  GridItem,
  Heading,
  Icon,
  Link,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ArrowSquareOut, Swap } from "phosphor-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const TableCell = (props: { project: Project; chain: Chain }) => {
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
      <Td>
        <Text fontWeight="normal" fontSize="sm">
          <Link href={walletExplorerUrl} isExternal>
            <Button
              size="xs"
              variant="ghost"
              leftIcon={<Icon as={ArrowSquareOut} />}
            >
              Details
            </Button>
          </Link>
          <Button
            size="xs"
            variant="ghost"
            leftIcon={<Icon as={Swap} />}
            onClick={clickWithdraw}
          >
            Withdraw
          </Button>
        </Text>
      </Td>
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
            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
              <GridItem colSpan={{ base: 12 }}>
                <Box>
                  <Heading as="h3" fontSize="2xl" fontWeight="bold">
                    Project Treasury
                  </Heading>
                </Box>
              </GridItem>
            </Grid>
          </CardHeader>
          <Divider />
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>NAME</Th>
                  <Th>WALLET ADDRESS</Th>
                  {chains.map((chain) => {
                    return <Th key={`chain_${chain.id}`}>{chain.name}</Th>;
                  })}
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>
                    <Text fontWeight="normal" fontSize="sm">
                      {item && item.name}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontWeight="normal" fontSize="sm">
                      {item && item.walletAddress}
                    </Text>
                  </Td>
                  {chains.map((chain) => {
                    if (item) {
                      return (
                        <TableCell
                          key={`chain_${chain.id}`}
                          project={item}
                          chain={chain}
                        />
                      );
                    } else {
                      return <Skeleton key={`chain_${chain.id}`} h={4} />;
                    }
                  })}
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Card>
      </DashboardLayout>
    </>
  );
}
