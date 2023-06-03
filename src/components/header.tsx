import Logo from "@/components/logo";
import { useFirebase } from "@/hooks/useFirebase";
import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Icon,
  Spacer,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { ArrowRight } from "phosphor-react";

export default function Header() {
  const { authToken } = useFirebase();

  return (
    <Box h="100%">
      <Container maxWidth="6xl" h="100%">
        <Flex align="center" h="100%">
          <NextLink href="/">
            <Logo height={12} />
          </NextLink>
          <Spacer />
          {authToken ? (
            <NextLink href="/dashboard">
              <Button
                colorScheme="primary"
                variant="outline"
                size="sm"
                rightIcon={<Icon as={ArrowRight} />}
                style={{ borderRadius: 20 }}
              >
                Dashboard
              </Button>
            </NextLink>
          ) : (
            <HStack gap={1}>
              <NextLink href="/session/signin">
                <Button size="sm" variant="ghost">
                  Sign in
                </Button>
              </NextLink>
              <NextLink href="/session/signup">
                <Button size="sm" variant="outline">
                  Register
                </Button>
              </NextLink>
            </HStack>
          )}
        </Flex>
      </Container>
    </Box>
  );
}
