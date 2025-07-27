import axios from "axios";
import { useCallback, useState } from "react";

const useCreateSession = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/session`
      );
      return response.data.session_id as string;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    createSessions,
  };
};

export default useCreateSession;
