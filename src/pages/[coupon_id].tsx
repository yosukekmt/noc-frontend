import ClaimButton from "@/components/claim/claim-button";
import HtmlHead from "@/components/html-head";
import Logo from "@/components/logo";
import { useBlockchain } from "@/hooks/useBlockchain";
import { useDatetime } from "@/hooks/useDatetime";
import { usePublicApi } from "@/hooks/usePublicApi";
import { Chain, Coupon, CouponRewardType, Nft } from "@/models";
import {
  AspectRatio,
  Box,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  Image,
  Link,
  Skeleton,
  Spacer,
  Text,
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaAtom, FaPlus } from "react-icons/fa";

const CouponImage = (props: { imageUrl: string; alt: string }) => {
  return (
    <AspectRatio w="180px" ratio={1}>
      <Box bgColor="gray" rounded={16} borderColor="white" borderWidth={1}>
        <Image src={props.imageUrl} alt={props.alt} />
      </Box>
    </AspectRatio>
  );
};

const CouponRewardTypeLabel = (props: { rewardType: CouponRewardType }) => {
  return (
    <Flex
      align="center"
      justify={{ base: "center", md: "start" }}
      borderColor="secondary.500"
      borderWidth={1}
      borderTopStartRadius={0}
      borderTopEndRadius={9999}
      borderBottomStartRadius={9999}
      borderBottomEndRadius={9999}
      px={2}
      py={1}
    >
      <Icon as={FaAtom} color="secondary.500" />
      <Text color="secondary.500" fontSize="sm" ml={2}>
        Gas Fee Cashback Coupon
      </Text>
    </Flex>
  );
};

const CouponDaysLeftLabel = (props: { endAt: Date }) => {
  const { formatDaysLeft } = useDatetime();

  const endDaysLeft = useMemo(() => {
    return formatDaysLeft(props.endAt);
  }, [formatDaysLeft, props.endAt]);

  return (
    <Center bgColor="blackAlpha.300" rounded="full" px={4} py={1}>
      <Text fontSize="sm" color="secondary.500">
        {endDaysLeft < 0 && "Expired"}
        {0 == endDaysLeft && `Finish Soon`}
        {1 == endDaysLeft && `Claim in ${endDaysLeft} Day`}
        {1 < endDaysLeft && `Claim in ${endDaysLeft} Days`}
      </Text>
    </Center>
  );
};

const CouponPeriodLabel = (props: {
  startAt: Date;
  endAt: Date;
  timezone: string;
  isMobileUi: boolean;
}) => {
  const { formatWithTimezone } = useDatetime();

  const startAtStr = useMemo(() => {
    return formatWithTimezone(props.startAt, props.timezone);
  }, [formatWithTimezone, props.startAt, props.timezone]);
  const endAtStr = useMemo(() => {
    if (!props.endAt) return;
    if (!props.timezone) return;
    return formatWithTimezone(props.endAt, props.timezone);
  }, [formatWithTimezone, props.endAt, props.timezone]);

  return (
    <Box>
      {props.isMobileUi ? (
        <>
          <Text fontWeight="light">
            {startAtStr} to
            <br />
            {endAtStr}
          </Text>
          <Text fontSize="sm" fontWeight="light" color="gray">
            {`(Timezone: ${props.timezone})`}
          </Text>
        </>
      ) : (
        <>
          <Text fontWeight="light">{`${startAtStr} - ${endAtStr}`}</Text>
          <Text fontSize="sm" fontWeight="light" color="gray">
            {`(Timezone: ${props.timezone})`}
          </Text>
        </>
      )}
    </Box>
  );
};

