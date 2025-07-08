import { useState, useRef, useEffect, useCallback } from 'react';
import { Message, Role, GenerationConfig, UploadedImage } from '../types';
import { generateStream } from '../services/geminiService';
import { Content } from '@google/genai';

const initialBotMessage: Message = {
  id: 'initial-bot-message',
  role: Role.BOT,
  text: 'Hello! As a software testing expert, I can help you create test cases, plans, and strategies. What are you working on today?'
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<GenerationConfig>({
    temperature: 0.7,
    maxOutputTokens: 2048,
    isThinkingEnabled: true,
  });
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);

  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTo({ top: chatWindowRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    const userMessageId = `user-${Date.now()}`;
    const userMessage: Message = { id: userMessageId, role: Role.USER, text };
    
    // Add user message and a bot placeholder for streaming
    setMessages(prev => [...prev, userMessage, { id: `bot-${Date.now()}`, role: Role.BOT, text: '' }]);
    
    const imageToSend = uploadedImage;
    setUploadedImage(null);

    try {
      // Prepare history for the API call, excluding the initial UI greeting
      const history: Content[] = messages
        .filter(msg => msg.id !== 'initial-bot-message')
        .map(msg => ({
          role: msg.role === Role.USER ? 'user' : 'model',
          parts: [{ text: msg.text }],
        }));

      const responseStream = await generateStream(history, text, imageToSend, config);
      
      let botResponse = '';
      for await (const chunk of responseStream) {
        const chunkText = chunk.text;
        if (chunkText) {
          botResponse += chunkText;
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.role === Role.BOT) {
              return [...prev.slice(0, -1), { ...lastMessage, text: botResponse }];
            }
            return prev;
          });
        }
      }
      
      if (!botResponse) {
          throw new Error("Received an empty response from the AI.");
      }

    } catch (e: any) {
      console.error(e);
      const errorMessage = e.message || 'Sorry, something went wrong. Please try again.';
      setError(errorMessage);
      setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.role === Role.BOT) {
              return [...prev.slice(0, -1), { ...lastMessage, text: errorMessage, isError: true }];
          }
          return [...prev, {id: `err-${Date.now()}`, role: Role.BOT, text: errorMessage, isError: true}];
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, config, uploadedImage]);

  return {
    messages,
    isLoading,
    error,
    handleSendMessage,
    chatWindowRef,
    config,
    setConfig,
    uploadedImage,
    setUploadedImage
  };
};
