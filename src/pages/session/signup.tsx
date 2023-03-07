import Footer from "@/components/session/footer";
import Header from "@/components/session/header";
import { useApiClient } from "@/hooks/useApiClient";
import { useCurrentUserApi } from "@/hooks/useCurrentUserApi";
import { useFirebase } from "@/hooks/useFirebase";
import { useValidator } from "@/hooks/useValidator";
import { User } from "@/models";
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
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Eye, EyeSlash, Warning } from "phosphor-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

export default function Login() {
  const router = useRouter();
  const {
    authToken,
    firebaseSignUp,
    firebaseSignOut,
    getFirebaseErrorMessage,
  } = useFirebase();
  const { getErrorMessage: getApiErrorMessage, isUnauthorizedError } =
    useApiClient();
  const { getCurrentUser, clearCurrentUser } = useCurrentUserApi();
  const { validateEmail, validatePassword } = useValidator();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAttempted, setIsAttempted] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = useMemo(() => {
    return validateEmail(email);
  }, [validateEmail, email]);
  const isValidPassword = useMemo(() => {
    return validatePassword(password);
  }, [validatePassword, password]);

  const callSignOut = useCallback(async () => {
    setIsLoading(true);
    await firebaseSignOut();
    clearCurrentUser();
    setIsLoading(false);
  }, [clearCurrentUser, firebaseSignOut]);

  const callSignUp = useCallback(async () => {
    setIsLoading(true);
    try {
      const authToken = await firebaseSignUp(email, password);
      console.log(authToken);
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = getFirebaseErrorMessage(err);
      if (errorMessage) {
        setErrorMessage(errorMessage);
      }
    }
    setIsLoading(false);
  }, [email, firebaseSignUp, getFirebaseErrorMessage, password]);

  const callApiGetCurrentUser = useCallback(
    async (authToken: string) => {
      setIsLoading(true);
      try {
        const item = await getCurrentUser(authToken);
        setCurrentUser(item);
      } catch (err: unknown) {
        console.error(err);
        const errorMessage = getApiErrorMessage(err);
        if (errorMessage) {
          setErrorMessage(errorMessage);
        }
        if (isUnauthorizedError(err)) {
          callSignOut();
        }
      }
      setIsLoading(false);
    },
    [callSignOut, getApiErrorMessage, getCurrentUser, isUnauthorizedError]
  );

  useEffect(() => {
    setErrorMessage("");
  }, [email, password, setErrorMessage]);

  useEffect(() => {
    if (!authToken) {
      return;
    }
    callApiGetCurrentUser(authToken);
  }, [authToken, callApiGetCurrentUser]);

  useEffect(() => {
    if (currentUser) {
      router.push("/dashboard");
      return;
    }
  }, [currentUser, router]);

  const clickSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    setIsAttempted(true);
    if (!isValidEmail) return;
    if (!isValidPassword) return;
    callSignUp();
  };

  return (
    <>
      <Head>
        <title>Nudge ONCHAIN</title>
        <meta
          name="description"
          content="Native implementation of coupon and cashback systems."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <Box bg="gray.100" minH="100vh">
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
                      Create your account
                    </Heading>
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
                        {isAttempted && !isValidEmail && (
                          <Flex align="center">
                            <Icon as={Warning} color="red" />
                            <Text
                              fontSize="sm"
                              fontWeight="normal"
                              color="red"
                              ml={2}
                            >
                              Please enter a valid email.
                            </Text>
                          </Flex>
                        )}
                      </Box>
                    </FormControl>
                    <FormControl mt={8}>
                      <FormLabel fontSize="sm">Password</FormLabel>
                      <InputGroup size="lg">
                        <Input
                          type={passwordVisible ? "text" : "password"}
                          name="password"
                          value={password}
                          onChange={(evt) => setPassword(evt.target.value)}
                        />
                        <InputRightElement>
                          <IconButton
                            variant="ghost"
                            aria-label="Toggle Password"
                            icon={
                              passwordVisible ? (
                                <Icon as={EyeSlash} />
                              ) : (
                                <Icon as={Eye} />
                              )
                            }
                            onClick={() => setPasswordVisible(!passwordVisible)}
                          />
                        </InputRightElement>
                      </InputGroup>
                      <Box h={2} mt={2}>
                        {(() => {
                          if (isAttempted && !isValidPassword) {
                            return (
                              <Flex align="center">
                                <Icon as={Warning} color="red" />
                                <Text
                                  fontSize="sm"
                                  fontWeight="normal"
                                  color="red"
                                  ml={2}
                                >
                                  Please enter your password.
                                </Text>
                              </Flex>
                            );
                          } else if (isAttempted && errorMessage) {
                            return (
                              <Flex align="center">
                                <Icon as={Warning} color="red" />
                                <Text
                                  fontSize="sm"
                                  fontWeight="normal"
                                  color="red"
                                  ml={2}
                                >
                                  {errorMessage}
                                </Text>
                              </Flex>
                            );
                          } else {
                            return <></>;
                          }
                        })()}
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
                      Create account
                    </Button>
                    <Flex justify="center" mt={8}>
                      <Text fontSize="sm" color="gray">
                        Have an account?
                        <Box as="span" ml={2}>
                          <NextLink href="/session/signin">Sign in</NextLink>
                        </Box>
                      </Text>
                    </Flex>
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
