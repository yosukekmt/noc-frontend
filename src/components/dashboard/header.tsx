import Logo from "@/components/logo";
import { useCurrentUserApi } from "@/hooks/useCurrentUserApi";
import { useFirebase } from "@/hooks/useFirebase";
import { useProjectsApi } from "@/hooks/useProjectsApi";
import { Project, User } from "@/models";
import { EditIcon, RepeatIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Plus } from "phosphor-react";
import { useEffect, useMemo, useState } from "react";
import { FaChevronDown, FaUser } from "react-icons/fa";
import { MdPerson, MdTrackChanges, MdWallet } from "react-icons/md";
import NewDialog from "./projects/new-dialog";

export type MenuItemType = "campaigns" | "members" | "project";

const NavButton = (props: {
  active: boolean;
  icon: React.ReactElement;
  label: string;
  link: string;
}) => {
  return (
    <NextLink href={props.link}>
      <Button
        size="sm"
        fontWeight="normal"
        leftIcon={props.icon}
        variant={props.active ? "solid" : "ghost"}
        colorScheme={props.active ? "whiteAlpha" : undefined}
        bgColor={props.active ? "white" : undefined}
      >
        {props.label}
      </Button>
    </NextLink>
  );
};

const MainNavigation = (props: { projectId: string }) => {
  const { pathname } = useRouter();
  const [_menuItemType, _setMenuItemType] = useState<MenuItemType>("campaigns");
  useEffect(() => {
    if (pathname.includes("/campaigns")) {
      _setMenuItemType("campaigns");
    } else if (pathname.includes("/members")) {
      _setMenuItemType("members");
    } else {
      _setMenuItemType("project");
    }
  }, [pathname]);

  return (
    <Flex gap={1} w="100%" justify="center">
      <NavButton
        active={_menuItemType === "campaigns"}
        icon={<Icon as={MdTrackChanges} />}
        label="Campaigns"
        link={`/dashboard/${props.projectId}/campaigns`}
      />
      <NavButton
        active={_menuItemType === "project"}
        icon={<Icon as={MdWallet} />}
        label="Treasury"
        link={`/dashboard/${props.projectId}`}
      />
      <NavButton
        active={_menuItemType === "members"}
        icon={<Icon as={MdPerson} />}
        label="Team"
        link={`/dashboard/${props.projectId}/members`}
      />
    </Flex>
  );
};

const ProjectMenuList = (props: {
  projects: Project[];
  onProjectClicked: (item: Project) => void;
  onNewProjectClicked: () => void;
}) => {
  return (
    <MenuList>
      {props.projects.map((item) => {
        return (
          <MenuItem
            onClick={() => props.onProjectClicked(item)}
            key={`project_${item.id}`}
          >
            {item.name}
          </MenuItem>
        );
      })}
      <MenuDivider />
      <MenuItem icon={<Plus />} onClick={props.onNewProjectClicked}>
        New Project
      </MenuItem>
    </MenuList>
  );
};

const AccountMenuList = (props: {
  user: User;
  onSignOutClicked: () => void;
}) => {
  return (
    <MenuList>
      <Box px={4} pt={2}>
        <Heading as="h3" fontSize="md" fontWeight="bold">
          Account
        </Heading>
        <Heading as="h4" fontSize="sm" fontWeight="light" mt={1}>
          {props.user.email}
        </Heading>
      </Box>
      <MenuDivider />
      <NextLink href="/dashboard/profile">
        <MenuItem icon={<RepeatIcon />}>Profile</MenuItem>
      </NextLink>
      <MenuItem icon={<EditIcon />} onClick={props.onSignOutClicked}>
        Sign out
      </MenuItem>
    </MenuList>
  );
};

const AccountNavigationMobile = (props: {
  user: User;
  project: Project;
  projects: Project[];
  onProjectClicked: (item: Project) => void;
  onNewProjectClicked: () => void;
  onSignOutClicked: () => void;
}) => {
  const projectLetter = useMemo(() => {
    return props.project.name[0];
  }, [props.project.name]);
  const username = useMemo(() => {
    return props.user.email.split("@")[0];
  }, [props.user.email]);
  return (
    <HStack gap={0}>
      <Menu>
        <MenuButton
          rounded="full"
          bgColor="transparent"
          borderColor="black"
          borderWidth="1px"
          w="40px"
          h="40px"
          minW="40px"
          minH="40px"
          maxW="40px"
          maxH="40px"
          p="3px"
          m={0}
        >
          <Text
            rounded="full"
            bgColor="black"
            textColor="white"
            borderColor="black"
            w="32px"
            h="32px"
            lineHeight="32px"
            fontWeight="normal"
          >
            {projectLetter}
          </Text>
        </MenuButton>
        <ProjectMenuList
          projects={props.projects}
          onProjectClicked={props.onProjectClicked}
          onNewProjectClicked={props.onNewProjectClicked}
        />
      </Menu>
      <Menu>
        <MenuButton
          rounded="full"
          bgColor="transparent"
          borderColor="black"
          borderWidth="1px"
          w="40px"
          h="40px"
          minW="40px"
          minH="40px"
          maxW="40px"
          maxH="40px"
          p="3px"
          m={0}
        >
          <Flex align="center" justify="center">
            <FaUser color="black" />
          </Flex>
        </MenuButton>
        <AccountMenuList
          user={props.user}
          onSignOutClicked={props.onSignOutClicked}
        />
      </Menu>
    </HStack>
  );
};

