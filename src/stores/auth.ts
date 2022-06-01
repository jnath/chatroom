import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  type User
} from "firebase/auth";
import { readable } from 'svelte/store';


// construction function. need to call it after we
// initialize our firebase app
export const initAuth = (useRedirect = false) => {
  const auth = getAuth();

  const loginWithEmailPassword = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

  const registerWithEmailPassword = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password);

  let firebaseUser: User | null = null;
  // wrap Firebase user in a Svelte readable store
  const user = readable<User | null>(null, set => {
    return auth.onAuthStateChanged(async authUser => {
      firebaseUser = authUser;
      set(firebaseUser);
    });
  });

  const logout = async () => {
    if(auth) {
      await auth.signOut();
    }
  };

  return {
    user,
    loginWithEmailPassword,
    registerWithEmailPassword,
    updateProfile: async (profile: {
        displayName?: string | null;
        photoURL?: string | null;
    }) => firebaseUser && await updateProfile(firebaseUser, profile),
    logout
  };
};
