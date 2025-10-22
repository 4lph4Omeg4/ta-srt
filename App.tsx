import React, { useState, useRef, useEffect, useCallback } from 'react';
import { type ChatMessage } from './types';
import { createChatSession } from './services/geminiService';
import type { Chat } from '@google/genai';
import { Logo } from './components/Logo';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const chatSessionRef = useRef<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatSessionRef.current = createChatSession();
  }, []);
  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    
    // Add a placeholder for the model's response
    const modelMessageId = `model-${Date.now()}`;
    setMessages(prev => [...prev, { id: modelMessageId, role: 'model', text: '' }]);

    try {
      if (!chatSessionRef.current) {
        throw new Error("Chat session not initialized");
      }
      
      const stream = await chatSessionRef.current.sendMessageStream({ message: input });

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        setMessages(prev => 
            prev.map(msg => 
                msg.id === modelMessageId ? { ...msg, text: msg.text + chunkText } : msg
            )
        );
      }

    } catch (err) {
      console.error(err);
      const errorMessage = "An ancient wisdom is currently unavailable. Please reflect and try again.";
      setError(errorMessage);
       setMessages(prev => 
            prev.map(msg => 
                msg.id === modelMessageId ? { ...msg, text: errorMessage } : msg
            )
        );
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessage = (msg: ChatMessage) => {
    const isModel = msg.role === 'model';
    
    const modelBubbleStyles = "bg-gray-800/60 backdrop-blur-sm border border-indigo-800/40 text-indigo-200 rounded-bl-none shadow-lg";
    const userBubbleStyles = "bg-slate-700 text-gray-100 rounded-br-none shadow-md";

    return (
      <div key={msg.id} className={`flex ${isModel ? 'justify-start' : 'justify-end'} mb-6 animate-fade-in-slide-up`}>
        <div className={`max-w-xl lg:max-w-2xl px-6 py-4 rounded-2xl ${isModel ? modelBubbleStyles : userBubbleStyles}`}>
          <p className={`whitespace-pre-wrap text-lg md:text-xl leading-relaxed font-medium ${isModel ? 'italic' : ''}`}>{msg.text}</p>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black text-gray-200">
      <header className="p-4 border-b border-gray-700/50 flex justify-center items-center">
        {messages.length > 0 && <Logo isCompact={true} />}
      </header>
      
      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <Logo />
            <p className="mt-8 text-xl text-gray-400 max-w-lg">
              Begin your inner journey. Pose a thought, a feeling, or a question to the void.
            </p>
          </div>
        ) : (
          <div>
            {messages.map(renderMessage)}
            {isLoading && (
               <div className="flex justify-start mb-6 animate-fade-in-slide-up">
                 <div className="max-w-xl px-6 py-4 rounded-2xl bg-gray-800/60 rounded-bl-none">
                    <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse delay-0"></span>
                        <span className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse delay-200"></span>
                        <span className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse delay-400"></span>
                    </div>
                 </div>
               </div>
            )}
          </div>
        )}
      </main>
      
      <footer className="p-4 md:p-6 border-t border-gray-700/50">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center bg-gray-800 border border-gray-700 rounded-2xl p-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What is on your mind?..."
              rows={1}
              className="flex-1 bg-transparent text-lg placeholder-gray-500 focus:outline-none px-4 resize-none"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2 rounded-full text-white bg-indigo-700 hover:bg-indigo-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
          <p className="text-center text-xs text-gray-600 mt-3">
            Powered by Timeline-Alchemy. This is a tool for introspection, not a source of absolute truth.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;