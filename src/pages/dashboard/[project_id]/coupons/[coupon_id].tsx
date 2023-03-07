import DeleteDialog from "@/components/dashboard/coupons/delete-dialog";
import { useCouponsApi } from "@/hooks/useCouponsApi";
import { useCurrentUserApi } from "@/hooks/useCurrentUserApi";
import { useFirebase } from "@/hooks/useFirebase";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Coupon } from "@/models";
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
  VStack,
  useDisclosure,
  useToken,
} from "@chakra-ui/react";
import { Chart, registerables } from "chart.js";
import Head from "next/head";
import { useRouter } from "next/router";
import { Cube, DotsThree, LineSegment, Tag } from "phosphor-react";
import { useCallback, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
Chart.register(...registerables);

export default function CouponDetail() {
  const { project_id: projectId, coupon_id: couponId } = useRouter().query;

  const { firebaseSignOut } = useFirebase();
  const { clearCurrentUser } = useCurrentUserApi();
  const { callGetCoupon } = useCouponsApi();
  const [item, setItem] = useState<Coupon | null>(null);
  const { authToken, isFirebaseInitialized } = useFirebase();
  const [isInitialized, setIsInitialized] = useState(false);

  const [lineColor1, lineColor2] = useToken("colors", ["blue", "gray"]);

  const deleteDialog = useDisclosure();

  const getCoupon = useCallback(
    async (
      authToken: string,
      projectId: string,
      couponId: string
    ): Promise<void> => {
      const item = await callGetCoupon(authToken, projectId, couponId);
      setItem(item);
    },
    [callGetCoupon]
  );

  useEffect(() => {
    if (!isFirebaseInitialized) return;
    if (!authToken) return;

    (async () => {
      await getCoupon(authToken, projectId as string, couponId as string);
      setIsInitialized(true);
    })();
  }, [isFirebaseInitialized, authToken, getCoupon, projectId, couponId]);

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
      <DashboardLayout>
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
                    {item && item.name}
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
                      <MenuItem icon={<Cube />} onClick={clickDelete}>
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
                  Start
                </Text>
                <Text fontSize="sm">
                  {item && item.startAt.toLocaleString()}
                </Text>
              </Box>
            </GridItem>
            <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
              <Box>
                <Text fontSize="sm" color="gray">
                  Duration
                </Text>
                <Text fontSize="sm">{item && item.treasuryAddress}</Text>
              </Box>
            </GridItem>
            <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
              <Box>
                <Text fontSize="sm" color="gray">
                  Address
                </Text>
                <Text fontSize="sm">{item && item.treasuryAddress}</Text>
              </Box>
            </GridItem>
            <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
              <Box>
                <Text fontSize="sm" color="gray">
                  Applicable NFTs
                </Text>
                <Text fontSize="sm">{item && item.treasuryAddress}</Text>
                <Text fontSize="sm">{item && item.treasuryAddress}</Text>
                <Text fontSize="sm">{item && item.treasuryAddress}</Text>
              </Box>
            </GridItem>
            <GridItem colSpan={{ base: 12, sm: 6, md: 4 }}>
              <Box>
                <Text fontSize="sm" color="gray">
                  Scam Protection
                </Text>
                <Text fontSize="sm">ON</Text>
              </Box>
            </GridItem>
          </Grid>
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
                      <Th>Walllet Address</Th>
                      <Th>Date</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {[...Array(3)].flatMap((x, idx) => {
                      return (
                        <Tr key={`members_${idx}`} h={16}>
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
      </DashboardLayout>

      {item && (
        <DeleteDialog
          item={item}
          isOpen={deleteDialog.isOpen}
          onClose={deleteDialog.onClose}
          onOpen={deleteDialog.onOpen}
          onDeleted={onDeleted}
        />
      )}
    </>
  );
}
