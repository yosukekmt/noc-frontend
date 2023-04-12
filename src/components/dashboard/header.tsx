import Logo from "@/components/logo";
import { useCurrentUserApi } from "@/hooks/useCurrentUserApi";
import { useFirebase } from "@/hooks/useFirebase";
import { useProjectsApi } from "@/hooks/useProjectsApi";
import { Project, User } from "@/models";
import {
  ChevronDownIcon,
  EditIcon,
  HamburgerIcon,
  RepeatIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import NewDialog from "./projects/new-dialog";

export type MenuItemType = "campaigns" | "members" | "";

const NavigationBar = ({ projectId = null }: { projectId?: string | null }) => {
  const { pathname } = useRouter();
  const [_menuItemType, _setMenuItemType] = useState<MenuItemType>("");
  useEffect(() => {
    if (pathname.includes("/members")) {
      _setMenuItemType("members");
    } else {
      _setMenuItemType("campaigns");
    }
  }, [pathname]);

  return (
    <Box h={8}>
      <Container maxWidth="6xl" h="100%">
        <Flex align="center" gap={4} h="100%">
          <NextLink href={`/dashboard/${projectId}`}>
            <Button
              fontWeight="bold"
              fontSize="sm"
              size="xs"
              style={{ borderRadius: 20 }}
              colorScheme={_menuItemType === "campaigns" ? "blue" : "white"}
              variant={_menuItemType === "campaigns" ? "solid" : "ghost"}
            >
              Campaigns
            </Button>
          </NextLink>
          <NextLink href={`/dashboard/${projectId}/members`}>
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
          <Spacer />
          <Link href="/how" isExternal>
            <Button size="xs" variant="outline">
              How to use Nudge ONCHAIN
            </Button>
          </Link>
        </Flex>
      </Container>
    </Box>
  );
};

export default function Header({
  projectId = null,
}: {
  projectId?: string | null;
}) {
  const router = useRouter();
  const { authToken, firebaseSignOut } = useFirebase();
  const { getCurrentUser, clearCurrentUser } = useCurrentUserApi();
  const { callGetProjects } = useProjectsApi();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const newDialog = useDisclosure();

  const currentProject: Project | undefined = useMemo(() => {
    if (!projectId) return;
    if (projects.length <= 0) return;
    return projects.find((item) => item.id === projectId);
  }, [projectId, projects]);

  useEffect(() => {
    if (!projectId) return;
    if (projects.length <= 0) return;
    if (currentProject) return;
    router.push("/dashboard");
  }, [projectId, projects, currentProject, router]);

  useEffect(() => {
    if (!authToken) return;

    (async () => {
      const item = await getCurrentUser(authToken);
      setCurrentUser(item);
    })();
    (async () => {
      const item = await callGetProjects(authToken);
      setProjects(item);
    })();
  }, [authToken, callGetProjects, getCurrentUser]);

  const clickProject = (item: Project) => {
    router.push(`/dashboard/${item.id}`);
  };

  const clickNew = () => {
    newDialog.onOpen();
  };

  const clickSignOut = () => {
    firebaseSignOut();
    clearCurrentUser();
    router.push("/");
  };
  const onCreated = (item: Project) => {
    if (!authToken) {
      return;
    }
    router.push(`/dashboard/${item.id}`);
  };

  return (
    <>
      <Box>
        <Box bg="gray.100" h={16}>
          <Container maxWidth="6xl" h="100%">
            <Flex py={2} align="center" h="100%">
              <NextLink href="/">
                <Logo height={12} />
              </NextLink>
              <Spacer />
              {0 < projects.length && (
                <Menu>
                  <MenuButton
                    mr={2}
                    as={IconButton}
                    aria-label="Options"
                    variant="ghots"
                  >
                    <Icon as={ChevronDownIcon} mr={2} />
                    {currentProject && currentProject.name}
                  </MenuButton>
                  <MenuList>
                    {projects.map((item) => {
                      return (
                        <MenuItem
                          onClick={() => clickProject(item)}
                          key={`project_${item.id}`}
                        >
                          {item.name}
                        </MenuItem>
                      );
                    })}
                    <MenuDivider />
                    <Box px={1}>
                      <Button size="sm" variant="ghost" onClick={clickNew}>
                        New Project
                      </Button>
                    </Box>
                  </MenuList>
                </Menu>
              )}
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
                      Account
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
        {projectId && <NavigationBar projectId={projectId} />}
        <Divider />
      </Box>
      <NewDialog
        closable={true}
        isOpen={newDialog.isOpen}
        onClose={newDialog.onClose}
        onOpen={newDialog.onOpen}
        onCreated={onCreated}
      />
    </>
  );
}
