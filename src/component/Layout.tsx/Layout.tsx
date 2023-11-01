import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { auth } from "../../utils/firebase/firebaseConfig.ts";
import CreateRoomModal from "../../pages/CreateRoomModal.tsx";
import { createRoom } from "../../utils/firebase/firestore.utils.ts";
import { RoomT } from "../../types/room.types.ts";
import { signInWithGoogle } from "../../utils/firebase/auth.utils.ts";
import { UserT } from "../../types/user.types.ts";

type LayoutProps = {
  currentUser: UserT | null;
  // dispatches an action aka describing the function that updates the state.
  setRooms: React.Dispatch<React.SetStateAction<RoomT[]>>;
};

const Layout = ({ currentUser, setRooms }: LayoutProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const handleCreateRoom = async (roomName: string) => {
    try {
      const newRoom = await createRoom(roomName);

      if (newRoom && newRoom.id) {
        setRooms((prevRooms) => {
          if (prevRooms.some((room) => room.id === newRoom.id)) {
            return prevRooms;
          }
          return [...prevRooms, newRoom];
        });
      } else {
        console.error("Failed to create room, no ID received");
      }
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <nav className="border-b border-purple-700 p-4 flex justify-between">
        <Link className="text-purple-500 hover:text-purple-700" to="/">
          Rooms
        </Link>
        {currentUser ? (
          <>
            <button
              className="text-purple-500 hover:text-purple-700"
              type="button"
              onClick={() => setIsModalOpen(true)}
            >
              Create Room
            </button>
            <button
              className="text-purple-500 hover:text-purple-700"
              type="button"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            className="text-purple-500 hover:text-purple-700"
            type="submit"
            onClick={signInWithGoogle}
          >
            Sign in
          </button>
        )}
      </nav>
      <div className="p-4">
        <Outlet />
      </div>
      <CreateRoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateRoom}
      />
    </div>
  );
};

export default Layout;
