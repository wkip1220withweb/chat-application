import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import firebase from "firebase/compat/app";
import { RoomT } from "../../types/room.types";
import { firestore } from "./firebaseConfig";
import { UserAuth } from "../../types/userAuth.types";

export const createUserProfileDocument = async (userAuth: UserAuth | null) => {
  if (!userAuth) return undefined;

  const userRef = doc(firestore, `users/${userAuth.uid}`);
  const snapShot = await getDoc(userRef);

  if (!snapShot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await setDoc(userRef, {
        displayName,
        email,
        createdAt,
      });
    } catch (error) {
      console.error("Error creating user", error);
    }
  }

  return userRef;
};

export const createRoom = async (roomName: string) => {
  try {
    const roomRef = await addDoc(collection(firestore, "rooms"), {
      name: roomName,
      createdAt: Timestamp.fromDate(new Date()),
    });
    const newRoom: RoomT = {
      id: roomRef.id,
      name: roomName,
      createdAt: Timestamp.fromDate(new Date()),
    };
    return newRoom;
  } catch (error) {
    console.error("Error creating room", error);
    return undefined;
  }
};

export const getRooms = async () => {
  const roomsRef = collection(firestore, "rooms");
  const snapshot = await getDocs(roomsRef);
  return snapshot.docs.map((roomDoc) => ({
    id: roomDoc.id,
    ...roomDoc.data(),
  }));
};

export const addUserToRoom = async (roomId: string, user: firebase.User) => {
  try {
    await setDoc(doc(firestore, `rooms/${roomId}/users/${user.uid}`), {
      displayName: user.displayName,
      email: user.email,
    });
  } catch (error) {
    console.error("Error adding user to room", error);
  }
};

export const sendMessage = async (
  roomId: string,
  userId: string,
  text: string
) => {
  try {
    await addDoc(collection(firestore, `rooms/${roomId}/messages`), {
      text,
      userId,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error sending message", error);
  }
};

export const getMessagesInRoom = async (roomId: string) => {
  try {
    const messagesRef = collection(firestore, `rooms/${roomId}/messages`);
    const snapshot = await getDocs(messagesRef);
    return snapshot.docs.map((messageDoc) => ({
      id: messageDoc.id,
      ...messageDoc.data(),
    }));
  } catch (error) {
    console.error("Error getting messages in room", error);
    return undefined;
  }
};

export const getUsers = async () => {
  try {
    const usersRef = collection(firestore, "users");
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map((userDoc) => {
      const data = userDoc.data();
      return {
        id: userDoc.id,
        displayName: data.displayName || "Unknown",
        email: data.email || "Unknown",
        createdAt: data.createdAt || Timestamp.fromDate(new Date()),
      };
    });
  } catch (error) {
    console.error("Error fetching users", error);
    return [];
  }
};
