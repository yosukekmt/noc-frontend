import PickerDialog from "@/components/dashboard/nfts/picker-dialog";
import { useApiClient } from "@/hooks/useApiClient";
import { useCouponsApi } from "@/hooks/useCouponsApi";
import { useDatetime } from "@/hooks/useDatetime";
import { useFirebase } from "@/hooks/useFirebase";
import { useUtil } from "@/hooks/useUtil";
import { useValidator } from "@/hooks/useValidator";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Nft } from "@/models";
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
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Plus, Warning } from "phosphor-react";
import { FormEvent, useCallback, useMemo, useState } from "react";

export default function CouponDetail() {
  const router = useRouter();
  const { project_id: projectId } = router.query;
  const { getErrorMessage } = useApiClient();
  const { callCreateCoupons } = useCouponsApi();
  const { authToken, isFirebaseInitialized } = useFirebase();
  const { truncateContractAddress } = useUtil();
  const { validateCouponsName, validateCouponsDescription } = useValidator();
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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [timezone, setTimezone] = useState(getDefaultTimezone());
  const [startDate, setStartDate] = useState<string>(getDefaultStartDate());
  const [startTime, setStartTime] = useState<string>(getDefaultStartTime());
  const [endDate, setEndDate] = useState<string>(getDefaultEndDate());
  const [endTime, setEndTime] = useState<string>(getDefaultEndTime());
  const [isAttempted, setIsAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const pickerDialog = useDisclosure();

  const nftIds = useMemo(() => {
    return nfts.map((nft) => nft.id);
  }, [nfts]);
  const startAt = useMemo(() => {
    return parseDateInput(startDate, startTime, timezone);
  }, [startDate, startTime, timezone, parseDateInput]);
  const endtAt = useMemo(() => {
    return parseDateInput(endDate, endTime, timezone);
  }, [endDate, endTime, timezone, parseDateInput]);
  const isValidNftIds = useMemo(() => {
    return 0 < nftIds.length;
  }, [nftIds]);
  const isValidName = useMemo(() => {
    return validateCouponsName(name);
  }, [validateCouponsName, name]);
  const isValidDescription = useMemo(() => {
    return validateCouponsDescription(description);
  }, [validateCouponsDescription, description]);

  const callApiCreateToken = useCallback(
    async (
      authToken: string,
      projectId: string,
      rewardType: "gas_fee_cashback",
      name: string,
      description: string,
      timezone: string,
      startAt: Date,
      endAt: Date,
      nftIds: string[]
    ) => {
      setIsLoading(true);
      try {
        const item = await callCreateCoupons(authToken, {
          projectId,
          rewardType,
          name,
          description,
          timezone,
          startAt,
          endAt,
          nftIds,
        });
        router.push(`/dashboard/${projectId}/coupons/${item.id}`);
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

    if (!isValidNftIds) return;
    if (!isValidName) return;
    if (!isValidDescription) return;

    callApiCreateToken(
      authToken,
      projectId as string,
      "gas_fee_cashback",
      name,
      description,
      timezone,
      startAt,
      endtAt,
      nftIds
    );
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
        <Flex justify="center">
          <Box maxWidth="xl" w="100%">
            <form onSubmit={clickSubmit}>
              <Heading as="h3" fontSize="2xl" fontWeight="bold">
                Create a new Gasback NFT
              </Heading>
              <Text fontSize="sm">
                Set up your Gasback NFT to engage you customers.
              </Text>
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
                  name="name"
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
              <FormControl>
                <FormLabel fontSize="sm">Description</FormLabel>
                <Textarea
                  size="sm"
                  bg="white"
                  name="description"
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
              <FormControl>
                <FormLabel fontSize="sm">Timezone</FormLabel>
                <Select
                  size="sm"
                  bg="white"
                  name="name"
                  value={timezone}
                  onChange={(evt) => setTimezone(evt.target.value)}
                >
                  {getTimezoneOffsets().flatMap((tz) => {
                    return (
                      <option value={tz.name}>
                        {`${tz.name} (${tz.offset})`}
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
              <Flex mt={4}>
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
      <PickerDialog
        isOpen={pickerDialog.isOpen}
        onClose={pickerDialog.onClose}
        onOpen={pickerDialog.onOpen}
        onPicked={onPicked}
      />
    </>
  );
}
