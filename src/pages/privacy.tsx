import Footer from "@/components/footer";
import Header from "@/components/header";
import HtmlHead from "@/components/html-head";
import TopBg from "@/components/top-bg";
import {
  Box,
  Card,
  Center,
  Container,
  Flex,
  Heading,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useMemo } from "react";
import { FaArrowLeft } from "react-icons/fa";

const TopSection = () => {
  return (
    <Box as="section" id="top-section">
      <Container maxWidth="6xl">
        <Center mt={8}>
          <NextLink href="/">
            <Flex justify={{ base: "center", md: "start" }}>
              <Tag
                size="md"
                variant="outline"
                colorScheme="secondary"
                borderTopStartRadius={0}
                borderTopEndRadius={9999}
                borderBottomStartRadius={9999}
                borderBottomEndRadius={9999}
                px={4}
                py={2}
              >
                <TagLeftIcon as={FaArrowLeft} />
                <TagLabel>Back Home</TagLabel>
              </Tag>
            </Flex>
          </NextLink>
        </Center>
        <Center mt={4}>
          <Heading textAlign="center">Privacy Policy</Heading>
        </Center>
      </Container>
    </Box>
  );
};

const BodySection = () => {
  return (
    <Box as="section" id="body-section">
      <Container maxWidth="6xl">
        <Card variant="none" h="100%" rounded={16} mt={16} p={8}>
          <Text fontSize="lg" fontWeight="light" mt={2}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat
            dui, interdum eget faucibus in, ornare vitae mi. Aliquam ut lorem et
            dui interdum finibus eu eu augue. Mauris ipsum libero, tristique ut
            nunc vitae, interdum dapibus ipsum. Phasellus et convallis mi.
            Aenean nulla arcu, eleifend at dui vitae, euismod scelerisque
            lectus. Nullam faucibus eget metus a sagittis. Nulla auctor, urna
            vitae sodales ullamcorper, ipsum urna varius libero, ut pretium
            nulla erat non ipsum. Fusce et consequat lacus.
          </Text>
          <Text fontSize="lg" fontWeight="light" mt={2}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat
            dui, interdum eget faucibus in, ornare vitae mi. Aliquam ut lorem et
            dui interdum finibus eu eu augue. Mauris ipsum libero, tristique ut
            nunc vitae, interdum dapibus ipsum. Phasellus et convallis mi.
            Aenean nulla arcu, eleifend at dui vitae, euismod scelerisque
            lectus. Nullam faucibus eget metus a sagittis. Nulla auctor, urna
            vitae sodales ullamcorper, ipsum urna varius libero, ut pretium
            nulla erat non ipsum. Fusce et consequat lacus.
          </Text>
          <Text fontSize="lg" fontWeight="light" mt={2}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat
            dui, interdum eget faucibus in, ornare vitae mi. Aliquam ut lorem et
            dui interdum finibus eu eu augue. Mauris ipsum libero, tristique ut
            nunc vitae, interdum dapibus ipsum. Phasellus et convallis mi.
            Aenean nulla arcu, eleifend at dui vitae, euismod scelerisque
            lectus. Nullam faucibus eget metus a sagittis. Nulla auctor, urna
            vitae sodales ullamcorper, ipsum urna varius libero, ut pretium
            nulla erat non ipsum. Fusce et consequat lacus.
          </Text>
          <Text fontSize="lg" fontWeight="light" mt={2}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat
            dui, interdum eget faucibus in, ornare vitae mi. Aliquam ut lorem et
            dui interdum finibus eu eu augue. Mauris ipsum libero, tristique ut
            nunc vitae, interdum dapibus ipsum. Phasellus et convallis mi.
            Aenean nulla arcu, eleifend at dui vitae, euismod scelerisque
            lectus. Nullam faucibus eget metus a sagittis. Nulla auctor, urna
            vitae sodales ullamcorper, ipsum urna varius libero, ut pretium
            nulla erat non ipsum. Fusce et consequat lacus.
          </Text>
          <Text fontSize="lg" fontWeight="light" mt={2}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat
            dui, interdum eget faucibus in, ornare vitae mi. Aliquam ut lorem et
            dui interdum finibus eu eu augue. Mauris ipsum libero, tristique ut
            nunc vitae, interdum dapibus ipsum. Phasellus et convallis mi.
            Aenean nulla arcu, eleifend at dui vitae, euismod scelerisque
            lectus. Nullam faucibus eget metus a sagittis. Nulla auctor, urna
            vitae sodales ullamcorper, ipsum urna varius libero, ut pretium
            nulla erat non ipsum. Fusce et consequat lacus.
          </Text>
          <Text fontSize="lg" fontWeight="light" mt={2}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat
            dui, interdum eget faucibus in, ornare vitae mi. Aliquam ut lorem et
            dui interdum finibus eu eu augue. Mauris ipsum libero, tristique ut
            nunc vitae, interdum dapibus ipsum. Phasellus et convallis mi.
            Aenean nulla arcu, eleifend at dui vitae, euismod scelerisque
            lectus. Nullam faucibus eget metus a sagittis. Nulla auctor, urna
            vitae sodales ullamcorper, ipsum urna varius libero, ut pretium
            nulla erat non ipsum. Fusce et consequat lacus.
          </Text>
          <Text fontSize="lg" fontWeight="light" mt={2}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat
            dui, interdum eget faucibus in, ornare vitae mi. Aliquam ut lorem et
            dui interdum finibus eu eu augue. Mauris ipsum libero, tristique ut
            nunc vitae, interdum dapibus ipsum. Phasellus et convallis mi.
            Aenean nulla arcu, eleifend at dui vitae, euismod scelerisque
            lectus. Nullam faucibus eget metus a sagittis. Nulla auctor, urna
            vitae sodales ullamcorper, ipsum urna varius libero, ut pretium
            nulla erat non ipsum. Fusce et consequat lacus.
          </Text>
          <Text fontSize="lg" fontWeight="light" mt={2}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat
            dui, interdum eget faucibus in, ornare vitae mi. Aliquam ut lorem et
            dui interdum finibus eu eu augue. Mauris ipsum libero, tristique ut
            nunc vitae, interdum dapibus ipsum. Phasellus et convallis mi.
            Aenean nulla arcu, eleifend at dui vitae, euismod scelerisque
            lectus. Nullam faucibus eget metus a sagittis. Nulla auctor, urna
            vitae sodales ullamcorper, ipsum urna varius libero, ut pretium
            nulla erat non ipsum. Fusce et consequat lacus.
          </Text>
          <Text fontSize="lg" fontWeight="light" mt={2}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat
            dui, interdum eget faucibus in, ornare vitae mi. Aliquam ut lorem et
            dui interdum finibus eu eu augue. Mauris ipsum libero, tristique ut
            nunc vitae, interdum dapibus ipsum. Phasellus et convallis mi.
            Aenean nulla arcu, eleifend at dui vitae, euismod scelerisque
            lectus. Nullam faucibus eget metus a sagittis. Nulla auctor, urna
            vitae sodales ullamcorper, ipsum urna varius libero, ut pretium
            nulla erat non ipsum. Fusce et consequat lacus.
          </Text>
          <Text fontSize="lg" fontWeight="light" mt={2}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat
            dui, interdum eget faucibus in, ornare vitae mi. Aliquam ut lorem et
            dui interdum finibus eu eu augue. Mauris ipsum libero, tristique ut
            nunc vitae, interdum dapibus ipsum. Phasellus et convallis mi.
            Aenean nulla arcu, eleifend at dui vitae, euismod scelerisque
            lectus. Nullam faucibus eget metus a sagittis. Nulla auctor, urna
            vitae sodales ullamcorper, ipsum urna varius libero, ut pretium
            nulla erat non ipsum. Fusce et consequat lacus.
          </Text>
        </Card>
      </Container>
    </Box>
  );
};

export default function Privacy() {
  const headerHeroHPx = useBreakpointValue({
    base: 800,
    sm: 640,
    md: 800,
  });
  const headerHPx = useMemo(() => {
    return 64;
  }, []);
  const heroHPx = useMemo(() => {
    return (headerHeroHPx || 0) - headerHPx;
  }, [headerHPx, headerHeroHPx]);

  return (
    <>
      <HtmlHead />
      <TopBg height={headerHeroHPx || 0} />
      <Box as="header" height={`${headerHPx}px`}>
        <Header />
      </Box>
      <Box as="main">
        <TopSection />
        <BodySection />
      </Box>
      <Box as="footer">
        <Footer />
      </Box>
    </>
  );
}
