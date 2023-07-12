import { useDatetime } from "@/hooks/useDatetime";
import { Chain, CouponHolder } from "@/models";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { useMemo } from "react";
import CouponHolderRow from "./coupon-holder-row";

export default function CouponHoldersSection(props: {
  isInitialized: boolean;
  chain: Chain | undefined;
  couponHolders: CouponHolder[];
  projectId: string | undefined;
  couponId: string | undefined;
}) {
  const { formatWithoutTimezone } = useDatetime();

  const items = useMemo(() => {
    return props.couponHolders.slice(0, 8);
  }, [props.couponHolders]);

  const isMore = useMemo(() => {
    return 8 < props.couponHolders.length;
  }, [props.couponHolders.length]);

  return (
    <Box>
      {!props.isInitialized && (
        <>
          {[0, 1, 2].flatMap((idx) => {
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
                <Skeleton h={4} />
              </Card>
            );
          })}
        </>
      )}
      {props.isInitialized && items.length === 0 && <Text>No Records</Text>}
      {props.isInitialized && items.length !== 0 && (
        <>
          {props.chain && props.projectId && props.couponId && (
            <>
              {items.flatMap((item) => {
                return (
                  <CouponHolderRow
                    chain={props.chain!}
                    couponHolder={item}
                    projectId={props.projectId!}
                    couponId={props.couponId!}
                  />
                );
              })}
            </>
          )}
          {props.projectId && props.couponId && isMore && (
            <Button
              size="md"
              mt={2}
              w="100%"
              variant="outline"
              colorScheme="black"
            >
              Show More
            </Button>
          )}
        </>
      )}
    </Box>
  );
}
