"use client";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { ChatInterface } from "@/components/chat/ChatInterface";

export default function Home() {
  return (
    <div className="flex h-screen bg-[#07080d] text-white overflow-hidden">
      <Sidebar />
      <ChatInterface />
    </div>
  );
}
