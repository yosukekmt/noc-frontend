import { useBlockchain } from "@/hooks/useBlockchain";
import { Link, Text } from "@chakra-ui/react";
import { useMemo } from "react";

export default function NftLink(props: {
  name: string;
  contractAddress: string;
  openseaUrl: string;
}) {
  const { truncateContractAddress, getOpenseaAddressUrl } = useBlockchain();

  const openseaAddresses = useMemo(() => {
    return getOpenseaAddressUrl(props.openseaUrl, props.contractAddress);
  }, [getOpenseaAddressUrl, props.contractAddress, props.openseaUrl]);
  const truncatedContractAddress = useMemo(() => {
    return truncateContractAddress(props.contractAddress);
  }, [props.contractAddress, truncateContractAddress]);
  return (
    <Link href={openseaAddresses} isExternal>
      <Text fontSize="md" fontWeight="light" color="gray">
        {`${props.name}(${truncatedContractAddress})`}
      </Text>
    </Link>
  );
}
