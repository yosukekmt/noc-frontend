import Logo from "@/components/logo";
import { Box, Container, Grid, GridItem, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";

export default function Footer() {
  return (
    <Box>
      <Container maxWidth="6xl">
        <Grid templateColumns="repeat(12, 1fr)" gap={4} py={12}>
          <GridItem colSpan={{ base: 12, md: 4 }}>
            <NextLink href="/">
              <Box minW={200} maxW={320} cursor="pointer">
                <Logo height={12} />
              </Box>
            </NextLink>
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 8 }}>
            <NextLink href="/">
              <Text fontWeight="light">Top</Text>
            </NextLink>
            <NextLink href="/how">
              <Text fontWeight="light">How to use</Text>
            </NextLink>
            <NextLink href="/terms">
              <Text fontWeight="light">Terms</Text>
            </NextLink>
            <NextLink href="/privacy">
              <Text fontWeight="light">Privacy</Text>
            </NextLink>
            <Link href="mailto:yosuke.kmt@gmail.com" isExternal>
              <Text fontWeight="light">Contact</Text>
            </Link>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
