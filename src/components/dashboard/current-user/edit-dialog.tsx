import { useFirebase } from "@/hooks/useFirebase";
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
    if (!isValidPassword) {
      return;
    }
    if (!isValidNewPassword) {
      return;
    }
    if (!isValidNewPasswordConfirmation) {
      return;
    }
    apiCallUpdatePassword(password, newPassword);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={clickSubmit}>
        <ModalContent>
          <ModalHeader>パスワードの変更</ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody bg="gray.100">
            <FormControl mt={8}>
              <FormLabel fontSize="sm">現在のパスワード</FormLabel>
              <InputGroup size="lg">
                <Input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(evt) => setPassword(evt.target.value)}
                />
              </InputGroup>
              <Box h={2} mt={2}>
                {isAttempted && !isValidPassword && (
                  <Flex align="center">
                    <WarningTwoIcon color="red" />
                    <Text fontSize="sm" fontWeight="normal" color="red" ml={2}>
                      現在のパスワードを入力してください。
                    </Text>
                  </Flex>
                )}
              </Box>
            </FormControl>
            <FormControl mt={8}>
              <FormLabel fontSize="sm">新しいパスワード</FormLabel>
              <InputGroup size="lg">
                <Input
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={(evt) => setNewPassword(evt.target.value)}
                />
              </InputGroup>
              <Box h={2} mt={2}>
                {isAttempted && !isValidNewPassword && (
                  <Flex align="center">
                    <WarningTwoIcon color="red" />
                    <Text fontSize="sm" fontWeight="normal" color="red" ml={2}>
                      新しいパスワードを入力してください。
                    </Text>
                  </Flex>
                )}
              </Box>
            </FormControl>
            <FormControl mt={8}>
              <FormLabel fontSize="sm">新しいパスワード（確認）</FormLabel>
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
                {(() => {
                  if (isAttempted && !isValidNewPasswordConfirmation) {
                    return (
                      <Flex align="center">
                        <WarningTwoIcon color="red" />
                        <Text
                          fontSize="sm"
                          fontWeight="normal"
                          color="red"
                          ml={2}
                        >
                          新しいパスワード（確認）を入力してください。
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
              キャンセル
            </Button>
            <Button type="submit" size="sm" isLoading={isLoading} ml={2}>
              パスワードの変更
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
