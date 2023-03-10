import Footer from "@/components/session/footer";
import Header from "@/components/session/header";
import { useApiClient } from "@/hooks/useApiClient";
import { usePublicApi } from "@/hooks/usePublicApi";
import { Coupon } from "@/models";
import { WarningTwoIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  Heading,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useCallback, useEffect, useState } from "react";

export default function Mint() {
  const { coupon_id: couponId } = useRouter().query;

  const { getErrorMessage: getApiErrorMessage, isUnauthorizedError } =
    useApiClient();
  const { callGetCoupon } = usePublicApi();
  const [item, setItem] = useState<Coupon | null>(null);
  const [isAttempted, setIsAttempted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const callSignIn = useCallback(async () => {}, []);

  const getCoupon = useCallback(
    async (authToken: string): Promise<void> => {
      const item = await callGetCoupon(authToken, couponId as string);
      setItem(item);
    },
    [callGetCoupon, couponId]
  );

  useEffect(() => {
    setErrorMessage("");
    getCoupon("");
  }, [getCoupon]);

  const clickSubmit = (evt: FormEvent) => {};

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
              <form onSubmit={clickSubmit}>
                <Card overflow="hidden" boxShadow="2xl" mt={8}>
                  <CardBody p={12}>
                    <Heading as="h2" size="sm" color="gray">
                      Get gasback NFT
                    </Heading>
                    <Heading as="h3" size="lg">
                      {item && item.name}
                    </Heading>
                    <Text fontSize="sm" color="gray" py={4}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. Excepteur
                      sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum.
                    </Text>
                    <VStack mt={8} align="start" w="100%">
                      <Heading as="h4" size="sm" color="gray">
                        Gasback NFT Details
                      </Heading>
                      <Flex align="center" w="100%">
                        <Text>Start</Text>
                        <Spacer />
                        <Text>
                          {item &&
                            item.startAt &&
                            item.startAt.toLocaleString()}
                        </Text>
                      </Flex>
                      <Flex align="center" w="100%">
                        <Text>End</Text>
                        <Spacer />
                        <Text>
                          {item &&
                            item.startAt &&
                            item.startAt.toLocaleString()}
                        </Text>
                      </Flex>
                    </VStack>
                    <VStack mt={8} align="start" w="100%">
                      <Heading as="h4" size="sm" color="gray">
                        Applicable NFTs
                      </Heading>
                      <Text fontSize="sm">0x382318481938ab902832</Text>
                      <Text fontSize="sm">0x382318481938ab902832</Text>
                      <Text fontSize="sm">0x382318481938ab902832</Text>
                      <Text fontSize="sm">0x382318481938ab902832</Text>
                    </VStack>
                    <Box mt={8}>
                      {isAttempted && errorMessage && (
                        <Flex align="center">
                          <WarningTwoIcon color="red" />
                          <Text
                            fontSize="sm"
                            fontWeight="normal"
                            color="red"
                            ml={2}
                          >
                            {errorMessage}
                          </Text>
                        </Flex>
                      )}
                    </Box>
                    <Button
                      type="submit"
                      w="100%"
                      size="lg"
                      fontWeight="light"
                      mt={8}
                      isLoading={isLoading}
                    >
                      Connect wallet & Claim
                    </Button>
                    <Text fontSize="sm" mt={2}>
                      Not sure how to use it?
                    </Text>
                  </CardBody>
                </Card>
              </form>
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
