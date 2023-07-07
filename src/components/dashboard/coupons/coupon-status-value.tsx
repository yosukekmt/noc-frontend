import { CouponStatus } from "@/models";
import { Flex, Icon, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { GoPrimitiveDot } from "react-icons/go";

export default function CouponStatusValue(props: { status: CouponStatus }) {
  const label = useMemo(() => {
    if (props.status === "processing") {
      return "Deploying";
    }
    if (props.status === "scheduled") {
      return "Scheduled";
    }
    if (props.status === "ongoing") {
      return "Ongoing";
    }
    if (props.status === "finished") {
      return "Finished";
    }
    if (props.status === "failed") {
      return "Could not process";
    }
    if (props.status === "invalidated") {
      return "Invalidated";
    }
  }, [props.status]);
  const color = useMemo(() => {
    if (props.status === "processing") {
      return "primary.500";
    }
    if (props.status === "scheduled") {
      return "secondary.500";
    }
    if (props.status === "ongoing") {
      return "primary.500";
    }
    if (props.status === "finished") {
      return "success.500";
    }
    if (props.status === "failed") {
      return "tertiary.500";
    }
    if (props.status === "invalidated") {
      return "tertiary.500";
    }
  }, [props.status]);

  return (
    <Flex align="center">
      <Text fontSize="md" fontWeight="light" color="gray">
        {label}
      </Text>
      <Icon as={GoPrimitiveDot} color={color} />
    </Flex>
  );
}
