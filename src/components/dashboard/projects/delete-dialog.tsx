import { useApiClient } from "@/hooks/useApiClient";
import { useFirebase } from "@/hooks/useFirebase";
import { useProjectsApi } from "@/hooks/useProjectsApi";
import { Project } from "@/models";
import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  Flex,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { FormEvent, useCallback, useState } from "react";

export default function DeleteDialog(props: {
  item: Project;
  isOpen: boolean;
  onClose(): void;
  onOpen(): void;
  onDeleted(): void;
}) {
  const { isOpen, onClose, onOpen, onDeleted } = props;
  const { authToken } = useFirebase();
  const { callDeleteProject } = useProjectsApi();
  const { getErrorMessage } = useApiClient();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const deleteProject = useCallback(
    async (authToken: string, id: string) => {
      setIsLoading(true);
      try {
        await callDeleteProject(authToken, id);
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
    [callDeleteProject, getErrorMessage, onClose, onDeleted]
  );

  const clickSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    if (!authToken) {
      return;
    }
    deleteProject(authToken, props.item.id);
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
              Remove project
            </Flex>
          </ModalHeader>
          <ModalBody>
            <Text fontSize="md">
              All members belong to this project will also lose the access.
            </Text>
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isLoading} ml={2}>
              Delete project
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
