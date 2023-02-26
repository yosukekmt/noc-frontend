import Logo from "@/components/logo";
import { Team, useCurrentTeam } from "@/hooks/useCurrentTeam";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useFirebase } from "@/hooks/useFirebase";
import { User } from "@/hooks/useUsersApi";
import { EditIcon, HamburgerIcon, RepeatIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export type MenuItemType = "gasback_nfts" | "members" | "";

const NavigationBar = () => {
  const { pathname } = useRouter();
  const [_menuItemType, _setMenuItemType] = useState<MenuItemType>("");
  useEffect(() => {
    if (pathname === "/dashboard/members") {
      _setMenuItemType("members");
    } else if (
      pathname === "/dashboard" ||
      pathname.startsWith("/dashboard/coupons/")
    ) {
      _setMenuItemType("gasback_nfts");
    }
  }, [pathname]);

  return (
    <Box h={8}>
      <Container maxWidth="6xl" h="100%">
        <Flex align="center" justify="start" gap={4} h="100%">
          <NextLink href="/dashboard">
            <Button
              fontWeight="bold"
              fontSize="sm"
              size="xs"
              style={{ borderRadius: 20 }}
              colorScheme={_menuItemType === "gasback_nfts" ? "blue" : "white"}
              variant={_menuItemType === "gasback_nfts" ? "solid" : "ghost"}
            >
              Gasback NFTs
            </Button>
          </NextLink>
          <NextLink href="/dashboard/members">
            <Button
              fontWeight="bold"
              fontSize="sm"
              size="xs"
              style={{ borderRadius: 20 }}
              colorScheme={_menuItemType === "members" ? "blue" : "white"}
              variant={_menuItemType === "members" ? "solid" : "ghost"}
            >
              Team
            </Button>
          </NextLink>
        </Flex>
      </Container>
    </Box>
  );
};

export default function Header() {
  const router = useRouter();
  const { authToken, firebaseSignOut } = useFirebase();
  const { getCurrentUser, clearCurrentUser } = useCurrentUser();
  const { getCurrentTeam, clearCurrentTeam } = useCurrentTeam();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);

  useEffect(() => {
    if (!authToken) {
      return;
    }
    {
      (async () => {
        const item = await getCurrentUser(authToken);
        console.log(item);
        setCurrentUser(item);
      })();
    }
    {
      (async () => {
        const item = await getCurrentTeam(authToken);
        setCurrentTeam(item);
      })();
    }
  }, [authToken, getCurrentTeam, getCurrentUser]);

  const clickSignOut = () => {
    firebaseSignOut();
    clearCurrentUser();
    clearCurrentTeam();
    router.push("/");
  };

  return (
    <Box>
      <Box bg="gray.100" h={16}>
        <Container maxWidth="6xl" h="100%">
          <Flex py={2} align="center" h="100%">
            <NextLink href="/">
              <Logo height={12} />
            </NextLink>
            <Spacer />
            <Text fontSize="md" mx={4}>
              {currentTeam && currentTeam.name}
            </Text>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<HamburgerIcon />}
                variant="outline"
              />
              <MenuList>
                <Box px={4} pt={2}>
                  <Heading as="h3" fontSize="md" fontWeight="bold">
                    {currentTeam && currentTeam.name}
                  </Heading>
                  <Heading as="h4" fontSize="sm" fontWeight="light" mt={1}>
                    {currentUser && currentUser.email}
                  </Heading>
                </Box>
                <MenuDivider />
                <NextLink href="/dashboard/profile">
                  <MenuItem icon={<RepeatIcon />}>Profile</MenuItem>
                </NextLink>
                <MenuItem icon={<EditIcon />} onClick={clickSignOut}>
                  Sign out
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Container>
        <Divider color="gray" />
      </Box>
      <NavigationBar />
      <Divider />
    </Box>
  );
}
