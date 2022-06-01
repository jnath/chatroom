
import { getAuth, updateProfile , type User } from 'firebase/auth'
import type { Readable } from 'svelte/store'

import { userConverter, UserData } from '$models/User'
import { createStoreDoc, type StoreFirestoreDocument } from '$stores/firestore'
import { getFirestore } from "firebase/firestore";

export type StoredUser = Readable<UserData> & {
  updateProfile: (data: {
    displayName?: string | null;
    photoURL?: string | null;
  }) => Promise<void>
}

export const getStoredUser = (user: User): StoredUser =>{
  const firestore = getFirestore();
  const {subscribe, set, update}: StoreFirestoreDocument<UserData> = createStoreDoc({
    firestore,
    converter: userConverter,
    paths: ['users', user.uid]
  })

  let firebaseAuthUser:User | null = null;

  const auth = getAuth();
  auth.onAuthStateChanged(async authUser => {
    if(authUser){
      firebaseAuthUser = authUser;
      await set(new UserData(firebaseAuthUser.uid, {
        username: firebaseAuthUser.displayName,
        picture: firebaseAuthUser.photoURL,
        online: true
      }))
    }else{
      firebaseAuthUser = null;
      await update({online: false});
    }
  });

  return {
    subscribe,
    async updateProfile(data){
      if(!firebaseAuthUser){
        return;
      }
      await updateProfile(firebaseAuthUser, data);
      await update({
        username: firebaseAuthUser.displayName || undefined,
        picture: firebaseAuthUser.photoURL || undefined
      });
    }
  };
}
