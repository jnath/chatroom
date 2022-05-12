import type { DocumentData, FirestoreDataConverter } from 'firebase/firestore';

export class RoomData {

  public id: string;
  public title: string;
  constructor(id: string, data: DocumentData){
    this.id = id;
    this.title = data.title;
  }
}

// Firestore data converter
export const roomConverter: FirestoreDataConverter<RoomData> = {
  toFirestore(data) {
    return JSON.parse(JSON.stringify(data));
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return new RoomData(snapshot.id, data);
  }
};
