import { Box } from "@chakra-ui/react";
import Lottie from "lottie-web";
import { useEffect, useRef } from "react";

export default function MintSuccess(props: {}) {
  const lottieContainer = useRef(null);

  useEffect(() => {
    if (!lottieContainer) return;
    if (!lottieContainer.current) return;

    const instance = Lottie.loadAnimation({
      container: lottieContainer.current,
      renderer: "svg",
      loop: false,
      autoplay: true,
      path: "/success.json",
    });
    return () => instance.destroy();
  }, []);

  return <Box ref={lottieContainer} w={240} h={240}></Box>;
}
