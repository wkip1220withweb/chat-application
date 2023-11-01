import firebase from "firebase/compat/app";

export type RoomT = {
  id: string;
  name: string;
  createdAt: firebase.firestore.Timestamp;
};
