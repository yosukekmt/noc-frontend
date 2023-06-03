import { useBlockchain } from "@/hooks/useBlockchain";
import { usePublicApi } from "@/hooks/usePublicApi";
import { Chain, Coupon, CouponTransfer } from "@/models";
import {
  Box,
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
import { useCallback, useEffect, useMemo, useState } from "react";
import MintError from "./mint-error";
import MintLoading from "./mint-loading";
import MintSuccess from "./mint-success";

export default function MintingDialog(props: {
  chain: Chain;
  coupon: Coupon;
  couponTransfer: CouponTransfer;
  isOpen: boolean;
  onClose(): void;
  onOpen(): void;
}) {
  const { getExplorerTxUrl } = useBlockchain();
  const { callGetCouponTransfer } = usePublicApi();
  const [item, setItem] = useState<CouponTransfer>(props.couponTransfer);

  const mintingStatus = useMemo<"started" | "succeeded" | "failed">(() => {
    if (item.succeededAt) return "succeeded";
    if (item.failedAt) return "failed";
    return "started";
  }, [item.failedAt, item.succeededAt]);

  const explorerUrl = useMemo(() => {
    if (!props.chain) return;
    if (!props.chain.explorerUrl) return;
    if (!item.txHash) return;
    return getExplorerTxUrl(props.chain.explorerUrl, item.txHash);
  }, [getExplorerTxUrl, item.txHash, props.chain]);

  const getCouponTransfer = useCallback(
    async (id: string) => {
      try {
        const item = await callGetCouponTransfer(id);
        setItem(item);
        if (item.succeededAt) return;
        if (item.failedAt) return;

        setTimeout(() => {
          getCouponTransfer(props.couponTransfer.id);
        }, 10000);
      } catch (err: unknown) {
        console.error(err);
      }
    },
    [callGetCouponTransfer, props.couponTransfer.id]
  );

  useEffect(() => {
    getCouponTransfer(props.couponTransfer.id);
  }, [getCouponTransfer, props.couponTransfer.id]);

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
            {mintingStatus === "started" && "Processing..."}
            {mintingStatus === "succeeded" && "Success!"}
            {mintingStatus === "failed" && "Error :("}
          </Heading>
          <Text fontSize="sm" color="gray" py={4}>
            {mintingStatus === "started" &&
              "Your Cashback Coupon is on its way!"}
            {mintingStatus === "succeeded" &&
              "Check your wallet to find your Cashback Coupon. You can safely close this window now."}
            {mintingStatus === "failed" &&
              "Did you declined? or the transaction fee might have been unexpectedly high. Try again."}
          </Text>
          <Flex w="100%" justify="center">
            {mintingStatus === "started" && <MintLoading />}
            {mintingStatus === "succeeded" && <MintSuccess />}
            {mintingStatus === "failed" && <MintError />}
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
