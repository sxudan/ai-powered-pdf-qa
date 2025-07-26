import { Message } from "@/types/message";
import ChatMessageRow from "../components/ChatMessageRow";

type ChatMessagesProps = {
  messages: Message[];
  loading?: boolean;
};

const ChatMessages = ({ messages, loading }: ChatMessagesProps) => {
  return (
    <div className="flex flex-col gap-20 overflow-y-auto h-full w-full">
      {messages.map((message) => (
        <ChatMessageRow key={message.id} message={message} />
      ))}
      {loading && (
        <ChatMessageRow
          message={{
            id: "loading",
            content: "Thinking...",
            role: "assistant",
            createdAt: new Date(),
          }}
          style="text-gray-500"
        />
      )}
    </div>
  );
};

export default ChatMessages;
