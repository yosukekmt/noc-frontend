import { useApiClient } from "@/hooks/useApiClient";
import { useFirebase } from "@/hooks/useFirebase";
import { useProjectsApi } from "@/hooks/useProjectsApi";
import { useValidator } from "@/hooks/useValidator";
import { Chain, Project } from "@/models";
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
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { FormEvent, useCallback, useMemo, useState } from "react";

export default function WithdrawDialog(props: {
  project: Project;
  chain: Chain;
  isOpen: boolean;
  onClose(): void;
  onOpen(): void;
  onSubmitted(): void;
}) {
  const { isOpen, onClose, onOpen } = props;
  const { authToken } = useFirebase();
  const { validateContractAddress } = useValidator();
  const { callWithdraw } = useProjectsApi();
  const { getErrorMessage } = useApiClient();
  const [walletAddress, setWalletAddress] = useState("");
  const [isAttempted, setIsAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isValidWalletAddress = useMemo(() => {
    return validateContractAddress(walletAddress);
  }, [validateContractAddress, walletAddress]);

  const requestWithdraw = useCallback(
    async (
      authToken: string,
      id: string,
      chainId: number,
      walletAddress: string
    ) => {
      setIsLoading(true);
      try {
        const item = await callWithdraw(authToken, id, chainId, walletAddress);
        props.onSubmitted();
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
    [callWithdraw, getErrorMessage, onClose, props]
  );

  const clickSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    if (!authToken) return;

    setIsAttempted(true);

    if (!isValidWalletAddress) return;

    requestWithdraw(authToken, props.project.id, props.chain.id, walletAddress);
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
              Request withdrawal
            </Flex>
          </ModalHeader>
          <Divider />
          <ModalBody>
            <Text fontSize="md" fontWeight="light" color="gray">
              You can withdraw the funds from this coupon tresury and have them
              transferred to a wallet address of your choosing. It is important
              to ensure that the wallet address provided is accurate and valid.
              Otherwise, the funds may be lost and cannot be retrieved.
            </Text>
            <FormControl my={8}>
              <FormLabel fontSize="sm">Network</FormLabel>
              <Input
                size="sm"
                bg="white"
                type="text"
                name="name"
                disabled={true}
                value={props.chain.name}
              />
            </FormControl>
            <FormControl mt={4} isRequired>
              <FormLabel fontSize="sm">Reimbursement wallet address</FormLabel>
              <Input
                size="sm"
                bg="white"
                type="text"
                name="name"
                value={walletAddress}
                placeholder="0x0000000000000000000000000000000000000000"
                onChange={(evt) => setWalletAddress(evt.target.value)}
              />
              <Box h={8} mt={2}>
                {isAttempted && !isValidWalletAddress && (
                  <Flex align="center">
                    <WarningTwoIcon color="red" />
                    <Text fontSize="sm" fontWeight="normal" color="red" ml={2}>
                      Please enter a valid wallet address
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
              Request Withdrawal
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
