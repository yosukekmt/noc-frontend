import HtmlHead from "@/components/html-head";
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
  Spacer,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { FaExclamationTriangle, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const router = useRouter();
  const {
    authToken,
    firebaseSignIn,
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
    console.log("callSignOut");
    setIsLoading(true);
    await firebaseSignOut();
    clearCurrentUser();
    setIsLoading(false);
  }, [clearCurrentUser, firebaseSignOut]);

  const callSignIn = useCallback(async () => {
    setIsLoading(true);
    try {
      const authToken = await firebaseSignIn(email, password);
      console.log(authToken);
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = getFirebaseErrorMessage(err);
      if (errorMessage) {
        setErrorMessage(errorMessage);
      }
    }
    setIsLoading(false);
  }, [email, getFirebaseErrorMessage, password, firebaseSignIn]);

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
    callSignIn();
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
                      Sign in to your account
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
                              Please enter a valid email.
                            </Text>
                          </Flex>
                        )}
                      </Box>
                    </FormControl>
                    <FormControl mt={8}>
                      <Flex>
                        <FormLabel fontSize="sm">Password</FormLabel>
                        <Spacer />
                        <NextLink href="/session/password">
                          <Text fontSize="sm">Forgot your password?</Text>
                        </NextLink>
                      </Flex>
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
                                <Icon as={FaEye} />
                              ) : (
                                <Icon as={FaEyeSlash} />
                              )
                            }
                            onClick={() => setPasswordVisible(!passwordVisible)}
                          />
                        </InputRightElement>
                      </InputGroup>
                      <Box h={2} mt={2}>
                        {isAttempted && (!isValidPassword || errorMessage) && (
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
                              {isValidPassword
                                ? errorMessage
                                : "Please enter your password."}
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
                  </CardBody>
                </Card>
              </form>
            </Container>
          </Box>
        </Box>
        <Box as="footer">
          <Container maxWidth="xl">
            <Flex mt={8}>
              <Text fontSize="sm" color="gray">
                Don&apos;t have an account?
                <NextLink href="/session/signup">
                  <Button variant="link" mx={2}>
                    Sign Up
                  </Button>
                </NextLink>
              </Text>
            </Flex>
          </Container>
          <Footer />
        </Box>
      </Box>
    </>
  );
}
