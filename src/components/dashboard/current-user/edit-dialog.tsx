import { useFirebase } from "@/hooks/useFirebase";
import { useValidator } from "@/hooks/useValidator";
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
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

export default function EditDialog(props: {
  isOpen: boolean;
  onClose(): void;
  onOpen(): void;
  onUpdated(): void;
}) {
  const { isOpen, onClose, onOpen, onUpdated } = props;
  const { authToken, updatePassword, getFirebaseErrorMessage } = useFirebase();
  const { validatePassword } = useValidator();

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");

  const [isAttempted, setIsAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isValidPassword = useMemo(() => {
    return validatePassword(password);
  }, [password, validatePassword]);
  const isValidNewPassword = useMemo(() => {
    return validatePassword(newPassword);
  }, [newPassword, validatePassword]);
  const isValidNewPasswordConfirmation = useMemo(() => {
    return newPassword === newPasswordConfirmation;
  }, [newPassword, newPasswordConfirmation]);

  useEffect(() => {
    setErrorMessage("");
  }, [password, newPassword, newPasswordConfirmation]);

  const apiCallUpdatePassword = useCallback(
    async (password: string, newPassword: string) => {
      setIsLoading(true);
      try {
        await updatePassword(password, newPassword);
        onUpdated();
        onClose();
      } catch (err: unknown) {
        console.error(err);
        const errorMessage = getFirebaseErrorMessage(err);
        if (errorMessage) {
          setErrorMessage(errorMessage);
        }
      }
      setIsLoading(false);
    },
    [updatePassword, getFirebaseErrorMessage, onUpdated, onClose]
  );

  const clickSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    if (!authToken) {
      return;
    }
    setIsAttempted(true);
    if (!isValidPassword) return;
    if (!isValidNewPassword) return;
    if (!isValidNewPasswordConfirmation) return;

    apiCallUpdatePassword(password, newPassword);
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
              Change your password
            </Flex>
          </ModalHeader>
          <ModalBody>
            <FormControl mt={8} isRequired>
              <FormLabel fontSize="sm">Current Password</FormLabel>
              <InputGroup size="lg">
                <Input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(evt) => setPassword(evt.target.value)}
                />
              </InputGroup>
            </FormControl>
            <FormControl mt={8} isRequired>
              <FormLabel fontSize="sm">New Password</FormLabel>
              <InputGroup size="lg">
                <Input
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={(evt) => setNewPassword(evt.target.value)}
                />
              </InputGroup>
            </FormControl>
            <FormControl mt={8} isRequired>
              <FormLabel fontSize="sm">New Password (Confirmation)</FormLabel>
              <InputGroup size="lg">
                <Input
                  type="password"
                  name="newPasswordConfirmation"
                  value={newPasswordConfirmation}
                  onChange={(evt) =>
                    setNewPasswordConfirmation(evt.target.value)
                  }
                />
              </InputGroup>
              <Box h={8} mt={2}>
                {isAttempted && !isValidNewPassword && (
                  <Flex align="center">
                    <WarningTwoIcon color="red" />
                    <Text fontSize="sm" fontWeight="normal" color="red" ml={2}>
                      Enter valid password
                    </Text>
                  </Flex>
                )}
                {isAttempted && !isValidNewPasswordConfirmation && (
                  <Flex align="center">
                    <WarningTwoIcon color="red" />
                    <Text fontSize="sm" fontWeight="normal" color="red" ml={2}>
                      Enter valid password
                    </Text>
                  </Flex>
                )}
                {isAttempted && errorMessage && (
                  <Flex align="center">
                    <WarningTwoIcon color="red" />
                    <Text fontSize="sm" fontWeight="normal" color="red" ml={2}>
                      {errorMessage}
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
              Change Password
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
