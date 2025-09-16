"use client"

import { useState } from "react"
import { MessageCircle, X, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatDemo } from "@/components/chat-demo"
import { cn } from "@/lib/utils"

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  const toggleChat = () => {
    if (isOpen && !isMinimized) {
      setIsOpen(false)
      setIsMinimized(false)
    } else {
      setIsOpen(true)
      setIsMinimized(false)
    }
  }

  const minimizeChat = () => {
    setIsMinimized(true)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={toggleChat}
            className="h-14 w-14 rounded-full bg-red-500 hover:bg-red-600 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <MessageCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
          </Button>
        )}

        {/* Chat Widget */}
        {isOpen && (
          <div
            className={cn(
              "bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300",
              isMinimized ? "w-80 h-16" : "w-96 h-[600px]",
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-red-500 text-white rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">BloodBot</h3>
                  <p className="text-xs opacity-90">Health Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={minimizeChat}
                  className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleChat}
                  className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <div className="h-[calc(600px-80px)]">
                <ChatDemo />
              </div>
            )}

            {/* Minimized State */}
            {isMinimized && (
              <div
                className="flex items-center justify-center h-full cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsMinimized(false)}
              >
                <p className="text-sm text-gray-600">Click to expand chat</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Backdrop for mobile */}
      {isOpen && !isMinimized && <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={toggleChat} />}
    </>
  )
}
