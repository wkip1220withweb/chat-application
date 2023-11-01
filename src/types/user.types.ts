import firebase from 'firebase/compat/app';

export type UserT = {
  uid: string;
  displayName: string;
  email: string;
  createdAt: firebase.firestore.Timestamp;
};