
import { getAuth, updateEmail, updateProfile , type User } from 'firebase/auth'
import { derived, get, writable, type Readable } from 'svelte/store'

import { userConverter, UserData } from '$models/User'
import { createStoreDoc, type StoreFirestoreDocument } from '$stores/firestore'
import { DocumentReference, getFirestore } from "firebase/firestore";

type MergedUser = {
  id: string;
  username: string,
  picture: string,
  online: boolean,
  email: string | null
} | null;

export type StoredUser = Readable<MergedUser> & {
  updateProfile: (data: {
    displayName?: string | null;
    photoURL?: string | null;
  }) => Promise<void>,
  updateEmail: (newEmail: string) => Promise<void>,
  getRef(): DocumentReference<UserData>
}


export const getCurrentUser = (): StoredUser =>{

  const firestore = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;
  if(!user){
    throw new Error('Not Auth');
  }

  const firestoreUser: StoreFirestoreDocument<UserData> = createStoreDoc({
    firestore,
    converter: userConverter,
    paths: ['users', user.uid]
  })

  const firebaseAuthUser = writable<User | null>(user);

  auth.onAuthStateChanged(async authUser => {
    if (authUser) {
      firebaseAuthUser.set(authUser);
      await firestoreUser.set(new UserData(authUser.uid, {
        username: authUser.displayName,
        picture: authUser.photoURL,
        online: true
      }))
    } else {
      firebaseAuthUser.set(null);
      await firestoreUser.update({online: false});
      // TODO: https://firebase.google.com/docs/firestore/solutions/presence#web
    }
  });

  const { subscribe } = derived([firebaseAuthUser, firestoreUser], ([$firebaseAuthUser, $firestoreUser]): MergedUser => {
    if(!$firestoreUser || !$firebaseAuthUser) {
      return null
    }
    return {
      id: $firestoreUser.id,
      username: $firestoreUser.username,
      picture: $firestoreUser.picture,
      online: $firestoreUser.online,
      email: $firebaseAuthUser.email
    }
  })

  return {
    subscribe,
    async updateEmail(newEmail: string) {
      const user = get(firebaseAuthUser);
      if(!user){
        return;
      }
      await updateEmail(user, newEmail)
    },
    async updateProfile(data){
      const user = get(firebaseAuthUser);
      if(!user){
        return;
      }
      await updateProfile(user, data);
      await firestoreUser.update({
        username: user.displayName || undefined,
        picture: user.photoURL || undefined
      });
    },
    getRef() {
      return firestoreUser.getRef();
    }
  };
}