const NftCell = (props: { nft: Nft; chain: Chain; isMobileUi: boolean }) => {
  const { truncateContractAddress, getIconPathById } = useBlockchain();

  const iconPath = useMemo(() => {
    return getIconPathById(props.chain.id);
  }, [getIconPathById, props.chain.id]);

  return (
    <Card
      variant="outline"
      borderColor="tertiary.500"
      bgColor="tertiary.300"
      boxShadow="none"
      px={4}
      py={2}
      mt={2}
    >
      {props.isMobileUi ? (
        <>
          <Text fontWeight="light">{props.nft.name}</Text>
          <Text fontSize="sm" fontWeight="bold">
            {props.nft.contractAddress}
          </Text>
          <Flex align="center">
            <Image src={iconPath} alt={props.chain.name} w="16px" h="16px" />
            <Text
              textAlign="end"
              fontSize="sm"
              fontWeight="light"
              color="secondary.500"
              ml={2}
            >
              {props.chain.name}
            </Text>
          </Flex>
        </>
      ) : (
        <Flex align="center">
          <Text fontWeight="light">{props.nft.name}</Text>
          <Spacer />
          <Box>
            <Tooltip label={props.nft.contractAddress}>
              <Text fontSize="sm" fontWeight="bold" textAlign="end">
                {truncateContractAddress(props.nft.contractAddress)}
              </Text>
            </Tooltip>
            <Flex align="center">
              <Image src={iconPath} alt={props.chain.name} w="16px" h="16px" />
              <Text
                textAlign="end"
                fontSize="sm"
                fontWeight="light"
                color="secondary.500"
                ml={2}
              >
                {props.chain.name}
              </Text>
            </Flex>
          </Box>
        </Flex>
      )}
    </Card>
  );
};

const Footer = (props: {}) => {
  return (
    <Box as="footer">
      <Container maxWidth="4xl">
        <Center mt={4}>
          <Flex align="center">
            <Text fontSize="sm" color="gray" ml={4}>
              Powered By
            </Text>
            <Link href="mailto:yosuke.kmt@gmail.com" isExternal>
              <Logo h={8} ml={2} />
            </Link>
          </Flex>
        </Center>
        <Center>
          <Flex align="center">
            <Link href="mailto:yosuke.kmt@gmail.com" isExternal>
              <Text fontSize="sm" color="gray" ml={4}>
                Contact
              </Text>
            </Link>
            <Link href="/privacy" isExternal>
              <Text fontSize="sm" color="gray" ml={4}>
                Privacy
              </Text>
            </Link>
            <Text fontSize="sm" color="gray" mx={1}>
              &amp;
            </Text>
            <Link href="/terms" isExternal>
              <Text fontSize="sm" color="gray">
                Terms
              </Text>
            </Link>
          </Flex>
        </Center>
      </Container>
    </Box>
  );
};

