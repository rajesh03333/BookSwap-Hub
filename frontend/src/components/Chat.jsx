import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const Chat = ({ roomId, user, otherUserId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // 🔥 1. Load old messages (DB)
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/messages/${roomId}`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    };

    if (roomId) fetchMessages();
  }, [roomId]);

  // 🔥 2. Socket connection
  useEffect(() => {
    socket.emit("join_room", roomId);

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, [roomId]);

  // 🔥 3. Send message
  const sendMessage = () => {
    if (!message.trim()) return;

    if (!otherUserId) {
      console.error("otherUserId missing");
      return;
    }

    const data = {
      roomId,
      senderId: user._id,
      receiverId: otherUserId,
      senderName: user.name,
      text: message,
      createdAt: new Date(),
    };

    socket.emit("send_message", data);

    // update UI instantly
    setMessages((prev) => [...prev, data]);
    setMessage("");
  };

  return (
    <div className="max-w-lg mx-auto">
      
      {/* 🔥 Messages */}
      <div className="h-80 overflow-y-auto border p-3 rounded">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 flex ${
              msg.senderId === user._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-xs ${
                msg.senderId === user._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 Input */}
      <div className="flex mt-2 gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border px-3 py-2 rounded"
          placeholder="Type a message..."
        />

        <button
          onClick={sendMessage}
          className="bg-green-500 hover:bg-green-600 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;