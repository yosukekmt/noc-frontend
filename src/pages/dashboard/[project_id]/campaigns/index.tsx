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

  const chain = useMemo(() => {
    return props.chains.find((chain) => chain.id === props.coupon.chainId);
  }, [props.chains, props.coupon.chainId]);

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
        mt={2}
      >
        <AspectRatio w="100%" ratio={1}>
          <Image
            src={props.coupon.imageUrl}
            alt={props.coupon.name}
            rounded={4}
          />
        </AspectRatio>
        <Text mt={{ base: 0 }}>{props.coupon.name}</Text>
        {props.coupon.rewardType === "cashback_gas" && (
          <Text fontWeight="light" mt={{ base: 4 }} height={{ base: "100%" }}>
            Gas Fee Cashback
          </Text>
        )}
        <Box>
          {status === "processing" && (
            <Badge colorScheme="primary">Processing</Badge>
          )}
          {status === "scheduled" && (
            <Badge colorScheme="secondary">Scheduled</Badge>
          )}
          {status === "ongoing" && <Badge colorScheme="success">Ongoing</Badge>}
          {status === "finished" && (
            <Badge colorScheme="primary">Finished</Badge>
          )}
          {status === "failed" && (
            <Badge colorScheme="danger">Could not process</Badge>
          )}
          {status === "invalidated" && (
            <Badge colorScheme="tertiary">Invalidated</Badge>
          )}
        </Box>
        <Text fontWeight="light" mt={{ base: 0 }}>
          {chain?.name || ""}
        </Text>
        <Text fontWeight="light" mt={{ base: 0 }}>
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
      <DashboardLayout projectId={projectId as string}>
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
          <Divider />
          <CardBody pt={0} px={4}>
            {isInitialized && projectId ? (
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
