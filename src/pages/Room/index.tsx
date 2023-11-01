import { useEffect, useState, useCallback } from "react";
import firebase from "firebase/compat/app";
import { useParams } from "react-router-dom";
import {
  onSnapshot,
  collection,
  doc,
  getDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { firestore } from "../../utils/firebase/firebaseConfig";
import { sendMessage } from "../../utils/firebase/firestore.utils";
import { UserT } from "../../types/user.types";
import { RoomT } from "../../types/room.types";
import { MessageT } from "../../types/message.types";

interface RoomProps {
  currentUser: UserT | null;
}

const Room = ({ currentUser }: RoomProps) => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState<MessageT[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState<Record<string, UserT>>({});
  const [roomName, setRoomName] = useState("");

  const fetchUserData = useCallback(
    async (userId: string) => {
      if (!users[userId]) {
        try {
          const userDoc = doc(firestore, `users/${userId}`);
          const userSnap = await getDoc(userDoc);
          const userData = userSnap.data() as UserT;
          setUsers((prevUsers) => ({ ...prevUsers, [userId]: userData }));
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    },
    [users]
  );

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (roomId) {
      const roomRef = doc(firestore, `rooms/${roomId}`);
      const messageRef = query(
        collection(firestore, `rooms/${roomId}/messages`),
        orderBy("createdAt", "asc")
      );

      const unsubscribeRoom = onSnapshot(roomRef, (roomDoc) => {
        const roomData = roomDoc.data() as RoomT | undefined;
        setRoomName(roomData?.name || "Unknown Room");
      });

      const unsubscribeMessages = onSnapshot(messageRef, (snapshot) => {
        const fetchedMessages = snapshot.docs.map((messageDoc) => {
          const data = messageDoc.data() as MessageT;
          return {
            ...data,
            id: messageDoc.id,
            createdAt: data.createdAt,
          };
        });
        setMessages(fetchedMessages);
        const userIds = [...new Set(fetchedMessages.map((m) => m.userId))];
        userIds.forEach(fetchUserData);
      });

      return () => {
        unsubscribeRoom();
        unsubscribeMessages();
      };
    }
  }, [roomId, fetchUserData]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && currentUser && roomId) {
      await sendMessage(roomId, currentUser.uid, newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{roomName}</h1>
      <div className="mb-6">
        <div>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-2 rounded-lg mb-2 ${
                message.userId === currentUser?.uid
                  ? "bg-purple-500 text-white ml-auto"
                  : "bg-gray-800"
              }`}
              style={{ maxWidth: "60%" }}
            >
              <p className="text-sm">
                <strong>
                  {users[message.userId]?.displayName || "Unknown User"}
                </strong>
                {" - "}
                {message.createdAt instanceof firebase.firestore.Timestamp
                  ? message.createdAt.toDate().toLocaleString()
                  : "Unknown Date"}
              </p>
              <p>{message.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={!currentUser}
          placeholder={!currentUser ? "Please log in to chat" : ""}
          className="flex-grow p-2 rounded-lg border border-gray-300  text-black mr-2"
        />
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={!currentUser || !newMessage.trim()}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Room;
