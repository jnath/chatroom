import { writable } from 'svelte/store';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  QueryConstraint,
  setDoc,
  updateDoc,
  type Firestore,
  type FirestoreDataConverter,
  type UpdateData
} from 'firebase/firestore';

export { orderBy, where, limit } from 'firebase/firestore';

export type StoreFirestoreCollection<T> = SvelteStore<T[]> & {
  add(doc: T): Promise<void>
};

export type StoreFirestoreDocument<T> = SvelteStore<T> & {
  set(doc: T): Promise<void>;
  update(doc: UpdateData<T>): Promise<void>;
};

export const createStoreDoc = <T>({firestore, converter, paths = [] }:{
  firestore: Firestore,
  converter: FirestoreDataConverter<T>,
  paths: string[] | string
}): StoreFirestoreDocument<T>  => {
  const {set, subscribe} = writable<T>();
  const [path, ...pathSegments] = Array.isArray(paths) ? paths : [paths];
  const docRef = doc(firestore, path, ...pathSegments).withConverter(converter)
  onSnapshot(docRef, (doc) => {
    const data = doc.data();
    if(data){
      set(data);
    }
  });

  return {
    subscribe,
    async set(doc: T){
      try {
        await setDoc(docRef, doc, {
          merge: true
        });
      } catch (e) {
        console.error("Error setting document: ", e);
      }
    },
    async update(doc: UpdateData<T>){
      try {
        await updateDoc(docRef, doc);
      } catch (e) {
        console.error("Error updating document: ", e);
      }
    }
  }
}

export const createStoreCollection = <T>({firestore, converter, containtes = [], paths = [] }:{
  firestore: Firestore,
  converter: FirestoreDataConverter<T>,
  containtes?: QueryConstraint[] | QueryConstraint,
  paths: string[] | string
}): StoreFirestoreCollection<T>  => {
  const {update: upsateStore, subscribe} = writable<T[]>([]);
  const [path, ...pathSegments] = Array.isArray(paths) ? paths : [paths];
  const collectionRef = collection(firestore, path, ...pathSegments).withConverter(converter);
  const queryConstraint = Array.isArray(containtes) ? containtes : [containtes];
  const q = query(collectionRef, ...queryConstraint);
  onSnapshot(q, (snapshot) => {
    upsateStore((datas)=>{
      const changes = snapshot.docChanges();
      const newData = changes
        .filter((change)=> change.type === 'added')
        .sort((a, b)=> a.newIndex - b.newIndex)
        .map((change) => change.doc.data() as T);

      return [...datas, ...newData]
    })
  });

  return {
    subscribe,
    async add(doc: T){
      try {
        await addDoc(collectionRef, doc);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  }
}
