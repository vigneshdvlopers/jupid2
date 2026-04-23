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
    <div className="flex flex-col space-y-4 h-[500px] overflow-y-auto mb-4 p-4 border border-gray-100 rounded-lg bg-gray-50">
      {messages.length === 0 && (
        <div className="text-center text-gray-400 mt-20">
          Start a conversation about your analysis...
        </div>
      )}
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] rounded-lg px-4 py-2 ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
            }`}
          >
            {msg.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatBox;
