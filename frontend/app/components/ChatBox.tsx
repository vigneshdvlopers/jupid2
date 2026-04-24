import React from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBoxProps {
  messages: Message[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages }) => {
  return (
    <div className="flex flex-col space-y-6 h-[600px] overflow-y-auto mb-6 p-6 custom-scrollbar">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div className="max-w-xs">
            <p className="text-lg font-display font-semibold">Architect AI</p>
            <p className="text-sm">Ask anything about your market intelligence or competitor trends.</p>
          </div>
        </div>
      )}
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
        >
          <div
            className={`max-w-[85%] px-5 py-3.5 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-tr-none'
                : 'bg-white dark:bg-card text-foreground border border-border rounded-tl-none'
            }`}
          >
            <div className={`text-xs font-semibold mb-1 uppercase tracking-wider opacity-60 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.role === 'user' ? 'Strategy Lead' : 'Architect AI'}
            </div>
            <p className="leading-relaxed text-[15px]">
                {msg.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatBox;
