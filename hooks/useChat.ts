'use client';

import { useState, useCallback } from 'react';
import { ChatMessage, LessonContext } from '../lib/openai';

interface UseChatOptions {
  lessonContext: LessonContext;
}

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export function useChat({ lessonContext }: UseChatOptions) {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim()) return;

    // Add user message immediately
    const userChatMessage: ChatMessage = {
      role: 'user',
      content: userMessage.trim(),
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userChatMessage],
      isLoading: true,
      error: null,
    }));

    try {
      // Call our API route
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.trim(),
          lessonContext,
          conversationHistory: chatState.messages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));

    } catch (error) {
      console.error('Chat error:', error);
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to get response. Please try again.',
      }));
    }
  }, [lessonContext, chatState.messages]);

  const clearChat = useCallback(() => {
    setChatState({
      messages: [],
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    messages: chatState.messages,
    isLoading: chatState.isLoading,
    error: chatState.error,
    sendMessage,
    clearChat,
  };
}
