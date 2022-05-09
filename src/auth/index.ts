import type { FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  type ParsedToken
} from "firebase/auth";
import { readable } from 'svelte/store';
export interface User {
  id?: string | object;
  name?: string | object;
  email?: string | object;
  picture?: string | object;
}

const userMapper = (claims: ParsedToken): User => ({
  id: claims.user_id,
  name: claims.name,
  email: claims.email,
  picture: claims.picture
});

// construction function. need to call it after we
// initialize our firebase app
export const initAuth = (firebaseApp: FirebaseApp, useRedirect = false) => {
  const auth = getAuth(firebaseApp);

  const loginWithEmailPassword = (email: string, password: string) =>
    auth && signInWithEmailAndPassword(auth, email, password);

  const logout = () => auth && auth.signOut();

  // wrap Firebase user in a Svelte readable store
  const user = readable<User | null>(null, set => {
    const unsub = auth.onAuthStateChanged(async fireUser => {
      if (fireUser) {
        const token = await fireUser.getIdTokenResult();
        const user = userMapper(token.claims);
        set(user);
      } else {
        set(null);
      }
    });

    return unsub;
  });

  return {
    user,
    loginWithEmailPassword,
    logout
  };
};
