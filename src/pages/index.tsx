import Footer from "@/components/footer";
import Header from "@/components/header";
import HtmlHead from "@/components/html-head";
import TopBg from "@/components/top-bg";
import {
  Box,
  Button,
  Card,
  Center,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  Image,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useMemo, useState } from "react";
import { FaArrowRight, FaStarOfLife } from "react-icons/fa";
import { MdCodeOff, MdDiscount, MdLineAxis, MdStream } from "react-icons/md";

const HeroSection = (props: { height: number }) => {
  return (
    <Box
      as="section"
      id="hero-section"
      width="100%"
      height={`${props.height}px`}
    >
      <Container maxWidth="6xl" h="100%">
        <Grid templateColumns="repeat(12, 1fr)" h="100%">
          <GridItem colSpan={{ base: 12, md: 12, lg: 7, xl: 6 }} h="100%">
            <Flex
              align={{ base: "top", md: "center" }}
              h="100%"
              mt={{ base: 16, sm: 24, md: 0 }}
              pb={{ base: 32, lg: 24 }}
            >
              <Box>
                <Flex justify={{ base: "center", md: "start" }}>
                  <Tag
                    size="md"
                    variant="outline"
                    colorScheme="secondary"
                    borderTopStartRadius={0}
                    borderTopEndRadius={9999}
                    borderBottomStartRadius={9999}
                    borderBottomEndRadius={9999}
                    px={4}
                    py={2}
                  >
                    <TagLeftIcon as={FaStarOfLife} />
                    <TagLabel>No-Code</TagLabel>
                  </Tag>
                </Flex>
                <Flex justify={{ base: "center", md: "start" }}>
                  <Heading
                    as="h1"
                    size="3xl"
                    lineHeight={1.1}
                    textAlign={{ base: "center", md: "start" }}
                    mt={4}
                  >
                    Streamline your
                    <br />
                    project&apos;s mint rewards
                  </Heading>
                </Flex>
                <Flex justify={{ base: "center", md: "start" }}>
                  <Heading
                    as="h3"
                    size="md"
                    fontWeight="normal"
                    mt={4}
                    textAlign={{ base: "center", md: "start" }}
                  >
                    Optimise your business in the rapidly evolving blockchain
                    landscape with our no-code customer engagement platform
                    within minutes.
                  </Heading>
                </Flex>
                <Box mt={4}>
                  <Box display={{ base: "block", md: "inline" }} mt={4}>
                    <NextLink href="/dashboard">
                      <Button
                        w={{ base: "100%", md: "inherit" }}
                        fontWeight="normal"
                        size={{ base: "lg", md: "md" }}
                        px={4}
                        py={2}
                        rightIcon={<Icon as={FaArrowRight} />}
                      >
                        Create Campaign
                      </Button>
                    </NextLink>
                  </Box>
                  <Box
                    display={{ base: "block", md: "inline" }}
                    mt={{ base: 2, md: 4 }}
                    ml={2}
                  >
                    <NextLink href="/dashboard">
                      <Button
                        colorScheme="whiteAlpha"
                        bgColor="white"
                        fontWeight="normal"
                        size={{ base: "lg", md: "md" }}
                        w={{ base: "100%", md: "inherit" }}
                        px={4}
                        py={2}
                      >
                        Learn More
                      </Button>
                    </NextLink>
                  </Box>
                </Box>
              </Box>
            </Flex>
          </GridItem>
          <GridItem
            colSpan={{ base: 12, md: 12, lg: 5, xl: 6 }}
            h="100%"
            display={{ base: "none", lg: "block" }}
          >
            <Center h="100%" pb={{ base: 24 }}>
              <Image src="/hero.png" />
            </Center>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

const WhatIsSection = () => {
  return (
    <Box as="section" id="whatis-section">
      <Container maxWidth="6xl">
        <Heading
          as="h1"
          size="xl"
          textAlign={{ base: "center", md: "start" }}
          mt={24}
        >
          What is
          <br />
          Nudge ONCHAIN?
        </Heading>
        <Grid templateColumns="repeat(12, 1fr)" gap={{ base: 4, md: 8 }} mt={4}>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <Text
              fontSize="lg"
              fontWeight="light"
              textAlign={{ base: "center", md: "start" }}
            >
              Nudge ONCHAIN offers a streamlined solution for managing cashback
              systems on blockchain-based transactions. By utilizing the open
              and accessible nature of the blockchain, we can analyze purchase
              history data to determine optimal selling prices.
            </Text>
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <Text
              fontSize="lg"
              fontWeight="light"
              textAlign={{ base: "center", md: "start" }}
            >
              This approach enables businesses to effectively monitor and
              control Customer Lifetime Value (LTV) and Customer Acquisition
              Cost (CAC), ensuring a more efficient and competitive operation.
            </Text>
          </GridItem>
        </Grid>
        <Heading
          as="h4"
          size="md"
          textAlign={{ base: "center", md: "start" }}
          mt={16}
        >
          Why Cashback?
        </Heading>
        <Text fontSize="lg" textAlign={{ base: "center", md: "start" }} mt={4}>
          Utilizing cashback systems for promoting purchasing decisions can
          influence consumer decision-making without constraining their choices.
          This approach allows for a precise measurement of LTV and CAC.
        </Text>
        <Box mt={8}>
          <Box display={{ base: "block", md: "inline" }} mt={4}>
            <NextLink href="/dashboard">
              <Button
                w={{ base: "100%", md: "inherit" }}
                fontWeight="normal"
                size={{ base: "lg", md: "md" }}
                px={4}
                py={2}
                rightIcon={<Icon as={FaArrowRight} />}
              >
                Create Campaign
              </Button>
            </NextLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

const FeaturesCard = (props: {
  title: string;
  description: string;
  icon: JSX.Element;
}) => {
  return (
    <Card variant="outline" p={8} rounded={16}>
      <Center bgColor="primary.500" w={24} h={24} rounded={9999}>
        {props.icon}
      </Center>
      <Heading as="h4" size="lg" fontWeight="bold" pt={8} pb={2}>
        {props.title}
      </Heading>
      <Text fontSize="lg" fontWeight="light">
        {props.description}
      </Text>
    </Card>
  );
};

const FeaturesSection = () => {
  return (
    <Box
      as="section"
      id="features-section"
      background="linear-gradient(to bottom, transparent 0%, transparent 90%, var(--chakra-colors-secondary-500) 90%, var(--chakra-colors-secondary-500) 100%)"
    >
      <Container maxWidth="6xl">
        <Grid templateColumns="repeat(12, 1fr)" gap={4} pt={24} pb={4}>
          <GridItem colSpan={{ base: 12 }}>
            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FeaturesCard
                  title="Auto-cashback NFT"
                  description="Manage cashback campaigns for your customers by distributing
                coupons. Customers receive cashback when the coupon exists
                in their wallet & receive cashback for any transaction."
                  icon={<MdDiscount size={64} />}
                />
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FeaturesCard
                  title="No-Code Mint Page"
                  description="You will then get this easy no-code coupon page for you to
                  share with your customers. They can get their cashback
                  coupons for free, and they don't need to be tech-savvy
                  to do it."
                  icon={<MdCodeOff size={64} />}
                />
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FeaturesCard
                  title="Realtime Dashboard"
                  description="Our dashboard provides a convenient way to manage your
                  cashback rewards and NFT holders. With real-time updates,
                  you can easily keep track of your customers' behavior,
                  enabling you to make informed decisions for your business."
                  icon={<MdLineAxis size={64} />}
                />
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FeaturesCard
                  title="Testnets support"
                  description="If you're curious about how our system works, you can
                  try the testnet version of Nudge ONCHAIN. You can experiment
                  as much as you'd like without any risks, so it's a
                  great way to get comfortable with the platform before using
                  it for real."
                  icon={<MdStream size={64} />}
                />
              </GridItem>
            </Grid>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

const HiwStep = (props: {
  active: boolean;
  num: 1 | 2 | 3 | 4 | 5 | 6;
  title: string;
  onSelected: (num: 1 | 2 | 3 | 4 | 5 | 6) => void;
}) => {
  return (
    <Card
      variant="outline"
      bgColor={props.active ? "white" : "transparent"}
      borderColor={props.active ? "white" : "gray.500"}
      rounded={9999}
      borderWidth={0.5}
      p={2}
      onClick={() => props.onSelected(props.num)}
    >
      <Flex align="center">
        <Center
          bgColor={props.active ? "secondary.500" : "transparent"}
          borderColor={props.active ? "white" : "gray.500"}
          borderWidth={0.5}
          w={10}
          h={10}
          rounded={9999}
        >
          <Text color={props.active ? "white" : "gray.500"}>{props.num}</Text>
        </Center>
        <Text flex={1} color={props.active ? "secondary" : "gray.500"} px={4}>
          {props.title}
        </Text>
      </Flex>
    </Card>
  );
};

const HiwImage = (props: { url: string; alt: string }) => {
  return (
    <Center h="100%">
      <Image src={props.url} alt={props.alt} />
    </Center>
  );
};

const HiwSection = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  const titles = [
    "Add funds to your treasury wallet",
    "Create a cashback campaign",
    "Share with your holders",
    "Holders mint the Cashback NFT",
    "Holders purchase an eligible NFT",
    "Users automatically receive their cashback",
  ];

  const clickStep = (num: 1 | 2 | 3 | 4 | 5 | 6) => {
    setStep(num);
  };

  return (
    <Box as="section" id="hiw-section" background="secondary.500">
      <Container maxWidth="6xl">
        <Heading as="h1" size="xl" textAlign="center" textColor="white" pt={24}>
          How it works
        </Heading>
        <Grid
          templateColumns="repeat(12, 1fr)"
          gap={{ base: 8, md: 8 }}
          pt={8}
          pb={24}
        >
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <VStack align="stretch" gap={1}>
              {[1, 2, 3, 4, 5, 6].flatMap((idx) => {
                return (
                  <HiwStep
                    active={step === idx}
                    num={idx as 1 | 2 | 3 | 4 | 5 | 6}
                    title={titles[idx - 1]}
                    onSelected={clickStep}
                  />
                );
              })}
            </VStack>
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <Box p={{ base: 0, md: 2 }}>
              <HiwImage url={`hiw${step}.png`} alt={titles[step - 1]} />
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default function Home() {
  const headerHeroHPx = useBreakpointValue({
    base: 800,
    sm: 640,
    md: 800,
  });
  const headerHPx = useMemo(() => {
    return 64;
  }, []);
  const heroHPx = useMemo(() => {
    return (headerHeroHPx || 0) - headerHPx;
  }, [headerHPx, headerHeroHPx]);

  return (
    <>
      <HtmlHead />
      <TopBg height={headerHeroHPx || 0} />
      <Box as="header" height={`${headerHPx}px`}>
        <Header />
      </Box>
      <Box as="main">
        <HeroSection height={heroHPx} />
        <WhatIsSection />
        <FeaturesSection />
        <HiwSection />
      </Box>
      <Box as="footer">
        <Footer />
      </Box>
    </>
  );
}
