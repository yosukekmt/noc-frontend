import Footer from "@/components/footer";
import Header from "@/components/header";
import HtmlHead from "@/components/html-head";
import {
  Box,
  Center,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
} from "@chakra-ui/react";

const TopSection = () => {
  return (
    <Box as="section" id="top-section">
      <Container maxWidth="6xl">
        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          <GridItem colSpan={{ base: 12, md: 12 }}>
            <Center>
              <Heading textAlign="center" my={24}>
                How to use
                <br />
                Nudge ONCHAIN
              </Heading>
            </Center>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

const HowSection = () => {
  return (
    <Box as="section" id="how-section" bg="gray.100">
      <Container maxWidth="6xl">
        <Box py={24}>
          <Grid
            templateAreas={{
              base: `"description1" "description2" "description3" "description4"`,
            }}
            gap={16}
          >
            <GridItem area="description1">
              <Text size="md">
                1. First things first, let&apos;s set up your cashback campaign.
                You&apos;ll need to pick the blockchain your NFT is on, decide
                on the type of cashback, select the period of the campaign
                should run, and choose which NFTs will be applicable.
              </Text>
            </GridItem>
            <GridItem area="description2">
              <Text size="md">
                2. Once you&apos;ve got the campaign deployed on the blockchain,
                you&apos;ll need to put some funds into your treasury wallet.
                Just head over to the treasury section, double-check the
                address, and then send money from your own wallet using the
                usual transaction methods, like MetaMask.
              </Text>
            </GridItem>
            <GridItem area="description3">
              <Text size="md">
                3. You&apos;re all set to share the coupon page with your
                customers now. Keep in mind that they can go ahead and get
                cashback coupons even before the campaign starts. But the actual
                cashback will only be given out during the campaign period.
              </Text>
            </GridItem>
            <GridItem area="description4">
              <Text size="md">
                4. Make sure to regularly check the dashboard during the
                campaign. You&apos;ll be able to see how things are going in
                real-time. And if you want to share access with your colleagues,
                just head over to the team section to get them involved.
              </Text>
            </GridItem>
          </Grid>
          <Text size="md" mt={24}>
            Do not hesitate to reach out to us. We&apos;re really excited to
            make our features even better, so any feedback you have, whether
            it&amp;s positive or negative, is more than welcome.
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default function Home() {
  return (
    <>
      <HtmlHead />
      <Box as="header" h={16}>
        <Header />
      </Box>
      <Box as="main">
        <TopSection />
        <HowSection />
      </Box>
      <Box as="footer">
        <Footer />
      </Box>
    </>
  );
}
