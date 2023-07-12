import { useBlockchain } from "@/hooks/useBlockchain";
import { useDatetime } from "@/hooks/useDatetime";
import { Chain, CouponHolder } from "@/models";
import { Button, Card, Flex, Link, Spacer, Text } from "@chakra-ui/react";
import { useMemo } from "react";

export default function CouponHolderRow(props: {
  chain: Chain;
  couponHolder: CouponHolder;
  projectId: string;
  couponId: string;
}) {
  const { formatWithoutTimezone } = useDatetime();
  const { getExplorerAddressUrl } = useBlockchain();

  const explorerUrl = useMemo(() => {
    if (!props.chain) return;
    if (!props.chain.explorerUrl) return;

    return getExplorerAddressUrl(
      props.chain.explorerUrl,
      props.couponHolder.walletAddress
    );
  }, [props.chain, props.couponHolder, getExplorerAddressUrl]);

  const created = useMemo(() => {
    return formatWithoutTimezone(props.couponHolder.createdAt);
  }, [formatWithoutTimezone, props.couponHolder.createdAt]);

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
        {explorerUrl && (
          <Link href={explorerUrl} isExternal>
            <Button
              variant="link"
              fontSize="sm"
              fontWeight="light"
              color="gray"
            >
              {props.couponHolder.walletAddress}
            </Button>
          </Link>
        )}
        <Spacer />
        <Text fontWeight="light" fontSize="sm">
          {created}
        </Text>
      </Flex>
    </Card>
  );
}
