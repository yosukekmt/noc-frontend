import { useApiClient } from "@/hooks/useApiClient";
import { useFirebase } from "@/hooks/useFirebase";
import { Coupon, useCouponsApi } from "@/hooks/useCouponsApi";
import { useValidator } from "@/hooks/useValidator";
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
  onCreated(item: Coupon): void;
}) {
  const { isOpen, onClose, onOpen, onCreated } = props;
  const { authToken } = useFirebase();
  const { validateCouponsName } = useValidator();
  const { callCreateCoupons } = useCouponsApi();
  const { getErrorMessage } = useApiClient();
  const [name, setName] = useState("");
  const [isAttempted, setIsAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isValidName = useMemo(() => {
    return validateCouponsName(name);
  }, [validateCouponsName, name]);

  const callApiCreateToken = useCallback(
    async (authToken: string, name: string) => {
      setIsLoading(true);
      try {
        const item = await callCreateCoupons(authToken, name);
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
    [callCreateCoupons, getErrorMessage, onClose, onCreated]
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
    callApiCreateToken(authToken, name);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={clickSubmit}>
        <ModalContent>
          <ModalHeader>Create a new coupon NFT</ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody bg="gray.100">
            <FormControl>
              <FormLabel fontSize="sm">Coupon name</FormLabel>
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
                          Please enter a coupon name.
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
