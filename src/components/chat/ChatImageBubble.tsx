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
      className={`relative max-w-[280px] overflow-hidden rounded-2xl shadow-sm transition-all duration-300 cursor-pointer border ${
        isSent
          ? 'bg-primary border-primary text-primary-foreground rounded-br-sm shadow-sm'
          : 'bg-secondary border-border text-foreground rounded-bl-sm shadow-sm'
      } ${isFirstInGroup ? 'mt-3' : 'mt-1'} group/bubble`}
      onClick={() => message.imageUrl && onImageClick(message.imageUrl)}
    >
      <div className="relative p-1.5 pb-0">
        {!isSent && isFirstInGroup && (
          <p className={`text-[12.5px] font-semibold mb-1 px-2.5 pt-1 opacity-95 ${isSent ? 'text-primary-foreground' : 'text-primary'}`}>
            {message.senderName}
          </p>
        )}
        
        <div className="relative aspect-auto min-h-[100px] bg-black/20 rounded-xl overflow-hidden group/image border border-transparent">
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
              <Loader2 className={`w-8 h-8 animate-spin ${isSent ? 'text-primary-foreground' : 'text-primary'}`} />
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
          
          <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors pointer-events-none" />
        </div>
      </div>

      <div className={`px-2.5 py-1.5 ${message.text ? 'pt-1' : ''}`}>
        {message.text && (
          <p className="text-[14.5px] leading-relaxed mb-1 break-words">
            {message.text}
          </p>
        )}
        
        <div className="flex items-center gap-1.5 justify-end mt-0.5">
          <span className={`text-[11px] font-normal uppercase ${isSent ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
            {formatTime(message.timestamp)}
          </span>
          {isSent && <MessageStatus status={message.status as any} />}
        </div>
      </div>
    </motion.div>
  );
}
