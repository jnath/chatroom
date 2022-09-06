import type { UserData } from '$models/User';
import type { DocumentData, DocumentReference, FirestoreDataConverter } from 'firebase/firestore';

export class OneOnOneData {

  public id: string;
  public users: DocumentReference<UserData>[];
  constructor(id: string, data: DocumentData){
    this.id = id;
    this.users = data.users;
  }
}

// Firestore data converter
export const oneOnOneConverter: FirestoreDataConverter<OneOnOneData> = {
  toFirestore(data) {
    return JSON.parse(JSON.stringify(data));
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return new OneOnOneData(snapshot.id, data);
  }
};
