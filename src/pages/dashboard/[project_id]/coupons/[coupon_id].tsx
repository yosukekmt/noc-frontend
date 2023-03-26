import DeleteDialog from "@/components/dashboard/coupons/delete-dialog";
import { useCouponsApi } from "@/hooks/useCouponsApi";
import { useCurrentUserApi } from "@/hooks/useCurrentUserApi";
import { useDatetime } from "@/hooks/useDatetime";
import { useFirebase } from "@/hooks/useFirebase";
import { useNftsApi } from "@/hooks/useNftsApi";
import NextLink from "next/link";
import { useNftTransfersApi } from "@/hooks/useNftTransfersApi";
import { useUtil } from "@/hooks/useUtil";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Coupon, Nft, NftTransfer } from "@/models";
import {
  Box,
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
  Skeleton,
  Spacer,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToken,
  VStack,
} from "@chakra-ui/react";
import { Chart, registerables } from "chart.js";
import Head from "next/head";
import { useRouter } from "next/router";
import { Cube, DotsThree, LineSegment, Tag } from "phosphor-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
Chart.register(...registerables);

const SummarySection = (props: {
  isInitialized: boolean;
  coupon: Coupon | null;
  nfts: Nft[];
  clickDelete: () => void;
}) => {
  const { formatWithTimezone } = useDatetime();
  const { truncateContractAddress } = useUtil();

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
              <Box>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label="Options"
                    icon={<DotsThree weight="bold" size={24} />}
                    variant="ghots"
                  />
                  <MenuList>
                    <MenuItem icon={<Cube />} onClick={props.clickDelete}>
                      Remove
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Box>
            </Flex>
            <Divider mt={2} />
          </GridItem>
        </Grid>
        <Grid templateColumns="repeat(12, 1fr)" gap={4} my={4}>
          <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
            <Box>
              <Text fontSize="sm" color="gray">
                Reward type
              </Text>
              <Text fontSize="sm">Gas fee cashback</Text>
            </Box>
          </GridItem>
          <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
            <Box>
              <Text fontSize="sm" color="gray">
                Gasback NFT Address
              </Text>
              <Text fontSize="sm">
                {props.coupon && props.coupon.contractAddress}
              </Text>
            </Box>
          </GridItem>
          <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
            <Box>
              <Text fontSize="sm" color="gray">
                Treasury Address
              </Text>
              <Text fontSize="sm">
                {props.coupon && props.coupon.treasuryAddress}
              </Text>
            </Box>
          </GridItem>
          <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
            <Box>
              <Text fontSize="sm" color="gray">
                Applicable NFTs
              </Text>
              {props.nfts.length === 0 && <Text fontSize="sm">No NFT set</Text>}
              {0 < props.nfts.length &&
                props.nfts.flatMap((nft) => {
                  return (
                    <Text fontSize="sm" key={`applicable_nft_${nft.id}`}>
                      {`${nft.name}(${truncateContractAddress(
                        nft.contractAddress
                      )})`}
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

const StatisticsSection = (props: {
  isInitialized: boolean;
  couponNftTransfers: NftTransfer[];
}) => {
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
              Statistics
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
                <StatLabel>Total Mints</StatLabel>
                <StatNumber>1294</StatNumber>
                <StatHelpText>+10.57% vs previous week</StatHelpText>
              </Stat>
              <Divider my={2} />
              <Stat>
                <StatLabel>Total Redemptions</StatLabel>
                <StatNumber>223</StatNumber>
                <StatHelpText>+1.22% vs previous week</StatHelpText>
              </Stat>
              <Divider my={2} />
              <Stat>
                <StatLabel>Tresury Balance</StatLabel>
                <StatNumber>1.3202389</StatNumber>
                <StatHelpText>ETH</StatHelpText>
              </Stat>
            </VStack>
          </GridItem>
        </Grid>
      </Box>
      <Box>
        <Grid templateColumns="repeat(12, 1fr)" gap={4} mt={24}>
          <GridItem colSpan={{ base: 12 }}>
            <Heading as="h4" fontSize="2xl">
              Recent Activity
            </Heading>
            <Divider mt={2} />
            <TableContainer>
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Event</Th>
                    <Th>From Address</Th>
                    <Th>To Address</Th>
                    <Th>Date</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {props.isInitialized &&
                    props.couponNftTransfers.length === 0 && (
                      <Tr key="nft_transfers_empty" h={16}>
                        <Td colSpan={3}>NO Record</Td>
                      </Tr>
                    )}
                  {props.isInitialized &&
                    props.couponNftTransfers.length !== 0 &&
                    props.couponNftTransfers.flatMap((item) => {
                      return (
                        <NftTransfersTableRow
                          isInitialized={props.isInitialized}
                          item={item}
                        />
                      );
                    })}
                  {!props.isInitialized &&
                    [...Array(3)].flatMap((x, idx) => {
                      return (
                        <Tr key={`nft_transfers_${idx}`} h={16}>
                          <Td>
                            <Skeleton h={4} />
                          </Td>
                          <Td>
                            <Skeleton h={4} />
                          </Td>
                          <Td>
                            <Skeleton h={4} />
                          </Td>
                        </Tr>
                      );
                    })}
                </Tbody>
              </Table>
            </TableContainer>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
};

const NftTransfersTableRow = (props: {
  isInitialized: boolean;
  item: NftTransfer;
}) => {
  const { formatWithoutTimezone } = useDatetime();

  const eventStr = useMemo(() => {
    if (
      props.item.fromAddress === "0x0000000000000000000000000000000000000000"
    ) {
      return "Mint";
    }
    if (props.item.toAddress === "0x0000000000000000000000000000000000000000") {
      return "Burn";
    }
    return "Transfer";
  }, [props.item.fromAddress, props.item.toAddress]);

  const fromAddressStr = useMemo(() => {
    if (
      props.item.fromAddress === "0x0000000000000000000000000000000000000000"
    ) {
      return "-";
    }
    return props.item.fromAddress;
  }, [props.item.fromAddress]);

  const toAddressStr = useMemo(() => {
    if (props.item.toAddress === "0x0000000000000000000000000000000000000000") {
      return "-";
    }
    return props.item.toAddress;
  }, [props.item.toAddress]);

  const blockProducedAtStr = useMemo(() => {
    return formatWithoutTimezone(props.item.blockProducedAt);
  }, [formatWithoutTimezone, props.item.blockProducedAt]);

  return (
    <Tr key={`nft_transfers_${props.item.id}`} h={16}>
      <Td fontWeight="normal" fontSize="sm">
        <NextLink
          href={`https://goerli.
                            etherscan.io/tx/${props.item.txHash}`}
          style={{ width: "100%", display: "block" }}
          target="_blank"
        >
          {eventStr}
        </NextLink>
      </Td>
      <Td fontWeight="normal" fontSize="sm">
        <NextLink
          href={`https://goerli.etherscan.io/tx/${item.txHash}`}
          style={{ width: "100%", display: "block" }}
          target="_blank"
        >
          {fromAddressStr}
        </NextLink>
      </Td>
      <Td fontWeight="normal" fontSize="sm">
        <NextLink
          href={`https://goerli.etherscan.io/tx/${item.txHash}`}
          style={{ width: "100%", display: "block" }}
          target="_blank"
        >
          {toAddressStr}
        </NextLink>
      </Td>
      <Td fontWeight="normal" fontSize="sm">
        <NextLink
          href={`https://goerli.etherscan.io/tx/${item.txHash}`}
          style={{ width: "100%", display: "block" }}
          target="_blank"
        >
          {blockProducedAtStr}
        </NextLink>
      </Td>
    </Tr>
  );
};

const NftTransfersSection = (props: {
  isInitialized: boolean;
  nftTransfers: NftTransfer[];
}) => {
  return (
    <Box>
      <Grid templateColumns="repeat(12, 1fr)" gap={4} mt={24}>
        <GridItem colSpan={{ base: 12 }}>
          <Heading as="h4" fontSize="2xl">
            Recent Activity
          </Heading>
          <Divider mt={2} />
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Event</Th>
                  <Th>From Address</Th>
                  <Th>To Address</Th>
                  <Th>Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {props.isInitialized && props.nftTransfers.length === 0 && (
                  <Tr key="nft_transfers_empty" h={16}>
                    <Td colSpan={3}>NO Record</Td>
                  </Tr>
                )}
                {props.isInitialized &&
                  props.nftTransfers.length !== 0 &&
                  props.nftTransfers.flatMap((item) => {
                    return (
                      <NftTransfersTableRow
                        isInitialized={props.isInitialized}
                        item={item}
                      />
                    );
                  })}
                {!props.isInitialized &&
                  [...Array(3)].flatMap((x, idx) => {
                    return (
                      <Tr key={`nft_transfers_${idx}`} h={16}>
                        <Td>
                          <Skeleton h={4} />
                        </Td>
                        <Td>
                          <Skeleton h={4} />
                        </Td>
                        <Td>
                          <Skeleton h={4} />
                        </Td>
                      </Tr>
                    );
                  })}
              </Tbody>
            </Table>
          </TableContainer>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default function CouponDetail() {
  const { project_id: projectId, coupon_id: couponId } = useRouter().query;

  const { callGetCoupon } = useCouponsApi();
  const { callGetNft, callGetNfts } = useNftsApi();
  const { callGetNftTransfers } = useNftTransfersApi();
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponNft, setCouponNft] = useState<Nft | null>(null);
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [couponNftTransfers, setCouponNftTransfers] = useState<NftTransfer[]>(
    []
  );
  const [nftTransfers, setNftTransfers] = useState<NftTransfer[]>([]);
  const { authToken, isFirebaseInitialized } = useFirebase();
  const [isInitialized, setIsInitialized] = useState(false);

  const deleteDialog = useDisclosure();

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

  const getCouponNft = useCallback(
    async (authToken: string, contractAddress: string): Promise<void> => {
      const item = await callGetNft(authToken, contractAddress);
      setCouponNft(item);
    },
    [callGetNft]
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

  const getCouponNftTransfers = useCallback(
    async (authToken: string, nftId: string): Promise<void> => {
      const items = await callGetNftTransfers(authToken, [nftId]);
      setNftTransfers(items);
    },
    [callGetNftTransfers]
  );

  const getNftTransfers = useCallback(
    async (authToken: string, nftIds: string[]): Promise<void> => {
      const items = await callGetNftTransfers(authToken, nftIds);
      setNftTransfers(items);
    },
    [callGetNftTransfers]
  );

  useEffect(() => {
    if (!isFirebaseInitialized) return;
    if (!authToken) return;

    const projectIdStr = projectId as string;
    const couponIdStr = couponId as string;
    if (!projectIdStr) return;
    if (!couponIdStr) return;

    (async () => {
      await getCoupon(authToken, projectIdStr, couponIdStr);
      setIsInitialized(true);
    })();
  }, [authToken, couponId, getCoupon, isFirebaseInitialized, projectId]);

  useEffect(() => {
    if (!isFirebaseInitialized) return;
    if (!authToken) return;
    if (!coupon) return;

    (async () => {
      await getCouponNft(authToken, coupon.contractAddress);
    })();
  }, [authToken, coupon, getCouponNft, isFirebaseInitialized]);

  useEffect(() => {
    if (!isFirebaseInitialized) return;
    if (!authToken) return;

    const projectIdStr = projectId as string;
    const couponIdStr = couponId as string;
    if (!projectIdStr) return;
    if (!couponIdStr) return;

    (async () => {
      await getNfts(authToken, projectIdStr, couponIdStr);
    })();
  }, [authToken, couponId, getNfts, isFirebaseInitialized, projectId]);

  useEffect(() => {
    if (!isFirebaseInitialized) return;
    if (!authToken) return;
    if (!couponNft) return;

    (async () => {
      await getCouponNftTransfers(authToken, couponNft.id);
    })();
  }, [authToken, couponNft, getCouponNftTransfers, isFirebaseInitialized]);

  useEffect(() => {
    if (!isFirebaseInitialized) return;
    if (!authToken) return;

    (async () => {
      await getNftTransfers(
        authToken,
        nfts.map((iitem) => iitem.id)
      );
    })();
  }, [authToken, getNftTransfers, isFirebaseInitialized, nfts]);

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
            coupon={coupon}
            nfts={nfts}
            clickDelete={clickDelete}
          />
          <StatisticsSection
            isInitialized={isInitialized}
            couponNftTransfers={couponNftTransfers}
          />
          <NftTransfersSection
            isInitialized={isInitialized}
            nftTransfers={nftTransfers}
          />
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
