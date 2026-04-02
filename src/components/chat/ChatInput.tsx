import { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker, { Theme, EmojiClickData } from 'emoji-picker-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ChatInputProps {
  onSend: (text: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setText(prev => prev + emojiData.emoji);
    inputRef.current?.focus();
  };

  return (
    <div className="px-3 py-2.5 bg-[#202C33] flex items-center gap-2 relative z-20">
      <div className="flex items-center">
        <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
          <PopoverTrigger asChild>
            <button className="p-2 text-[#8696a0] hover:text-[#D1D7DB] transition-colors focus:outline-none">
              <Smile className="w-[26px] h-[26px]" />
            </button>
          </PopoverTrigger>
          <PopoverContent 
            side="top" 
            align="start" 
            className="p-0 border-none bg-transparent shadow-none w-auto mb-2"
          >
            <div className="shadow-2xl rounded-xl overflow-hidden border border-[#222D34]">
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                theme={Theme.DARK}
                lazyLoadEmojis={true}
                skinTonesDisabled
                searchPlaceHolder="Search emoji"
                width={350}
                height={450}
                style={{
                  '--epr-bg-color': '#111B21',
                  '--epr-category-label-bg-color': '#111B21',
                  '--epr-picker-border-color': '#222D34',
                  '--epr-search-input-bg-color': '#202C33',
                  '--epr-search-input-border-color': 'transparent',
                  '--epr-hover-bg-color': '#202C33',
                  '--epr-focus-bg-color': '#202C33',
                  '--epr-highlight-color': '#00a884',
                  '--epr-search-input-bg-color-active': '#202C33',
                } as React.CSSProperties}
              />
            </div>
          </PopoverContent>
        </Popover>
        
        <button className="p-2 text-[#8696a0] hover:text-[#D1D7DB] transition-colors focus:outline-none">
          <Paperclip className="w-[26px] h-[26px] rotate-45" />
        </button>
      </div>

      <div className="flex-1">
        <input
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message"
          className="w-full bg-[#2A3942] rounded-lg px-4 py-2.5 text-[15px] text-[#D1D7DB] placeholder:text-[#8696a0] focus:outline-none transition-all"
        />
      </div>

      <div className="w-12 flex justify-center">
        <AnimatePresence mode="wait">
          {text.trim() ? (
            <motion.button
              key="send"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              onClick={handleSend}
              className="text-[#8696a0] hover:text-[#D1D7DB] focus:outline-none"
            >
              <Send className="w-[26px] h-[26px]" />
            </motion.button>
          ) : (
            <motion.button
              key="mic"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="text-[#8696a0] hover:text-[#D1D7DB] focus:outline-none"
            >
              <Mic className="w-[26px] h-[26px]" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
