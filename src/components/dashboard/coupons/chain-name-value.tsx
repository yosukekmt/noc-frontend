import { useBlockchain } from "@/hooks/useBlockchain";
import { useChainsApi } from "@/hooks/useChainsApi";
import { useFirebase } from "@/hooks/useFirebase";
import { Chain } from "@/models";
import { Flex, Image, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function ChainNameValue(props: { chainId: number }) {
  const { authToken, isFirebaseInitialized } = useFirebase();
  const { getIconPathById } = useBlockchain();
  const { callGetChain } = useChainsApi();
  const [chain, setChain] = useState<Chain | undefined>(undefined);
  const iconPath = useMemo(() => {
    return getIconPathById(props.chainId);
  }, [getIconPathById, props.chainId]);

  const chainName = useMemo(() => {
    return chain?.name || "";
  }, [chain?.name]);

  const getChain = useCallback(
    async (authToken: string, chainId: number): Promise<void> => {
      const item = await callGetChain(authToken, chainId);
      setChain(item);
    },
    [callGetChain]
  );

  useEffect(() => {
    if (!isFirebaseInitialized) return;
    if (!authToken) return;

    (async () => {
      await getChain(authToken, props.chainId);
    })();
  }, [authToken, getChain, isFirebaseInitialized, props.chainId]);

  return (
    <Flex align="center">
      <Image src={iconPath} alt="Icon" w="16px" h="16px" />
      <Text fontSize="md" fontWeight="light" color="gray" ml={2}>
        {chainName}
      </Text>
    </Flex>
  );
}
