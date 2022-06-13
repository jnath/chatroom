import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as authUpdateProfile,
  type User
} from "firebase/auth";
import { readable } from 'svelte/store';


export const logout = async ()=>{
  const auth = getAuth();
  if(auth) {
    await auth.signOut();
  }
}

export const loginWithEmailPassword = (email: string, password: string) =>
  signInWithEmailAndPassword(getAuth(), email, password);

export const registerWithEmailPassword = (email: string, password: string) =>
  createUserWithEmailAndPassword(getAuth(), email, password);


export const updateProfile = async (profile: {
  displayName?: string | null;
  photoURL?: string | null;
}) => {
  const auth = getAuth();

  auth.currentUser && await authUpdateProfile(auth.currentUser, profile)
}

// construction function. need to call it after we
// initialize our firebase app
export const initAuth = () => {
  const auth = getAuth();


  let firebaseUser: User | null = null;
  // wrap Firebase user in a Svelte readable store
  const { subscribe } = readable<User | null>(null, set => {
    return auth.onAuthStateChanged(async authUser => {
      firebaseUser = authUser;
      set(firebaseUser);
    });
  });

  return {
    subscribe,
  };
};
