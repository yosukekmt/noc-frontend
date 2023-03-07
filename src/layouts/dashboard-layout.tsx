import Header from "@/components/dashboard/header";
import { useCurrentUserApi } from "@/hooks/useCurrentUserApi";
import { useFirebase } from "@/hooks/useFirebase";
import { Box, Container } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: JSX.Element;
}) {
  const router = useRouter();
  const { firebaseSignOut } = useFirebase();
  const { clearCurrentUser } = useCurrentUserApi();
  const { authToken, isFirebaseInitialized } = useFirebase();

  useEffect(() => {
    if (!isFirebaseInitialized) {
      return;
    }
    if (!authToken) {
      firebaseSignOut();
      clearCurrentUser();
      router.push("/");
      return;
    }
  }, [
    authToken,
    clearCurrentUser,
    firebaseSignOut,
    isFirebaseInitialized,
    router,
  ]);

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
