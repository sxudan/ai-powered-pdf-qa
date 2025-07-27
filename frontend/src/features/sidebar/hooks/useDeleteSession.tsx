import axios from "axios";
import { useCallback, useState } from "react";

const useDeleteSession = () => {
  const [isLoading, setIsLoading] = useState(false);

  const deleteSession = useCallback(async (sessionId: string) => {
    try {
      setIsLoading(true);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/session/${sessionId}`
      );
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    deleteSession,
  };
};

export default useDeleteSession;
