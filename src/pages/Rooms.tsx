import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Timestamp } from "firebase/firestore";
import { RoomT } from "../types/room.types";
import { UserT } from "../types/user.types";
import { getUsers } from "../utils/firebase/firestore.utils";

type RoomsProps = {
  rooms: RoomT[];
};

const Rooms = ({ rooms }: RoomsProps) => {
  const [users, setUsers] = useState<UserT[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getUsers();
      if (fetchedUsers) {
        const usersWithUid = fetchedUsers.map((user) => ({
          ...user,
          uid: user.id,
          createdAt: Timestamp.fromDate(new Date(user.createdAt)),
        }));
        setUsers(usersWithUid as UserT[]);
      }
    };
    fetchUsers();
  }, []);

  const goToRoom = (roomId: string) => {
    navigate(`/room/${roomId}`);
  };

  const sortedRooms = [...rooms].sort(
    (a, b) => b.createdAt.seconds - a.createdAt.seconds
  );

  return (
    <div className="container mx-auto p-4 flex flex-col lg:flex-row">
      <div className="flex-grow">
        <h1 className="text-3xl font-bold mb-6">Rooms</h1>
        {sortedRooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => goToRoom(room.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === "Space") {
                    goToRoom(room.id);
                  }
                }}
                role="button"
                tabIndex={0}
                className="p-4 bg-gray-800 rounded-lg cursor-pointer transform hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring focus:border-blue-300 min-h-[100px]"
              >
                <h3 className="text-xl font-semibold mb-2 truncate">
                  {room.name}
                </h3>
                <p className="text-gray-400">
                  {room.createdAt.toDate().toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <h1>No Rooms Available</h1>
            <p className="text-gray-500">Please create a new room</p>
          </div>
        )}
      </div>
      <div className="w-full lg:w-64 mt-4 lg:mt-0 lg:ml-4">
        <h2 className="text-3xl font-bold mb-6">Users</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-4">
          {users.map((user) => (
            <div key={user.uid} className="mb-4">
              <p className="text-lg font-semibold">{user.displayName}</p>
              <p>{user.email}</p>
              <p className="text-gray-400">
                Joined:
                {user.createdAt.toDate().toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rooms;
