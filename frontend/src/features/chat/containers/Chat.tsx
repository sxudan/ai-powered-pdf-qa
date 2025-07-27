"use client";

import ChatBox from "../components/ChatBox";
import useQA from "../hooks/useQA";
import useUploadFile from "../hooks/useUploadFile";
import ChatMessages from "./ChatMessages";

const Chat = ({ sessionId }: { sessionId: string }) => {
  const { handleFileUpload, isUploading, fileUploaded } =
    useUploadFile(sessionId);
  const { isLoading, handleAsk, messages } = useQA();

  return (
    <div className="items-center justify-center h-screen relative flex flex-col justify-center">
      <div className="h-full w-[30%] relative">
        <div className="absolute bottom-[180px] flex justify-center left-0 w-full">
          <ChatMessages messages={messages} loading={isLoading} />
        </div>
        <div className="absolute bottom-10 w-full px-4 flex justify-center h-[100px] left-0">
          <ChatBox
            onFileChange={handleFileUpload}
            onMessageSend={(question) => handleAsk(question, sessionId)}
            status={
              fileUploaded
                ? "File uploaded successfully"
                : isUploading
                ? "Uploading..."
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
