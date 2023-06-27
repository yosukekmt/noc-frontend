import EditDialog from "@/components/dashboard/current-user/edit-dialog";
import HtmlHead from "@/components/html-head";
import { useCurrentUserApi } from "@/hooks/useCurrentUserApi";
import { useFirebase } from "@/hooks/useFirebase";
import DashboardLayout from "@/layouts/dashboard-layout";
import { User } from "@/models";
import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Profile() {
  const { authToken } = useFirebase();
  const { getCurrentUser } = useCurrentUserApi();
  const [currentUser, setcurrentUser] = useState<User | null>(null);

  const editUserDialog = useDisclosure();
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  useEffect(() => {
    if (!authToken) {
      return;
    }
    {
      (async () => {
        const item = await getCurrentUser(authToken);
        setcurrentUser(item);
      })();
    }
  }, [authToken, getCurrentUser]);

  const clickEdit = () => {
    editUserDialog.onOpen();
  };
  const onUpdated = () => {
    setPasswordUpdated(true);
  };
  return (
    <>
      <HtmlHead />
      <DashboardLayout>
        <Card variant="outline">
          <CardHeader>
            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
              <GridItem colSpan={{ base: 12, sm: 6 }}>
                <Heading as="h3" fontSize="2xl" fontWeight="bold">
                  Profile
                </Heading>
              </GridItem>
            </Grid>
          </CardHeader>
          <CardBody>
            <Grid templateColumns="repeat(12, 1fr)" gap={2}>
              <GridItem colSpan={{ base: 12, md: 9, lg: 6 }}>
                <Box>
                  <Flex align="center" h={8} mt={8}>
                    <Heading w={200} fontSize="sm">
                      Email
                    </Heading>
                    <Text fontSize="sm">
                      {currentUser && currentUser.email}
                    </Text>
                  </Flex>
                  <Flex align="center" h={8} mt={8}>
                    <Heading w={200} fontSize="sm">
                      Password
                    </Heading>
                    <Box>
                      {currentUser && (
                        <Flex>
                          <Text fontSize="sm">••••••••</Text>
                          <IconButton
                            size="xs"
                            onClick={clickEdit}
                            ml={4}
                            aria-label="Change password..."
                          >
                            <EditIcon />
                          </IconButton>
                        </Flex>
                      )}
                      {passwordUpdated && (
                        <Text fontSize="sm" color="red">
                          Your password is successfully updated.
                        </Text>
                      )}
                    </Box>
                  </Flex>
                </Box>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>
      </DashboardLayout>
      <EditDialog
        isOpen={editUserDialog.isOpen}
        onClose={editUserDialog.onClose}
        onOpen={editUserDialog.onOpen}
        onUpdated={onUpdated}
      />
    </>
  );
}
