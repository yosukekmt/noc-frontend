import { useApiClient } from "@/hooks/useApiClient";
import { useFirebase } from "@/hooks/useFirebase";
import { User, useUsersApi } from "@/hooks/useUsersApi";
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
  onCreated(item: User): void;
}) {
  const { isOpen, onClose, onOpen, onCreated } = props;
  const { authToken } = useFirebase();
  const { validateEmail } = useValidator();
  const { callCreateUser } = useUsersApi();
  const { getErrorMessage, isBadRequestError } = useApiClient();
  const [email, setEmail] = useState("");
  const [isAttempted, setIsAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isValidEmail = useMemo(() => {
    return validateEmail(email);
  }, [validateEmail, email]);

  const createUser = useCallback(
    async (authToken: string, email: string) => {
      setIsLoading(true);
      try {
        const item = await callCreateUser(authToken, email);
        console.log(item);
        onCreated(item);
        onClose();
      } catch (err: unknown) {
        console.error(err);
        if (isBadRequestError(err)) {
          setErrorMessage("すでに登録済みのメールアドレスです。");
        } else {
          const errorMessage = getErrorMessage(err);
          if (errorMessage) {
            setErrorMessage(errorMessage);
          }
        }
      }
      setIsLoading(false);
    },
    [callCreateUser, getErrorMessage, onClose, onCreated, isBadRequestError]
  );

  const clickSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    if (!authToken) {
      return;
    }
    setIsAttempted(true);
    if (!isValidEmail) {
      return;
    }
    createUser(authToken, email);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={clickSubmit}>
        <ModalContent>
          <ModalHeader>メンバーを追加</ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody bg="gray.100">
            <FormControl>
              <FormLabel fontSize="sm">メールアドレス</FormLabel>
              <Input
                size="sm"
                bg="white"
                type="text"
                name="email"
                value={email}
                onChange={(evt) => setEmail(evt.target.value)}
              />
              <Box h={8} mt={2}>
                {(() => {
                  if (isAttempted && !isValidEmail) {
                    return (
                      <Flex align="center">
                        <WarningTwoIcon color="red" />
                        <Text
                          fontSize="sm"
                          fontWeight="normal"
                          color="red"
                          ml={2}
                        >
                          メールアドレスを入力してください。
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
              作成
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
