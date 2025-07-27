import { Message } from "@/types/message";
import axios from "axios";
import { useCallback, useState } from "react";

const useQA = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const ask = useCallback(async (question: string, sessionId: string) => {
    if (!question) return;

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/qa`,
        {
          question,
          session_id: sessionId,
        }
      );
      return response.data.answer as string;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAsk = useCallback(
    async (question: string, sessionId: string) => {
      setMessages((prev) => [
        ...prev,
        {
          id: new Date().toISOString(),
          content: question,
          role: "user" as const,
          createdAt: new Date(),
        },
      ]);
      try {
        const answer = await ask(question, sessionId);
        setMessages((prev) => [
          ...prev,
          {
            id: new Date().toISOString(),
            content: answer ?? "",
            role: "assistant" as const,
            createdAt: new Date(),
          },
        ]);
      } catch (error) {
        console.error(error);
      }
    },
    [ask]
  );

  return {
    handleAsk,
    isLoading,
    messages,
  };
};

export default useQA;
