import Logo from "@/components/logo";
import { useFirebase } from "@/hooks/useFirebase";
import {
  AtSignIcon,
  ChatIcon,
  ChevronRightIcon,
  MoonIcon,
  QuestionIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Spacer,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";

const Header = () => {
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
                size="sm"
                rightIcon={<ChevronRightIcon />}
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
};

const HeroSection = () => {
  return (
    <Box as="section" id="hero-section">
      <Container maxWidth="6xl">
        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          <GridItem colSpan={{ base: 12, md: 12 }}>
            <Box my={{ base: 16, md: 36 }}>
              <Heading as="h1" size="3xl" lineHeight={1.4}>
                Design Your Nudge For
                <br />
                Incentive Economy
                <br />
                Era
              </Heading>
              <Heading as="h3" size="md" fontWeight="normal" mt={4}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Heading>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

const WhatIsSection = () => {
  return (
    <Box as="section" id="whatis-section" bg="gray.100">
      <Container maxWidth="6xl">
        <Grid templateColumns="repeat(12, 1fr)" gap={4} py={24}>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <Heading as="h1" size="xl">
              What is &quot;NUDGE ONCHAIN&quot;?
            </Heading>
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <Text fontSize="lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum. 　
            </Text>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};
const FeaturesSection = () => {
  return (
    <Box as="section" id="features-section">
      <Container maxWidth="6xl">
        <Grid templateColumns="repeat(12, 1fr)" gap={4} py={24}>
          <GridItem colSpan={{ base: 12 }}>
            <Heading as="h1" size="3xl">
              Features
            </Heading>
          </GridItem>
          <GridItem colSpan={{ base: 12 }}>
            <Grid templateColumns="repeat(12, 1fr)" gap={2}>
              <GridItem colSpan={{ base: 12, md: 6, lg: 3 }}>
                <Box py={8}>
                  <ChatIcon boxSize={6} />
                  <Heading as="h4" size="md" fontWeight="bold" py={4}>
                    Feature 1
                  </Heading>
                  <Text fontSize="lg">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </Text>
                </Box>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6, lg: 3 }}>
                <Box py={8}>
                  <QuestionIcon boxSize={6} />
                  <Heading as="h4" size="md" fontWeight="bold" py={4}>
                    Feature 2
                  </Heading>
                  <Text fontSize="lg">
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                    irure dolor in reprehenderit in voluptate velit esse cillum
                    dolore eu fugiat nulla pariatur.
                  </Text>
                </Box>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6, lg: 3 }}>
                <Box py={8}>
                  <MoonIcon boxSize={6} />
                  <Heading as="h4" size="md" fontWeight="bold" py={4}>
                    Feature 3
                  </Heading>
                  <Text fontSize="lg">
                    Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                  </Text>
                </Box>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6, lg: 3 }}>
                <Box py={8}>
                  <AtSignIcon boxSize={6} />
                  <Heading as="h4" size="md" fontWeight="bold" py={4}>
                    Feature 4
                  </Heading>
                  <Text fontSize="lg">
                    Sed ut perspiciatis unde omnis iste natus error sit
                    voluptatem accusantium doloremque laudantium, totam rem
                    aperiam, eaque ipsa quae ab illo inventore veritatis et
                    quasi architecto beatae vitae dicta sunt explicabo.
                  </Text>
                </Box>
              </GridItem>
            </Grid>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

const Footer = () => {
  return (
    <Box bg="gray.100">
      <Container maxWidth="6xl">
        <Grid templateColumns="repeat(12, 1fr)" gap={4} py={12}>
          <GridItem colSpan={{ base: 12, sm: 4 }}>
            <NextLink href="/">
              <Box minW={200} maxW={320} cursor="pointer">
                <Logo height={12} />
              </Box>
            </NextLink>
          </GridItem>
          <GridItem colSpan={{ base: 12, sm: 8 }}>
            <Heading as="h3" size="md" fontWeight="bold">
              Links
            </Heading>
            <Grid templateColumns="repeat(12, 1fr)" gap={4} py={4}>
              <GridItem colSpan={{ base: 12, sm: 6, md: 4, lg: 2 }}>
                <NextLink href="/">
                  <Text fontWeight="light">Docs</Text>
                </NextLink>
              </GridItem>
              <GridItem colSpan={{ base: 12, sm: 6, md: 4, lg: 2 }}>
                <NextLink href="/">
                  <Text fontWeight="light">FAQs</Text>
                </NextLink>
              </GridItem>
              <GridItem colSpan={{ base: 12, sm: 6, md: 4, lg: 2 }}>
                <NextLink href="/">
                  <Text fontWeight="light">Github</Text>
                </NextLink>
              </GridItem>
              <GridItem colSpan={{ base: 12, sm: 6, md: 4, lg: 2 }}>
                <NextLink href="/">
                  <Text fontWeight="light">Contact</Text>
                </NextLink>
              </GridItem>
            </Grid>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};
export default function Home() {
  return (
    <>
      <Head>
        <title>Nudge ONCHAIN</title>
        <meta
          name="description"
          content="Native implementation of coupon and cashback systems."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <Box as="header" h={16}>
        <Header />
      </Box>
      <Box as="main">
        <HeroSection />
        <WhatIsSection />
        <FeaturesSection />
      </Box>
      <Box as="footer">
        <Footer />
      </Box>
    </>
  );
}
