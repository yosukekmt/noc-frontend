import Footer from "@/components/footer";
import Header from "@/components/header";
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import { ChartLineUp, Cursor, TestTube, Ticket } from "phosphor-react";

const HeroSection = () => {
  return (
    <Box as="section" id="hero-section">
      <Container maxWidth="6xl">
        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          <GridItem colSpan={{ base: 12, md: 12 }}>
            <Box my={{ base: 16, md: 36 }}>
              <Heading as="h1" size="3xl" lineHeight={1.4}>
                LTV &amp; CAC
                <br />
                management platform
                <br />
                for blockchains
              </Heading>
              <Heading as="h3" size="md" fontWeight="normal" mt={4}>
                Every web3 business deserves a sophisticated LTV &amp; CAC
                management tool. Nudge ONCHAIN serves as a valuable companion in
                designing the Nudge for the forthcoming incentive economy era,
                enabling businesses to optimize their operations and thrive in
                the rapidly-evolving blockchain landscape.
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
              What is &quot;Nudge ONCHAIN&quot;?
            </Heading>
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <Text fontSize="lg">
              Nudge ONCHAIN offers a streamlined solution for managing cashback
              systems on blockchain-based transactions. By utilizing the open
              and accessible nature of the blockchain, we can analyze purchase
              history data to determine optimal selling prices. This approach
              enables businesses to effectively monitor and control Customer
              Lifetime Value (LTV) and Customer Acquisition Cost (CAC), ensuring
              a more efficient and competitive operation.
            </Text>
            <Heading as="h4" size="md" mt={8}>
              Why Cashback?
            </Heading>
            <Text fontSize="lg">
              Utilizing cashback systems for promoting purchasing decisions can
              influence consumer decision-making without constraining their
              choices. This approach allows for a precise measurement of LTV and
              CAC.
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
            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
              <GridItem colSpan={{ base: 12, md: 6, lg: 3 }}>
                <Box py={8}>
                  <Ticket size={32} />
                  <Heading as="h4" size="md" fontWeight="bold" py={4}>
                    Auto-cashback NFT
                  </Heading>
                  <Text fontSize="lg">
                    You can make an auto-cashback NFT for your customers. When
                    they have this NFT, they&apos;ll get cashback for any
                    transactions they make with your NFT-related purchases. You
                    can even set how long the cashback campaign lasts and which
                    NFTs are part of the deal.
                  </Text>
                </Box>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6, lg: 3 }}>
                <Box py={8}>
                  <Cursor size={32} />
                  <Heading as="h4" size="md" fontWeight="bold" py={4}>
                    Minting
                  </Heading>
                  <Text fontSize="lg">
                    You will then get this easy no-code minting page for you to
                    share with your customers. They can mint their cashback NFTs
                    for free, and they don&apos;t need to be tech-savvy to do
                    it.
                  </Text>
                </Box>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6, lg: 3 }}>
                <Box py={8}>
                  <ChartLineUp size={32} />
                  <Heading as="h4" size="md" fontWeight="bold" py={4}>
                    Realtime Dashboard
                  </Heading>
                  <Text fontSize="lg">
                    Our dashboard provides a convenient way to manage your
                    cashback rewards and NFT holders. With real-time updates,
                    you can easily keep track of your customers&apos; behavior,
                    enabling you to make informed decisions for your business.
                  </Text>
                </Box>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6, lg: 3 }}>
                <Box py={8}>
                  <TestTube size={32} />
                  <Heading as="h4" size="md" fontWeight="bold" py={4}>
                    Testnet
                  </Heading>
                  <Text fontSize="lg">
                    If you&apos;re curious about how our system works, you can
                    try the testnet version of Nudge ONCHAIN. You can experiment
                    as much as you&apos;d like without any risks, so it&apos;s a
                    great way to get comfortable with the platform before using
                    it for real.
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
