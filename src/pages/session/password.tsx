import HtmlHead from "@/components/html-head";
import Footer from "@/components/session/footer";
import Header from "@/components/session/header";
import { useFirebase } from "@/hooks/useFirebase";
import { useValidator } from "@/hooks/useValidator";
import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useCallback, useMemo, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

export default function Password() {
  const router = useRouter();
  const { resetPassword, getFirebaseErrorMessage } = useFirebase();
  const [email, setEmail] = useState("");
  const [isAttempted, setIsAttempted] = useState(false);
  const { validateEmail } = useValidator();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const callResetPassword = useCallback(
    async (email: string, url: string) => {
      setIsLoading(true);
      try {
        await resetPassword(email, url);
        router.push("/session/sent");
      } catch (err: unknown) {
        console.error(err);
        const errorMessage = getFirebaseErrorMessage(err);
        if (errorMessage) {
          setErrorMessage(errorMessage);
        }
      }
      setIsLoading(false);
    },
    [getFirebaseErrorMessage, resetPassword, router]
  );

  const isValidEmail = useMemo(() => {
    return validateEmail(email);
  }, [validateEmail, email]);

  const clickSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    setIsAttempted(true);
    if (!isValidEmail) return;
    callResetPassword(email, `${window.location.origin}/session/signin`);
  };

  return (
    <>
      <HtmlHead />
      <Box
        backgroundImage="url(/bg_session.jpg)"
        backgroundSize="cover"
        backgroundRepeat="no-repeat"
        backgroundPosition="center center"
        minH="100vh"
      >
        <Box as="header">
          <Header />
        </Box>
        <Box as="main">
          <Box>
            <Container maxWidth="xl">
              <form onSubmit={clickSubmit}>
                <Card overflow="hidden" boxShadow="2xl" mt={8}>
                  <CardBody p={12}>
                    <Heading as="h2" size="md">
                      Reset your password
                    </Heading>
                    <Text fontSize="md" pt={4}>
                      Enter the email address associated with your account and
                      we&apos;ll send you a link to reset your password.
                    </Text>
                    <FormControl mt={8}>
                      <FormLabel fontSize="sm">Email</FormLabel>
                      <InputGroup size="lg">
                        <Input
                          type="text"
                          name="email"
                          value={email}
                          onChange={(evt) => setEmail(evt.target.value)}
                        />
                      </InputGroup>
                      <Box h={2} mt={2}>
                        {isAttempted && (!isValidEmail || errorMessage) && (
                          <Flex align="center" px={4}>
                            <Icon
                              as={FaExclamationTriangle}
                              color="danger.500"
                            />
                            <Text
                              fontSize="sm"
                              fontWeight="normal"
                              color="danger.500"
                              ml={2}
                            >
                              {isValidEmail
                                ? errorMessage
                                : "Please enter a valid email."}
                            </Text>
                          </Flex>
                        )}
                      </Box>
                    </FormControl>
                    <Button
                      type="submit"
                      w="100%"
                      size="lg"
                      fontWeight="light"
                      mt={8}
                      isLoading={isLoading}
                    >
                      Continue
                    </Button>
                    <NextLink href="/session/signin">
                      <Button
                        w="100%"
                        size="sm"
                        fontWeight="light"
                        variant="ghost"
                        mt={2}
                      >
                        Return to sign in
                      </Button>
                    </NextLink>
                  </CardBody>
                </Card>
              </form>
            </Container>
          </Box>
        </Box>
        <Box as="footer">
          <Footer />
        </Box>
      </Box>
    </>
  );
}
