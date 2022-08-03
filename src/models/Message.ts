import type { UserData } from '$models/User';
import type { AttachementData } from '$models/Attachement';
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

  public attachements: DocumentReference<AttachementData>[];

  constructor(data: DocumentData){
    this.text = data.text;
    this.date = data.date;
    this.from = data.from;
    this.attachements = data.attachements;
  }
}

// Firestore data converter
export const messageConverter: FirestoreDataConverter<MessageData> = {
  toFirestore(data) {
    return {
      text: data.text,
      date: data.date,
      from: data.from,
      attachements: data.attachements
    }
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return new MessageData(data);
  }
};
