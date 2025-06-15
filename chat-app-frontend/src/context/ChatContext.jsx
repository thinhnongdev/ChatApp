import { createContext, use, useContext, useState } from "react";

const ChatContext = createContext();
export const ChatProvider = ({ children }) => {
  const [roomCode, setRoomCode] = useState("");
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
  return (
    <ChatContext.Provider
      value={{ roomCode, username, connected, setRoomCode, setUsername, setConnected }}
    >
      {children}
    </ChatContext.Provider>
  );
};
const useChatContext = () => useContext(ChatContext);
export default useChatContext;
