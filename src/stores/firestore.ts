import { writable } from 'svelte/store';
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  type Firestore,
  type FirestoreDataConverter
} from 'firebase/firestore';

export type StoreFirestore<T> = SvelteStore<T[]> & { add(message: T): Promise<void> };

export const create = <T>(
  firestore: Firestore,
  converter: FirestoreDataConverter<T>,
  path:string, ...pathSegments: string[]
): StoreFirestore<T>  => {
  const {update, subscribe} = writable<T[]>([]);
  const collectionRef = collection(firestore, path, ...pathSegments).withConverter(converter);
  const q = query(collectionRef);
  onSnapshot(q, (snapshot) => {
    update((datas)=>{
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
    async add(message: T){
      try {
        await addDoc(collectionRef, message);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  }
}
