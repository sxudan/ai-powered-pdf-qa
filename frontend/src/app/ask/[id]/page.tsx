"use client";

import Chat from "@/features/chat/containers/Chat";
import Sidebar from "@/features/sidebar/containers/Sidebar";
import { useParams } from "next/navigation";

const AskPage = () => {
  const { id } = useParams();

  return (
    <div className="flex flex-row h-screen w-screen w-full max-h-screen">
      <Sidebar currentSession={id as string} />
      <div className="flex-1">
        <Chat sessionId={id as string} />
      </div>
    </div>
  );
};

export default AskPage;
