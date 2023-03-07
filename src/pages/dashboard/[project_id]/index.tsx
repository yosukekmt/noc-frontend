import NewDialog from "@/components/dashboard/coupons/new-dialog";
import { useCouponsApi } from "@/hooks/useCouponsApi";
import { useCurrentUserApi } from "@/hooks/useCurrentUserApi";
import { useFirebase } from "@/hooks/useFirebase";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Coupon } from "@/models";
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
  useClipboard,
  useDisclosure,
} from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

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
          </Tr>
        );
      })}
    </Tbody>
  );
};

const LoadedTbodyRow = (props: { item: Coupon }) => {
  const { onCopy, value, setValue, hasCopied } = useClipboard("");
  const { authToken } = useFirebase();

  const clickCopy = () => {
    onCopy();
  };

  return (
    <Tr key={`coupon_${props.item.id}`} h={8}>
      <Td fontWeight="normal" fontSize="sm">
        <NextLink
          href={`/dashboard/coupons/${props.item.id}`}
          style={{ width: "100%", display: "block" }}
        >
          <Text>{props.item.name}</Text>
        </NextLink>
      </Td>
      <Td fontWeight="normal" fontSize="sm">
        <NextLink
          href={`/dashboard/coupons/${props.item.id}`}
          style={{ width: "100%", display: "block" }}
        >
          Gas fee cashback
        </NextLink>
      </Td>
      <Td fontWeight="normal" fontSize="sm">
        <NextLink
          href={`/dashboard/coupons/${props.item.id}`}
          style={{ width: "100%", display: "block" }}
        >
          {props.item.startAt.toLocaleString()}
        </NextLink>
      </Td>
      <Td fontWeight="normal" fontSize="sm">
        <NextLink
          href="/dashboard/coupons/uuid"
          style={{ width: "100%", display: "block" }}
        >
          {props.item.endAt.toLocaleString()}
        </NextLink>
      </Td>
    </Tr>
  );
};

const LoadedTbody = (props: { items: Coupon[] }) => {
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
          return <LoadedTbodyRow item={item} />;
        })}
    </Tbody>
  );
};

export default function Project() {
  const { project_id: projectId } = useRouter().query;
  const router = useRouter();
  const { firebaseSignOut } = useFirebase();
  const { clearCurrentUser } = useCurrentUserApi();
  const { callGetCoupons } = useCouponsApi();
  const [items, setItems] = useState<Coupon[]>([]);
  const { authToken, isFirebaseInitialized } = useFirebase();
  const [isInitialized, setIsInitialized] = useState(false);
  const newDialog = useDisclosure();

  const getCoupons = useCallback(
    async (authToken: string): Promise<void> => {
      const items = await callGetCoupons(authToken, projectId as string);
      setItems(items);
    },
    [callGetCoupons, projectId]
  );

  useEffect(() => {
    if (!isFirebaseInitialized) {
      return;
    }
    if (!authToken) {
      firebaseSignOut();
      clearCurrentUser();
      router.push("/");
      return;
    }

    (async () => {
      await getCoupons(authToken);
      setIsInitialized(true);
    })();
  }, [
    isFirebaseInitialized,
    authToken,
    firebaseSignOut,
    clearCurrentUser,
    router,
    getCoupons,
  ]);

  const clickNew = () => {
    newDialog.onOpen();
  };

  const onCreated = (item: Coupon) => {
    if (!authToken) {
      return;
    }
    getCoupons(authToken);
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
      <DashboardLayout>
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
                  <Th>START</Th>
                  <Th>DURATION</Th>
                </Tr>
              </Thead>
              {isInitialized ? <LoadedTbody items={items} /> : <LoadingTBody />}
            </Table>
          </TableContainer>
        </Card>
      </DashboardLayout>
      {projectId && (
        <NewDialog
          projectId={projectId as string}
          isOpen={newDialog.isOpen}
          onClose={newDialog.onClose}
          onOpen={newDialog.onOpen}
          onCreated={onCreated}
        />
      )}
    </>
  );
}
