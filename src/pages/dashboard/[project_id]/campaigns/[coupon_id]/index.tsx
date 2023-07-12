import CashbacksSection from "@/components/dashboard/coupons/cashbacks-section";
import ChainNameValue from "@/components/dashboard/coupons/chain-name-value";
import CouponHoldersSection from "@/components/dashboard/coupons/coupon-holders-section";
import CouponRewardTypeValue from "@/components/dashboard/coupons/coupon-reward-type-value";
import CouponStatusValue from "@/components/dashboard/coupons/coupon-status-value";
import InvalidateDialog from "@/components/dashboard/coupons/invalidate-dialog";
import NftLink from "@/components/dashboard/coupons/nft-link";
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
  Icon,
  IconButton,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { DotsThree } from "phosphor-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaArrowLeft, FaTrash } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";

const SummarySection = (props: {
  isInitialized: boolean;
  chain: Chain | undefined;
  coupon: Coupon | undefined;
  nfts: Nft[];
  clickDelete: () => void;
}) => {
  const { getStatus } = useCouponsApi();
  const { formatWithTimezone } = useDatetime();
  const status = useMemo(() => {
    if (!props.coupon) return;
    return getStatus(props.coupon);
  }, [getStatus, props.coupon]);

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
    <Box>
      <Box>
        <Heading as="h4" fontSize="md">
          Status
        </Heading>
        {props.isInitialized && status ? (
          <CouponStatusValue status={status!} />
        ) : (
          <Skeleton h={4} />
        )}
      </Box>
      <Box mt={8}>
        <Heading as="h4" fontSize="md">
          Reward Type
        </Heading>

        {props.isInitialized && props.coupon && props.coupon.rewardType ? (
          <CouponRewardTypeValue rewardType={props.coupon.rewardType} />
        ) : (
          <Skeleton h={4} />
        )}
      </Box>
      <Box mt={8}>
        <Heading as="h4" fontSize="md">
          Network
        </Heading>
        {props.isInitialized && props.coupon && props.coupon.chainId ? (
          <ChainNameValue chainId={props.coupon.chainId} />
        ) : (
          <Skeleton h={4} />
        )}
      </Box>
      <Box mt={8}>
        <Heading as="h4" fontSize="md">
          Applicable NFT Collections
        </Heading>

        {props.isInitialized && props.chain && props.chain.openseaUrl ? (
          <>
            {props.nfts.length === 0 && (
              <Text fontSize="sm">No NFT Collections</Text>
            )}
            {0 < props.nfts.length && (
              <>
                {props.nfts.flatMap((nft) => {
                  return (
                    <NftLink
                      openseaUrl={props.chain!.openseaUrl}
                      name={nft.name}
                      contractAddress={nft.contractAddress}
                    />
                  );
                })}
              </>
            )}
          </>
        ) : (
          <Skeleton h={4} />
        )}
      </Box>
      <Box mt={8}>
        <Heading as="h4" fontSize="md">
          Starts
        </Heading>

        {props.isInitialized && startAtStr ? (
          <Text fontSize="md" fontWeight="light" color="gray">
            {startAtStr}
          </Text>
        ) : (
          <Skeleton h={4} />
        )}
      </Box>
      <Box mt={8}>
        <Heading as="h4" fontSize="md">
          Ends
        </Heading>
        {props.isInitialized && startAtStr ? (
          <Text fontSize="md" fontWeight="light" color="gray">
            {endAtStr}
          </Text>
        ) : (
          <Skeleton h={4} />
        )}
      </Box>
      <Box mt={8}>
        <Heading as="h4" fontSize="md">
          Timezone
        </Heading>
        {props.isInitialized && props.coupon && props.coupon.timezone ? (
          <Text fontSize="md" fontWeight="light" color="gray">
            {props.coupon && props.coupon.timezone}
          </Text>
        ) : (
          <Skeleton h={4} />
        )}
      </Box>
      <Box mt={8}>
        <Heading as="h4" fontSize="md">
          Campaign Description
        </Heading>
        {props.isInitialized && props.coupon && props.coupon.description ? (
          <Text fontSize="md" fontWeight="light" color="gray">
            {props.coupon && props.coupon.description}
          </Text>
        ) : (
          <Skeleton h={4} />
        )}
      </Box>
    </Box>
  );
};

