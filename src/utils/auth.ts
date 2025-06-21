/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/auth.ts
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    const user = result.user;

    const isNewUser = (result as any)._tokenResponse?.isNewUser;

    return {
      success: true,
      user: {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        uid: user.uid,
        idToken
      },
      isNewUser,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};
