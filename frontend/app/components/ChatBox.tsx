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
    <div className="flex flex-col space-y-4 h-[500px] overflow-y-auto mb-4 p-4 bg-muted/30">
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full text-muted-foreground italic">
          Start a conversation about your analysis...
        </div>
      )}
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] px-4 py-2 rounded-lg ${
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-white border border-border text-foreground'
            }`}
          >
            <p className="text-sm">{msg.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatBox;