const BodyMobile = (props: {
  coupon: Coupon | undefined;
  chain: Chain | undefined;
  nfts: Nft[];
}) => {
  return (
    <Box as="main" mb={32}>
      <Box bg="secondary.500" h={{ base: "204px" }}>
        <Container maxWidth="4xl" pt="24px">
          <Box
            bg="primary.500"
            h={{ base: "180px" }}
            borderTopRadius={16}
            pt="32px"
            px="40px"
          >
            <Flex>
              <Spacer />
              {props.coupon && props.coupon.imageUrl && props.coupon.name ? (
                <CouponImage
                  imageUrl={props.coupon.imageUrl}
                  alt={props.coupon.name}
                />
              ) : (
                <AspectRatio>
                  <Box
                    bgColor="gray"
                    rounded={16}
                    borderColor="white"
                    borderWidth={1}
                  ></Box>
                </AspectRatio>
              )}
              <Spacer />
            </Flex>
          </Box>
        </Container>
      </Box>
      <Box>
        <Container maxWidth="4xl">
          <Box
            bg="white"
            minH={{ base: "320px" }}
            borderBottomRadius={16}
            pt="64px"
          >
            <Box px={4} pb="24px">
              <Box>
                <Flex>
                  {props.coupon && props.coupon.rewardType ? (
                    <CouponRewardTypeLabel
                      rewardType={props.coupon.rewardType}
                    />
                  ) : (
                    <Skeleton h={4} mt={2} />
                  )}
                </Flex>
              </Box>
              <Box mt={4}>
                <Flex>
                  {props.coupon && props.coupon.rewardType ? (
                    <CouponDaysLeftLabel endAt={props.coupon.endAt} />
                  ) : (
                    <Skeleton h={4} mt={2} />
                  )}
                </Flex>
              </Box>
              <Box mt={4}>
                {props.coupon && props.coupon.name ? (
                  <Heading as="h2" fontWeight="bold" fontSize="4xl" mt={4}>
                    {props.coupon.name}
                  </Heading>
                ) : (
                  <Skeleton h={4} mt={2} />
                )}
                {props.coupon && props.coupon.description ? (
                  <Text color="secondary.500" fontWeight="light">
                    {props.coupon.description}
                  </Text>
                ) : (
                  <Skeleton h={4} mt={2} />
                )}
              </Box>
              <Box mt={8}>
                <Heading as="h3" fontWeight="bold" fontSize="lg">
                  Cashback Period
                </Heading>
                {props.coupon &&
                props.coupon.startAt &&
                props.coupon.endAt &&
                props.coupon.timezone ? (
                  <CouponPeriodLabel
                    startAt={props.coupon.startAt}
                    endAt={props.coupon.endAt}
                    timezone={props.coupon.timezone}
                    isMobileUi={true}
                  />
                ) : (
                  <>
                    <Skeleton h={4} mt={2} />
                    <Skeleton h={4} mt={2} />
                    <Skeleton h={4} mt={2} />
                  </>
                )}
              </Box>
              <Box mt={8}>
                <Heading as="h3" fontWeight="bold" fontSize="lg">
                  Applicable NFT Collections
                </Heading>
                <Text fontWeight="light">
                  You will receive cashback when you get NFTs from any of these
                  collections.
                </Text>
                {props.chain && 0 < props.nfts.length ? (
                  <>
                    {props.nfts.flatMap((nft) => {
                      return (
                        <NftCell
                          nft={nft}
                          chain={props.chain!}
                          isMobileUi={true}
                        />
                      );
                    })}
                  </>
                ) : (
                  <>
                    <Skeleton h={4} mt={2} />
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
      <Box
        position="fixed"
        left={0}
        bottom={0}
        w="100%"
        backgroundColor="white"
        borderTopColor="gray.300"
        borderTopWidth="1px"
        px={4}
        py={2}
      >
        <Flex>
          <Spacer />
          {props.chain && props.coupon ? (
            <ClaimButton chain={props.chain} coupon={props.coupon} />
          ) : (
            <>
              <Button
                size="md"
                type="submit"
                isLoading
                leftIcon={<Icon as={FaPlus} />}
              >
                Claim Cashback Coupon
              </Button>
            </>
          )}
          <Spacer />
        </Flex>
      </Box>
      <Footer />
    </Box>
  );
};

const BodyDesktop = (props: {
  coupon: Coupon | undefined;
  chain: Chain | undefined;
  nfts: Nft[];
}) => {
  return (
    <Box as="main" mb={32}>
      <Box bg="secondary.500" h={{ base: "280px" }}>
        <Container maxWidth="4xl" pt="60px">
          <Box
            bg="primary.500"
            h={{ base: "220px" }}
            borderTopRadius={16}
            pt="64px"
            px="40px"
          >
            <Flex>
              {props.coupon && props.coupon.imageUrl && props.coupon.name ? (
                <CouponImage
                  imageUrl={props.coupon.imageUrl}
                  alt={props.coupon.name}
                />
              ) : (
                <AspectRatio>
                  <Box
                    bgColor="gray"
                    rounded={16}
                    borderColor="white"
                    borderWidth={1}
                  ></Box>
                </AspectRatio>
              )}
              <Box pl={8} flex="1">
                <Flex>
                  {props.coupon && props.coupon.rewardType ? (
                    <CouponRewardTypeLabel
                      rewardType={props.coupon.rewardType}
                    />
                  ) : (
                    <Skeleton h={4} mt={2} />
                  )}
                  <Spacer />
                  {props.coupon && props.coupon.rewardType ? (
                    <CouponDaysLeftLabel endAt={props.coupon.endAt} />
                  ) : (
                    <Skeleton h={4} mt={2} />
                  )}
                </Flex>
                {props.coupon && props.coupon.name ? (
                  <Heading as="h2" fontWeight="bold" fontSize="4xl" mt={4}>
                    {props.coupon.name}
                  </Heading>
                ) : (
                  <Skeleton h={4} mt={2} />
                )}
                {props.coupon && props.coupon.description ? (
                  <Text color="secondary.500" fontWeight="light" mt={2}>
                    {props.coupon.description}
                  </Text>
                ) : (
                  <Skeleton h={4} mt={2} />
                )}
              </Box>
            </Flex>
          </Box>
        </Container>
      </Box>
      <Box>
        <Container maxWidth="4xl">
          <Box
            bg="white"
            minH={{ base: "320px" }}
            borderBottomRadius={16}
            pt="64px"
          >
            <Box px="40px" pb="24px">
              <Box>
                <Heading as="h3" fontWeight="bold" fontSize="lg">
                  Cashback Period
                </Heading>
                {props.coupon &&
                props.coupon.startAt &&
                props.coupon.endAt &&
                props.coupon.timezone ? (
                  <CouponPeriodLabel
                    startAt={props.coupon.startAt}
                    endAt={props.coupon.endAt}
                    timezone={props.coupon.timezone}
                    isMobileUi={false}
                  />
                ) : (
                  <>
                    <Skeleton h={4} mt={2} />
                    <Skeleton h={4} mt={2} />
                    <Skeleton h={4} mt={2} />
                  </>
                )}
              </Box>
              <Box mt={8}>
                <Heading as="h3" fontWeight="bold" fontSize="lg">
                  Applicable NFT Collections
                </Heading>
                <Text fontWeight="light">
                  You will receive cashback when you get NFTs from any of these
                  collections.
                </Text>
                {props.chain && 0 < props.nfts.length ? (
                  <>
                    {props.nfts.flatMap((nft) => {
                      return (
                        <NftCell
                          nft={nft}
                          chain={props.chain!}
                          isMobileUi={false}
                        />
                      );
                    })}
                  </>
                ) : (
                  <>
                    <Skeleton h={4} mt={2} />
                  </>
                )}
              </Box>
            </Box>
            <Divider color="gray.100" />
            <Grid templateColumns="repeat(12, 1fr)" py={4}>
              <GridItem colSpan={{ base: 3 }}></GridItem>
              <GridItem colSpan={{ base: 6 }} textAlign="center">
                {props.chain && props.coupon ? (
                  <ClaimButton chain={props.chain} coupon={props.coupon} />
                ) : (
                  <>
                    <Button
                      size="md"
                      type="submit"
                      isLoading
                      leftIcon={<Icon as={FaPlus} />}
                    >
                      Claim Cashback Coupon
                    </Button>
                  </>
                )}
              </GridItem>
              <GridItem colSpan={{ base: 3 }}></GridItem>
            </Grid>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default function Mint() {
  const { coupon_id } = useRouter().query;
  const isMobileUi = useBreakpointValue({ base: true, md: false });
  const { callGetCoupon, callGetChain, callGetNfts } = usePublicApi();
  const [coupon, setCoupon] = useState<Coupon | undefined>(undefined);
  const [chain, setChain] = useState<Chain | undefined>(undefined);
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const couponId = useMemo(() => {
    return coupon_id && (coupon_id as string);
  }, [coupon_id]);

  const getCoupon = useCallback(
    async (couponId: string): Promise<void> => {
      const item = await callGetCoupon(couponId);
      setCoupon(item);
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
    getCoupon(couponId);
    getChain(couponId);
    getNfts(couponId);
  }, [couponId, getChain, getCoupon, getNfts]);

  return (
    <>
      <HtmlHead />
      {isMobileUi ? (
        <BodyMobile coupon={coupon} chain={chain} nfts={nfts} />
      ) : (
        <BodyDesktop coupon={coupon} chain={chain} nfts={nfts} />
      )}
    </>
  );
}
