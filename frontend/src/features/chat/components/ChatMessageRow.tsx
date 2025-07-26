import AppText from "@/features/components/AppText";
import { Message } from "@/types/message";
import { cn } from "@/utils/cn";

interface ChatMessageRowProps {
  message: Message;
  style?: string;
}

const ChatMessageRow = ({ message, style }: ChatMessageRowProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        message.role === "user" ? "items-end" : "items-start"
      )}
    >
      <AppText style={style}>{message.content}</AppText>
    </div>
  );
};

export default ChatMessageRow;
