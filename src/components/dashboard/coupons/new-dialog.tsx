import { useApiClient } from "@/hooks/useApiClient";
import { useCouponsApi } from "@/hooks/useCouponsApi";
import { useDatetime } from "@/hooks/useDatetime";
import { useFirebase } from "@/hooks/useFirebase";
import { useValidator } from "@/hooks/useValidator";
import { Coupon } from "@/models";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Warning } from "phosphor-react";
import { FormEvent, useCallback, useMemo, useState } from "react";

export default function NewDialog(props: {
  projectId: string;
  isOpen: boolean;
  onClose(): void;
  onOpen(): void;
  onCreated(item: Coupon): void;
}) {
  const { isOpen, onClose, onOpen, onCreated } = props;
  const { authToken } = useFirebase();
  const { validateCouponsName, validateCouponsDescription } = useValidator();
  const {
    getDefaultTimezone,
    getDefaultStartDate,
    getDefaultStartTime,
    getDefaultEndDate,
    getDefaultEndTime,
    parseDateInput,
    getTimezones,
    getTimezoneOffsets,
  } = useDatetime();
  const { callCreateCoupons } = useCouponsApi();
  const { getErrorMessage } = useApiClient();
  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState(getDefaultTimezone());
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<string>(getDefaultStartDate());
  const [startTime, setStartTime] = useState<string>(getDefaultStartTime());
  const [endDate, setEndDate] = useState<string>(getDefaultEndDate());
  const [endTime, setEndTime] = useState<string>(getDefaultEndTime());
  const [isAttempted, setIsAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const startAt = useMemo(() => {
    return parseDateInput(startDate, startTime, timezone);
  }, [startDate, startTime, timezone, parseDateInput]);
  const endtAt = useMemo(() => {
    return parseDateInput(endDate, endTime, timezone);
  }, [endDate, endTime, timezone, parseDateInput]);
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
      startAt: Date,
      endAt: Date
    ) => {
      setIsLoading(true);
      try {
        const item = await callCreateCoupons(authToken, {
          projectId,
          rewardType,
          name,
          description,
          startAt,
          endAt,
        });
        onCreated(item);
        onClose();
      } catch (err: unknown) {
        console.error(err);

        const errorMessage = getErrorMessage(err);
        if (errorMessage) {
          setErrorMessage(errorMessage);
        }
      }
      setIsLoading(false);
    },
    [callCreateCoupons, getErrorMessage, onClose, onCreated]
  );

  const clickSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    if (!authToken) return;
    setIsAttempted(true);

    if (!isValidName) return;
    if (!isValidDescription) return;

    callApiCreateToken(
      authToken,
      props.projectId,
      "gas_fee_cashback",
      name,
      description,
      startAt,
      endtAt
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={clickSubmit}>
        <ModalContent>
          <ModalHeader>Create a new coupon NFT</ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody bg="gray.100">
            <FormControl>
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
                    <Text fontSize="sm" fontWeight="normal" color="red" ml={2}>
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
                    <Text fontSize="sm" fontWeight="normal" color="red" ml={2}>
                      Please enter a description.
                    </Text>
                  </Flex>
                )}
              </Box>
            </FormControl>
            <FormControl mt={8}>
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
            <Box h={8} mt={2}>
              {isAttempted && errorMessage && (
                <Flex align="center">
                  <Icon as={Warning} color="red" />
                  <Text fontSize="sm" fontWeight="normal" color="red" ml={2}>
                    {errorMessage}
                  </Text>
                </Flex>
              )}
            </Box>
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isLoading} ml={2}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
