import { useBlockchain } from "@/hooks/useBlockchain";
import { useDatetime } from "@/hooks/useDatetime";
import { Cashback, Chain } from "@/models";
import {
  Box,
  Button,
  Divider,
  Grid,
  GridItem,
  Heading,
  Link,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import * as Crypto from "crypto";
import NextLink from "next/link";
import { useMemo } from "react";

export const CashbacksTableLoadingRow = (props: {}) => {
  const uiKey = useMemo(() => {
    return `cashbacks_${Crypto.randomBytes(20).toString("hex")}`;
  }, []);

  return (
    <Tr key={uiKey} h={16}>
      <Td fontWeight="normal" fontSize="sm" colSpan={6}>
        <Skeleton h={4} />
      </Td>
    </Tr>
  );
};

export const CashbacksTableRow = (props: { chain: Chain; item: Cashback }) => {
  const { getExplorerTxUrl, getExplorerAddressUrl, truncateContractAddress } =
    useBlockchain();
  const { formatWithoutTimezone } = useDatetime();

  const blockProducedAtStr = useMemo(() => {
    return formatWithoutTimezone(props.item.createdAt);
  }, [formatWithoutTimezone, props.item.createdAt]);

  const explorerTxUrl = useMemo(() => {
    if (!props.chain) return;
    if (!props.chain.explorerUrl) return;
    if (!props.item) return;
    if (!props.item.txHash) return;
    return getExplorerTxUrl(props.chain.explorerUrl, props.item.txHash);
  }, [props.chain, props.item, getExplorerTxUrl]);

  const explorerWalletUrl = useMemo(() => {
    if (!props.chain) return;
    if (!props.chain.explorerUrl) return;
    if (!props.item) return;
    if (!props.item.walletAddress) return;
    return getExplorerAddressUrl(
      props.chain.explorerUrl,
      props.item.walletAddress
    );
  }, [props.chain, props.item, getExplorerAddressUrl]);
  const uiKey = useMemo(() => {
    return `cashbacks_${props.item.id}`;
  }, [props.item.id]);
  return (
    <Tr key={uiKey} h={8}>
      <Td fontWeight="normal" fontSize="sm">
        <Link
          href={explorerTxUrl || ""}
          style={{ width: "100%", display: "block" }}
          isExternal
        >
          Gas fee cashback
        </Link>
      </Td>
      <Td fontWeight="normal" fontSize="sm">
        <Link
          href={explorerTxUrl || ""}
          style={{ width: "100%", display: "block" }}
          isExternal
        >
          {props.item.txHash ? "Submitted" : "Failed"}
        </Link>
      </Td>
      <Td fontWeight="normal" fontSize="sm">
        {props.item.txHash && (
          <Link
            href={explorerTxUrl || ""}
            style={{ width: "100%", display: "block" }}
            isExternal
          >
            {truncateContractAddress(props.item.txHash)}
          </Link>
        )}
      </Td>
      <Td fontWeight="normal" fontSize="sm">
        {props.item.walletAddress && (
          <Link
            href={explorerWalletUrl || ""}
            style={{ width: "100%", display: "block" }}
            isExternal
          >
            {truncateContractAddress(props.item.walletAddress)}
          </Link>
        )}
      </Td>
      <Td fontWeight="normal" fontSize="sm">
        <Link
          href="https://www.alchemy.com/gwei-calculator"
          style={{ width: "100%", display: "block" }}
          isExternal
        >
          {`${Intl.NumberFormat().format(props.item.amountWei)} Wei`}
        </Link>
      </Td>
      <Td fontWeight="normal" fontSize="sm">
        <Link
          href={explorerTxUrl || ""}
          style={{ width: "100%", display: "block" }}
          isExternal
        >
          {blockProducedAtStr}
        </Link>
      </Td>
    </Tr>
  );
};

export default function CashbacksSection(props: {
  isInitialized: boolean;
  chain: Chain | undefined;
  cashbacks: Cashback[];
  projectId: string | undefined;
  couponId: string | undefined;
}) {
  const items = useMemo(() => {
    return props.cashbacks.slice(0, 16);
  }, [props.cashbacks]);

  const isMore = useMemo(() => {
    return 8 < props.cashbacks.length;
  }, [props.cashbacks.length]);

  return (
    <Box>
      <Grid templateColumns="repeat(12, 1fr)" gap={4} mt={24}>
        <GridItem colSpan={{ base: 12 }}>
          <Heading as="h4" fontSize="2xl">
            Recent Cashbacks
          </Heading>
          <Divider mt={2} />
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>EVENT</Th>
                  <Th>STATUS</Th>
                  <Th>TX HASH</Th>
                  <Th>WALLET</Th>
                  <Th>AMOUNT</Th>
                  <Th>DATE</Th>
                </Tr>
              </Thead>
              <Tbody>
                {!props.isInitialized && (
                  <>
                    <CashbacksTableLoadingRow />
                    <CashbacksTableLoadingRow />
                    <CashbacksTableLoadingRow />
                  </>
                )}
                {props.isInitialized && items.length === 0 && (
                  <>
                    <Tr key="cashbacks_empty" h={16}>
                      <Td colSpan={6}>No Records</Td>
                    </Tr>
                  </>
                )}
                {props.isInitialized && items.length !== 0 && (
                  <>
                    {items.flatMap((item) => {
                      return (
                        <>
                          {props.chain && (
                            <CashbacksTableRow
                              chain={props.chain}
                              item={item}
                            />
                          )}
                        </>
                      );
                    })}
                    {props.projectId && props.couponId && isMore && (
                      <Tr key="coupon_holders_more" h={16}>
                        <Td colSpan={2}>
                          <NextLink
                            href={`/dashboard/${props.projectId}/coupons/${props.couponId}/cashbacks`}
                          >
                            <Button size="sm">View More</Button>
                          </NextLink>
                        </Td>
                      </Tr>
                    )}
                  </>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </GridItem>
      </Grid>
    </Box>
  );
}
