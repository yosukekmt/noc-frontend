import CashbacksSection from "@/components/dashboard/coupons/cashbacks-section";
import CouponHoldersSection from "@/components/dashboard/coupons/coupon-holders-section";
import InvalidateDialog from "@/components/dashboard/coupons/invalidate-dialog";
import HtmlHead from "@/components/html-head";
import { useBlockchain } from "@/hooks/useBlockchain";
import { useCashbacksApi } from "@/hooks/useCashbacksApi";
import { useChainsApi } from "@/hooks/useChainsApi";
import { useCouponHoldersApi } from "@/hooks/useCouponHoldersApi";
import { useCouponsApi } from "@/hooks/useCouponsApi";
import { useDatetime } from "@/hooks/useDatetime";
import { useFirebase } from "@/hooks/useFirebase";
import { useNftsApi } from "@/hooks/useNftsApi";
import { useProjectsApi } from "@/hooks/useProjectsApi";
import { useUrl } from "@/hooks/useUrl";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Cashback, Chain, Coupon, CouponHolder, Nft, Project } from "@/models";
import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Image,
  Link,
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
import { useRouter } from "next/router";
import { Cube, DotsThree, LineSegment, Spinner, Tag } from "phosphor-react";
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
        <Grid templateColumns="repeat(12, 1fr)" my={4}>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <Flex>
              <Card
                width={128}
                height={128}
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
              <Box ml={4}>
                <Heading as="h3">
                  <Flex align="center">
                    <Tag color="gray" size={16} weight="fill" />
                    <Text fontSize="sm" color="gray" ml={2}>
                      Cashback Campaign
                    </Text>
                  </Flex>
                </Heading>
                <Heading as="h4" fontSize="4xl" mt={2}>
                  {props.coupon && props.coupon.name}
                </Heading>
              </Box>
            </Flex>
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <Flex>
              <Spacer />
              {props.coupon && (
                <Link href={getMintUrl(props.coupon.id)} isExternal>
                  <Button>Coupon Page</Button>
                </Link>
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
                    Invalidate
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </GridItem>
        </Grid>
        <Divider mt={2} />
        <Grid templateColumns="repeat(12, 1fr)" gap={4} my={4}>
          <GridItem colSpan={{ base: 12, sm: 6, md: 3 }}>
            <Box>
              <Text fontSize="sm" color="gray">
                Network
              </Text>
              <Text fontSize="sm">{props.chain && props.chain.name}</Text>
            </Box>
          </GridItem>
          <GridItem colSpan={{ base: 12, sm: 6, md: 3 }}>
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
                {status === "invalidated" && "Invalidated"}
              </Text>
            </Box>
          </GridItem>
          <GridItem colSpan={{ base: 12, sm: 6, md: 3 }}>
            <Box>
              <Text fontSize="sm" color="gray">
                Reward type
              </Text>
              {props.coupon && props.coupon.rewardType === "cashback_gas" && (
                <Text fontSize="sm">Gas fee cashback</Text>
              )}
              {props.coupon && props.coupon.rewardType === "cashback_005" && (
                <Text fontSize="sm">5% Cashback</Text>
              )}
            </Box>
          </GridItem>
          <GridItem colSpan={{ base: 12, sm: 6, md: 3 }}>
            <Box>
              <Text fontSize="sm" color="gray">
                Contract address
              </Text>
              <Text fontSize="sm">
                {isContractReady && explorerUrl && (
                  <Link
                    href={explorerUrl!}
                    style={{ width: "100%", display: "block" }}
                    isExternal
                  >
                    {truncateContractAddress(props.coupon!.contractAddress)}
                    <br />({`Token ID:${props.coupon!.nftTokenId}`})
                  </Link>
                )}
                {isContractReady === false && "Processing"}
              </Text>
            </Box>
          </GridItem>
          <GridItem colSpan={{ base: 12, sm: 4 }}>
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
                      <Link
                        href={openseaAddresses.get(nft.contractAddress) || ""}
                        style={{ width: "100%", display: "block" }}
                        isExternal
                      >
                        {`${nft.name}(${truncateContractAddress(
                          nft.contractAddress
                        )})`}
                      </Link>
                    </Text>
                  );
                })}
            </Box>
          </GridItem>
          <GridItem colSpan={{ base: 12, sm: 4 }}>
            <Box>
              <Text fontSize="sm" color="gray">
                Description
              </Text>
              <Text fontSize="sm">
                {props.coupon && props.coupon.description}
              </Text>
            </Box>
          </GridItem>
          <GridItem colSpan={{ base: 12, sm: 4 }}>
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
  project: Project | undefined;
  coupon: Coupon | undefined;
  nfts: Nft[];
  projectId: string | undefined;
  couponId: string | undefined;
  clickDelete: () => void;
}) => {
  const { truncateContractAddress, getExplorerAddressUrl } = useBlockchain();

  const explorerUrl = useMemo(() => {
    if (!props.chain) return;
    if (!props.chain.explorerUrl) return;
    if (!props.project) return;

    return getExplorerAddressUrl(
      props.chain.explorerUrl,
      props.project.walletAddress
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
                {explorerUrl && props.project && (
                  <Link
                    href={explorerUrl}
                    style={{ width: "100%", display: "block" }}
                    isExternal
                  >
                    {truncateContractAddress(props.project?.walletAddress)}
                  </Link>
                )}
              </Text>
            </Box>
          </GridItem>
          <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
            <Box>
              <Text fontSize="sm" color="gray">
                Balance
              </Text>
              <Text fontSize="sm">
                {explorerUrl && props.project && (
                  <Link
                    href={explorerUrl}
                    style={{ width: "100%", display: "block" }}
                    isExternal
                  >
                    Click Here
                  </Link>
                )}
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
  const router = useRouter();
  const { project_id, coupon_id } = useRouter().query;

  const { callGetChain } = useChainsApi();
  const { callGetProject } = useProjectsApi();
  const { callGetCoupon } = useCouponsApi();
  const { callGetNfts } = useNftsApi();
  const { callGetCouponHolders } = useCouponHoldersApi();
  const { callGetCashbacks } = useCashbacksApi();

  const [chain, setChain] = useState<Chain | undefined>(undefined);
  const [project, setProject] = useState<Project | undefined>(undefined);
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

  const getProject = useCallback(
    async (authToken: string, projectId: string): Promise<void> => {
      const item = await callGetProject(authToken, projectId);
      setProject(item);
    },
    [callGetProject]
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

    (async () => {
      await getProject(authToken, projectId);
      setIsInitialized(true);
    })();
  }, [authToken, getProject, isFirebaseInitialized, projectId]);

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

  const onDeleted = () => {
    router.push(`/dashboard/${projectId}/coupons/`);
  };

  return (
    <>
      <HtmlHead />
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
            project={project}
            coupon={coupon}
            nfts={nfts}
            couponId={couponId}
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
      {coupon && projectId && (
        <InvalidateDialog
          projectId={projectId}
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
