import DeleteDialog from "@/components/dashboard/invitations/delete-dialog";
import { Invitation } from "@/models";
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
export default function InvitationCell(props: {
  projectId: string;
  invitation: Invitation;
  onDeleted: (itemId: string) => void;
}) {
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
}
