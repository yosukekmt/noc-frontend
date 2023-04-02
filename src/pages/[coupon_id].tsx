import MintingDialog from "@/components/minting-dialog";
import Footer from "@/components/session/footer";
import Header from "@/components/session/header";
import { useBlockchain } from "@/hooks/useBlockchain";
import { useDatetime } from "@/hooks/useDatetime";
import { usePublicApi } from "@/hooks/usePublicApi";
import { Chain, Coupon, Nft } from "@/models";
import {
  Box,
  Card,
  CardBody,
  Container,
  Flex,
  Heading,
  Spacer,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {
  ThirdwebProvider,
  useAddress,
  useContract,
  Web3Button,
} from "@thirdweb-dev/react";
import { SmartContract } from "@thirdweb-dev/sdk";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

const MintBody = (props: { coupon: Coupon; chain: Chain; nfts: Nft[] }) => {
  const address = useAddress();
  const { formatWithTimezone } = useDatetime();
  const { truncateContractAddress } = useBlockchain();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [mintingStatus, setMintingStatus] = useState<
    "started" | "succeeded" | "failed"
  >("started");
  const mintingDialog = useDisclosure();

  useContract(props.coupon.contractAddress, "edition-drop");

  const startAtStr = useMemo(() => {
    if (!props.coupon.startAt) return;
    if (!props.coupon.timezone) return;

    return formatWithTimezone(props.coupon.startAt, props.coupon.timezone);
  }, [formatWithTimezone, props.coupon.startAt, props.coupon.timezone]);

  const endAtStr = useMemo(() => {
    if (!props.coupon.endAt) return;
    if (!props.coupon.timezone) return;

    return formatWithTimezone(props.coupon.endAt, props.coupon.timezone);
  }, [formatWithTimezone, props.coupon.endAt, props.coupon.timezone]);

  const clickClaim = async (contract: SmartContract) => {
    mintingDialog.onOpen();
    setMintingStatus("started");
    const result = await contract.erc1155.claim(props.coupon.nftTokenId, 1);
    setTxHash(result.receipt.transactionHash);
  };

  const onSuccess = (result: SmartContract) => {
    console.log("result");
    console.log(result);
    setMintingStatus("succeeded");
  };

  const onError = (err: unknown) => {
    console.error("err");
    console.error(err);
    setMintingStatus("failed");
  };

  return (
    <>
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
                      <Text>Network</Text>
                      <Spacer />
                      <Text>{props.chain.name}</Text>
                    </Flex>
                    <Flex align="center" w="100%">
                      <Text>Stat</Text>
                      <Spacer />
                      <Text>{startAtStr}</Text>
                    </Flex>
                    <Flex align="center" w="100%">
                      <Text>End</Text>
                      <Spacer />
                      <Text>{endAtStr}</Text>
                    </Flex>
                    <Flex align="center" w="100%">
                      <Text>Time zone</Text>
                      <Spacer />
                      <Text>{props.coupon.timezone}</Text>
                    </Flex>
                  </VStack>
                  <VStack mt={8} align="start" w="100%">
                    <Heading as="h4" size="sm" color="gray">
                      Applicable NFTs
                    </Heading>
                    {props.nfts.map((nft) => {
                      return (
                        <Flex key={`applicable_nft_${nft.id}`}>
                          <Text fontSize="sm">{nft.name}</Text>
                          <Tooltip
                            label={nft.contractAddress}
                            aria-label="Contract Address"
                            placement="top"
                          >
                            <Text
                              fontSize="sm"
                              ml={1}
                            >{`(${truncateContractAddress(
                              nft.contractAddress
                            )})`}</Text>
                          </Tooltip>
                        </Flex>
                      );
                    })}
                  </VStack>
                  <Box mt={8}>
                    <Web3Button
                      contractAddress={props.coupon.contractAddress}
                      colorMode="light"
                      accentColor="black"
                      action={(contract) => clickClaim(contract)}
                      onSuccess={(result) => onSuccess(result)}
                      onError={(error) => onError(error)}
                    >
                      Claim Gasback NFT
                    </Web3Button>
                  </Box>
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
      <MintingDialog
        chain={props.chain}
        txHash={txHash}
        status={mintingStatus}
        isOpen={mintingDialog.isOpen}
        onClose={mintingDialog.onClose}
        onOpen={mintingDialog.onOpen}
      />
    </>
  );
};

export default function Mint() {
  const { coupon_id: couponId } = useRouter().query;
  const { callGetCoupon, callGetChain, callGetNfts } = usePublicApi();
  const [item, setItem] = useState<Coupon | null>(null);
  const [chain, setChain] = useState<Chain | null>(null);
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const getCoupon = useCallback(
    async (couponId: string): Promise<void> => {
      const item = await callGetCoupon(couponId);
      setItem(item);
    },
    [callGetCoupon]
  );

  const getChain = useCallback(
    async (couponId: string): Promise<void> => {
      const item = await callGetChain(couponId);
      setChain(item);
    },
    [callGetChain]
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
    getChain(couponId as string);
    getNfts(couponId as string);
  }, [couponId, getChain, getCoupon, getNfts]);

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
      {item && chain && (
        <ThirdwebProvider activeChain={chain.id as 1 | 5 | 137 | 80001}>
          {item && <MintBody coupon={item} chain={chain} nfts={nfts} />}
        </ThirdwebProvider>
      )}
    </>
  );
}
