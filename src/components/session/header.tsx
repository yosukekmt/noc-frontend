import Logo from "@/components/logo";
import { Box, Container, Flex } from "@chakra-ui/react";
import NextLink from "next/link";

export default function Header() {
  return (
    <Box>
      <Container maxWidth="xl">
        <Flex pt={16}>
          <NextLink href="/">
            <Logo height={12} />
          </NextLink>
        </Flex>
      </Container>
    </Box>
  );
}
