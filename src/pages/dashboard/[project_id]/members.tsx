import InvitationCell from "@/components/dashboard/coupons/invitation-cell";
import UserCell from "@/components/dashboard/coupons/user-cell";
import NewDialog from "@/components/dashboard/invitations/new-dialog";
import HtmlHead from "@/components/html-head";
import { useFirebase } from "@/hooks/useFirebase";
import { useInvitationsApi } from "@/hooks/useInvitationsApi";
import { useUsersApi } from "@/hooks/useUsersApi";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Invitation, User } from "@/models";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Skeleton,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

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
          <CardBody>
            {isInitialized && projectId ? (
              <Grid templateColumns="repeat(12, 1fr)" gap={2}>
                {invitations.map((invitation) => {
                  return (
                    <GridItem colSpan={12} key={`invitation_${invitation.id}`}>
                      <InvitationCell
                        projectId={projectId}
                        invitation={invitation}
                        onDeleted={onInvitationDeleted}
                      />
                    </GridItem>
                  );
                })}
                {users.map((user) => {
                  return (
                    <GridItem colSpan={12} key={`user_${user.id}`}>
                      <UserCell
                        projectId={projectId}
                        user={user}
                        onDeleted={onUserDeleted}
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
      {projectId && (
        <NewDialog
          projectId={projectId}
          isOpen={newDialog.isOpen}
          onClose={newDialog.onClose}
          onOpen={newDialog.onOpen}
          onCreated={onCreated}
        />
      )}
    </>
  );
}
