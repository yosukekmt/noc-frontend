import { CouponRewardType } from "@/models";
import { Text } from "@chakra-ui/react";
import { useMemo } from "react";

export default function CouponRewardTypeValue(props: {
  rewardType: CouponRewardType;
}) {
  const label = useMemo(() => {
    if (props.rewardType === "cashback_gas") {
      return "Gas Fee Cashback";
    }
    if (props.rewardType === "cashback_005") {
      return "5% Cashback";
    }
  }, [props.rewardType]);

  return (
    <Text fontSize="md" fontWeight="light" color="gray">
      {label}
    </Text>
  );
}
