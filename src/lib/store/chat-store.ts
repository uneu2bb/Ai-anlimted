"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuid } from "uuid";
import type { Chat, Message, Attachment } from "@/types";
import { DEFAULT_MODEL_ID } from "@/lib/ai/models";

interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  isStreaming: boolean;
  createChat: (modelId?: string) => string;
  setActiveChat: (id: string | null) => void;
  addMessage: (chatId: string, message: Omit<Message, "id" | "createdAt">) => string;
  updateMessage: (chatId: string, messageId: string, updates: Partial<Message>) => void;
  appendToMessage: (chatId: string, messageId: string, text: string) => void;
  deleteChat: (id: string) => void;
  clearChats: () => void;
  setStreaming: (value: boolean) => void;
  updateChatTitle: (chatId: string, title: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: [],
      activeChatId: null,
      isStreaming: false,

      createChat: (modelId = DEFAULT_MODEL_ID) => {
        const id = uuid();
        const now = Date.now();
        const newChat: Chat = {
          id,
          title: "محادثة جديدة",
          messages: [],
          modelId,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          chats: [newChat, ...state.chats],
          activeChatId: id,
        }));
        return id;
      },

      setActiveChat: (id) => set({ activeChatId: id }),

      addMessage: (chatId, message) => {
        const id = uuid();
        const full: Message = { ...message, id, createdAt: Date.now() };
        set((state) => ({
          chats: state.chats.map((c) =>
            c.id === chatId
              ? {
                  ...c,
                  messages: [...c.messages, full],
                  updatedAt: Date.now(),
                  title:
                    c.messages.length === 0 && message.role === "user"
                      ? message.content.slice(0, 40) || "محادثة جديدة"
                      : c.title,
                }
              : c
          ),
        }));
        return id;
      },

      updateMessage: (chatId, messageId, updates) => {
        set((state) => ({
          chats: state.chats.map((c) =>
            c.id === chatId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === messageId ? { ...m, ...updates } : m
                  ),
                  updatedAt: Date.now(),
                }
              : c
          ),
        }));
      },

      appendToMessage: (chatId, messageId, text) => {
        set((state) => ({
          chats: state.chats.map((c) =>
            c.id === chatId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === messageId ? { ...m, content: m.content + text } : m
                  ),
                }
              : c
          ),
        }));
      },

      deleteChat: (id) => {
        set((state) => {
          const remaining = state.chats.filter((c) => c.id !== id);
          return {
            chats: remaining,
            activeChatId:
              state.activeChatId === id ? remaining[0]?.id ?? null : state.activeChatId,
          };
        });
      },

      clearChats: () => set({ chats: [], activeChatId: null }),
      setStreaming: (value) => set({ isStreaming: value }),

      updateChatTitle: (chatId, title) => {
        set((state) => ({
          chats: state.chats.map((c) =>
            c.id === chatId ? { ...c, title, updatedAt: Date.now() } : c
          ),
        }));
      },
    }),
    {
      name: "ai-unlimited-pro-chats",
      partialize: (state) => ({
        chats: state.chats,
        activeChatId: state.activeChatId,
      }),
    }
  )
);
