import { Container, Flex, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";

export default function Footer() {
  return (
    <Container maxWidth="xl">
      <Flex mt={24}>
        <Text fontSize="sm" color="gray">
          &copy; Centiv
        </Text>
        <Link href="mailto:yosuke.kmt@gmail.com" isExternal>
          <Text fontSize="sm" color="gray" ml={4}>
            Contact
          </Text>
        </Link>
        <NextLink href="/privacy">
          <Text fontSize="sm" color="gray" ml={4}>
            Privacy
          </Text>
        </NextLink>
        <Text fontSize="sm" color="gray" mx={1}>
          &amp;
        </Text>
        <NextLink href="/terms">
          <Text fontSize="sm" color="gray">
            Terms
          </Text>
        </NextLink>
      </Flex>
    </Container>
  );
}
