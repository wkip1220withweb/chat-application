import { useState } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (roomName: string) => void;
};

const Modal = ({ isOpen, onClose, onSubmit }: ModalProps) => {
  const [roomName, setRoomName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(roomName);
    setRoomName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 p-4 rounded-lg relative">
        <button
          type="button"
          onClick={() => {
            onClose();
            setRoomName("");
          }}
          className="text-white text-lg absolute top-0 left-0 m-4"
        >
          &times;
        </button>
        <form onSubmit={handleSubmit}>
          <div className="mt-10">
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
              className="p-2 rounded w-full text-black"
              placeholder="Room Name"
            />
          </div>
          <div className="mt-4 flex justify-center">
            <button
              type="submit"
              className={`px-4 py-2 rounded text-white ${
                roomName.length < 5
                  ? "bg-purple-300 cursor-not-allowed"
                  : "bg-purple-500"
              }`}
              disabled={roomName.length < 5}
            >
              Create Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
