import CashbacksSection from "@/components/dashboard/coupons/cashbacks-section";
import CouponHoldersSection from "@/components/dashboard/coupons/coupon-holders-section";
import DeleteDialog from "@/components/dashboard/coupons/delete-dialog";
import { useBlockchain } from "@/hooks/useBlockchain";
import { useCashbacksApi } from "@/hooks/useCashbacksApi";
import { useChainsApi } from "@/hooks/useChainsApi";
import { useCouponHoldersApi } from "@/hooks/useCouponHoldersApi";
import { useCouponsApi } from "@/hooks/useCouponsApi";
import { useDatetime } from "@/hooks/useDatetime";
import { useFirebase } from "@/hooks/useFirebase";
import { useNftsApi } from "@/hooks/useNftsApi";
import { useUrl } from "@/hooks/useUrl";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Cashback, Chain, Coupon, CouponHolder, Nft } from "@/models";
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useDisclosure,
  useToken,
  VStack,
} from "@chakra-ui/react";
import { Chart, registerables } from "chart.js";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Cube, DotsThree, LineSegment, Tag } from "phosphor-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
Chart.register(...registerables);

const SummarySection = (props: {
  isInitialized: boolean;
  chain: Chain | undefined;
  coupon: Coupon | undefined;
  nfts: Nft[];
  clickDelete: () => void;
}) => {
  const { getStatus } = useCouponsApi();
  const { formatWithTimezone } = useDatetime();
  const { getMintUrl } = useUrl();
  const {
    truncateContractAddress,
    getExplorerAddressUrl,
    getOpenseaAddressUrl,
  } = useBlockchain();

  const status = useMemo(() => {
    if (!props.coupon) return;
    return getStatus(props.coupon);
  }, [getStatus, props.coupon]);

  const isContractReady = useMemo(() => {
    if (!props.coupon) return;
    return !!props.coupon.contractAddress && !!props.coupon.nftTokenId;
  }, [props.coupon]);

  const startAtStr = useMemo(() => {
    if (!props.coupon) return;
    if (!props.coupon.startAt) return;
    if (!props.coupon.timezone) return;

    return formatWithTimezone(props.coupon.startAt, props.coupon.timezone);
  }, [formatWithTimezone, props.coupon]);

  const endAtStr = useMemo(() => {
    if (!props.coupon) return;
    if (!props.coupon.endAt) return;
    if (!props.coupon.timezone) return;

    return formatWithTimezone(props.coupon.endAt, props.coupon.timezone);
  }, [formatWithTimezone, props.coupon]);

  const explorerUrl = useMemo(() => {
    if (!props.chain) return;
    if (!props.chain.explorerUrl) return;
    if (!props.coupon) return;
    if (!props.coupon.contractAddress) return;
    return getExplorerAddressUrl(
      props.chain.explorerUrl,
      props.coupon.contractAddress
    );
  }, [getExplorerAddressUrl, props.chain, props.coupon]);

  const openseaAddresses = useMemo(() => {
    if (!props.chain) return;
    if (!props.chain.explorerUrl) return;

    const addresses: Map<string, string> = new Map();

    props.nfts.forEach((nft) => {
      const openseaAddress = getOpenseaAddressUrl(
        props.chain!.openseaUrl,
        nft.contractAddress
      );
      addresses.set(nft.contractAddress, openseaAddress);
    });
    return addresses;
  }, [getOpenseaAddressUrl, props.chain, props.nfts]);

  return (
    <>
      <Box>
        <Grid templateColumns="repeat(12, 1fr)" gap={4} my={4}>
          <GridItem colSpan={{ base: 12 }}>
            <Flex align="center">
              <Box>
                <Heading as="h3">
                  <Flex align="center">
                    <Tag color="gray" size={16} weight="fill" />
                    <Text fontSize="sm" color="gray" ml={2}>
                      Gasback NFT
                    </Text>
                  </Flex>
                </Heading>
                <Heading as="h4" fontSize="4xl" mt={2}>
                  {props.coupon && props.coupon.name}
                </Heading>
              </Box>
              <Spacer />
              <Flex align="center">
                {props.coupon && (
                  <NextLink
                    href={getMintUrl(props.coupon.id)}
                    style={{ width: "100%", display: "block" }}
                    target="_blank"
                  >
                    <Button size="sm">Mint Page</Button>
                  </NextLink>
                )}
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label="Options"
                    icon={<DotsThree weight="bold" size={24} />}
                    variant="ghots"
                  />
                  <MenuList>
                    <MenuItem icon={<Cube />} onClick={props.clickDelete}>
                      Deactivate
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            </Flex>
            <Divider mt={2} />
          </GridItem>
        </Grid>
        <Grid templateColumns="repeat(12, 1fr)" gap={4} my={4}>
          <GridItem colSpan={{ base: 12, sm: 6, md: 2 }}>
            <Box>
              <Text fontSize="sm" color="gray">
                Status
              </Text>
              <Text fontSize="sm">
                {status === "processing" && "Processing"}
                {status === "scheduled" && "Scheduled"}
                {status === "ongoing" && "Ongoing"}
                {status === "finished" && "Finished"}
                {status === "failed" && "Could not process"}
              </Text>
            </Box>
          </GridItem>
          <GridItem colSpan={{ base: 12, sm: 6, md: 2 }}>
            <Box>
              <Text fontSize="sm" color="gray">
                Reward type
              </Text>
              <Text fontSize="sm">Gas fee cashback</Text>
            </Box>
          </GridItem>
          <GridItem colSpan={{ base: 12, sm: 6, md: 2 }}>
            <Box>
              <Text fontSize="sm" color="gray">
                Contract address
              </Text>
              <Text fontSize="sm">
                {isContractReady && explorerUrl && (
                  <NextLink
                    href={explorerUrl!}
                    style={{ width: "100%", display: "block" }}
                    target="_blank"
                  >
                    {truncateContractAddress(props.coupon!.contractAddress)}
                    <br />({`Token ID:${props.coupon!.nftTokenId}`})
                  </NextLink>
                )}
                {isContractReady === false && "Processing"}
              </Text>
            </Box>
          </GridItem>
          <GridItem colSpan={{ base: 12, sm: 6, md: 6 }}>
            <Box>
              <Text fontSize="sm" color="gray">
                Applicable NFTs
              </Text>
              {props.nfts.length === 0 && <Text fontSize="sm">No NFT set</Text>}
              {openseaAddresses &&
                0 < props.nfts.length &&
                props.nfts.flatMap((nft) => {
                  return (
                    <Text fontSize="sm" key={`applicable_nft_${nft.id}`}>
                      <NextLink
                        href={openseaAddresses.get(nft.contractAddress) || ""}
                        style={{ width: "100%", display: "block" }}
                        target="_blank"
                      >
                        {`${nft.name}(${truncateContractAddress(
                          nft.contractAddress
                        )})`}
                      </NextLink>
                    </Text>
                  );
                })}
            </Box>
          </GridItem>
          <GridItem colSpan={{ base: 12, sm: 6 }}>
            <Box>
              <Text fontSize="sm" color="gray">
                Description
              </Text>
              <Text fontSize="sm">
                {props.coupon && props.coupon.description}
              </Text>
            </Box>
          </GridItem>
          <GridItem colSpan={{ base: 12, sm: 6 }}>
            <Box>
              <Text fontSize="sm" color="gray">
                Period
              </Text>
              <Text fontSize="sm">
                {props.coupon && `${startAtStr} - ${endAtStr}`}
              </Text>
              <Text fontSize="sm">
                {props.coupon && `(${props.coupon.timezone})`}
              </Text>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
};

const TresurySection = (props: {
  isInitialized: boolean;
  chain: Chain | undefined;
  coupon: Coupon | undefined;
  nfts: Nft[];
  clickDelete: () => void;
}) => {
  const { truncateContractAddress, getExplorerAddressUrl } = useBlockchain();

  const isTreasuryReady = useMemo(() => {
    if (!props.coupon) return;
    return !!props.coupon.treasuryAddress;
  }, [props.coupon]);

  const explorerUrl = useMemo(() => {
    if (!props.chain) return;
    if (!props.chain.explorerUrl) return;
    if (!props.coupon) return;
    if (!props.coupon.treasuryAddress) return;
    return getExplorerAddressUrl(
      props.chain.explorerUrl,
      props.coupon.treasuryAddress
    );
  }, [getExplorerAddressUrl, props.chain, props.coupon]);

  return (
    <>
      <Box>
        <Grid templateColumns="repeat(12, 1fr)" gap={4} mt={24}>
          <GridItem colSpan={{ base: 12 }}>
            <Flex>
              <Heading as="h4" fontSize="2xl">
                Treasury Status
              </Heading>
              <Spacer />
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<DotsThree weight="bold" size={24} />}
                  variant="ghots"
                />
                <MenuList>
                  <MenuItem icon={<Cube />} onClick={props.clickDelete}>
                    Withdraw
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
            <Divider mt={2} />
          </GridItem>
        </Grid>
        <Grid templateColumns="repeat(12, 1fr)" gap={4} my={4}>
          <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
            <Box>
              <Text fontSize="sm" color="gray">
                Contract address
              </Text>
              <Text fontSize="sm">
                {isTreasuryReady && explorerUrl && props.coupon && (
                  <NextLink
                    href={explorerUrl}
                    style={{ width: "100%", display: "block" }}
                    target="_blank"
                  >
                    {truncateContractAddress(props.coupon.treasuryAddress)}
                  </NextLink>
                )}
                {isTreasuryReady === false && "Processing"}
              </Text>
            </Box>
          </GridItem>
          <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
            <Box>
              <Text fontSize="sm" color="gray">
                Balance
              </Text>
              <Text fontSize="sm">
                {isTreasuryReady && explorerUrl && props.coupon && (
                  <NextLink
                    href={explorerUrl}
                    style={{ width: "100%", display: "block" }}
                    target="_blank"
                  >
                    Click Here
                  </NextLink>
                )}
                {isTreasuryReady === false && "Processing"}
              </Text>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
};

const StatisticsSection = (props: { isInitialized: boolean }) => {
  const [lineColor1, lineColor2] = useToken("colors", ["blue", "gray"]);
  const chartData = {
    labels: [
      "5/9",
      "6/9",
      "7/9",
      "8/9",
      "9/9",
      "10/9",
      "11/9",
      "12/9",
      "13/9",
      "14/9",
      "15/9",
      "16/9",
    ],
    datasets: [
      {
        data: [12, 19, 3, 5, 2, 3, 12, 19, 3, 5, 2, 3],
        borderColor: lineColor1,
        borderWidth: 1,
      },
      {
        data: [2, 3, 2, 1, 2, 3, 4, 20, 13, 23, 12, 23],
        borderColor: lineColor2,
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Box>
        <Grid templateColumns="repeat(12, 1fr)" gap={4} mt={24}>
          <GridItem colSpan={{ base: 12 }}>
            <Heading as="h4" fontSize="2xl">
              Statistics(DUMMY)
            </Heading>
            <Divider mt={2} />
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 8 }}>
            <Box w="100%" h="100%">
              <Box mb={4}>
                <Flex align="center">
                  <LineSegment size={24} color={lineColor1} />
                  <Text fontSize="md" ml={2} mr={8}>
                    Last 7 days
                  </Text>
                  <LineSegment size={24} color={lineColor2} />
                  <Text fontSize="md" ml={2}>
                    Previous period
                  </Text>
                </Flex>
              </Box>
              <Line
                data={chartData}
                height={120}
                options={{
                  layout: { autoPadding: false },
                  elements: {
                    point: {
                      radius: 0,
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </Box>
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 4 }}>
            <VStack align="start" h="100%">
              <Stat>
                <StatLabel>Total mints</StatLabel>
                <StatNumber>1294</StatNumber>
                <StatHelpText>+10.57% vs previous week</StatHelpText>
              </Stat>
              <Divider my={2} />
              <Stat>
                <StatLabel>Total redemptions</StatLabel>
                <StatNumber>223</StatNumber>
                <StatHelpText>+1.22% vs previous week</StatHelpText>
              </Stat>
              <Divider my={2} />
              <Stat>
                <StatLabel>Tresury balance</StatLabel>
                <StatNumber>1.3202389</StatNumber>
                <StatHelpText>ETH</StatHelpText>
              </Stat>
            </VStack>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
};

export default function CouponDetail() {
  const { project_id, coupon_id } = useRouter().query;

  const { callGetChain } = useChainsApi();
  const { callGetCoupon } = useCouponsApi();
  const { callGetNft, callGetNfts } = useNftsApi();
  const { callGetCouponHolders } = useCouponHoldersApi();
  const { callGetCashbacks } = useCashbacksApi();

  const [chain, setChain] = useState<Chain | undefined>(undefined);
  const [coupon, setCoupon] = useState<Coupon | undefined>(undefined);
  const [nfts, setNfts] = useState<Nft[]>([]);

  const [couponHolders, setCouponHolders] = useState<CouponHolder[]>([]);
  const [cashbacks, setCashbacks] = useState<Cashback[]>([]);
  const { authToken, isFirebaseInitialized } = useFirebase();
  const [isInitialized, setIsInitialized] = useState(false);

  const deleteDialog = useDisclosure();

  const getChain = useCallback(
    async (authToken: string, chainId: number): Promise<void> => {
      const item = await callGetChain(authToken, chainId);
      setChain(item);
    },
    [callGetChain]
  );

  const projectId = useMemo(() => {
    return project_id && (project_id as string);
  }, [project_id]);

  const couponId = useMemo(() => {
    return coupon_id && (coupon_id as string);
  }, [coupon_id]);

  const getCoupon = useCallback(
    async (
      authToken: string,
      projectId: string,
      couponId: string
    ): Promise<void> => {
      const item = await callGetCoupon(authToken, projectId, couponId);
      setCoupon(item);
    },
    [callGetCoupon]
  );

  const getNfts = useCallback(
    async (
      authToken: string,
      projectId: string,
      couponId: string
    ): Promise<void> => {
      const items = await callGetNfts(authToken, projectId, couponId);
      setNfts(items);
    },
    [callGetNfts]
  );

  const getCouponHoldersApi = useCallback(
    async (
      authToken: string,
      projectId: string,
      couponId: string
    ): Promise<void> => {
      const result = await callGetCouponHolders(
        authToken,
        projectId,
        couponId,
        1
      );
      setCouponHolders(result.items);
    },
    [callGetCouponHolders]
  );

  const getCashbacks = useCallback(
    async (
      authToken: string,
      projectId: string,
      couponId: string
    ): Promise<void> => {
      const result = await callGetCashbacks(authToken, projectId, couponId, 1);
      setCashbacks(result.items);
    },
    [callGetCashbacks]
  );

  useEffect(() => {
    if (!isFirebaseInitialized) return;
    if (!authToken) return;
    if (!coupon) return;

    (async () => {
      await getChain(authToken, coupon.chainId);
      setIsInitialized(true);
    })();
  }, [authToken, coupon, getChain, isFirebaseInitialized]);

  useEffect(() => {
    if (!isFirebaseInitialized) return;
    if (!authToken) return;
    if (!projectId) return;
    if (!couponId) return;

    (async () => {
      await getCoupon(authToken, projectId, couponId);
      setIsInitialized(true);
    })();
  }, [authToken, couponId, getCoupon, isFirebaseInitialized, projectId]);

  useEffect(() => {
    if (!isFirebaseInitialized) return;
    if (!authToken) return;
    if (!projectId) return;
    if (!couponId) return;

    (async () => {
      await getNfts(authToken, projectId, couponId);
    })();
  }, [authToken, couponId, getNfts, isFirebaseInitialized, projectId]);

  useEffect(() => {
    if (!isFirebaseInitialized) return;
    if (!authToken) return;
    if (!projectId) return;
    if (!couponId) return;

    (async () => {
      await getCouponHoldersApi(authToken, projectId, couponId);
    })();
  }, [
    authToken,
    couponId,
    getCouponHoldersApi,
    isFirebaseInitialized,
    projectId,
  ]);

  useEffect(() => {
    if (!isFirebaseInitialized) return;
    if (!authToken) return;
    if (!projectId) return;
    if (!couponId) return;

    (async () => {
      await getCashbacks(authToken, projectId, couponId);
    })();
  }, [authToken, couponId, getCashbacks, isFirebaseInitialized, projectId]);

  const clickDelete = () => {
    deleteDialog.onOpen();
  };

  const onDeleted = () => {};
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
      <DashboardLayout projectId={projectId as string}>
        <Box>
          <SummarySection
            isInitialized={isInitialized}
            chain={chain}
            coupon={coupon}
            nfts={nfts}
            clickDelete={clickDelete}
          />
          <TresurySection
            isInitialized={isInitialized}
            chain={chain}
            coupon={coupon}
            nfts={nfts}
            clickDelete={clickDelete}
          />
          <CouponHoldersSection
            isInitialized={isInitialized}
            chain={chain}
            couponHolders={couponHolders}
            projectId={projectId}
            couponId={couponId}
          />
          <CashbacksSection
            isInitialized={isInitialized}
            chain={chain}
            cashbacks={cashbacks}
            projectId={projectId}
            couponId={couponId}
          />
          {chain && <StatisticsSection isInitialized={isInitialized} />}
        </Box>
      </DashboardLayout>
      {coupon && (
        <DeleteDialog
          projectId={projectId as string}
          item={coupon}
          isOpen={deleteDialog.isOpen}
          onClose={deleteDialog.onClose}
          onOpen={deleteDialog.onOpen}
          onDeleted={onDeleted}
        />
      )}
    </>
  );
}
