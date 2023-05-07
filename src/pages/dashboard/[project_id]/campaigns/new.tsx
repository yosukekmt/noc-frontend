import ImageUploadInput from "@/components/dashboard/image-upload-input";
import PickerDialog from "@/components/dashboard/nfts/picker-dialog";
import HtmlHead from "@/components/html-head";
import { useApiClient } from "@/hooks/useApiClient";
import { useBlockchain } from "@/hooks/useBlockchain";
import { useChainsApi } from "@/hooks/useChainsApi";
import { useCouponsApi } from "@/hooks/useCouponsApi";
import { useDatetime } from "@/hooks/useDatetime";
import { useFirebase } from "@/hooks/useFirebase";
import { useValidator } from "@/hooks/useValidator";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Chain, Nft } from "@/models";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Icon,
  Input,
  Select,
  Spacer,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Textarea,
  useDisclosure,
  Wrap,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Plus, Warning } from "phosphor-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

export default function NewCoupon() {
  const router = useRouter();
  const { project_id: project_id } = router.query;
  const { getErrorMessage } = useApiClient();
  const { callGetChains } = useChainsApi();
  const { callCreateCoupons } = useCouponsApi();
  const { authToken, isFirebaseInitialized } = useFirebase();
  const { truncateContractAddress } = useBlockchain();
  const {
    validateCouponsName,
    validateCouponsDescription,
    validateCouponSupply,
  } = useValidator();
  const {
    getDefaultTimezone,
    getDefaultStartDate,
    getDefaultStartTime,
    getDefaultEndDate,
    getDefaultEndTime,
    parseDateInput,
    getTimezoneOffsets,
  } = useDatetime();

  const [nfts, setNfts] = useState<Nft[]>([]);
  const [chains, setChains] = useState<Chain[]>([]);
  const [chainId, setChainId] = useState<number | null>(null);
  const [rewardType, setRewardType] = useState<"cashback_gas" | "cashback_005">(
    "cashback_gas"
  );
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [supply, setSupply] = useState(1000);
  const [imageUrl, setImageUrl] = useState("");
  const [timezone, setTimezone] = useState(getDefaultTimezone());
  const [startDate, setStartDate] = useState<string>(getDefaultStartDate());
  const [startTime, setStartTime] = useState<string>(getDefaultStartTime());
  const [endDate, setEndDate] = useState<string>(getDefaultEndDate());
  const [endTime, setEndTime] = useState<string>(getDefaultEndTime());
  const [isAttempted, setIsAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const pickerDialog = useDisclosure();

  const projectId = useMemo(() => {
    return project_id as string;
  }, [project_id]);
  const nftIds = useMemo(() => {
    return nfts.map((nft) => nft.id);
  }, [nfts]);
  const startAt = useMemo(() => {
    return parseDateInput(startDate, startTime, timezone);
  }, [startDate, startTime, timezone, parseDateInput]);
  const endtAt = useMemo(() => {
    return parseDateInput(endDate, endTime, timezone);
  }, [endDate, endTime, timezone, parseDateInput]);
  const isValidChainId = useMemo(() => {
    return !!chainId;
  }, [chainId]);
  const isValidNftIds = useMemo(() => {
    return 0 < nftIds.length;
  }, [nftIds]);
  const isValidName = useMemo(() => {
    return validateCouponsName(name);
  }, [validateCouponsName, name]);
  const isValidDescription = useMemo(() => {
    return validateCouponsDescription(description);
  }, [validateCouponsDescription, description]);
  const isValidSupply = useMemo(() => {
    return validateCouponSupply(supply);
  }, [validateCouponSupply, supply]);
  const isValidImageUrl = useMemo(() => {
    return imageUrl && imageUrl.startsWith("http");
  }, [imageUrl]);
  const chain = useMemo(() => {
    if (!chainId) return null;
    return chains.find((item) => item.id === chainId);
  }, [chainId, chains]);

  const timezoneOptions = useMemo((): { value: string; text: string }[] => {
    const zones = getTimezoneOffsets();
    return zones.flatMap((zone) => {
      return {
        value: zone.name,
        text: `${zone.name} (${zone.offset})`,
      };
    });
  }, [getTimezoneOffsets]);

  const getChains = useCallback(
    async (authToken: string): Promise<void> => {
      const items = await callGetChains(authToken);
      setChains(items);
      if (!chainId) {
        setChainId(items[0].id);
      }
    },
    [callGetChains, chainId]
  );

  const callApiCreateToken = useCallback(
    async (
      authToken: string,
      projectId: string,
      chainId: number,
      rewardType: "cashback_gas" | "cashback_005",
      name: string,
      description: string,
      supply: number,
      timezone: string,
      startAt: Date,
      endAt: Date,
      nftIds: string[],
      imageUrl: string
    ) => {
      setIsLoading(true);
      try {
        const item = await callCreateCoupons(authToken, {
          projectId,
          chainId,
          rewardType,
          name,
          description,
          supply,
          timezone,
          startAt,
          endAt,
          nftIds,
          imageUrl,
        });
        router.push(`/dashboard/${projectId}/campaigns/${item.id}`);
      } catch (err: unknown) {
        console.error(err);

        const errorMessage = getErrorMessage(err);
        if (errorMessage) {
          setErrorMessage(errorMessage);
        }
      }
      setIsLoading(false);
    },
    [callCreateCoupons, getErrorMessage, router]
  );

  useEffect(() => {
    if (!isFirebaseInitialized) return;
    if (!authToken) return;

    (async () => {
      await getChains(authToken);
    })();
  }, [isFirebaseInitialized, authToken, getChains]);

  const onPicked = (item: Nft) => {
    setNfts([...nfts, item]);
  };

  const clickAdd = () => {
    pickerDialog.onOpen();
  };

  const clickRemove = (item: Nft) => {
    setNfts(nfts.filter((nft) => item.id !== nft.id));
  };

  const clickSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    if (!authToken) return;
    setIsAttempted(true);

    if (!isValidChainId) return;
    if (!isValidNftIds) return;
    if (!isValidName) return;
    if (!isValidDescription) return;
    if (!isValidSupply) return;
    if (!isValidImageUrl) return;

    callApiCreateToken(
      authToken,
      projectId,
      chainId!,
      rewardType,
      name,
      description,
      supply,
      timezone,
      startAt,
      endtAt,
      nftIds,
      imageUrl
    );
  };

  return (
    <>
      <HtmlHead />
      <DashboardLayout projectId={projectId}>
        <Flex justify="center">
          <Box maxWidth="xl" w="100%">
            <form onSubmit={clickSubmit}>
              <Heading as="h3" fontSize="2xl" fontWeight="bold">
                Create a new campaign
              </Heading>
              <Text fontSize="sm">
                Set up your campaign to engage you customers.
              </Text>
              <FormControl mt={2}>
                <FormLabel fontSize="sm">Network</FormLabel>
                {chainId && (
                  <Select
                    size="sm"
                    bg="white"
                    name="chainId"
                    value={chainId}
                    onChange={(evt) =>
                      setChainId(Number.parseInt(evt.target.value))
                    }
                  >
                    {chains.flatMap((chain) => {
                      return (
                        <option value={chain.id} key={`chain_${chain.id}`}>
                          {chain.name}
                        </option>
                      );
                    })}
                  </Select>
                )}
              </FormControl>
              <FormControl mt={2}>
                <FormLabel fontSize="sm">Applicable NFTs</FormLabel>
                <Wrap spacing={1} mt={2}>
                  {nfts.map((nft) => (
                    <Tag size="sm" key={`nft_${nft.id}`}>
                      <TagLabel>{`${nft.name}(${truncateContractAddress(
                        nft.contractAddress
                      )})`}</TagLabel>
                      <TagCloseButton onClick={() => clickRemove(nft)} />
                    </Tag>
                  ))}
                </Wrap>
                <Button
                  size="sm"
                  fontSize="sm"
                  leftIcon={<Icon as={Plus} weight="bold" />}
                  onClick={clickAdd}
                  mt={2}
                >
                  Add NFT
                </Button>
                <Box h={8} mt={2}>
                  {isAttempted && !isValidNftIds && (
                    <Flex align="center">
                      <Icon as={Warning} color="red" />
                      <Text
                        fontSize="sm"
                        fontWeight="normal"
                        color="red"
                        ml={2}
                      >
                        Please add at least 1 applicable NFT.
                      </Text>
                    </Flex>
                  )}
                </Box>
              </FormControl>
              <FormControl mt={2}>
                <FormLabel fontSize="sm">Coupon name</FormLabel>
                <Input
                  size="sm"
                  bg="white"
                  type="text"
                  name="coupon_name"
                  value={name}
                  onChange={(evt) => setName(evt.target.value)}
                />
                <Box h={8} mt={2}>
                  {isAttempted && !isValidName && (
                    <Flex align="center">
                      <Icon as={Warning} color="red" />
                      <Text
                        fontSize="sm"
                        fontWeight="normal"
                        color="red"
                        ml={2}
                      >
                        Please enter a coupon name.
                      </Text>
                    </Flex>
                  )}
                </Box>
              </FormControl>
              <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                <GridItem colSpan={{ base: 12, sm: 6 }}>
                  <FormControl mt={2}>
                    <FormLabel fontSize="sm">Reward type</FormLabel>
                    <Select
                      size="sm"
                      bg="white"
                      name="rewardType"
                      value={rewardType}
                      onChange={(evt) =>
                        setRewardType(
                          evt.target.value as "cashback_gas" | "cashback_005"
                        )
                      }
                    >
                      <option value="cashback_gas">Gas fee cashback</option>;
                      <option value="cashback_005">5% Cashback</option>;
                    </Select>
                    <Box h={8} mt={2}></Box>
                  </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 12, sm: 6 }}>
                  <FormControl mt={2}>
                    <FormLabel fontSize="sm">
                      Number of Supply (1-10000)
                    </FormLabel>
                    <Input
                      size="sm"
                      bg="white"
                      type="number"
                      name="coupon_supply"
                      min={1}
                      max={10000}
                      value={supply.toString()}
                      onChange={(evt) =>
                        setSupply(Number.parseInt(evt.target.value))
                      }
                    />
                    <Box h={8} mt={2}></Box>
                  </FormControl>
                </GridItem>
              </Grid>
              <FormControl>
                <FormLabel fontSize="sm">Coupon Description</FormLabel>
                <Textarea
                  size="sm"
                  bg="white"
                  name="coupon_description"
                  value={description}
                  onChange={(evt) => setDescription(evt.target.value)}
                />
                <Box h={8} mt={2}>
                  {isAttempted && !isValidDescription && (
                    <Flex align="center">
                      <Icon as={Warning} color="red" />
                      <Text
                        fontSize="sm"
                        fontWeight="normal"
                        color="red"
                        ml={2}
                      >
                        Please enter a description.
                      </Text>
                    </Flex>
                  )}
                </Box>
              </FormControl>
              <Box>
                <ImageUploadInput
                  projectId={projectId}
                  onUploaded={setImageUrl}
                />
              </Box>
              <FormControl>
                <FormLabel fontSize="sm">Timezone</FormLabel>
                <Select
                  size="sm"
                  bg="white"
                  name="name"
                  value={timezone}
                  onChange={(evt) => setTimezone(evt.target.value)}
                >
                  {timezoneOptions.flatMap((tz, idx) => {
                    return (
                      <option value={tz.value} key={`timezone_${idx}`}>
                        {tz.text}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>
              <FormLabel fontSize="sm" mt={2}>
                Coupon valid from
              </FormLabel>
              <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                <GridItem colSpan={{ base: 6 }}>
                  <FormControl>
                    <Input
                      size="sm"
                      bg="white"
                      name="startDate"
                      type="date"
                      value={startDate}
                      onChange={(evt) => setStartDate(evt.target.value)}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 6 }}>
                  <FormControl>
                    <Input
                      size="sm"
                      bg="white"
                      name="startTime"
                      type="time"
                      value={startTime}
                      onChange={(evt) => setStartTime(evt.target.value)}
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              <FormLabel fontSize="sm" mt={2}>
                Coupon expires at
              </FormLabel>
              <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                <GridItem colSpan={{ base: 6 }}>
                  <FormControl>
                    <Input
                      size="sm"
                      bg="white"
                      name="endDate"
                      type="date"
                      value={endDate}
                      onChange={(evt) => setEndDate(evt.target.value)}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 6 }}>
                  <FormControl>
                    <Input
                      size="sm"
                      bg="white"
                      name="endTime"
                      type="time"
                      value={endTime}
                      onChange={(evt) => setEndTime(evt.target.value)}
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              <Flex mt={4} mb={32}>
                <NextLink href={`/dashboard/${projectId}`}>
                  <Button size="sm">Cancel</Button>
                </NextLink>
                <Spacer />
                <Button type="submit" size="sm" isLoading={isLoading} ml={2}>
                  Create
                </Button>
              </Flex>
            </form>
          </Box>
        </Flex>
      </DashboardLayout>
      {chain && (
        <PickerDialog
          chain={chain}
          isOpen={pickerDialog.isOpen}
          onClose={pickerDialog.onClose}
          onOpen={pickerDialog.onOpen}
          onPicked={onPicked}
        />
      )}
    </>
  );
}
