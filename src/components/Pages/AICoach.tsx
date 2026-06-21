"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCarbonStore } from "@/store/useCarbonStore";
import { Sparkles, Send, HelpCircle } from "lucide-react";

export const AICoach: React.FC = () => {
  const { chatHistory, addChatMessage, ecoPoints } = useCarbonStore();
  const [inputText, setInputText] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  // Suggested prompt chips (10 popular ones from the 25 Q&As)
  const suggestions = [
    "How can I reduce food waste?",
    "Is solar power worth it?",
    "How do I optimize EV charging?",
    "Why does beef have high emissions?",
    "How can I save household electricity?",
    "Why are flights so carbon-heavy?",
    "Is fast fashion bad for the climate?",
    "How does public transit help?",
    "Should I buy local food?",
    "What is the impact of dairy?"
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    addChatMessage(text, "user");
    setInputText("");
  };

  // Scroll container to bottom on new messages (layout-safe via ref and timeout)
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    };

    scrollToBottom(); // Scroll immediately

    // Scroll again after a tiny delay for React render pass and browser paint
    const timer = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timer);
  }, [chatHistory]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-4 md:py-6 flex flex-col gap-4 md:gap-6 h-[calc(100vh-190px)] md:h-[calc(100vh-140px)] min-h-[480px] text-left">
      {/* Header Info */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
            <Sparkles className="text-primary h-6 w-6" />
          </div>
          <div>
            <h3 className="font-headline-md text-headline-md text-base font-bold text-on-surface">CarbonLens Coach</h3>
            <span className="text-xs text-on-surface-variant">AI Sustainability Assistant</span>
          </div>
        </div>
        
        {/* Points Display */}
        <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-2 border border-primary/20">
          <span className="text-[10px] font-label-caps text-on-surface-variant uppercase">Eco Points</span>
          <span className="text-primary font-bold font-data-point">{ecoPoints}</span>
        </div>
      </div>

      {/* Messages Window */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 min-h-0 glass-card rounded-2xl p-4 md:p-6 overflow-y-auto flex flex-col gap-4 custom-scrollbar"
      >
        {chatHistory.map((msg) => {
          const isAI = msg.sender === "ai";
          return (
            <div
              key={msg.id}
              className={`flex flex-col gap-1 max-w-[80%] ${isAI ? "self-start items-start" : "self-end items-end"}`}
            >
              {/* Sender Name */}
              <span className="text-[10px] font-label-caps text-on-surface-variant uppercase px-1">
                {isAI ? "Coach" : "You"}
              </span>
              
              {/* Message Bubble */}
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line border shadow-sm ${
                  isAI
                    ? "bg-surface-container border-white/5 text-on-surface chat-bubble-ai"
                    : "bg-primary/10 border-primary/30 text-on-surface chat-bubble-user"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex flex-nowrap items-center gap-2 shrink-0 overflow-x-auto py-2 custom-scrollbar w-full">
        <span className="text-xs text-on-surface-variant font-label-caps flex items-center gap-1 shrink-0">
          <HelpCircle className="h-3.5 w-3.5" /> Suggested:
        </span>
        {suggestions.map((sug, i) => (
          <button
            key={i}
            onClick={() => handleSend(sug)}
            className="px-3.5 py-1.5 rounded-full border border-white/10 hover:border-primary/40 bg-white/[0.02] hover:bg-primary/5 text-xs text-on-surface hover:text-primary transition-all cursor-pointer font-body-md whitespace-nowrap shrink-0"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="flex gap-3 items-center shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend(inputText)}
          placeholder="Ask Coach about carbon indices, energy, recycling, or green diets..."
          className="flex-1 bg-surface-container border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3.5 text-sm text-on-surface focus:outline-none placeholder:text-on-surface-variant"
        />
        <button
          onClick={() => handleSend(inputText)}
          className="p-3.5 bg-primary text-on-primary rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(78,222,163,0.15)] cursor-pointer"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
