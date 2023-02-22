import DeleteDialog from "@/components/dashboard/users/delete-dialog";
import NewDialog from "@/components/dashboard/users/new-dialog";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useFirebase } from "@/hooks/useFirebase";
import { User, useUsersApi } from "@/hooks/useUsersApi";
import DashboardLayout from "@/layouts/dashboard-layout";
import { DeleteIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Button,
  Card,
  CardHeader,
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
import { useCallback, useEffect, useMemo, useState } from "react";

const LoadingTBody = () => {
  return (
    <Tbody>
      {[...Array(3)].flatMap((x, idx) => {
        return (
          <Tr key={`members_${idx}`} h={16}>
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

const LoadedTbody = (props: {
  clickDelete: (item: User) => void;
  items: User[];
}) => {
  const { authToken } = useFirebase();
  const { getCurrentUser } = useCurrentUser();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  useEffect(() => {
    if (!authToken) {
      return;
    }
    {
      (async () => {
        const item = await getCurrentUser(authToken);
        console.log(item);
        setCurrentUser(item);
      })();
    }
  }, [authToken, getCurrentUser]);
  return (
    <Tbody>
      {props.items.flatMap((item, idx) => {
        return (
          <Tr key={`members_${idx}`} h={16}>
            <Td fontWeight="normal" fontSize="sm">
              {item.email}
            </Td>
            <Td fontWeight="normal" fontSize="sm">
              {item.createdAt.toLocaleString()}
            </Td>
            <Td textAlign="end">
              {currentUser && item.email !== currentUser.email && (
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label="Options"
                    icon={<HamburgerIcon />}
                    variant="ghots"
                    disabled={!currentUser}
                  />
                  <MenuList>
                    <MenuItem
                      icon={<DeleteIcon />}
                      onClick={() => props.clickDelete(item)}
                      disabled={
                        !!currentUser && item.email === currentUser.email
                      }
                    >
                      Remove
                    </MenuItem>
                  </MenuList>
                </Menu>
              )}
            </Td>
          </Tr>
        );
      })}
    </Tbody>
  );
};

export default function Members() {
  const { authToken } = useFirebase();
  const { callGetUsers } = useUsersApi();
  const [items, setItems] = useState<User[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const newUserDialog = useDisclosure();
  const deleteUserDialog = useDisclosure();

  const getUsers = useCallback(
    async (authToken: string): Promise<void> => {
      const items = await callGetUsers(authToken);
      setItems(items);
    },
    [callGetUsers]
  );

  useEffect(() => {
    if (!authToken) {
      return;
    }
    {
      (async () => {
        await getUsers(authToken);
        setIsInitialized(true);
      })();
    }
  }, [authToken, getUsers]);

  const clickNew = () => {
    newUserDialog.onOpen();
  };

  const clickDelete = (item: User) => {
    setTargetUser(item);
    deleteUserDialog.onOpen();
  };

  const onCreated = (item: User) => {
    if (!authToken) {
      return;
    }
    getUsers(authToken);
  };

  const onDeleted = () => {
    if (!authToken) {
      return;
    }
    getUsers(authToken);
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
                <Heading as="h3" fontSize="2xl" fontWeight="bold">
                  Team
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
                    New Member
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
                  <Th>Email</Th>
                  <Th>Created</Th>
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
        isOpen={newUserDialog.isOpen}
        onClose={newUserDialog.onClose}
        onOpen={newUserDialog.onOpen}
        onCreated={onCreated}
      />
      {targetUser && (
        <DeleteDialog
          user={targetUser}
          isOpen={deleteUserDialog.isOpen}
          onClose={deleteUserDialog.onClose}
          onOpen={deleteUserDialog.onOpen}
          onDeleted={onDeleted}
        ></DeleteDialog>
      )}
    </>
  );
}
