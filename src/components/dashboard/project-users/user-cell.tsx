import ProjectUsersDeleteDialog from "@/components/dashboard/project-users/delete-dialog";
import { useCurrentUserApi } from "@/hooks/useCurrentUserApi";
import { useFirebase } from "@/hooks/useFirebase";
import { User } from "@/models";
import { DeleteIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Badge,
  Card,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function UserCell(props: {
  projectId: string;
  user: User;
  onDeleted: (itemId: string) => void;
}) {
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
}
