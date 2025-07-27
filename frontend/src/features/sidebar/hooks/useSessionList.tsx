import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const useSessionList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<string[]>([]);

  const getSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/sessions`
      );
      return response.data.sessions as string[];
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getSessions().then((sessions) => {
      setSessions(sessions);
    });
  }, [getSessions]);

  return {
    isLoading,
    sessions,
    refetchSessions: getSessions,
  };
};

export default useSessionList;
