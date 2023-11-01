import { GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebaseConfig";

import { createUserProfileDocument } from "./firestore.utils";

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const { user } = await auth.signInWithPopup(provider);
    await createUserProfileDocument(user);
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
};

export const signOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out", error);
  }
};
