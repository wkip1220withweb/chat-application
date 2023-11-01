import firebase from "firebase/compat/app";

export type MessageT = {
  id: string;
  userId: string;
  text: string;
  createdAt: firebase.firestore.Timestamp;
};
