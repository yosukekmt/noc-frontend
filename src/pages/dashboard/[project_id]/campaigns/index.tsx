import ChainNameValue from "@/components/dashboard/coupons/chain-name-value";
import CouponRewardTypeValue from "@/components/dashboard/coupons/coupon-reward-type-value";
import CouponStatusValue from "@/components/dashboard/coupons/coupon-status-value";
import HtmlHead from "@/components/html-head";
import { useBlockchain } from "@/hooks/useBlockchain";
import { useChainsApi } from "@/hooks/useChainsApi";
import { useCouponsApi } from "@/hooks/useCouponsApi";
import { useCurrentUserApi } from "@/hooks/useCurrentUserApi";
import { useFirebase } from "@/hooks/useFirebase";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Chain, Coupon } from "@/models";
import {
  AspectRatio,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  IconButton,
  Image,
  Skeleton,
  Spacer,
  Tbody,
  Td,
  Text,
  Tr,
  useBreakpointValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdTrackChanges } from "react-icons/md";

const CouponCell = (props: {
  chains: Chain[];
  projectId: string;
  coupon: Coupon;
}) => {
  const { getStatus } = useCouponsApi();
  const { getChainById } = useBlockchain();

  const detailUrl = useMemo(() => {
    return `/dashboard/${props.projectId}/campaigns/${props.coupon.id}`;
  }, [props.coupon.id, props.projectId]);

  const status = useMemo(() => {
    return getStatus(props.coupon);
  }, [getStatus, props.coupon]);

  return (
    <NextLink href={detailUrl}>
      <Card
        variant="outline"
        borderColor="tertiary.500"
        bgColor="tertiary.300"
        boxShadow="none"
        px={4}
        py={4}
      >
        <AspectRatio w="100%" ratio={1}>
          <Image
            src={props.coupon.imageUrl}
            alt={props.coupon.name}
            rounded={4}
          />
        </AspectRatio>
        <Text mt={{ base: 0 }}>{props.coupon.name}</Text>

        {props.coupon && props.coupon.rewardType ? (
          <CouponRewardTypeValue rewardType={props.coupon.rewardType} />
        ) : (
          <Skeleton h={4} />
        )}
        {status ? <CouponStatusValue status={status!} /> : <Skeleton h={4} />}
        <Box mt={8}>
          {props.coupon && props.coupon.chainId ? (
            <ChainNameValue chainId={props.coupon.chainId} />
          ) : (
            <Skeleton h={4} />
          )}
        </Box>
        <Text fontWeight="light">
          {props.coupon.createdAt.toLocaleString()}
        </Text>
      </Card>
    </NextLink>
  );
};
const LoadedTbodyRow = (props: {
  chains: Chain[];
  projectId: string;
  item: Coupon;
}) => {
  const { getStatus } = useCouponsApi();

  const detailUrl = useMemo(() => {
    return `/dashboard/${props.projectId}/campaigns/${props.item.id}`;
  }, [props.item.id, props.projectId]);

  const chain = useMemo(() => {
    return props.chains.find((chain) => chain.id === props.item.chainId);
  }, [props.chains, props.item.chainId]);

  const status = useMemo(() => {
    return getStatus(props.item);
  }, [getStatus, props.item]);

  return (
    <Tr key={`coupon_${props.item.id}`} h={8}>
      <Td fontWeight="normal" fontSize="sm">
        <NextLink href={detailUrl} style={{ width: "100%", display: "block" }}>
          <Text>{props.item.name}</Text>
        </NextLink>
      </Td>
      <Td fontWeight="normal" fontSize="sm">
        <NextLink href={detailUrl} style={{ width: "100%", display: "block" }}>
          Gas fee cashback
        </NextLink>
      </Td>
      <Td fontWeight="normal" fontSize="sm">
        <NextLink href={detailUrl} style={{ width: "100%", display: "block" }}>
          {chain && chain.name}
        </NextLink>
      </Td>
      <Td fontWeight="normal" fontSize="sm">
        <NextLink href={detailUrl} style={{ width: "100%", display: "block" }}>
          {status === "processing" && "Processing"}
          {status === "scheduled" && "Scheduled"}
          {status === "ongoing" && "Ongoing"}
          {status === "finished" && "Finished"}
          {status === "failed" && "Could not process"}
          {status === "invalidated" && "Invalidated"}
        </NextLink>
      </Td>
      <Td fontWeight="normal" fontSize="sm">
        <NextLink href={detailUrl} style={{ width: "100%", display: "block" }}>
          {props.item.createdAt.toLocaleString()}
        </NextLink>
      </Td>
    </Tr>
  );
};

