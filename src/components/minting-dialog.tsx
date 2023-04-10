import { useBlockchain } from "@/hooks/useBlockchain";
import { Chain } from "@/models";
import {
  Button,
  Flex,
  Heading,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useMemo } from "react";
import MintError from "./mint-error";
import MintLoading from "./mint-loading";
import MintSuccess from "./mint-success";

export default function MintingDialog(props: {
  chain: Chain;
  txHash: string | null;
  status: "started" | "succeeded" | "failed";
  isOpen: boolean;
  onClose(): void;
  onOpen(): void;
}) {
  const { getExplorerTxUrl } = useBlockchain();

  const explorerUrl = useMemo(() => {
    if (!props.chain) return;
    if (!props.chain.explorerUrl) return;
    if (!props.txHash) return;
    return getExplorerTxUrl(props.chain.explorerUrl, props.txHash);
  }, [getExplorerTxUrl, props.chain, props.txHash]);

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader />
        <ModalBody>
          <Heading as="h3" size="lg">
            {props.status === "started" && "Processing..."}
            {props.status === "succeeded" && "Success!"}
            {props.status === "failed" && "Error :("}
          </Heading>
          <Text fontSize="sm" color="gray" py={4}>
            {props.status === "started" && "Your Gasback NFT is on its way!"}
            {props.status === "succeeded" &&
              "Check your wallet to find your Gasback NFT. You can safely close this window now."}
            {props.status === "failed" &&
              "Did you declined? or the transaction fee might have been unexpectedly high. Try again."}
          </Text>
          <Flex w="100%" justify="center">
            {props.status === "started" && <MintLoading />}
            {props.status === "succeeded" && <MintSuccess />}
            {props.status === "failed" && <MintError />}
          </Flex>
          <Flex w="100%" justify="center">
            {explorerUrl && (
              <Link href={explorerUrl} isExternal>
                <Button
                  type="submit"
                  w="100%"
                  size="lg"
                  fontWeight="light"
                  mt={8}
                >
                  View on etherscan
                </Button>
              </Link>
            )}
          </Flex>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
