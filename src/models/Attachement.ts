import type {
  Timestamp,
  DocumentData,
  FirestoreDataConverter,
} from 'firebase/firestore';

export class AttachementData {

  public name: string;
  public path: string;
  public src: string;

  public date: Timestamp;


  constructor(data: DocumentData){
    this.name = data.text;
    this.path = data.path;
    this.src = data.src;
    this.date = data.date;
  }
}

// Firestore data converter
export const attachementConverter: FirestoreDataConverter<AttachementData> = {
  toFirestore(data) {
    return {
      name: data.name,
      path: data.path,
      src: data.src,
      date: data.date,
    }
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return new AttachementData(data);
  }
};
