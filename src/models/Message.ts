import type { DocumentData, FirestoreDataConverter } from 'firebase/firestore';

export class MessageData {

  public text: string;

  constructor(data: DocumentData){
    this.text = data.text;
  }
}

// Firestore data converter
export const messageConverter: FirestoreDataConverter<MessageData> = {
  toFirestore(data) {
    return JSON.parse(JSON.stringify(data));
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return new MessageData(data);
  }
};
