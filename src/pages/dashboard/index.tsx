import NewDialog from "@/components/dashboard/projects/new-dialog";
import HtmlHead from "@/components/html-head";
import { useFirebase } from "@/hooks/useFirebase";
import { useProjectsApi } from "@/hooks/useProjectsApi";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Project } from "@/models";
import { Center, Flex, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Spinner } from "phosphor-react";
import { useCallback, useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const { authToken, isFirebaseInitialized } = useFirebase();
  const { callGetProjects } = useProjectsApi();
  const [isInitialized, setIsInitialized] = useState(false);
  const newDialog = useDisclosure();

  const getProjects = useCallback(
    async (authToken: string): Promise<void> => {
      const items = await callGetProjects(authToken);
      if (items.length === 0) {
        newDialog.onOpen();
      } else {
        router.push(`/dashboard/${items[0].id}/campaigns`);
      }
    },
    [callGetProjects, newDialog, router]
  );

  useEffect(() => {
    if (!isFirebaseInitialized) return;
    if (!authToken) return;

    (async () => {
      await getProjects(authToken);
      setIsInitialized(true);
    })();
  }, [authToken, getProjects, isFirebaseInitialized]);

  const onCreated = (item: Project) => {
    if (!authToken) {
      return;
    }
    router.push(`/dashboard/${item.id}/campaigns`);
  };

  return (
    <>
      <HtmlHead />
      <DashboardLayout>
        <Flex h={320} align="center" justify="center">
          <Center>
            <Spinner size={24}>
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                dur="1.8s"
                from="0 0 0"
                to="360 0 0"
                repeatCount="indefinite"
              />
            </Spinner>
          </Center>
        </Flex>
      </DashboardLayout>
      <NewDialog
        closable={false}
        isOpen={newDialog.isOpen}
        onClose={newDialog.onClose}
        onOpen={newDialog.onOpen}
        onCreated={onCreated}
      />
    </>
  );
}
