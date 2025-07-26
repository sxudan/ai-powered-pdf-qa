"use client";
import { cn } from "@/utils/cn";
import { useCallback, useRef, useState } from "react";
import { IoIosAttach } from "react-icons/io";

interface ChatBoxProps {
  onFileChange: (file: File) => void;
  onMessageSend: (message: string) => void;
  status?: string;
  disabled?: boolean;
}

const ChatBox = ({ onFileChange, onMessageSend, status, disabled }: ChatBoxProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");

  const onFileClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        onFileChange(file);
      }
    },
    [onFileChange]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        onMessageSend(message);
        setMessage("");
      }
    },
    [message, onMessageSend]
  );

  return (
    <div className="w-full max-w-md bg-[#303030] rounded-lg p-4 gap-2 flex flex-col">
      <input
        type="text"
        placeholder="Ask a question"
        className={cn("w-full p-2 rounded-md outline-none", disabled && "opacity-50 cursor-not-allowed")}
        onKeyDown={handleKeyDown}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={disabled}
      />
      <div className="flex items-center gap-2 cursor-pointer flex-row gap-2">
        <IoIosAttach size={20} onClick={onFileClick} />
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileInputChange}
        />
        {status && <p className="text-sm text-gray-500">{status}</p>}
      </div>
    </div>
  );
};

export default ChatBox;
