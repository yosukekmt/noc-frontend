import {
  CashbacksTableLoadingRow,
  CashbacksTableRow,
} from "@/components/dashboard/coupons/cashbacks-section";
import {
  CouponHoldersTableLoadingRow,
  CouponHoldersTableRow,
} from "@/components/dashboard/coupons/coupon-holders-section";
import { useCashbacksApi } from "@/hooks/useCashbacksApi";
import { useChainsApi } from "@/hooks/useChainsApi";
import { useCouponHoldersApi } from "@/hooks/useCouponHoldersApi";
import { useCouponsApi } from "@/hooks/useCouponsApi";
import { useFirebase } from "@/hooks/useFirebase";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Cashback, Chain, Coupon, CouponHolder, PageInfo } from "@/models";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  Grid,
  GridItem,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import next from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Spinner, MagnifyingGlass } from "phosphor-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

export default function Cashbacks() {
  const { project_id, coupon_id } = useRouter().query;

  const { callGetChain } = useChainsApi();
  const { callGetCoupon } = useCouponsApi();
  const { callGetCashbacks } = useCashbacksApi();

  const [chain, setChain] = useState<Chain | undefined>(undefined);
  const [coupon, setCoupon] = useState<Coupon | undefined>(undefined);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [items, setItems] = useState<Cashback[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  const { authToken, isFirebaseInitialized } = useFirebase();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [query, setQuery] = useState("");

  const projectId = useMemo(() => {
    return project_id && (project_id as string);
  }, [project_id]);

  const couponId = useMemo(() => {
    return coupon_id && (coupon_id as string);
  }, [coupon_id]);

  const viewingMin = useMemo(() => {
    if (!pageInfo) return;
    return (pageInfo.page - 1) * pageInfo.perPage + 1;
  }, [pageInfo]);

  const viewingMax = useMemo(() => {
    if (!pageInfo) return;
    const max = pageInfo.page * pageInfo.perPage;
    return max <= pageInfo.total ? max : pageInfo.total;
  }, [pageInfo]);

  const lastPage = useMemo(() => {
    if (!pageInfo) return;
    return Math.ceil(pageInfo.total / pageInfo.perPage);
  }, [pageInfo]);

  const prevEnabled = useMemo(() => {
    if (!pageInfo) return false;
    return 2 <= currentPage;
  }, [pageInfo, currentPage]);

  const nextEnabled = useMemo(() => {
    if (!pageInfo) return false;
    return currentPage <= pageInfo.perPage;
  }, [pageInfo, currentPage]);

  const getChain = useCallback(
    async (authToken: string, chainId: number): Promise<void> => {
      const item = await callGetChain(authToken, chainId);
      setChain(item);
    },
    [callGetChain]
  );

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

  const getCashbacks = useCallback(
    async (
      authToken: string,
      projectId: string,
      couponId: string,
      page: number,
      query: string
    ): Promise<void> => {
      const result = await callGetCashbacks(
        authToken,
        projectId,
        couponId,
        page,
        query
      );
      setPageInfo(result.pageInfo);
      setItems(result.items);
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
      setIsLoading(true);
      try {
        await getCashbacks(authToken, projectId, couponId, currentPage, query);
        setIsLoading(false);
      } catch (err: unknown) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [
    authToken,
    couponId,
    currentPage,
    getCashbacks,
    isFirebaseInitialized,
    projectId,
    query,
  ]);

  const clickSubmit = (evt: FormEvent) => {
    evt.preventDefault();
  };

  const clickPrevPage = () => {
    if (!prevEnabled) return;
    setCurrentPage(currentPage - 1);
    window.scrollTo(0, 0);
  };

  const clickNextPage = () => {
    if (!nextEnabled) return;
    setCurrentPage(currentPage + 1);
    window.scrollTo(0, 0);
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
      <DashboardLayout projectId={projectId as string}>
        <Box>
          <Grid templateColumns="repeat(12, 1fr)" gap={4}>
            <GridItem colSpan={{ base: 12 }}>
              <Heading as="h4" fontSize="2xl">
                Cashbacks
              </Heading>
              <Divider mt={2} />
              <form onSubmit={clickSubmit}>
                <FormControl>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={isLoading ? Spinner : MagnifyingGlass} />
                    </InputLeftElement>
                    <Input
                      type="text"
                      name="query"
                      value={query}
                      onChange={(evt) => setQuery(evt.target.value)}
                    />
                  </InputGroup>
                </FormControl>
              </form>
              <Divider mt={2} />
              <TableContainer>
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>EVENT</Th>
                      <Th>STATUS</Th>
                      <Th>TX HASH</Th>
                      <Th>WALLET</Th>
                      <Th>AMOUNT</Th>
                      <Th>DATE</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {!isInitialized && (
                      <>
                        <CashbacksTableLoadingRow />
                        <CashbacksTableLoadingRow />
                        <CashbacksTableLoadingRow />
                      </>
                    )}
                    {isInitialized && items.length === 0 && (
                      <>
                        <Tr key="cashbacks_empty" h={16}>
                          <Td colSpan={6}>No Records</Td>
                        </Tr>
                      </>
                    )}
                    {isInitialized && items.length !== 0 && (
                      <>
                        {items.flatMap((item) => {
                          return (
                            <>
                              {chain && (
                                <CashbacksTableRow chain={chain} item={item} />
                              )}
                            </>
                          );
                        })}
                        <Tr key="cashbacks_page_info_bottom" h={16}>
                          <Td colSpan={6}>
                            <Flex align="center">
                              <Text>{`Viewing ${viewingMin}-${viewingMax} of ${pageInfo?.total}`}</Text>
                              <Spacer />
                              <Button
                                size="sm"
                                mr={1}
                                isDisabled={!prevEnabled}
                                onClick={clickPrevPage}
                              >
                                Previous
                              </Button>
                              <Button
                                size="sm"
                                isDisabled={!nextEnabled}
                                onClick={clickNextPage}
                              >
                                Next
                              </Button>
                            </Flex>
                          </Td>
                        </Tr>
                      </>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </GridItem>
          </Grid>
        </Box>
      </DashboardLayout>
    </>
  );
}
