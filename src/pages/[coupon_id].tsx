import ClaimButton from "@/components/claim/claim-button";
import HtmlHead from "@/components/html-head";
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
  Image,
  Spacer,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Spinner } from "phosphor-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const MintBody = (props: { coupon: Coupon; chain: Chain; nfts: Nft[] }) => {
  const { formatWithTimezone } = useDatetime();
  const { truncateContractAddress } = useBlockchain();
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
                  <Flex>
                    <Card
                      width={256}
                      height={256}
                      bg="gray.200"
                      align="center"
                      justify="center"
                    >
                      {props.coupon ? (
                        <Image
                          src={props.coupon.imageUrl}
                          alt="Preview"
                          w="100%"
                          h="100%"
                        />
                      ) : (
                        <Spinner size={24}>
                          <animateTransform
                            attributeName="transform"
                            attributeType="XML"
                            type="rotate"
                            dur="1.8s"
                            from="0 0 0"
                            to="360 0 0"
                            repeatCount="indefinite"
                          ></animateTransform>
                        </Spinner>
                      )}
                    </Card>
                  </Flex>
                  <Heading as="h2" size="sm" color="gray" mt={8}>
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
                    <ClaimButton chain={props.chain} coupon={props.coupon} />
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
      s
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
      <HtmlHead />
      {item && chain && <MintBody coupon={item} chain={chain} nfts={nfts} />}
    </>
  );
}
