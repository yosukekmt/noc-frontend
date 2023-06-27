import { useApiClient } from "@/hooks/useApiClient";
import { useFirebase } from "@/hooks/useFirebase";
import { useProjectsApi } from "@/hooks/useProjectsApi";
import { useValidator } from "@/hooks/useValidator";
import { Project } from "@/models";
import { CloseIcon, WarningTwoIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { FormEvent, useCallback, useMemo, useState } from "react";

export default function NewDialog(props: {
  closable: boolean;
  isOpen: boolean;
  onClose(): void;
  onOpen(): void;
  onCreated(item: Project): void;
}) {
  const { isOpen, onClose, onOpen, onCreated } = props;
  const { authToken } = useFirebase();
  const { validateProjectName } = useValidator();
  const { callCreateProject } = useProjectsApi();
  const { getErrorMessage } = useApiClient();
  const [name, setName] = useState("");
  const [isAttempted, setIsAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isValidName = useMemo(() => {
    return validateProjectName(name);
  }, [validateProjectName, name]);

  const createProject = useCallback(
    async (authToken: string, name: string) => {
      setIsLoading(true);
      try {
        const item = await callCreateProject(authToken, { name });
        onCreated(item);
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
    [callCreateProject, getErrorMessage, onClose, onCreated]
  );

  const clickSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    if (!authToken) {
      return;
    }
    setIsAttempted(true);
    if (!isValidName) {
      return;
    }
    createProject(authToken, name);
  };

  return (
    <Modal
      closeOnOverlayClick={props.closable}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <form onSubmit={clickSubmit}>
        <ModalContent>
          <ModalHeader>
            <Flex align="center">
              {props.closable && (
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
              )}
              Create a new project
            </Flex>
          </ModalHeader>
          <ModalBody>
            <FormControl isRequired>
              <FormLabel fontSize="sm">Project name</FormLabel>
              <Input
                size="sm"
                bg="white"
                type="text"
                name="name"
                value={name}
                onChange={(evt) => setName(evt.target.value)}
              />
              <Box h={8} mt={2}>
                {(() => {
                  if (isAttempted && !isValidName) {
                    return (
                      <Flex align="center">
                        <WarningTwoIcon color="red" />
                        <Text
                          fontSize="sm"
                          fontWeight="normal"
                          color="red"
                          ml={2}
                        >
                          Please enter a project name.
                        </Text>
                      </Flex>
                    );
                  } else if (isAttempted && errorMessage) {
                    return (
                      <Flex align="center">
                        <WarningTwoIcon color="red" />
                        <Text
                          fontSize="sm"
                          fontWeight="normal"
                          color="red"
                          ml={2}
                        >
                          {errorMessage}
                        </Text>
                      </Flex>
                    );
                  } else {
                    return <></>;
                  }
                })()}
              </Box>
            </FormControl>
          </ModalBody>
          <Divider />
          <ModalFooter>
            {props.closable && (
              <Button size="sm" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button type="submit" size="sm" isLoading={isLoading} ml={2}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
