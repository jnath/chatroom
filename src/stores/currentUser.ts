import { userConverter, UserData } from '$models/User'
import { createStoreDoc, type StoreFirestoreDocument } from '$stores/firestore'
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";

export const getCurrentUser = ()=>{
  const auth = getAuth();
  const firestore = getFirestore();
  let currentUser: StoreFirestoreDocument<UserData> | undefined;

  const unsub = auth.onAuthStateChanged(async user => {
    if (user) {
      currentUser = createStoreDoc({
        firestore,
        converter: userConverter,
        paths: ['users', user.uid]
      })

      currentUser.set(new UserData(user.uid, {
        username: user.displayName,
        picture: user.photoURL,
        online: true
      }))

      console.log(user, auth.currentUser);
    } else {
      currentUser?.update({ online: false })
    }
  });

  return {
    currentUser,
    unsubscrib: () => {
      unsub();
    }
  }
}
