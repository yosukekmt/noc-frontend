import Header from "@/components/dashboard/header";
import { Box, Container } from "@chakra-ui/react";

export default function DashboardLayout({
  children,
}: {
  children: JSX.Element;
}) {
  return (
    <Box>
      <Box as="header">
        <Header />
      </Box>
      <Box as="main">
        <Container maxWidth="6xl" py={8}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}
