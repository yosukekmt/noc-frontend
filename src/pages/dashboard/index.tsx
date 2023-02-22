import DeleteDialog from "@/components/dashboard/coupons/delete-dialog";
import NewDialog from "@/components/dashboard/coupons/new-dialog";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useFirebase } from "@/hooks/useFirebase";
import { Coupon, useCouponsApi } from "@/hooks/useCouponsApi";
import DashboardLayout from "@/layouts/dashboard-layout";
import { CheckIcon, DeleteIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  Center,
  CardHeader,
  Divider,
  Flex,
  Grid,
  Tooltip,
  GridItem,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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
  useDisclosure,
  useClipboard,
} from "@chakra-ui/react";
import Head from "next/head";
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
            <Td>
              <Skeleton h={4} />
            </Td>
            <Td></Td>
          </Tr>
        );
      })}
    </Tbody>
  );
};

const LoadedTbodyRow = (props: { clickDelete: () => void; item: Coupon }) => {
  const { onCopy, value, setValue, hasCopied } = useClipboard("");
  const { authToken } = useFirebase();

  const clickCopy = () => {
    onCopy();
  };

  return (
    <Tr key={`coupon_${props.item.uuid}`} h={16}>
      <Td fontWeight="normal" fontSize="sm">
        {props.item.name}
      </Td>
      <Td fontWeight="normal" fontSize="sm">
        {props.item.rewardType}
      </Td>
      <Td fontWeight="normal" fontSize="sm">
        <Tooltip label="Click to copy address">
          <Text fontWeight="normal" fontSize="sm" onClick={clickCopy}>
            {props.item.address}
          </Text>
        </Tooltip>
        {hasCopied && (
          <Flex align="center" mt={1}>
            <CheckIcon color="blue" />
            <Text color="blue" fontWeight="normal" fontSize="xs" ml={1}>
              Copied
            </Text>
          </Flex>
        )}
      </Td>
      <Td fontWeight="normal" fontSize="sm">
        <Tooltip label="Click to copy address">
          <Text fontWeight="normal" fontSize="sm" onClick={clickCopy}>
            {props.item.targetAddress}
          </Text>
        </Tooltip>
        {hasCopied && (
          <Flex align="center" mt={1}>
            <CheckIcon color="blue" />
            <Text color="blue" fontWeight="normal" fontSize="xs" ml={1}>
              Copied
            </Text>
          </Flex>
        )}
      </Td>
      <Td fontWeight="normal" fontSize="sm">
        {props.item.createdAt.toLocaleString()}
      </Td>
      <Td textAlign="end">
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            variant="ghots"
          />
          <MenuList>
            <MenuItem icon={<DeleteIcon />} onClick={() => props.clickDelete()}>
              Invalidate
            </MenuItem>
          </MenuList>
        </Menu>
      </Td>
    </Tr>
  );
};

const LoadedTbody = (props: {
  clickDelete: (item: Coupon) => void;
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
              item={item}
              clickDelete={() => props.clickDelete(item)}
            />
          );
        })}
    </Tbody>
  );
};

export default function Dashboard() {
  const router = useRouter();
  const { firebaseSignOut } = useFirebase();
  const { clearCurrentUser } = useCurrentUser();
  const { callGetCoupons } = useCouponsApi();
  const [items, setItems] = useState<Coupon[]>([]);
  const { authToken, isFirebaseInitialized } = useFirebase();
  const [isInitialized, setIsInitialized] = useState(false);
  const [targetCoupon, setTargetCoupon] = useState<Coupon | null>(null);

  const newDialog = useDisclosure();
  const deleteDialog = useDisclosure();

  const getCoupons = useCallback(
    async (authToken: string): Promise<void> => {
      const items = await callGetCoupons(authToken);
      setItems(items);
    },
    [callGetCoupons]
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
      console.log("callGetCoupons");
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

  const clickDelete = (item: Coupon) => {
    setTargetCoupon(item);
    deleteDialog.onOpen();
  };

  const onCreated = (item: Coupon) => {
    if (!authToken) {
      return;
    }
    getCoupons(authToken);
  };

  const onDeleted = () => {
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
                    Coupon NFT
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
                    New Coupon NFT
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
                  <Th>TYPE</Th>
                  <Th>ADDRESS</Th>
                  <Th>TARGET ADDRESS</Th>
                  <Th>CREATED</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              {isInitialized ? (
                <LoadedTbody items={items} clickDelete={clickDelete} />
              ) : (
                <LoadingTBody />
              )}
            </Table>
          </TableContainer>
        </Card>
      </DashboardLayout>
      <NewDialog
        isOpen={newDialog.isOpen}
        onClose={newDialog.onClose}
        onOpen={newDialog.onOpen}
        onCreated={onCreated}
      />
      {targetCoupon && (
        <DeleteDialog
          item={targetCoupon}
          isOpen={deleteDialog.isOpen}
          onClose={deleteDialog.onClose}
          onOpen={deleteDialog.onOpen}
          onDeleted={onDeleted}
        ></DeleteDialog>
      )}
    </>
  );
}
