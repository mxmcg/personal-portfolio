'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatInterface() {
  const [lastResponse, setLastResponse] = useState<string>('');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 100) + 'px';
    }
  }, [input]);

  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      role: 'user',
      content: content,
    };

    // Console log for now
    console.log('User message:', userMessage.content);

    // Add to history for context
    const updatedHistory = [...conversationHistory, userMessage];
    setConversationHistory(updatedHistory);

    setInput('');
    setIsLoading(true);

    // Call Claude API
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content, history: conversationHistory }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
      };

      console.log('Assistant response:', assistantMessage.content);

      // Only show the last response, but keep history for context
      setLastResponse(assistantMessage.content);
      setConversationHistory([...updatedHistory, assistantMessage]);
    } catch (error) {
      console.error('Error calling Claude API:', error);
      setLastResponse('Sorry, I encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    await sendMessage(input.trim());
  };

  const handleQuickAction = async (message: string) => {
    if (isLoading) return;
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="mt-8 space-y-4">
      {/* Last Response */}
      {lastResponse && (
        <div className="text-sm text-slate-300 leading-relaxed">
          {lastResponse}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      )}

      {/* Welcome Message */}
      {!lastResponse && !isLoading && (
        <div>
          <p className="text-sm text-slate-400 mb-3">Ask me anything about Max's work</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleQuickAction("Tell me about Max's projects")}
              disabled={isLoading}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50"
            >
              Projects →
            </button>
            <button
              onClick={() => handleQuickAction("What are Max's skills?")}
              disabled={isLoading}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50"
            >
              Skills →
            </button>
            <button
              onClick={() => handleQuickAction("What's Max's experience?")}
              disabled={isLoading}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50"
            >
              Experience →
            </button>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="pt-2">
        <div className={`flex items-center gap-2 border-b-2 transition-colors ${
          isFocused ? 'border-slate-400' : 'border-slate-700'
        }`}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask something..."
            disabled={isLoading}
            rows={1}
            className="flex-1 resize-none bg-transparent py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none disabled:opacity-50 max-h-[80px]"
            style={{ scrollbarWidth: 'thin' }}
            aria-label="Message input"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="pb-2 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
