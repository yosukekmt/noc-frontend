import { useBlockchain } from "@/hooks/useBlockchain";
import { usePublicApi } from "@/hooks/usePublicApi";
import { Chain, Coupon, CouponTransfer } from "@/models";
import { Button, Spinner, useDisclosure } from "@chakra-ui/react";
import {
  ConnectKitButton,
  ConnectKitProvider,
  getDefaultClient,
} from "connectkit";
import { useCallback, useEffect, useState } from "react";
import { createClient, useAccount, useSignMessage, WagmiConfig } from "wagmi";
import MintingDialog from "../minting-dialog";

const ConnectButton = (props: {
  coupon: Coupon;
  onSigned: (
    couponId: string,
    walletAddress: string,
    message: string,
    signature: string
  ) => void;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | undefined>();
  const { data, error, isLoading, signMessage } = useSignMessage({
    onError(error, variables, context) {
      setIsProcessing(false);

      console.log("onError");
      console.log("error");
      console.log(error);
      console.log("variables");
      console.log(variables);
      console.log("context");
      console.log(context);
    },
    onMutate(variables) {
      console.log("onMutate");
      console.log("variables");
      console.log(variables);
    },
    onSettled(data, error, variables, context) {
      console.log("onSettled");
      console.log("data");
      console.log(data);
      console.log("error");
      console.log(error);
      console.log("variables");
      console.log(variables);
      console.log("context");
      console.log(context);
    },
    onSuccess(data, variables, context) {
      console.log("onSuccess");
      console.log("data");
      console.log(data);
      console.log("variables");
      console.log(variables);
      console.log("context");
      console.log(context);
      setIsProcessing(false);
      props.onSigned(
        props.coupon.id,
        address!,
        variables.message as string,
        data
      );
    },
  });

  const signTerms = useCallback(
    async (couponId: string, walletAddress: string): Promise<void> => {
      setIsProcessing(true);
      console.log("hgoe4");

      const message = `Welcome to Nudge ONCHAIN!\nClick to sign in and agree to the Nudge ONCHAIN Terms of Service (https://nudgeonchain.xyz/terms) and Privacy Policy (https://nudgeonchain.xyz/privacy). Don't worry, this action won't initiate a blockchain transaction or cost any gas fees.\n\nWallet address:\n${walletAddress}\nCoupon ID:\n${couponId}`;
      console.log("hgoe5");
      signMessage({ message });
      console.log("hgoe5");
    },
    [signMessage]
  );

  useEffect(() => {
    console.log("hgoe");
    if (!isConnected) return;
    console.log("hgoe1");

    if (!address) return;
    console.log("hgoe3");

    (() => signTerms(props.coupon.id, address))();
  }, [address, isConnected, props.coupon.id, signTerms]);

  return (
    <>
      <ConnectKitButton.Custom>
        {({
          show,
          hide,
          chain,
          unsupported,
          isConnected,
          isConnecting,
          address,
          truncatedAddress,
          ensName,
        }) => {
          setIsConnected(isConnected);
          setAddress(address);

          if (isProcessing) {
            if (unsupported) {
              return <Button>WRONG NETWORK</Button>;
            } else {
              return <Button>Processing...</Button>;
            }
          }
          return (
            <Button {...props} onClick={show}>
              Claim Coupon
            </Button>
          );
        }}
      </ConnectKitButton.Custom>
    </>
  );
};

export default function ClaimButton(props: { chain: Chain; coupon: Coupon }) {
  const { getAlchemyApiKey, getChainById } = useBlockchain();
  const { callCreateCouponTransfer } = usePublicApi();

  const wagmiClient = createClient(
    getDefaultClient({
      autoConnect: false,
      appName: "Nudge ONCHAIN",
      alchemyId: getAlchemyApiKey(),
      chains: [getChainById(props.chain.id)],
    })
  );

  const [item, setItem] = useState<CouponTransfer | undefined>(undefined);
  const mintingDialog = useDisclosure();

  const createCouponTransfer = useCallback(
    async (
      couponId: string,
      walletAddress: string,
      signedMessage: string,
      signature: string
    ) => {
      try {
        const item = await callCreateCouponTransfer({
          couponId,
          walletAddress,
          signedMessage,
          signature,
        });
        setItem(item);
        mintingDialog.onOpen();
      } catch (err: unknown) {
        console.error(err);
      }
    },
    [callCreateCouponTransfer, mintingDialog]
  );

  const onSigned = (
    couponId: string,
    walletAddress: string,
    signedMessage: string,
    signature: string
  ) => {
    createCouponTransfer(couponId, walletAddress, signedMessage, signature);
  };

  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <ConnectKitProvider debugMode>
          <ConnectButton onSigned={onSigned} coupon={props.coupon} />
        </ConnectKitProvider>
      </WagmiConfig>
      {item && (
        <MintingDialog
          chain={props.chain}
          coupon={props.coupon}
          couponTransfer={item}
          isOpen={mintingDialog.isOpen}
          onClose={mintingDialog.onClose}
          onOpen={mintingDialog.onOpen}
        />
      )}
    </>
  );
}
