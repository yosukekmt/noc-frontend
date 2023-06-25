import DeleteDialog from "@/components/dashboard/invitations/delete-dialog";
import NewDialog from "@/components/dashboard/invitations/new-dialog";
import ProjectUsersDeleteDialog from "@/components/dashboard/project-users/delete-dialog";
import HtmlHead from "@/components/html-head";
import { useCurrentUserApi } from "@/hooks/useCurrentUserApi";
import { useFirebase } from "@/hooks/useFirebase";
import { useInvitationsApi } from "@/hooks/useInvitationsApi";
import { useUsersApi } from "@/hooks/useUsersApi";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Invitation, User } from "@/models";
import { DeleteIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
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
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

const InvitationCell = (props: {
  projectId: string;
  invitation: Invitation;
  onDeleted: (itemId: string) => void;
}) => {
  const deleteDialog = useDisclosure();

  const clickDelete = () => {
    deleteDialog.onOpen();
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
        <Flex align="center">
          <Text>{props.invitation.email}</Text>
          <Spacer />
          <Badge>Invited</Badge>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
              variant="ghots"
            />
            <MenuList>
              <MenuItem icon={<DeleteIcon />} onClick={clickDelete}>
                Remove
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Card>
      <DeleteDialog
        projectId={props.projectId}
        item={props.invitation}
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.onClose}
        onOpen={deleteDialog.onOpen}
        onDeleted={props.onDeleted}
      />
    </>
  );
};

const UserCell = (props: {
  projectId: string;
  user: User;
  onDeleted: (itemId: string) => void;
}) => {
  const deleteDialog = useDisclosure();
  const { authToken } = useFirebase();
  const { getCurrentUser } = useCurrentUserApi();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (!authToken) return;

    (async () => {
      const item = await getCurrentUser(authToken);
      setCurrentUser(item);
    })();
  }, [authToken, getCurrentUser]);

  const clickDelete = () => {
    deleteDialog.onOpen();
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
        <Flex align="center">
          <Text>{props.user.email}</Text>
          <Spacer />
          <Badge>Joined</Badge>
          {currentUser && props.user.email !== currentUser.email && (
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
                  onClick={clickDelete}
                  disabled={
                    !!currentUser && props.user.email === currentUser.email
                  }
                >
                  Remove
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Card>
      <ProjectUsersDeleteDialog
        projectId={props.projectId}
        item={props.user}
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.onClose}
        onOpen={deleteDialog.onOpen}
        onDeleted={props.onDeleted}
      />
    </>
  );
};

export default function Members() {
  const { project_id } = useRouter().query;
  const { authToken } = useFirebase();
  const { callGetInvitations } = useInvitationsApi();
  const { callGetUsers } = useUsersApi();
  const [users, setUsers] = useState<User[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const newDialog = useDisclosure();

  const projectId = useMemo(() => {
    return project_id && (project_id as string);
  }, [project_id]);

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
      <HtmlHead />
      <DashboardLayout projectId={projectId}>
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
          <CardBody pt={0}>
            {isInitialized && projectId ? (
              <>
                {invitations.map((invitation) => {
                  return (
                    <InvitationCell
                      projectId={projectId}
                      invitation={invitation}
                      onDeleted={onInvitationDeleted}
                      key={`invitation_${invitation.id}`}
                    />
                  );
                })}
                {users.map((user) => {
                  return (
                    <UserCell
                      projectId={projectId}
                      user={user}
                      onDeleted={onUserDeleted}
                      key={`user_${user.id}`}
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
