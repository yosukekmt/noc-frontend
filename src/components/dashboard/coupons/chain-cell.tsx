import { useBlockchain } from "@/hooks/useBlockchain";
import { Chain, Project } from "@/models";
import {
  Box,
  Button,
  Card,
  Flex,
  Icon,
  Link,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import WithdrawDialog from "../projects/withdraw-dialog";
import WithdrawSubmittedDialog from "../projects/withdraw-submitted-dialog";

export default function ChainCell(props: {
  project: Project;
  chain: Chain;
  cellType: "grid" | "row";
}) {
  const { getExplorerAddressUrl, truncateContractAddress } = useBlockchain();
  const requestDialog = useDisclosure();
  const requestedDialog = useDisclosure();

  const walletExplorerUrl = useMemo(() => {
    return getExplorerAddressUrl(
      props.chain.explorerUrl,
      props.project.walletAddress
    );
  }, [
    getExplorerAddressUrl,
    props.chain.explorerUrl,
    props.project.walletAddress,
  ]);

  const clickWithdraw = () => {
    requestDialog.onOpen();
  };

  const onSubmitted = () => {
    requestedDialog.onOpen();
  };
  return (
    <>
      <Card
        variant="outline"
        borderColor="tertiary.500"
        bgColor="tertiary.300"
        boxShadow="none"
        px={4}
        py={4}
      >
        {props.cellType === "row" && (
          <>
            <Flex align="center">
              <Text>{props.chain.name}</Text>
              <Spacer />
              <Link href={walletExplorerUrl} isExternal>
                <Button fontWeight="light" variant="link">
                  {props.project.walletAddress}
                </Button>
              </Link>
              <Button
                variant="link"
                leftIcon={<Icon as={FaExternalLinkAlt} />}
                onClick={clickWithdraw}
                ml={4}
              >
                Withdraw
              </Button>
            </Flex>
          </>
        )}
        {props.cellType === "grid" && (
          <Box>
            <Text>{props.chain.name}</Text>
            <Link href={walletExplorerUrl} isExternal>
              <Button fontWeight="light" variant="link">
                {props.project.walletAddress}
              </Button>
            </Link>
            <Box mt={{ base: 4, md: 0 }}>
              <Button
                variant="link"
                leftIcon={<Icon as={FaExternalLinkAlt} />}
                onClick={clickWithdraw}
              >
                Withdraw
              </Button>
            </Box>
          </Box>
        )}
      </Card>
      <WithdrawDialog
        project={props.project}
        chain={props.chain}
        isOpen={requestDialog.isOpen}
        onClose={requestDialog.onClose}
        onOpen={requestDialog.onOpen}
        onSubmitted={onSubmitted}
      />
      <WithdrawSubmittedDialog
        project={props.project}
        chain={props.chain}
        isOpen={requestedDialog.isOpen}
        onClose={requestedDialog.onClose}
        onOpen={requestedDialog.onOpen}
      />
    </>
  );
}
