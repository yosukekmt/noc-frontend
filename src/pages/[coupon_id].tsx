import Footer from "@/components/session/footer";
import Header from "@/components/session/header";
import { usePublicApi } from "@/hooks/usePublicApi";
import { Coupon, Nft } from "@/models";
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
import { Ethereum, Goerli, Sepolia } from "@thirdweb-dev/chains";
import {
  ThirdwebProvider,
  useAddress,
  useContract,
  Web3Button,
} from "@thirdweb-dev/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useCallback, useEffect, useState } from "react";

const BLOCKCHAIN_NETWORK = process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK;

const MintBody = (props: { coupon: Coupon; nfts: Nft[] }) => {
  const address = useAddress();

  useContract(props.coupon.contractAddress, "edition-drop");

  const clickSubmit = (evt: FormEvent) => {};

  return (
    <Box bg="gray.100" minH="100vh">
      <Box as="header">
        <Header />
      </Box>
      <Box as="main">
        <Box>
          <Container maxWidth="xl">
            <Card overflow="hidden" boxShadow="2xl" mt={8}>
              <CardBody p={12}>
                <Heading as="h2" size="sm" color="gray">
                  Get gasback NFT
                </Heading>
                <Heading as="h3" size="lg">
                  {props.coupon.name}
                </Heading>
                <Text fontSize="sm" color="gray" py={4}>
                  {props.coupon.description}
                </Text>
                <VStack mt={8} align="start" w="100%">
                  <Heading as="h4" size="sm" color="gray">
                    Gasback NFT Details
                  </Heading>
                  <Flex align="center" w="100%">
                    <Text>Start</Text>
                    <Spacer />
                    <Text>{props.coupon.startAt.toLocaleString()}</Text>
                  </Flex>
                  <Flex align="center" w="100%">
                    <Text>End</Text>
                    <Spacer />
                    <Text>{props.coupon.endAt.toLocaleString()}</Text>
                  </Flex>
                </VStack>
                <VStack mt={8} align="start" w="100%">
                  <Heading as="h4" size="sm" color="gray">
                    Applicable NFTs
                  </Heading>
                  {props.nfts.map((nft) => {
                    return (
                      <Text fontSize="sm" key={`applicable_nft_${nft.id}`}>
                        {`${nft.name}(${nft.contractAddress})`}
                      </Text>
                    );
                  })}
                </VStack>

                <Button
                  type="submit"
                  w="100%"
                  size="lg"
                  fontWeight="light"
                  mt={8}
                >
                  Connect wallet & Claim
                </Button>
                <Web3Button
                  contractAddress={props.coupon.contractAddress}
                  action={(contract) => contract.erc1155.claim(0, 1)}
                />
                <Text fontSize="sm" mt={2}>
                  Not sure how to use it?
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
  );
};

export default function Mint() {
  const chain =
    BLOCKCHAIN_NETWORK === "mainnet"
      ? Ethereum
      : BLOCKCHAIN_NETWORK === "goerli"
      ? Goerli
      : Sepolia;
  const { coupon_id: couponId } = useRouter().query;
  const { callGetCoupon, callGetNfts } = usePublicApi();
  const [item, setItem] = useState<Coupon | null>(null);
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const getCoupon = useCallback(
    async (couponId: string): Promise<void> => {
      const item = await callGetCoupon(couponId);
      setItem(item);
    },
    [callGetCoupon]
  );
  const getNfts = useCallback(
    async (couponId: string): Promise<void> => {
      const items = await callGetNfts(couponId);
      setNfts(items);
    },
    [callGetNfts]
  );

  useEffect(() => {
    if (!couponId) return;

    setErrorMessage("");
    getCoupon(couponId as string);
    getNfts(couponId as string);
  }, [couponId, getCoupon, getNfts]);

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
      <ThirdwebProvider activeChain={chain}>
        {item && <MintBody coupon={item} nfts={nfts} />}
      </ThirdwebProvider>
    </>
  );
}
