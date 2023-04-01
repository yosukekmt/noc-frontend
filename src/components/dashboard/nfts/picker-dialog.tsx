import { useChainsApi } from "@/hooks/useChainsApi";
import { useFirebase } from "@/hooks/useFirebase";
import { useNftsApi } from "@/hooks/useNftsApi";
import { useValidator } from "@/hooks/useValidator";
import { Chain, Nft } from "@/models";
import {
  Button,
  Card,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
} from "@chakra-ui/react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

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

  const getNft = useCallback(
    async (
      authToken: string,
      chainId: number,
      contractAddress: string
    ): Promise<void> => {
      const item = await callGetNft(authToken, chainId, contractAddress);
      setItem(item);
    },
    [callGetNft]
  );

  useEffect(() => {
    if (!authToken) return;
    if (!isValidContractAddress) return;

    (async () => {
      await getNft(authToken, props.chain.id, contractAddress);
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
          <ModalHeader>Create a new coupon NFT</ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody bg="gray.100">
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
              <Card variant="outline" p={2} mt={2}>
                <Heading as="h4" fontSize="md" fontWeight="bold">
                  NFT Name
                </Heading>
                <Text>{item.name}</Text>
              </Card>
            )}
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button size="sm" onClick={props.onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isLoading} ml={2}>
              Add NFT
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
