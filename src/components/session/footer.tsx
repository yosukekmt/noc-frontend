import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Container, Flex, Text } from "@chakra-ui/react";
import NextLink from "next/link";

export default function Footer() {
  return (
    <Container maxWidth="xl">
      <Flex mt={24}>
        <Text fontSize="sm" color="gray">
          &copy; Centiv
        </Text>
        <Text fontSize="sm" color="gray" ml={4}>
          Contact
        </Text>
        <Text fontSize="sm" color="gray" ml={4}>
          Privacy &amp; Terms
        </Text>
      </Flex>
    </Container>
  );
}
