import NewDialog from "@/components/dashboard/projects/new-dialog";
import { useFirebase } from "@/hooks/useFirebase";
import { useProjectsApi } from "@/hooks/useProjectsApi";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Project } from "@/models";
import { Center, Flex, useDisclosure } from "@chakra-ui/react";
import Head from "next/head";
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
        router.push(`/dashboard/${items[0].id}`);
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
    router.push(`/dashboard/${item.id}`);
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
              ></animateTransform>
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
