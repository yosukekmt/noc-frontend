import { useApiClient } from "@/hooks/useApiClient";
import { useFirebase } from "@/hooks/useFirebase";
import { Coupon, useCouponsApi } from "@/hooks/useCouponsApi";
import { User } from "@/hooks/useUsersApi";
import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { FormEvent, useCallback, useState } from "react";

export default function DeleteDialog(props: {
  item: Coupon;
  isOpen: boolean;
  onClose(): void;
  onOpen(): void;
  onDeleted(): void;
}) {
  const { isOpen, onClose, onOpen, onDeleted } = props;
  const { authToken } = useFirebase();
  const { callDeleteCoupon } = useCouponsApi();
  const { getErrorMessage } = useApiClient();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const deleteToken = useCallback(
    async (authToken: string, uuid: string) => {
      setIsLoading(true);
      try {
        await callDeleteCoupon(authToken, uuid);
        onDeleted();
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
    [callDeleteCoupon, getErrorMessage, onClose, onDeleted]
  );

  const clickSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    if (!authToken) {
      return;
    }
    deleteToken(authToken, props.item.uuid);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={clickSubmit}>
        <ModalContent>
          <ModalHeader>Invalidate Coupon</ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody bg="gray.100">
            <Text fontSize="md">This coupon will be unabled.</Text>
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isLoading} ml={2}>
              Delete coupon
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
