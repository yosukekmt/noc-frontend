import { useApiClient } from "@/hooks/useApiClient";
import { useBlockchain } from "@/hooks/useBlockchain";
import { useFirebase } from "@/hooks/useFirebase";
import { Chain, Project } from "@/models";
import {
  Button,
  Divider,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";

export default function WithdrawSubmittedDialog(props: {
  project: Project;
  chain: Chain;
  isOpen: boolean;
  onClose(): void;
  onOpen(): void;
}) {
  const { isOpen, onClose, onOpen } = props;
  const { authToken } = useFirebase();
  const { getExplorerAddressUrl } = useBlockchain();
  const { getErrorMessage } = useApiClient();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const url = useMemo(() => {
    return getExplorerAddressUrl(
      props.chain.explorerUrl,
      props.project.walletAddress
    );
  }, [
    getExplorerAddressUrl,
    props.chain.explorerUrl,
    props.project.walletAddress,
  ]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Withdrawal requested</ModalHeader>
        <ModalCloseButton />
        <Divider />
        <ModalBody bg="gray.100">
          <Text fontSize="md">
            Your withdrawal request has been successfully submitted. You can
            check the status of your transaction by clicking on{" "}
            <Link href={url} isExternal={true} color="green">
              this link
            </Link>
            .
          </Text>
        </ModalBody>
        <Divider />
        <ModalFooter>
          <Button size="sm" onClick={onClose}>
            OK
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