const LoadedTbody = (props: {
  chains: Chain[];
  projectId: string;
  items: Coupon[];
}) => {
  return (
    <Tbody>
      {0 === props.items.length && (
        <Tr key={"coupons_empty"} h={16}>
          <Td colSpan={5}>
            <Center>There is not any coupons.</Center>
          </Td>
        </Tr>
      )}
      {0 < props.items.length &&
        props.items.flatMap((item) => {
          return (
            <LoadedTbodyRow
              chains={props.chains}
              projectId={props.projectId}
              item={item}
            />
          );
        })}
    </Tbody>
  );
};

export default function ProjectCampaigns() {
  const router = useRouter();
  const { project_id } = router.query;
  const { firebaseSignOut } = useFirebase();
  const { clearCurrentUser } = useCurrentUserApi();
  const { callGetChains } = useChainsApi();
  const { callGetCoupons } = useCouponsApi();
  const [chains, setChains] = useState<Chain[]>([]);
  const [items, setItems] = useState<Coupon[]>([]);
  const { authToken, isFirebaseInitialized } = useFirebase();
  const [isInitialized, setIsInitialized] = useState(false);
  const shrinkHeader = useBreakpointValue({ base: true, sm: false });

  const projectId = useMemo(() => {
    return project_id && (project_id as string);
  }, [project_id]);

  const getChains = useCallback(
    async (authToken: string): Promise<void> => {
      const items = await callGetChains(authToken);
      setChains(items);
    },
    [callGetChains]
  );

  const getCoupons = useCallback(
    async (authToken: string, projectId: string): Promise<void> => {
      const items = await callGetCoupons(authToken, projectId);
      setItems(items);
    },
    [callGetCoupons]
  );

  useEffect(() => {
    if (!isFirebaseInitialized) return;
    if (authToken) return;

    firebaseSignOut();
    clearCurrentUser();
    router.push("/");
    return;
  }, [
    authToken,
    clearCurrentUser,
    firebaseSignOut,
    isFirebaseInitialized,
    router,
  ]);

  useEffect(() => {
    if (!isFirebaseInitialized) return;
    if (!authToken) return;
    if (!projectId) return;

    (async () => {
      await getChains(authToken);
      await getCoupons(authToken, projectId);
      setIsInitialized(true);
    })();
  }, [authToken, getChains, getCoupons, isFirebaseInitialized, projectId]);

  return (
    <>
      <HtmlHead />
      <DashboardLayout projectId={projectId}>
        <Card variant="outline">
          <CardHeader>
            <Flex align="center">
              <Heading as="h3" fontSize="2xl" fontWeight="bold">
                Campaigns
              </Heading>
              <Spacer />
              <NextLink href={`/dashboard/${projectId}/campaigns/new`}>
                {shrinkHeader ? (
                  <IconButton
                    aria-label="Search database"
                    icon={<Icon as={FaPlus} />}
                  />
                ) : (
                  <Button
                    size="sm"
                    w={{ base: "100%", sm: "inherit" }}
                    leftIcon={<Icon as={FaPlus} />}
                  >
                    Create Campaign
                  </Button>
                )}
              </NextLink>
            </Flex>
          </CardHeader>
          <CardBody minH={400}>
            {isInitialized && projectId ? (
              <>
                {0 < items.length ? (
                  <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                    {items.map((item) => {
                      return (
                        <GridItem
                          colSpan={{ base: 6, md: 4, lg: 3 }}
                          key={`coupon_${item.id}`}
                        >
                          <CouponCell
                            chains={chains}
                            projectId={projectId}
                            coupon={item}
                          />
                        </GridItem>
                      );
                    })}
                  </Grid>
                ) : (
                  <Box pt={24}>
                    <Center>
                      <Icon as={MdTrackChanges} boxSize={16} />
                    </Center>
                    <Center>
                      <Heading as="h2">No Campaigns</Heading>
                    </Center>
                    <Center>
                      <Text textAlign="center" fontWeight="light">
                        All campaigns will display here. Click below to get
                        started.
                      </Text>
                    </Center>
                    <Center mt={4}>
                      <NextLink href={`/dashboard/${projectId}/campaigns/new`}>
                        <Button
                          size="sm"
                          w={{ base: "100%", sm: "inherit" }}
                          leftIcon={<Icon as={FaPlus} />}
                        >
                          Create Campaign
                        </Button>
                      </NextLink>
                    </Center>
                  </Box>
                )}
              </>
            ) : (
              <>
                <Skeleton h={4} mt={2} />
                <Skeleton h={4} mt={2} />
                <Skeleton h={4} mt={2} />
              </>
            )}
          </CardBody>
        </Card>
      </DashboardLayout>
    </>
  );
}
