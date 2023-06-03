import { Box } from "@chakra-ui/react";

export default function TopBg(props: { height: number }) {
  return (
    <Box
      width="100%"
      height={`${props.height}px`}
      position="absolute"
      zIndex={-1}
      backgroundImage="url(/bg_top.jpg)"
      backgroundSize="cover"
      backgroundRepeat="no-repeat"
      backgroundPosition="center center"
    />
  );
}
