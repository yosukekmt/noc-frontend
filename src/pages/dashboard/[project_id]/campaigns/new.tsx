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
  Card,
  Center,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Icon,
  IconButton,
  Input,
  Select,
  Spacer,
  Text,
  Textarea,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Plus, Warning } from "phosphor-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { FaArrowLeft, FaSave, FaTrashAlt } from "react-icons/fa";

export default function NewCoupon() {
  const isMobileUi = useBreakpointValue({ base: true, md: false });

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
        <form onSubmit={clickSubmit}>
          <Card mb={16}>
            <Flex align="center" px={8} py={4}>
              <Button
                rounded="full"
                bgColor="transparent"
                borderColor="black"
                borderWidth="1px"
                w="40px"
                h="40px"
                minW="40px"
                minH="40px"
                maxW="40px"
                maxH="40px"
                p="3px"
              >
                <Flex align="center" justify="center">
                  <FaArrowLeft color="black" />
                </Flex>
              </Button>
              <Heading
                as="h3"
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="bold"
                ml={4}
              >
                Create New Campaign
              </Heading>
              {!isMobileUi && (
                <>
                  <Spacer />
                  <Button
                    type="submit"
                    size="sm"
                    isLoading={isLoading}
                    leftIcon={<Icon as={FaSave} />}
                  >
                    Save Campaign
                  </Button>
                </>
              )}
            </Flex>
            <Divider color="gray.100" />
            <Grid
              templateAreas={{
                base: `"form_images" "form_horizontal_divider" "form_main"`,
                md: `"form_main form_vertical_divider form_images"`,
              }}
              gridTemplateColumns={{
                base: "100% 100% 100%",
                md: "calc(100% - 321px) 1px 320px",
              }}
            >
              <GridItem area={"form_main"}>
                <Container pt={8} pb={24}>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Campaign Name</FormLabel>
                    <Input
                      bg="white"
                      type="text"
                      name="coupon_name"
                      value={name}
                      onChange={(evt) => setName(evt.target.value)}
                    />
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
                  </FormControl>
                  <FormControl isRequired mt={4}>
                    <Flex align="center" mb={2}>
                      <FormLabel fontSize="sm" m={0}>
                        Campaign Description
                      </FormLabel>
                      <Spacer />
                      <Text
                        fontSize="sm"
                        color="gray.500"
                      >{`${description.length}/280 Characters`}</Text>
                    </Flex>
                    <Textarea
                      bg="white"
                      name="coupon_description"
                      value={description}
                      onChange={(evt) => setDescription(evt.target.value)}
                    />
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
                  </FormControl>
                  <FormControl isRequired mt={4}>
                    <FormLabel fontSize="sm">Network</FormLabel>
                    {chainId && (
                      <Select
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
                  <FormControl isRequired mt={8}>
                    <FormLabel fontSize="sm">
                      Applicable NFT Collections
                    </FormLabel>
                    {nfts.flatMap((nft) => {
                      return (
                        <Card
                          variant="outline"
                          borderColor="tertiary.500"
                          bgColor="tertiary.300"
                          boxShadow="none"
                          px={4}
                          py={2}
                          mt={2}
                        >
                          <Flex align="center">
                            <Box>
                              <Text fontSize="md" fontWeight="normal">
                                {nft.name}
                              </Text>
                              <Text
                                fontSize="sm"
                                fontWeight="light"
                                color="gray.500"
                              >
                                {nft.contractAddress}
                              </Text>
                            </Box>
                            <Spacer />
                            <IconButton
                              onClick={() => clickRemove(nft)}
                              variant="outline"
                              aria-label="Close"
                              colorScheme="whiteAlpha"
                              borderColor="black"
                              color="black"
                              icon={<Icon as={FaTrashAlt} />}
                              mr={4}
                            />
                          </Flex>
                        </Card>
                      );
                    })}
                    <Button
                      size="sm"
                      fontSize="sm"
                      leftIcon={<Icon as={Plus} weight="bold" />}
                      onClick={clickAdd}
                      w="100%"
                      mt={2}
                    >
                      Add Collection
                    </Button>
                  </FormControl>
                  <FormControl isRequired mt={8}>
                    <FormLabel fontSize="sm">Reward Type</FormLabel>
                    <Select
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
                    </Select>
                  </FormControl>
                  <FormControl isRequired mt={8}>
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
                  <FormControl isRequired mt={4}>
                    <FormLabel fontSize="sm" mt={2}>
                      Campaign Start
                    </FormLabel>
                    <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                      <GridItem colSpan={{ base: 6 }}>
                        <Input
                          size="sm"
                          bg="white"
                          name="startDate"
                          type="date"
                          value={startDate}
                          onChange={(evt) => setStartDate(evt.target.value)}
                        />
                      </GridItem>
                      <GridItem colSpan={{ base: 6 }}>
                        <Input
                          size="sm"
                          bg="white"
                          name="startTime"
                          type="time"
                          value={startTime}
                          onChange={(evt) => setStartTime(evt.target.value)}
                        />
                      </GridItem>
                    </Grid>
                  </FormControl>
                  <FormControl isRequired mt={4}>
                    <FormLabel fontSize="sm" mt={2}>
                      Campaign End
                    </FormLabel>
                    <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                      <GridItem colSpan={{ base: 6 }}>
                        <Input
                          size="sm"
                          bg="white"
                          name="endDate"
                          type="date"
                          value={endDate}
                          onChange={(evt) => setEndDate(evt.target.value)}
                        />
                      </GridItem>
                      <GridItem colSpan={{ base: 6 }}>
                        <Input
                          size="sm"
                          bg="white"
                          name="endTime"
                          type="time"
                          value={endTime}
                          onChange={(evt) => setEndTime(evt.target.value)}
                        />
                      </GridItem>
                    </Grid>
                  </FormControl>
                </Container>
              </GridItem>
              <GridItem area="form_horizontal_divider">
                <Divider orientation="horizontal" color="pink" />
              </GridItem>
              <GridItem area="form_vertical_divider">
                <Divider orientation="vertical" color="pink" />
              </GridItem>
              <GridItem area={"form_images"}>
                <Container pt={8}>
                  <Center>
                    <ImageUploadInput
                      projectId={projectId}
                      onUploaded={setImageUrl}
                    />
                  </Center>
                </Container>
              </GridItem>
            </Grid>
            {isMobileUi && (
              <Box
                position="fixed"
                left={0}
                bottom={0}
                w="100%"
                backgroundColor="white"
                borderTopColor="gray.300"
                borderTopWidth="1px"
                px={4}
                py={2}
              >
                <Button
                  size="lg"
                  type="submit"
                  w="100%"
                  isLoading={isLoading}
                  leftIcon={<Icon as={FaSave} />}
                >
                  Save Campaign
                </Button>
              </Box>
            )}
          </Card>
        </form>
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
