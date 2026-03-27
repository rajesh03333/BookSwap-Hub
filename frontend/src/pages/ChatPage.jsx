import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Chat from "../components/Chat";

const ChatPage = () => {
  const { userId } = useParams();
  const { user } = useAuth();

  const roomId = [user._id, userId].sort().join("_");

  return (
    <Chat
      roomId={roomId}
      user={user}
      otherUserId={userId} // 🔥 PASS THIS
    />
  );
};

export default ChatPage;