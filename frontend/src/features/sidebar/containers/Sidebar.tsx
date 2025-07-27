"use client";

import AppText from "@/features/components/AppText";
import SidebarItem from "../components/SidebarItem";
import { FaEdit } from "react-icons/fa";
import useSessionList from "../hooks/useSessionList";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import useCreateSession from "../hooks/useCreateSession";

const Sidebar = ({ currentSession }: { currentSession: string }) => {
  const { sessions, isLoading, refetchSessions } = useSessionList();
  const router = useRouter();

  const handleOpenSession = useCallback(
    async (sessionId: string) => {
      router.push(`/ask/${sessionId}`);
    },
    [router]
  );

  const { createSessions } = useCreateSession();

  useEffect(() => {
    if (currentSession) {
      refetchSessions();
    }
  }, [currentSession, handleOpenSession, refetchSessions]);

  const handleCreateSession = useCallback(async () => {
    const sessionId = await createSessions();
    router.push(`/ask/${sessionId}`);
  }, [createSessions, router]);

  return (
    <div className="flex flex-col h-full bg-[#222] w-[200px] px-4 py-10 overflow-y-auto">
      <SidebarItem
        title="New Chat"
        icon={<FaEdit />}
        onClick={handleCreateSession}
      />
      <div className="py-4">
        <AppText style="text-sm">Chats</AppText>
        <div className="flex flex-col gap-1">
          {sessions.reverse().map((session, index) => (
            <SidebarItem
              key={index}
              title={session}
              onClick={() => handleOpenSession(session)}
              textStyle="text-sm"
              isActive={currentSession === session}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