const AccountNavigationDesktop = (props: {
  user: User;
  project: Project;
  projects: Project[];
  onProjectClicked: (item: Project) => void;
  onNewProjectClicked: () => void;
  onSignOutClicked: () => void;
}) => {
  const projectLetter = useMemo(() => {
    return props.project.name[0];
  }, [props.project.name]);
  const username = useMemo(() => {
    return props.user.email.split("@")[0];
  }, [props.user.email]);
  return (
    <>
      <Menu>
        <MenuButton
          h="32px"
          p={1}
          roundedStart="full"
          roundedEnd="none"
          bgColor="transparent"
          borderColor="black"
          borderWidth="1px"
          maxWidth={240}
        >
          <Flex align="center">
            <Text
              rounded="full"
              bgColor="black"
              textColor="white"
              w="24px"
              h="24px"
              minW="24px"
              minH="24px"
              maxW="24px"
              maxH="24px"
              lineHeight="24px"
              fontWeight="normal"
            >
              {projectLetter}
            </Text>
            <Text
              textColor="black"
              lineHeight="24px"
              fontWeight="normal"
              noOfLines={1}
              fontSize="sm"
              px={4}
            >
              {props.project.name}
            </Text>
            <Icon as={FaChevronDown} boxSize={2} color="black" mr={2} />
          </Flex>
        </MenuButton>
        <ProjectMenuList
          projects={props.projects}
          onProjectClicked={props.onProjectClicked}
          onNewProjectClicked={props.onNewProjectClicked}
        />
      </Menu>
      <Menu>
        <MenuButton
          aria-label="Options"
          p={1}
          h="32px"
          maxWidth={240}
          roundedStart="none"
          roundedEnd="full"
          bgColor="transparent"
          borderTopColor="black"
          borderBottomColor="black"
          borderEndColor="black"
          borderWidth="1px"
          borderTopWidth="1px"
          borderBottomWidth="1px"
          borderEndWidth="1px"
          borderStartWidth={0}
        >
          <Flex align="center">
            <Box
              rounded="full"
              bgColor="primary.500"
              w="24px"
              h="24px"
              minW="24px"
              minH="24px"
              maxW="24px"
              maxH="24px"
              ml={2}
            >
              <Center h="24px">
                <FaUser color="black" />
              </Center>
            </Box>
            <Text
              textColor="black"
              lineHeight="24px"
              fontWeight="normal"
              fontSize="sm"
              noOfLines={1}
              px={2}
            >
              {username}
            </Text>
            <Icon as={FaChevronDown} boxSize={2} color="black" mr={2} />
          </Flex>
        </MenuButton>
        <AccountMenuList
          user={props.user}
          onSignOutClicked={props.onSignOutClicked}
        />
      </Menu>
    </>
  );
};

const AccountNavigation = (props: {
  isMobileUi: boolean;
  user: User;
  project: Project;
  projects: Project[];
  onProjectClicked: (item: Project) => void;
  onNewProjectClicked: () => void;
  onSignOutClicked: () => void;
}) => {
  return (
    <>
      {props.isMobileUi ? (
        <AccountNavigationMobile
          user={props.user}
          project={props.project}
          projects={props.projects}
          onProjectClicked={props.onProjectClicked}
          onNewProjectClicked={props.onNewProjectClicked}
          onSignOutClicked={props.onSignOutClicked}
        />
      ) : (
        <AccountNavigationDesktop
          user={props.user}
          project={props.project}
          projects={props.projects}
          onProjectClicked={props.onProjectClicked}
          onNewProjectClicked={props.onNewProjectClicked}
          onSignOutClicked={props.onSignOutClicked}
        />
      )}
    </>
  );
};

export default function Header({
  projectId = null,
}: {
  projectId: string | null;
}) {
  const isMobileUi = useBreakpointValue({ base: true, lg: false });

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
      <Container maxWidth="6xl" h="100%">
        {isMobileUi ? (
          <>
            <Flex py={2} align="center" h="100%">
              <NextLink href="/">
                <Logo height={12} />
              </NextLink>
              <Spacer />
              {currentUser && currentProject && (
                <AccountNavigation
                  isMobileUi={true}
                  user={currentUser}
                  project={currentProject}
                  projects={projects}
                  onProjectClicked={clickProject}
                  onNewProjectClicked={clickNew}
                  onSignOutClicked={clickSignOut}
                />
              )}
            </Flex>
            <Flex py={2} align="center" h="100%">
              {currentUser && currentProject && (
                <MainNavigation projectId={currentProject.id} />
              )}
            </Flex>
          </>
        ) : (
          <Flex py={2} align="center" h="100%">
            <NextLink href="/">
              <Logo height={12} />
            </NextLink>
            <Spacer />
            {currentUser && currentProject && (
              <MainNavigation projectId={currentProject.id} />
            )}
            <Spacer />
            {currentUser && currentProject && (
              <AccountNavigation
                isMobileUi={false}
                user={currentUser}
                project={currentProject}
                projects={projects}
                onProjectClicked={clickProject}
                onNewProjectClicked={clickNew}
                onSignOutClicked={clickSignOut}
              />
            )}
          </Flex>
        )}
      </Container>
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
