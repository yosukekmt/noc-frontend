import { useApiClient } from "@/hooks/useApiClient";
import { useFirebase } from "@/hooks/useFirebase";
import { User, useUsersApi } from "@/hooks/useUsersApi";
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

export default function DeleteDialog(props: {
  user: User;
  isOpen: boolean;
  onClose(): void;
  onOpen(): void;
  onDeleted(): void;
}) {
  const { isOpen, onClose, onOpen, onDeleted } = props;
  const { authToken } = useFirebase();
  const { callDeleteUser } = useUsersApi();
  const { getErrorMessage } = useApiClient();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const deleteUser = useCallback(
    async (authToken: string, email: string) => {
      setIsLoading(true);
      try {
        await callDeleteUser(authToken, email);
        onDeleted();
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
    [callDeleteUser, getErrorMessage, onClose, onDeleted]
  );

  const clickSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    if (!authToken) {
      return;
    }
    deleteUser(authToken, props.user.email);
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
                {props.user.email}
              </Text>{" "}
              will no longer be able to access this account.
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
