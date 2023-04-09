import { useBlockchain } from "@/hooks/useBlockchain";
import { useDatetime } from "@/hooks/useDatetime";
import { Chain, CouponHolder } from "@/models";
import {
  Box,
  Button,
  Divider,
  Grid,
  GridItem,
  Heading,
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

export const CouponHoldersTableLoadingRow = (props: {}) => {
  const uiKey = useMemo(() => {
    return `coupon_holders_${Crypto.randomBytes(20).toString("hex")}`;
  }, []);

  return (
    <Tr key={uiKey} h={16}>
      <Td fontWeight="normal" fontSize="sm" colSpan={2}>
        <Skeleton h={4} />
      </Td>
    </Tr>
  );
};

export const CouponHoldersTableRow = (props: {
  chain: Chain;
  item: CouponHolder;
}) => {
  const { getExplorerAddressUrl } = useBlockchain();
  const { formatWithoutTimezone } = useDatetime();

  const explorerUrl = useMemo(() => {
    if (!props.chain) return;
    if (!props.chain.explorerUrl) return;
    if (!props.item) return;
    if (!props.item.walletAddress) return;
    return getExplorerAddressUrl(
      props.chain.explorerUrl,
      props.item.walletAddress
    );
  }, [props.chain, props.item, getExplorerAddressUrl]);

  return (
    <Tr key={`coupon_holders_${props.item.id}`} h={8}>
      <Td fontWeight="normal" fontSize="sm">
        <NextLink
          href={explorerUrl || ""}
          style={{ width: "100%", display: "block" }}
          target="_blank"
        >
          {formatWithoutTimezone(props.item.createdAt)}
        </NextLink>
      </Td>
      <Td fontWeight="normal" fontSize="sm">
        <NextLink
          href={explorerUrl || ""}
          style={{ width: "100%", display: "block" }}
          target="_blank"
        >
          {props.item.walletAddress}
        </NextLink>
      </Td>
    </Tr>
  );
};

export default function CouponHoldersSection(props: {
  isInitialized: boolean;
  chain: Chain | undefined;
  couponHolders: CouponHolder[];
  projectId: string | undefined;
  couponId: string | undefined;
}) {
  const items = useMemo(() => {
    return props.couponHolders.slice(0, 8);
  }, [props.couponHolders]);

  const isMore = useMemo(() => {
    return 8 < props.couponHolders.length;
  }, [props.couponHolders.length]);

  return (
    <Box>
      <Grid templateColumns="repeat(12, 1fr)" gap={4} mt={24}>
        <GridItem colSpan={{ base: 12 }}>
          <Heading as="h4" fontSize="2xl">
            Coupon Holders
          </Heading>
          <Divider mt={2} />
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>SINCE</Th>
                  <Th>WALLET</Th>
                </Tr>
              </Thead>
              <Tbody>
                {!props.isInitialized && (
                  <>
                    <CouponHoldersTableLoadingRow />
                    <CouponHoldersTableLoadingRow />
                    <CouponHoldersTableLoadingRow />
                  </>
                )}
                {props.isInitialized && items.length === 0 && (
                  <>
                    <Tr key="coupon_holders_empty" h={16}>
                      <Td colSpan={2}>No Records</Td>
                    </Tr>
                  </>
                )}
                {props.isInitialized && items.length !== 0 && (
                  <>
                    {items.flatMap((item) => {
                      return (
                        <>
                          {props.chain && (
                            <CouponHoldersTableRow
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
                            href={`/dashboard/${props.projectId}/coupons/${props.couponId}/coupon_holders`}
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
