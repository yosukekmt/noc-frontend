import { useApiClient } from "@/hooks/useApiClient";
import { useFirebase } from "@/hooks/useFirebase";
import { useInvitationsApi } from "@/hooks/useInvitationsApi";
import { Invitation } from "@/models";
import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { FormEvent, useCallback, useState } from "react";

export default function DeleteDialog(props: {
  projectId: string;
  item: Invitation;
  isOpen: boolean;
  onClose(): void;
  onOpen(): void;
  onDeleted(itemId: string): void;
}) {
  const { isOpen, onClose, onOpen, onDeleted } = props;
  const { authToken } = useFirebase();
  const { callDeleteInvitation } = useInvitationsApi();
  const { getErrorMessage } = useApiClient();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const deleteInvitation = useCallback(
    async (authToken: string, projectId: string, id: string) => {
      setIsLoading(true);
      try {
        await callDeleteInvitation(authToken, projectId, id);
        onDeleted(id);
        onClose();
      } catch (err: unknown) {
        console.error(err);
        const errorMessage = getErrorMessage(err);
        if (errorMessage) {
          setErrorMessage(errorMessage);
        }
      }
      setIsLoading(false);
    },
    [callDeleteInvitation, getErrorMessage, onClose, onDeleted]
  );

  const clickSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    if (!authToken) {
      return;
    }
    deleteInvitation(authToken, props.projectId, props.item.id);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={clickSubmit}>
        <ModalContent>
          <ModalHeader>
            <Flex align="center">
              <IconButton
                onClick={props.onClose}
                variant="outline"
                aria-label="Close"
                colorScheme="blackAlpha"
                borderColor="black"
                color="black"
                icon={<CloseIcon boxSize={2} />}
                mr={4}
              />
              Invalidate an invitation
            </Flex>
          </ModalHeader>
          <ModalBody>
            <Text fontSize="md">
              <Text as="span" fontWeight="bold">
                {props.item.email}
              </Text>{" "}
              will no longer be available.
            </Text>
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isLoading} ml={2}>
              Invalidate
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