const TresurySection = (props: {
  isInitialized: boolean;
  chain: Chain | undefined;
  project: Project | undefined;
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
  }, [props.chain, props.project, getExplorerAddressUrl]);

  return (
    <Box>
      <Flex align="center">
        <Heading as="h3" fontSize="lg">
          Treasury Status
        </Heading>
        <Spacer />
        {props.project && (
          <Link
            href={`/dashboard/${props.project.id}`}
            isExternal
            display="flex"
          >
            <Button
              variant="link"
              size="sm"
              leftIcon={<Icon as={FiArrowUpRight} boxSize={4} />}
            >
              Withdraw
            </Button>
          </Link>
        )}
      </Flex>
      <Grid templateColumns="repeat(12, 1fr)" my={4}>
        <GridItem colSpan={{ base: 12, md: 6 }}>
          <Heading as="h4" fontSize="md">
            Contract Address
          </Heading>
          {explorerUrl && props.project && (
            <Link
              href={explorerUrl}
              style={{ width: "100%", display: "block" }}
              isExternal
              display="flex"
            >
              <Button
                variant="link"
                fontSize="md"
                fontWeight="light"
                color="gray"
              >
                {truncateContractAddress(props.project?.walletAddress)}
              </Button>
            </Link>
          )}
        </GridItem>
        <GridItem colSpan={{ base: 12, md: 6 }}>
          <Heading as="h4" fontSize="md">
            Funds Balance
          </Heading>
          {explorerUrl && props.project && (
            <Link
              href={explorerUrl}
              style={{ width: "100%", display: "block" }}
              isExternal
            >
              <Button
                variant="link"
                fontSize="md"
                fontWeight="light"
                color="gray"
              >
                Click Here
              </Button>
            </Link>
          )}
        </GridItem>
      </Grid>
    </Box>
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
  const { getMintUrl } = useUrl();

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
    router.push(`/dashboard/${projectId}/campaigns/`);
  };

  return (
    <>
      <HtmlHead />
      <DashboardLayout projectId={projectId}>
        <Card mb={16}>
          <Flex align="center" px={{ base: 4, md: 8 }} py={4}>
            <NextLink href={`/dashboard/${projectId}/campaigns/`}>
              <IconButton
                aria-label="back"
                variant="outline"
                colorScheme="black"
                w="40px"
                h="40px"
                icon={<FaArrowLeft color="black" />}
              />
            </NextLink>
            {isInitialized && coupon ? (
              <>
                <Image
                  src={coupon.imageUrl}
                  w="40px"
                  h="40px"
                  alt="Icon"
                  ml={4}
                  rounded={4}
                />
                <Heading
                  as="h3"
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="bold"
                  ml={4}
                  noOfLines={1}
                >
                  {coupon.name}
                </Heading>
              </>
            ) : (
              <Skeleton h={4} />
            )}
            <Spacer />
            {isInitialized && coupon && (
              <>
                <Link href={getMintUrl(coupon.id)} isExternal>
                  <IconButton
                    display={{ base: "block", md: "none" }}
                    w="40px"
                    h="40px"
                    aria-label="Mint Page"
                    icon={<FiArrowUpRight size={16} />}
                  />
                  <Button
                    display={{ base: "none", md: "block" }}
                    size="sm"
                    leftIcon={<Icon as={FiArrowUpRight} boxSize={4} />}
                  >
                    Coupon Page
                  </Button>
                </Link>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label="Options"
                    icon={<DotsThree weight="bold" size={24} />}
                    variant="ghots"
                    w="40px"
                    h="40px"
                    ml={2}
                  />
                  <MenuList>
                    <MenuItem
                      icon={<FaTrash size={16} />}
                      onClick={clickDelete}
                    >
                      Invalidate
                    </MenuItem>
                  </MenuList>
                </Menu>
              </>
            )}
          </Flex>
          <Divider color="gray.100" />
          <Grid
            templateAreas={{
              base: `"coupon_summary" "coupon_horizontal_divider" "coupon_stats"`,
              md: `"coupon_summary coupon_vertical_divider coupon_stats"`,
            }}
            gridTemplateColumns={{
              base: "100% 100% 100%",
              md: "320px 1px calc(100% - 321px)",
            }}
          >
            <GridItem
              area="coupon_summary"
              px={{ base: 4, md: 8 }}
              py={{ base: 8 }}
            >
              <SummarySection
                isInitialized={isInitialized}
                chain={chain}
                coupon={coupon}
                nfts={nfts}
                clickDelete={clickDelete}
              />
            </GridItem>
            <GridItem area="coupon_horizontal_divider">
              <Divider orientation="horizontal" color="pink" />
            </GridItem>
            <GridItem area="coupon_vertical_divider">
              <Divider orientation="vertical" color="pink" />
            </GridItem>
            <GridItem
              area="coupon_stats"
              px={{ base: 4, md: 8 }}
              py={{ base: 8 }}
            >
              <TresurySection
                isInitialized={isInitialized}
                chain={chain}
                project={project}
              />
              <Divider my={8} />
              <Flex align="center">
                <Heading as="h3" fontSize="lg">
                  Coupon Holders
                </Heading>
              </Flex>
              <CouponHoldersSection
                isInitialized={isInitialized}
                chain={chain}
                couponHolders={couponHolders}
                projectId={projectId}
                couponId={couponId}
              />
              <Divider my={8} />
              <Flex align="center">
                <Heading as="h3" fontSize="lg">
                  Recent Cashbacks
                </Heading>
              </Flex>
              <CashbacksSection
                isInitialized={isInitialized}
                chain={chain}
                cashbacks={cashbacks}
                projectId={projectId}
                couponId={couponId}
              />
            </GridItem>
          </Grid>
        </Card>
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
