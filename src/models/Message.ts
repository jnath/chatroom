import { Timestamp, type DocumentData, type FirestoreDataConverter } from 'firebase/firestore';

export class MessageData {

  public text: string;

  public date: Timestamp;

  public userId: string;

  constructor(data: DocumentData){
    this.text = data.text;
    this.date = data.date;
    this.userId = data.userId;
  }
}

// Firestore data converter
export const messageConverter: FirestoreDataConverter<MessageData> = {
  toFirestore(data) {
    return JSON.parse(JSON.stringify(data), (key, value)=>{
      if(key === 'date') {
        return Timestamp.fromMillis(value.seconds * 1000)
      }
      return value;
    });
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return new MessageData(data);
  }
};
