import CouponHoldersSection from "@/components/dashboard/coupons/coupon-holders-section";
import HtmlHead from "@/components/html-head";
import { useChainsApi } from "@/hooks/useChainsApi";
import { useCouponHoldersApi } from "@/hooks/useCouponHoldersApi";
import { useCouponsApi } from "@/hooks/useCouponsApi";
import { useFirebase } from "@/hooks/useFirebase";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Chain, Coupon, CouponHolder, PageInfo } from "@/models";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Flex,
  Heading,
  Icon,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MdTrackChanges } from "react-icons/md";

export default function CouponCouponHolders() {
  const { project_id, coupon_id } = useRouter().query;

  const { callGetChain } = useChainsApi();
  const { callGetCoupon } = useCouponsApi();
  const { callGetCouponHolders } = useCouponHoldersApi();

  const [chain, setChain] = useState<Chain | undefined>(undefined);
  const [coupon, setCoupon] = useState<Coupon | undefined>(undefined);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [items, setItems] = useState<CouponHolder[]>([]);
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
    return currentPage + 1 < pageInfo.totalPages;
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

  const getCouponHoldersApi = useCallback(
    async (
      authToken: string,
      projectId: string,
      couponId: string,
      page: number,
      query: string
    ): Promise<void> => {
      const result = await callGetCouponHolders(
        authToken,
        projectId,
        couponId,
        page,
        query
      );
      setPageInfo(result.pageInfo);
      setItems(result.items);
    },
    [callGetCouponHolders]
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
        await getCouponHoldersApi(
          authToken,
          projectId,
          couponId,
          currentPage,
          query
        );
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
    getCouponHoldersApi,
    isFirebaseInitialized,
    projectId,
    query,
  ]);

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
      <HtmlHead />
      <DashboardLayout projectId={projectId}>
        <Card variant="outline">
          <CardHeader>
            <Flex align="center">
              <Heading as="h3" fontSize="2xl" fontWeight="bold">
                Coupon Holders
              </Heading>
              <Spacer />
            </Flex>
          </CardHeader>
          <CardBody minH={400}>
            {isInitialized && items.length === 0 && (
              <Box pt={24}>
                <Center>
                  <Icon as={MdTrackChanges} boxSize={16} />
                </Center>
                <Center>
                  <Heading as="h2">No Coupon Holders</Heading>
                </Center>
              </Box>
            )}
            {isInitialized && items.length !== 0 && (
              <CouponHoldersSection
                isInitialized={isInitialized}
                chain={chain}
                couponHolders={items}
                projectId={projectId}
                couponId={couponId}
              />
            )}
          </CardBody>
          <CardFooter>
            <Flex align="center" w="100%">
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
          </CardFooter>
        </Card>
      </DashboardLayout>
    </>
  );
}
