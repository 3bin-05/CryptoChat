import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useChat } from '@/context/ChatContext';
import { Message, formatTime } from '@/lib/mockData';
import { MessageStatus } from './MessageStatus';
import { ChatImageBubble } from './ChatImageBubble';
import { ImageLightboxModal } from './ImageLightboxModal';

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const { user } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const renderDateSeparator = (date: Date, prevDate?: Date) => {
    const d1 = new Date(date).setHours(0, 0, 0, 0);
    const d2 = prevDate ? new Date(prevDate).setHours(0, 0, 0, 0) : null;

    if (d1 !== d2) {
      const day = new Date(d1);
      const today = new Date().setHours(0, 0, 0, 0);
      const yesterday = new Date(today - 86400000).setHours(0, 0, 0, 0);

      let label = day.toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' });
      if (d1 === today) label = 'TODAY';
      else if (d1 === yesterday) label = 'YESTERDAY';

      return (
        <div className="w-full flex justify-center my-6 sticky top-0 z-20 pointer-events-none">
          <span className="px-3 py-1.5 rounded-lg bg-[#182229] text-[12.5px] font-medium text-[#8696a0] uppercase shadow-sm">
            {label}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 flex flex-col w-full relative">
      {messages.map((msg, i) => {
        const isSent = msg.senderId === user.uid;
        const isNewSender = i === 0 || messages[i - 1].senderId !== msg.senderId;
        const isNewDay = i === 0 || new Date(messages[i-1].timestamp).setHours(0,0,0,0) !== new Date(msg.timestamp).setHours(0,0,0,0);
        const isFirstInGroup = isNewSender || isNewDay;

        return (
          <div key={msg.id} className="w-full flex flex-col">
            {renderDateSeparator(msg.timestamp, i > 0 ? messages[i - 1].timestamp : undefined)}
            
            <div className={`w-full flex ${isSent ? 'justify-end' : 'justify-start'}`}>
              {msg.type === 'image' ? (
                <ChatImageBubble
                  message={msg}
                  isSent={isSent}
                  isFirstInGroup={isFirstInGroup}
                  onImageClick={(url) => setLightboxUrl(url)}
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.1 }}
                  className={`relative max-w-[70%] min-w-[80px] px-4 py-2 rounded-2xl shadow-sm transition-all duration-200 hover:brightness-110 cursor-default ${
                    isSent
                      ? 'bg-[#005C4B] text-white rounded-br-md'
                      : 'bg-[#202C33] text-[#E9EDEF] rounded-bl-md'
                  } ${isFirstInGroup ? 'mt-3' : 'mt-1'}`}
                >
                  {!isSent && isFirstInGroup && (
                    <p className="text-[12.5px] font-semibold text-[#34B7F1] mb-1 opacity-95">{msg.senderName}</p>
                  )}
                  
                  <div className="flex flex-wrap items-end gap-x-3">
                    <p className="text-[14.5px] leading-relaxed flex-1 break-words">{msg.text}</p>
                    <div className="flex items-center gap-1.5 ml-auto mt-1 -mb-0.5">
                      <span className="text-[11px] text-white/60 font-normal uppercase">{formatTime(msg.timestamp)}</span>
                      {isSent && <MessageStatus status={msg.status} />}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} className="h-4 w-full shrink-0" />

      <ImageLightboxModal
        isOpen={!!lightboxUrl}
        imageUrl={lightboxUrl}
        onClose={() => setLightboxUrl(null)}
      />
    </div>
  );
}
