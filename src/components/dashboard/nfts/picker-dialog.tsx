import { useFirebase } from "@/hooks/useFirebase";
import { useNftsApi } from "@/hooks/useNftsApi";
import { useValidator } from "@/hooks/useValidator";
import { Chain, Nft } from "@/models";
import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
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
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { FaArrowRight } from "react-icons/fa";

export default function PickerDialog(props: {
  chain: Chain;
  isOpen: boolean;
  onClose(): void;
  onOpen(): void;
  onPicked(item: Nft): void;
}) {
  const { authToken } = useFirebase();
  const { validateContractAddress } = useValidator();
  const { callGetNft } = useNftsApi();
  const [contractAddress, setContractAddress] = useState("");
  const [item, setItem] = useState<Nft | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isValidContractAddress = useMemo(() => {
    return validateContractAddress(contractAddress);
  }, [validateContractAddress, contractAddress]);

  const isNftFound = useMemo(() => {
    return !!item;
  }, [item]);

  const isAddable = useMemo(() => {
    return isValidContractAddress && isNftFound;
  }, [isNftFound, isValidContractAddress]);

  const getNft = useCallback(
    async (
      authToken: string,
      chainId: number,
      contractAddress: string
    ): Promise<Nft> => {
      const item = await callGetNft(authToken, chainId, contractAddress);
      return item;
    },
    [callGetNft]
  );

  useEffect(() => {
    if (!authToken) return;
    if (!isValidContractAddress) return;

    (async () => {
      setIsLoading(true);
      try {
        const item = await getNft(authToken, props.chain.id, contractAddress);
        setItem(item);
      } catch (err: unknown) {
        console.error(err);
      }
      setIsLoading(false);
    })();
  }, [
    authToken,
    isValidContractAddress,
    getNft,
    props.chain.id,
    contractAddress,
  ]);

  const clickSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    if (!item) return;
    props.onPicked(item);
    props.onClose();
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
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
              Add NFT Collection
            </Flex>
          </ModalHeader>
          <Divider />
          <ModalBody>
            <FormControl>
              <FormLabel fontSize="sm">Network</FormLabel>
              <Input
                size="sm"
                bg="white"
                type="text"
                name="chainId"
                value={props.chain.name}
                disabled={true}
              />
            </FormControl>
            <FormControl mt={2}>
              <FormLabel fontSize="sm">Contract Address</FormLabel>
              <Input
                size="sm"
                bg="white"
                type="text"
                name="contractAddress"
                value={contractAddress}
                placeholder="0x..."
                onChange={(evt) => setContractAddress(evt.target.value)}
              />
            </FormControl>
            {item && (
              <Card
                variant="outline"
                borderColor="tertiary.500"
                bgColor="tertiary.300"
                boxShadow="none"
                px={4}
                py={2}
                mt={2}
              >
                <Box>
                  <Text fontSize="md" fontWeight="normal">
                    {item.name}
                  </Text>
                  <Text fontSize="sm" fontWeight="light" color="gray.500">
                    {item.contractAddress}
                  </Text>
                </Box>
              </Card>
            )}
          </ModalBody>
          <Divider />
          <ModalFooter justifyContent="center">
            <Button
              type="submit"
              size="sm"
              isDisabled={!isAddable}
              leftIcon={<Icon as={FaArrowRight} />}
              isLoading={isLoading}
              ml={2}
            >
              Add Collection
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
