import type { UserData } from '$models/User';
import type {
  Timestamp,
  DocumentReference,
  DocumentData,
  FirestoreDataConverter,
} from 'firebase/firestore';

export class MessageData {

  public text: string;

  public date: Timestamp;

  public from: DocumentReference<UserData>;

  constructor(data: DocumentData){
    this.text = data.text;
    this.date = data.date;
    this.from = data.from;
  }
}

// Firestore data converter
export const messageConverter: FirestoreDataConverter<MessageData> = {
  toFirestore(data) {
    return {
      text: data.text,
      date: data.date,
      from: data.from
    }
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return new MessageData(data);
  }
};
