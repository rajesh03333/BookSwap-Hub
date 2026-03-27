import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ChatList = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      const res = await fetch(`http://localhost:5000/api/chats/${user._id}`);
      const data = await res.json();

      const uniqueRooms = [...new Set(data.map(m => m.roomId))];

      // 🔥 Fetch user details for each chat
      const chatsWithUsers = await Promise.all(
        uniqueRooms.map(async (room) => {
          const otherUserId = room.split("_").find(id => id !== user._id);

          try {
            const userRes = await fetch(`http://localhost:5000/api/users/${otherUserId}`);
            const userData = await userRes.json();

            return {
              room,
              otherUserId,
              name: userData.name || "Unknown User",
            };
          } catch (err) {
            return {
              room,
              otherUserId,
              name: "Unknown User",
            };
          }
        })
      );

      setRooms(chatsWithUsers);
    };

    if (user?._id) {
      fetchChats();
    }
  }, [user]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Chats</h2>

      {rooms.map((chat) => (
        <div
          key={chat.room}
          onClick={() => navigate(`/chat/${chat.otherUserId}`)}
          className="p-3 border mb-2 cursor-pointer hover:bg-gray-100"
        >
          Chat with {chat.name}
        </div>
      ))}
    </div>
  );
};

export default ChatList;