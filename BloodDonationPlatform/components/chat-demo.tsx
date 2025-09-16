"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Chat } from "@/components/ui/chat"

export function ChatDemo() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  return <Chat messages={messages} sendMessage={sendMessage} isGenerating={status === "in_progress"} />
}
