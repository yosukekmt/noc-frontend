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
  Link,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useMemo } from "react";
import { BiSupport } from "react-icons/bi";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const TopSection = () => {
  return (
    <Box as="section" id="top-section">
      <Container maxWidth="6xl">
        <Center mt={8}>
          <NextLink href="/">
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
                <TagLeftIcon as={FaArrowLeft} />
                <TagLabel>Back Home</TagLabel>
              </Tag>
            </Flex>
          </NextLink>
        </Center>
        <Center mt={4}>
          <Heading textAlign="center">How to use Nudge ONCHAIN</Heading>
        </Center>
      </Container>
    </Box>
  );
};

const HowCard = (props: {
  num: number;
  title: string;
  description: string;
}) => {
  return (
    <Card variant="none" h="100%" p={8} rounded={16}>
      <Center bgColor={"primary.500"} w={16} h={16} rounded="full">
        <Text fontSize={32}>{props.num}</Text>
      </Center>
      <Heading as="h4" size="lg" fontWeight="bold" mt={4}>
        {props.title}
      </Heading>
      <Text fontSize="lg" fontWeight="light" mt={2}>
        {props.description}
      </Text>
    </Card>
  );
};
const HowSection = () => {
  const titles = [
    "Add funds to your treasury wallet",
    "Create a cashback campaign",
    "Share with your holders",
    "Track your campaign",
  ];
  const descriptions = [
    "To get started, you'll need to put some funds into your treasury wallet. Just head over to the treasury section, double-check the address, and then send money from your own wallet using the usual transaction methods, like Metamask.",
    "You'll need to pick the blockchain your NFT is on, decide on the type of cashback, select the period of the campaign should run, and choose which NFTs will be applicable.",
    "You're all set to share the coupon page with your customers now. Keep in mind that they can go ahead and get cashback coupons even before the campaign starts. But the actual cashback will only be given out during the campaign period.",
    "Make sure to regularly check the dashboard during the campaign. You'll be able to see how things are going in real-time. And if you want to share access with your colleagues, just head over to the team section to get them involved.",
  ];
  return (
    <Box as="section" id="how-section">
      <Container maxWidth="6xl">
        <Grid templateColumns="repeat(12, 1fr)" h="100%" gap={8} pt={16}>
          {[1, 2, 3, 4].flatMap((index) => {
            return (
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <HowCard
                  num={index}
                  title={titles[index - 1]}
                  description={descriptions[index - 1]}
                />
              </GridItem>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

const HelpSection = () => {
  return (
    <Box as="section" id="how-section">
      <Container maxWidth="6xl">
        <Card
          variant="none"
          backgroundColor="secondary.500"
          h="100%"
          mt={8}
          p={8}
          rounded={16}
        >
          <Flex align="center">
            <Center
              borderColor="white"
              borderWidth={1}
              w={16}
              h={16}
              rounded="full"
            >
              <BiSupport size={32} color="white" />
            </Center>
            <Box flex={1} px={8}>
              <Heading as="h4" size="lg" fontWeight="bold" textColor="white">
                Need help?
              </Heading>
              <Text fontWeight="light" textColor="gray">
                Do not hesitate to reach out to us. We&apos;re really excited to
                make our features even better, so any feedback you have, whether
                it&s positive or negative, is more than welcome.
              </Text>
            </Box>
            <Link href="mailto:yosuke.kmt@gmail.com" isExternal>
              <Button
                fontWeight="normal"
                rightIcon={<Icon as={FaArrowRight} />}
              >
                Contact Support
              </Button>
            </Link>
          </Flex>
        </Card>
      </Container>
    </Box>
  );
};
export default function How() {
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
        <TopSection />
        <HowSection />
        <HelpSection />
      </Box>
      <Box as="footer">
        <Footer />
      </Box>
    </>
  );
}
