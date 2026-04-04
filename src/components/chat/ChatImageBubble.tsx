import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { formatTime } from '@/lib/mockData';
import { MessageStatus } from './MessageStatus';
import { getOptimizedCloudinaryUrl } from '@/lib/cloudinaryUtils';
import { Loader2 } from 'lucide-react';

interface ChatImageBubbleProps {
  message: {
    senderId: string;
    senderName: string;
    text: string;
    timestamp: Date;
    status: string;
    imageUrl?: string;
  };
  isSent: boolean;
  isFirstInGroup: boolean;
  onImageClick: (url: string) => void;
}

export function ChatImageBubble({ message, isSent, isFirstInGroup, onImageClick }: ChatImageBubbleProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const optimizedUrl = getOptimizedCloudinaryUrl(message.imageUrl);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative max-w-[250px] overflow-hidden rounded-2xl shadow-sm transition-all duration-200 hover:brightness-110 cursor-pointer ${
        isSent
          ? 'bg-[#005C4B] rounded-br-md'
          : 'bg-[#202C33] rounded-bl-md'
      } ${isFirstInGroup ? 'mt-3' : 'mt-1'}`}
      onClick={() => message.imageUrl && onImageClick(message.imageUrl)}
    >
      <div className="relative p-1.5 pb-0">
        {!isSent && isFirstInGroup && (
          <p className="text-[12.5px] font-semibold text-[#34B7F1] mb-1 px-2.5 pt-1 opacity-95">
            {message.senderName}
          </p>
        )}
        
        <div className="relative aspect-auto min-h-[100px] bg-[#111B21]/50 rounded-xl overflow-hidden group">
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#202C33]/50">
              <Loader2 className="w-8 h-8 text-[#8696a0] animate-spin" />
            </div>
          )}
          
          <img
            src={optimizedUrl}
            alt="Chat"
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>
      </div>

      <div className={`px-2.5 py-1.5 ${message.text ? 'pt-1' : ''}`}>
        {message.text && (
          <p className="text-[14.5px] leading-relaxed text-[#E9EDEF] mb-1 break-words">
            {message.text}
          </p>
        )}
        
        <div className="flex items-center gap-1.5 justify-end mt-0.5">
          <span className="text-[11px] text-white/60 font-normal uppercase">
            {formatTime(message.timestamp)}
          </span>
          {isSent && <MessageStatus status={message.status as any} />}
        </div>
      </div>
    </motion.div>
  );
}
