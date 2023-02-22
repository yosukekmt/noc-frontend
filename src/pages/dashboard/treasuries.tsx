import DeleteDialog from "@/components/dashboard/treasuries/delete-dialog";
import NewDialog from "@/components/dashboard/treasuries/new-dialog";
import { useFirebase } from "@/hooks/useFirebase";
import { Treasury, useTreasuriesApi } from "@/hooks/useTreasuriesApi";
import DashboardLayout from "@/layouts/dashboard-layout";
import { DeleteIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Button,
  Card,
  CardHeader,
  Center,
  Divider,
  Flex,
  Grid,
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
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";

const LoadingTBody = () => {
  return (
    <Tbody>
      {[...Array(3)].flatMap((x, idx) => {
        return (
          <Tr key={`treasury_${idx}`} h={16}>
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

const LoadedTbodyRow = (props: { clickDelete: () => void; item: Treasury }) => {
  return (
    <Tr key={`treasury_${props.item.uuid}`} h={16}>
      <Td fontWeight="normal" fontSize="sm">
        {props.item.name}
      </Td>
      <Td fontWeight="normal" fontSize="sm">
        {props.item.balance}
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
            <MenuItem icon={<DeleteIcon />} onClick={props.clickDelete}>
              Invalidate
            </MenuItem>
          </MenuList>
        </Menu>
      </Td>
    </Tr>
  );
};

const LoadedTbody = (props: {
  clickDelete: (item: Treasury) => void;
  items: Treasury[];
}) => {
  return (
    <Tbody>
      {0 === props.items.length && (
        <Tr key={"treasury_empty"} h={16}>
          <Td colSpan={5}>
            <Center>There is not any treasuries.</Center>
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

export default function Treasuries() {
  const { authToken } = useFirebase();
  const { callGetTreasuries } = useTreasuriesApi();
  const [items, setItems] = useState<Treasury[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [targetTreasury, setTargetTreasury] = useState<Treasury | null>(null);
  const newDialog = useDisclosure();
  const deleteDialog = useDisclosure();

  const getTreasuries = useCallback(
    async (authToken: string): Promise<void> => {
      const items = await callGetTreasuries(authToken);
      setItems(items);
    },
    [callGetTreasuries]
  );

  useEffect(() => {
    if (!authToken) {
      return;
    }
    {
      (async () => {
        await getTreasuries(authToken);
        setIsInitialized(true);
      })();
    }
  }, [authToken, getTreasuries]);

  const clickNew = () => {
    newDialog.onOpen();
  };

  const clickDelete = (item: Treasury) => {
    setTargetTreasury(item);
    deleteDialog.onOpen();
  };

  const onCreated = (item: Treasury) => {
    if (!authToken) {
      return;
    }
    getTreasuries(authToken);
  };

  const onDeleted = () => {
    if (!authToken) {
      return;
    }
    getTreasuries(authToken);
  };

  return (
    <>
      <Head>
        <title>Nudge ONCHAIN</title>
        <meta
          name="description"
          content="Web3 native implementation of coupon and cashback systems."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <DashboardLayout>
        <Card variant="outline">
          <CardHeader>
            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
              <GridItem colSpan={{ base: 12, sm: 6 }}>
                <Heading as="h3" fontSize="2xl" fontWeight="bold">
                  Treasuries
                </Heading>
              </GridItem>
              <GridItem colSpan={{ base: 12, sm: 6 }}>
                <Flex align="center" h="100%">
                  <Spacer />
                  <Button
                    size="sm"
                    w={{ base: "100%", sm: "inherit" }}
                    onClick={clickNew}
                  >
                    New treasury
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
                  <Th>BALANCE</Th>
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
      {targetTreasury && (
        <DeleteDialog
          item={targetTreasury}
          isOpen={deleteDialog.isOpen}
          onClose={deleteDialog.onClose}
          onOpen={deleteDialog.onOpen}
          onDeleted={onDeleted}
        ></DeleteDialog>
      )}
    </>
  );
}
