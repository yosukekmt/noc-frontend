import { Cashback, Chain } from "@/models";
import { Box, Button, Card, Skeleton, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { CashbackRow } from "./cashback-row";

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
          {props.chain && (
            <>
              {items.flatMap((item) => {
                return (
                  <CashbackRow
                    chain={props.chain!}
                    item={item}
                    key={`cashbacks_${item.id}`}
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
