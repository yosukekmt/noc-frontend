//import * as Firebase from "firebase/app";
//import * as FirebaseAuth from "firebase/auth";
import { faker } from "@faker-js/faker";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";
const ERROR_MESSAGES = [
  {
    code: "auth/invalid-email",
    message: "The email is invalid.",
  },
  {
    code: "auth/user-disabled",
    message: "The email is invalid.",
  },
  {
    code: "auth/user-not-found",
    message: "No existing user found with this email.",
  },
  {
    code: "auth/wrong-password",
    message: "The password is incorrect.",
  },
];
/*
const firebase = Firebase.initializeApp(
  JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG as string)
);
const firebaseAuth = FirebaseAuth.getAuth(firebase);
firebaseAuth.languageCode = "ja";
*/
const authTokenAtom = atom<string | null>(null);
const isInitializedAtom = atom<boolean>(false);

const item = `Bearer ${faker.datatype.uuid()}`;

export const useFirebase = () => {
  const [authToken, setAuthToken] = useAtom(authTokenAtom);
  const [isInitialized, setIsInitialized] = useAtom(isInitializedAtom);

  setTimeout(() => {
    setIsInitialized(true);
    setAuthToken(item);
  }, 300);

  /*
  firebaseAuth.onAuthStateChanged((firebaseUser) => {
    setIsInitialized(true);
    if (!firebaseUser) {
      setAuthToken(null);
      return;
    }
    firebaseUser
      .getIdToken()
      .then((idToken) => {
        setAuthToken(`Bearer ${idToken}`);
        console.log(authToken);
      })
      .catch((err) => {
        setAuthToken(null);
      })
      .finally(() => {});
  });
*/

  const signIn = useCallback(
    async (email: string, password: string): Promise<string> => {
      if (authToken && 0 < authToken.length) {
        return authToken;
      } /*
      const credential = await FirebaseAuth.signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const idToken = await credential.user.getIdToken();
      const item = `Bearer ${idToken}`;
      */
      setAuthToken(item);
      return item;
    },
    [authToken, setAuthToken]
  );

  const signOut = useCallback(async (): Promise<void> => {
    //await FirebaseAuth.signOut(firebaseAuth);
    setAuthToken(null);
  }, [setAuthToken]);

  const updatePassword = useCallback(
    async (password: string, newPassword: string): Promise<void> => {
      /*      const user = firebaseAuth.currentUser;
      if (!user) return;
      const email = user.email;
      if (!email) return;

      const credential = FirebaseAuth.EmailAuthProvider.credential(
        email,
        password
      );
      await FirebaseAuth.reauthenticateWithCredential(user, credential);
      await FirebaseAuth.updatePassword(user, newPassword);*/
    },
    []
  );

  const resetPassword = useCallback(
    async (email: string, url: string): Promise<void> => {
      /*
      const config = { url: url, handleCodeInApp: false };
      return await FirebaseAuth.sendPasswordResetEmail(
        firebaseAuth,
        email,
        config
      );*/
    },
    []
  );

  const getErrorMessage = useCallback((err: unknown): string | null => {
    return (
      ERROR_MESSAGES.find((message) => message.code === (err as any).code)
        ?.message || null
    );
  }, []);

  return {
    isFirebaseInitialized: isInitialized,
    authToken,
    firebaseSignIn: signIn,
    firebaseSignOut: signOut,
    updatePassword,
    resetPassword,
    getErrorMessage,
  };
};
