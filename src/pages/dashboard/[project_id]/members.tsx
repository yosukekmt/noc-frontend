import DeleteDialog from "@/components/dashboard/invitations/delete-dialog";
import NewDialog from "@/components/dashboard/invitations/new-dialog";
import ProjectUsersDeleteDialog from "@/components/dashboard/project-users/delete-dialog";
import { useCurrentUserApi } from "@/hooks/useCurrentUserApi";
import { useFirebase } from "@/hooks/useFirebase";
import { useInvitationsApi } from "@/hooks/useInvitationsApi";
import { useUsersApi } from "@/hooks/useUsersApi";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Invitation, User } from "@/models";
import { DeleteIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Button,
  Card,
  CardHeader,
  Divider,
  Text,
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
  Badge,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

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

const InvitationLoadedTbody = (props: {
  projectId: string;
  items: Invitation[];
  onDeleted: (itemId: string) => void;
}) => {
  const deleteDialog = useDisclosure();
  const [targetItem, setTargetItem] = useState<Invitation | null>(null);

  const clickDelete = (item: Invitation) => {
    setTargetItem(item);
    deleteDialog.onOpen();
  };

  return (
    <>
      {props.items.map((item, idx) => {
        return (
          <Tr key={`members_${idx}`} h={16}>
            <Td fontWeight="normal" fontSize="sm">
              {item.email}
            </Td>
            <Td fontWeight="normal" fontSize="sm">
              <Badge>Invited</Badge>
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
                  <MenuItem
                    icon={<DeleteIcon />}
                    onClick={() => clickDelete(item)}
                  >
                    Remove
                  </MenuItem>
                </MenuList>
              </Menu>
            </Td>
          </Tr>
        );
      })}
      {targetItem && (
        <DeleteDialog
          projectId={props.projectId}
          item={targetItem}
          isOpen={deleteDialog.isOpen}
          onClose={deleteDialog.onClose}
          onOpen={deleteDialog.onOpen}
          onDeleted={props.onDeleted}
        />
      )}
    </>
  );
};

const UserLoadedTbody = (props: {
  projectId: string;
  items: User[];
  onDeleted: (itemId: string) => void;
}) => {
  const { authToken } = useFirebase();
  const { getCurrentUser } = useCurrentUserApi();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const deleteDialog = useDisclosure();
  const [targetItem, setTargetItem] = useState<User | null>(null);

  useEffect(() => {
    if (!authToken) return;

    (async () => {
      const item = await getCurrentUser(authToken);
      setCurrentUser(item);
    })();
  }, [authToken, getCurrentUser]);

  const clickDelete = (item: User) => {
    setTargetItem(item);
    deleteDialog.onOpen();
  };

  return (
    <>
      {props.items.map((item, idx) => {
        return (
          <Tr key={`members_${idx}`} h={16}>
            <Td fontWeight="normal" fontSize="sm">
              {item.email}
            </Td>
            <Td fontWeight="normal" fontSize="sm">
              <Badge>Joined</Badge>
            </Td>
            <Td textAlign="end">
              {currentUser && item.email !== currentUser.email && (
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label="Options"
                    icon={<HamburgerIcon />}
                    variant="ghots"
                  />
                  <MenuList>
                    <MenuItem
                      icon={<DeleteIcon />}
                      onClick={() => clickDelete(item)}
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
      {targetItem && (
        <ProjectUsersDeleteDialog
          projectId={props.projectId}
          item={targetItem}
          isOpen={deleteDialog.isOpen}
          onClose={deleteDialog.onClose}
          onOpen={deleteDialog.onOpen}
          onDeleted={props.onDeleted}
        />
      )}
    </>
  );
};

export default function Members() {
  const { project_id: projectId } = useRouter().query;
  const { authToken } = useFirebase();
  const { callGetInvitations } = useInvitationsApi();
  const { callGetUsers } = useUsersApi();
  const [users, setUsers] = useState<User[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const newDialog = useDisclosure();

  const getInvitations = useCallback(
    async (authToken: string, projectId: string): Promise<void> => {
      const items = await callGetInvitations(authToken, projectId);
      setInvitations(items);
    },
    [callGetInvitations]
  );
  const getUsers = useCallback(
    async (authToken: string, projectId: string): Promise<void> => {
      const items = await callGetUsers(authToken, projectId);
      setUsers(items);
    },
    [callGetUsers]
  );

  useEffect(() => {
    if (!authToken) return;
    if (!projectId) return;

    (async () => {
      await getInvitations(authToken, projectId as string);
      await getUsers(authToken, projectId as string);
      setIsInitialized(true);
    })();
  }, [authToken, projectId, getInvitations, getUsers]);

  const clickNew = () => {
    newDialog.onOpen();
  };

  const onCreated = (item: Invitation) => {
    if (!authToken) return;
    if (!projectId) return;

    getInvitations(authToken, projectId as string);
  };

  const onInvitationDeleted = (itemId: string) => {
    if (!authToken) return;
    if (!projectId) return;

    getInvitations(authToken, projectId as string);
  };

  const onUserDeleted = (itemId: string) => {
    if (!authToken) return;
    if (!projectId) return;

    getUsers(authToken, projectId as string);
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
                    Invite member
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
                  <Th>EMAIL</Th>
                  <Th>STATUS</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              {isInitialized ? (
                <>
                  <InvitationLoadedTbody
                    projectId={projectId as string}
                    items={invitations}
                    onDeleted={onInvitationDeleted}
                  />
                  <UserLoadedTbody
                    projectId={projectId as string}
                    items={users}
                    onDeleted={onUserDeleted}
                  />
                </>
              ) : (
                <LoadingTBody />
              )}
            </Table>
          </TableContainer>
        </Card>
      </DashboardLayout>
      <NewDialog
        projectId={projectId as string}
        isOpen={newDialog.isOpen}
        onClose={newDialog.onClose}
        onOpen={newDialog.onOpen}
        onCreated={onCreated}
      />
    </>
  );
}
