import { useApiClient } from "@/hooks/useApiClient";
import { useFirebase } from "@/hooks/useFirebase";
import { useValidator } from "@/hooks/useValidator";
import { Treasury, useTreasuriesApi } from "@/hooks/useTreasuriesApi";
import { WarningTwoIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { FormEvent, useCallback, useMemo, useState } from "react";

export default function NewDialog(props: {
  isOpen: boolean;
  onClose(): void;
  onOpen(): void;
  onCreated(item: Treasury): void;
}) {
  const { isOpen, onClose, onOpen, onCreated } = props;
  const { authToken } = useFirebase();
  const { validateTreasuryName } = useValidator();
  const { callCreateTreasury } = useTreasuriesApi();
  const { getErrorMessage } = useApiClient();
  const [name, setName] = useState("");
  const [isAttempted, setIsAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isValidName = useMemo(() => {
    return validateTreasuryName(name);
  }, [name, validateTreasuryName]);

  const callApiCreateTreasury = useCallback(
    async (authToken: string, name: string) => {
      setIsLoading(true);
      try {
        const item = await callCreateTreasury(authToken, name);
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
    [callCreateTreasury, getErrorMessage, onClose, onCreated]
  );

  const clickSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    if (!authToken) return;

    setIsAttempted(true);
    if (!isValidName) return;

    callApiCreateTreasury(authToken, name);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={clickSubmit}>
        <ModalContent>
          <ModalHeader>Create a new treasury</ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody bg="gray.100">
            <FormControl>
              <FormLabel fontSize="sm">Treasury name</FormLabel>
              <Input
                size="sm"
                bg="white"
                type="text"
                name="name"
                value={name}
                onChange={(evt) => setName(evt.target.value)}
              />
              <Box h={2} mt={2}>
                {isAttempted && !isValidName && (
                  <Flex align="center">
                    <WarningTwoIcon color="red" />
                    <Text fontSize="sm" fontWeight="normal" color="red" ml={2}>
                      Treasury name is required.
                    </Text>
                  </Flex>
                )}
              </Box>
            </FormControl>
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isLoading} ml={2}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
