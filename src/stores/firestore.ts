import { get, writable, type Subscriber, type Unsubscriber } from 'svelte/store';
import {
  addDoc,
  collection,
  doc,
  DocumentReference,
  onSnapshot,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  QuerySnapshot,
  setDoc,
  startAfter,
  startAt,
  updateDoc,
  type Firestore,
  type FirestoreDataConverter,
  type UpdateData
} from 'firebase/firestore';

export { orderBy, where, limit } from 'firebase/firestore';

export type StoreFirestoreCollection<T> = SvelteStore<T[]> & {
  add(doc: T): Promise<void>,
  // next(): Promise<StoreFirestoreCollection<T>>
};

export type StoreFirestoreDocument<T> = SvelteStore<T> & {
  set(doc: T): Promise<void>;
  update(doc: UpdateData<T>): Promise<void>;
  getRef(): DocumentReference<T>
};

export const createStoreDoc = <T>({firestore, converter, paths = [] }:{
  firestore: Firestore,
  converter: FirestoreDataConverter<T>,
  paths: string[] | string
}): StoreFirestoreDocument<T>  => {
  const {set, subscribe} = writable<T>();
  const [path, ...pathSegments] = Array.isArray(paths) ? paths : [paths];
  const docRef = doc(firestore, path, ...pathSegments).withConverter(converter)
  const unsubscribe = onSnapshot(docRef, (doc) => {
    const data = doc.data();
    if(data){
      set(data);
    }
  });

  return {
    subscribe: (run: Subscriber<T>, invalidate): Unsubscriber => {
      const unrun = subscribe(run, invalidate);
      return ()=>{
        unrun();
        unsubscribe();
      }
    },
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
    },
    getRef: ()=>{
      return docRef;
    }
  }
}

const updateWithSnapshot = <T>(snapshot:QuerySnapshot<T>, datas: T[]) => {
  const newData = [...datas];
  const changes = snapshot.docChanges();
  changes
  .forEach((change)=>{
    if(change.type === 'added'){
      if(newData.length > change.newIndex){
        if(change.oldIndex > -1){
          newData.splice(change.oldIndex)
        }
        newData.splice(change.newIndex, 0, change.doc.data())
      } else {
        newData.push(change.doc.data())
      }
    } else if( change.type === 'modified') {
      newData.splice(change.newIndex, 1, change.doc.data())
    } else if( change.type === 'removed') {
      newData.splice(change.oldIndex)
    }
  })
  return [...newData]
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



  // let lastVisible: QueryDocumentSnapshot<T>;
  // const next = async () => {
  //   if(!lastVisible){
  //     throw new Error('next must be call after')
  //   }
  //   const nextQ = query(collectionRef, ...[...queryConstraint, startAfter(lastVisible)]);
  //   onSnapshot(nextQ, (snapshot) => {
  //     console.log('next snap', snapshot);
  //     const changes = snapshot.docChanges();
  //     console.log(changes.map((change)=>change))
  //   });
  //   // get(createStoreCollection({
  //   //   firestore,
  //   //   converter,
  //   //   containtes: [...queryConstraint, startAt(10)],
  //   //   paths
  //   // }))
  // }

  const unsubscribe = onSnapshot(q, (snapshot) => {
    // lastVisible = snapshot.docs[snapshot.docs.length - 1];

    upsateStore((datas)=>{
      return updateWithSnapshot(snapshot, datas);
      // const newData = [...datas];
      // const changes = snapshot.docChanges();
      // changes
      // .forEach((change)=>{
      //   if(change.type === 'added'){
      //     if(newData.length > change.newIndex){
      //       if(change.oldIndex > -1){
      //         newData.splice(change.oldIndex)
      //       }
      //       newData.splice(change.newIndex, 0, change.doc.data())
      //     } else {
      //       newData.push(change.doc.data())
      //     }
      //   } else if( change.type === 'modified') {
      //     newData.splice(change.newIndex, 1, change.doc.data())
      //   } else if( change.type === 'removed') {
      //     newData.splice(change.oldIndex)
      //   }
      // })
      // return [...newData]
    })
  });

  return {
    subscribe: (run: Subscriber<T[]>, invalidate): Unsubscriber => {
      const unrun = subscribe(run, invalidate);
      return ()=>{
        unrun();
        unsubscribe();
      }
    },
    // next,
    async add(doc: T){
      try {
        await addDoc(collectionRef, doc);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  }
}
