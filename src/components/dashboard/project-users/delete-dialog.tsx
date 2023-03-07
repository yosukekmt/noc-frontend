import { useApiClient } from "@/hooks/useApiClient";
import { useFirebase } from "@/hooks/useFirebase";
import { useProjectUsersApi } from "@/hooks/useProjectUsersApi";
import { User } from "@/models";
import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { FormEvent, useCallback, useState } from "react";

export default function ProjectUsersDeleteDialog(props: {
  projectId: string;
  item: User;
  isOpen: boolean;
  onClose(): void;
  onOpen(): void;
  onDeleted(itemId: string): void;
}) {
  const { isOpen, onClose, onOpen, onDeleted } = props;
  const { authToken } = useFirebase();
  const { callDeleteProjectUser } = useProjectUsersApi();
  const { getErrorMessage } = useApiClient();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const deleteProjectUser = useCallback(
    async (authToken: string, projectId: string, userId: string) => {
      setIsLoading(true);
      try {
        await callDeleteProjectUser(authToken, projectId, userId);
        onDeleted(userId);
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
    [callDeleteProjectUser, getErrorMessage, onClose, onDeleted]
  );

  const clickSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    if (!authToken) {
      return;
    }
    deleteProjectUser(authToken, props.projectId, props.item.id);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={clickSubmit}>
        <ModalContent>
          <ModalHeader>Remove user from team</ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody bg="gray.100">
            <Text fontSize="md">
              <Text as="span" fontWeight="bold">
                {props.item.email}
              </Text>{" "}
              will no longer be able to access this project.
            </Text>
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isLoading} ml={2}>
              Remove user
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
