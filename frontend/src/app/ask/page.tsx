"use client";

import useCreateSession from "@/features/sidebar/hooks/useCreateSession";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const AskPage = () => {
  const router = useRouter();

  const { createSessions } = useCreateSession();

  const handleCreateSession = useCallback(async () => {
    const sessionId = await createSessions();
    router.push(`/ask/${sessionId}`);
  }, [createSessions, router]);

  return (
    <div className="flex flex-col h-full w-full justify-center items-center">
      <button
        className="bg-blue-100 text-black p-4 rounded-md cursor-pointer"
        onClick={handleCreateSession}
      >
        New Chat
      </button>
    </div>
  );
};

export default AskPage;
