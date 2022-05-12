import type { DocumentData, FirestoreDataConverter } from 'firebase/firestore';

export class UserData {

  public id: string;
  public name: string;
  public picture: string;

  public online: boolean;
  constructor(id: string, data: DocumentData){
    this.id = id;
    this.name = data.name;
    this.picture = data.picture;
    this.online = data.online;
  }
}

// Firestore data converter
export const userConverter: FirestoreDataConverter<UserData> = {
  toFirestore(data) {
    return JSON.parse(JSON.stringify(data));
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return new UserData(snapshot.id, data);
  }
};
