import { useBlockchain } from "@/hooks/useBlockchain";
import { useDatetime } from "@/hooks/useDatetime";
import { Cashback, Chain } from "@/models";
import { Card, Flex, Link, Spacer, Text } from "@chakra-ui/react";
import { useMemo } from "react";

export const CashbackRow = (props: { chain: Chain; item: Cashback }) => {
  const { getExplorerTxUrl, getExplorerAddressUrl, truncateContractAddress } =
    useBlockchain();
  const { formatWithoutTimezone } = useDatetime();

  const explorerTxUrl = useMemo(() => {
    return getExplorerTxUrl(props.chain.explorerUrl, props.item.txHash);
  }, [props.chain, props.item, getExplorerTxUrl]);

  const explorerWalletUrl = useMemo(() => {
    return getExplorerAddressUrl(
      props.chain.explorerUrl,
      props.item.walletAddress
    );
  }, [props.chain, props.item, getExplorerAddressUrl]);

  const truncatedTxHash = useMemo(() => {
    return truncateContractAddress(props.item.txHash);
  }, [props.item.txHash, truncateContractAddress]);
  const truncatedWalletAddress = useMemo(() => {
    return truncateContractAddress(props.item.walletAddress);
  }, [props.item.walletAddress, truncateContractAddress]);
  const formattedAmountWei = useMemo(() => {
    return Intl.NumberFormat().format(props.item.amountWei);
  }, [props.item.amountWei]);
  const createdAtStr = useMemo(() => {
    return formatWithoutTimezone(props.item.createdAt);
  }, [formatWithoutTimezone, props.item.createdAt]);

  return (
    <Card
      variant="outline"
      borderColor="tertiary.500"
      bgColor="tertiary.300"
      boxShadow="none"
      px={4}
      py={2}
      mt={2}
    >
      <Flex align="center">
        {explorerTxUrl && truncatedTxHash && (
          <Link href={explorerTxUrl} isExternal>
            <Text fontWeight="light" fontSize="sm">
              {truncatedTxHash}
            </Text>
          </Link>
        )}
        <Spacer />
        {explorerWalletUrl && truncatedWalletAddress && (
          <Link href={explorerWalletUrl} isExternal>
            <Text fontWeight="light" fontSize="sm" ml={2}>
              {truncatedWalletAddress}
            </Text>
          </Link>
        )}
        {formattedAmountWei && (
          <Link href="https://www.alchemy.com/gwei-calculator" isExternal>
            <Text fontWeight="light" fontSize="sm" ml={2}>
              {`${formattedAmountWei} Wei`}
            </Text>
          </Link>
        )}
        {explorerTxUrl && createdAtStr && (
          <Link href={explorerTxUrl} isExternal>
            <Text fontWeight="light" fontSize="sm" ml={2}>
              {createdAtStr}
            </Text>
          </Link>
        )}
      </Flex>
    </Card>
  );
};
