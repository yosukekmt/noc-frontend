import { useChainsApi } from "@/hooks/useChainsApi";
import { useCouponsApi } from "@/hooks/useCouponsApi";
import { useCurrentUserApi } from "@/hooks/useCurrentUserApi";
import { useFirebase } from "@/hooks/useFirebase";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Coupon, Chain } from "@/models";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Center,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Skeleton,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

const LoadingTBody = () => {
  return (
    <Tbody>
      {[...Array(3)].flatMap((x, idx) => {
        return (
          <Tr key={`coupon_${idx}`} h={16}>
            <Td>
              <Skeleton h={4} />
            </Td>
            <Td>
              <Skeleton h={4} />
            </Td>
            <Td>
              <Skeleton h={4} />
            </Td>
            <Td>
              <Skeleton h={4} />
            </Td>
            <Td>
              <Skeleton h={4} />
            </Td>
          </Tr>
        );
      })}
    </Tbody>
  );
};

const LoadedTbodyRow = (props: {
  chains: Chain[];
  projectId: string;
  item: Coupon;
}) => {
  const { getStatus } = useCouponsApi();

  const detailUrl = useMemo(() => {
    return `/dashboard/${props.projectId}/coupons/${props.item.id}`;
  }, [props.item.id, props.projectId]);

  const chain = useMemo(() => {
    return props.chains.find((chain) => chain.id === props.item.chainId);
  }, [props.chains, props.item.chainId]);

  const status = useMemo(() => {
    return getStatus(props.item);
  }, [getStatus, props.item]);

  return (
    <Tr key={`coupon_${props.item.id}`} h={8}>
      <Td fontWeight="normal" fontSize="sm">
        <NextLink href={detailUrl} style={{ width: "100%", display: "block" }}>
          <Text>{props.item.name}</Text>
        </NextLink>
      </Td>
      <Td fontWeight="normal" fontSize="sm">
        <NextLink href={detailUrl} style={{ width: "100%", display: "block" }}>
          Gas fee cashback
        </NextLink>
      </Td>
      <Td fontWeight="normal" fontSize="sm">
        <NextLink href={detailUrl} style={{ width: "100%", display: "block" }}>
          {chain && chain.name}
        </NextLink>
      </Td>
      <Td fontWeight="normal" fontSize="sm">
        <NextLink href={detailUrl} style={{ width: "100%", display: "block" }}>
          {status === "processing" && "Processing"}
          {status === "scheduled" && "Scheduled"}
          {status === "ongoing" && "Ongoing"}
          {status === "finished" && "Finished"}
          {status === "failed" && "Could not process"}
          {status === "invalidated" && "Invalidated"}
        </NextLink>
      </Td>
      <Td fontWeight="normal" fontSize="sm">
        <NextLink href={detailUrl} style={{ width: "100%", display: "block" }}>
          {props.item.createdAt.toLocaleString()}
        </NextLink>
      </Td>
    </Tr>
  );
};

const LoadedTbody = (props: {
  chains: Chain[];
  projectId: string;
  items: Coupon[];
}) => {
  return (
    <Tbody>
      {0 === props.items.length && (
        <Tr key={"coupons_empty"} h={16}>
          <Td colSpan={5}>
            <Center>There is not any coupons.</Center>
          </Td>
        </Tr>
      )}
      {0 < props.items.length &&
        props.items.flatMap((item) => {
          return (
            <LoadedTbodyRow
              chains={props.chains}
              projectId={props.projectId}
              item={item}
            />
          );
        })}
    </Tbody>
  );
};

export default function Project() {
  const router = useRouter();
  const { project_id: projectId } = router.query;
  const { firebaseSignOut } = useFirebase();
  const { clearCurrentUser } = useCurrentUserApi();
  const { callGetChains } = useChainsApi();
  const { callGetCoupons } = useCouponsApi();
  const [chains, setChains] = useState<Chain[]>([]);
  const [items, setItems] = useState<Coupon[]>([]);
  const { authToken, isFirebaseInitialized } = useFirebase();
  const [isInitialized, setIsInitialized] = useState(false);

  const getChains = useCallback(
    async (authToken: string): Promise<void> => {
      const items = await callGetChains(authToken);
      setChains(items);
    },
    [callGetChains]
  );

  const getCoupons = useCallback(
    async (authToken: string): Promise<void> => {
      const items = await callGetCoupons(authToken, projectId as string);
      setItems(items);
    },
    [callGetCoupons, projectId]
  );

  useEffect(() => {
    if (!isFirebaseInitialized) return;
    if (authToken) return;

    firebaseSignOut();
    clearCurrentUser();
    router.push("/");
    return;
  }, [
    authToken,
    clearCurrentUser,
    firebaseSignOut,
    isFirebaseInitialized,
    router,
  ]);

  useEffect(() => {
    if (!isFirebaseInitialized) return;
    if (!authToken) return;

    (async () => {
      await getChains(authToken);
      await getCoupons(authToken);
      setIsInitialized(true);
    })();
  }, [authToken, getChains, getCoupons, isFirebaseInitialized]);

  const clickNew = () => {
    router.push(`/dashboard/${projectId}/coupons/new`);
  };

  return (
    <>
      <Head>
        <title>Nudge ONCHAIN</title>
        <meta
          name="description"
          content="Native implementation of coupon and cashback systems."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <DashboardLayout projectId={projectId as string}>
        <Card variant="outline">
          <CardHeader>
            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
              <GridItem colSpan={{ base: 12, sm: 6 }}>
                <Box>
                  <Heading as="h3" fontSize="2xl" fontWeight="bold">
                    Gasback NFTs
                  </Heading>
                </Box>
              </GridItem>
              <GridItem colSpan={{ base: 12, sm: 6 }}>
                <Flex align="center" h="100%">
                  <Spacer />
                  <Button
                    size="sm"
                    w={{ base: "100%", sm: "inherit" }}
                    onClick={clickNew}
                  >
                    New Gasback NFT
                  </Button>
                </Flex>
              </GridItem>
            </Grid>
          </CardHeader>
          <Divider />
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>NAME</Th>
                  <Th>REWARD TYPE</Th>
                  <Th>NETWORK</Th>
                  <Th>STATUS</Th>
                  <Th>CREATED</Th>
                </Tr>
              </Thead>
              {isInitialized ? (
                <LoadedTbody
                  chains={chains}
                  projectId={projectId as string}
                  items={items}
                />
              ) : (
                <LoadingTBody />
              )}
            </Table>
          </TableContainer>
        </Card>
      </DashboardLayout>
    </>
  );
}
