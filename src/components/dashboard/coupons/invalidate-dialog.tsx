import { useApiClient } from "@/hooks/useApiClient";
import { useCouponsApi } from "@/hooks/useCouponsApi";
import { useFirebase } from "@/hooks/useFirebase";
import { Coupon } from "@/models";
import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  Flex,
  IconButton,
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

export default function InvalidateDialog(props: {
  projectId: string;
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
    async (authToken: string, projectId: string, id: string) => {
      setIsLoading(true);
      try {
        await callDeleteCoupon(authToken, projectId, id);
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
    deleteToken(authToken, props.projectId, props.item.id);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={clickSubmit}>
        <ModalContent>
          <ModalHeader>
            <Flex align="center">
              <IconButton
                onClick={props.onClose}
                variant="outline"
                aria-label="Close"
                colorScheme="blackAlpha"
                borderColor="black"
                color="black"
                icon={<CloseIcon boxSize={2} />}
                mr={4}
              />
              Invalidate Coupon
            </Flex>
          </ModalHeader>
          <ModalBody>
            <Text fontSize="md" py={8}>
              Are you certain that you wish to invalidate this coupon? Please be
              aware that if you proceed with this action, the coupon will be
              permanently deactivated and cannot be reactivated.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isLoading} ml={2}>
              Invalidate coupon
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
