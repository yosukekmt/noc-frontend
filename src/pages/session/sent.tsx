import Footer from "@/components/session/footer";
import Header from "@/components/session/header";
import {
  Box,
  Card,
  CardBody,
  Container,
  Heading,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";

export default function Sent() {
  const clickResend = () => {
    console.log("resend");
  };
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
      <Box bg="gray.100" minH="100vh">
        <Box as="header">
          <Header />
        </Box>
        <Box as="main">
          <Box>
            <Container maxWidth="xl">
              <Card overflow="hidden" boxShadow="2xl" mt={8}>
                <CardBody p={12}>
                  <Heading size="md">
                    Thanks, check your email for instructions to reset your
                    password
                  </Heading>
                  <Text fontSize="sm" pt={4}>
                    If you haven&apos;t received an email in 5 minutes, check
                    your spam or
                    <NextLink href="/session/password">resend</NextLink>.
                  </Text>
                </CardBody>
              </Card>
            </Container>
          </Box>
        </Box>
        <Box as="footer">
          <Footer />
        </Box>
      </Box>
    </>
  );
}