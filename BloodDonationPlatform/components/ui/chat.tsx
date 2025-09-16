"use client"

import type React from "react"
import { useState } from "react"

import type { UIMessage } from "ai"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Bot, User } from "lucide-react"
import { useRef, useEffect } from "react"

interface ChatProps {
  messages: UIMessage[]
  sendMessage: (message: { text: string }) => void
  isGenerating: boolean
}

export function Chat({ messages, sendMessage, isGenerating }: ChatProps) {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isGenerating) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    if (!input.trim() || isGenerating) return

    sendMessage({ text: input })
    setInput("")

    // Reset textarea height after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSubmit()
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)

    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = "auto"
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px"
  }

  const getMessageText = (message: UIMessage): string => {
    return message.parts
      .filter((part) => part.type === "text")
      .map((part) => (part as any).text)
      .join("")
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 max-w-[85%] p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="h-4 w-4" />
                <span className="text-xs font-medium">BloodBot</span>
              </div>
              <p className="text-sm leading-relaxed">
                Hello! I'm your health assistant. I can help you with blood donation questions, health tips, and
                emergency guidance. How can I assist you today?
              </p>
              <span className="text-xs opacity-70 mt-2 block">
                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] p-3 rounded-lg ${
                message.role === "user" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-800"
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="h-4 w-4" />
                  <span className="text-xs font-medium">BloodBot</span>
                </div>
              )}
              {message.role === "user" && (
                <div className="flex items-center gap-2 mb-2 justify-end">
                  <span className="text-xs font-medium">You</span>
                  <User className="h-4 w-4" />
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{getMessageText(message)}</p>
              <span className="text-xs opacity-70 mt-2 block">
                {new Date(message.createdAt || new Date()).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 max-w-[80%] p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="h-4 w-4" />
                <span className="text-xs font-medium">BloodBot</span>
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleFormSubmit} className="space-y-2">
          <div className="flex items-end gap-3 p-3 bg-white border border-gray-300 rounded-xl shadow-sm focus-within:border-red-500 focus-within:shadow-md transition-all">
            <Textarea
              ref={textareaRef}
              placeholder="Type your message here..."
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              disabled={isGenerating}
              className="flex-1 resize-none border-0 outline-none bg-transparent text-gray-900 placeholder-gray-400 text-sm leading-6 min-h-[24px] max-h-[120px] overflow-y-auto shadow-none focus-visible:ring-0"
              style={{
                fontFamily:
                  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                direction: "ltr",
                textAlign: "left",
                unicodeBidi: "normal",
              }}
            />
            <Button
              type="submit"
              size="sm"
              disabled={isGenerating || !input.trim()}
              className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">Press Enter to send • Shift+Enter for new line</p>
          </div>
        </form>
      </div>
    </div>
  )
}
