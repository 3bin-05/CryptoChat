import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Smile, Mic, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker, { Theme, EmojiClickData } from 'emoji-picker-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ImageUploadButton } from './ImageUploadButton';
import { ImagePreview } from './ImagePreview';
import { toast } from 'sonner';

interface ChatInputProps {
  onSend: (text: string) => void;
  onSendImage?: (file: File, caption: string) => Promise<void>;
}

export function ChatInput({ onSend, onSendImage }: ChatInputProps) {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (selectedImage) {
      if (!onSendImage) return;
      setIsUploading(true);
      try {
        await onSendImage(selectedImage, caption);
        setSelectedImage(null);
        setCaption('');
      } catch (error: any) {
        toast.error(error.message || 'Failed to send image');
      } finally {
        setIsUploading(false);
      }
    } else if (text.trim()) {
      onSend(text.trim());
      setText('');
    }
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

  const handleFileSelect = (file: File) => {
    // Validate
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG and WEBP images are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }
    setSelectedImage(file);
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  }, []);

  return (
    <div 
      className={`min-h-[62px] px-3 py-2 bg-[#202C33] flex items-center gap-2 relative z-20 transition-colors ${
        isDragging ? 'bg-[#2A3942]' : ''
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <AnimatePresence>
        {selectedImage && (
          <ImagePreview
            imageFile={selectedImage}
            caption={caption}
            onCaptionChange={setCaption}
            onRemove={() => setSelectedImage(null)}
            isSending={isUploading}
          />
        )}
      </AnimatePresence>

      {isDragging && (
        <div className="absolute inset-0 bg-[#00a884]/10 border-2 border-dashed border-[#00a884] flex items-center justify-center pointer-events-none z-30">
          <p className="text-[#00a884] font-medium">Drop image here</p>
        </div>
      )}

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
        
        <ImageUploadButton onFileSelect={handleFileSelect} disabled={isUploading} />
      </div>

      <div className="flex-1">
        <input
          ref={inputRef}
          value={text}
          onChange={e => {
            setText(e.target.value);
            if (selectedImage) setCaption(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder={selectedImage ? "Add a caption..." : "Type a message"}
          disabled={isUploading}
          className="w-full bg-[#2A3942] rounded-lg px-4 py-2.5 text-[15px] text-[#D1D7DB] placeholder:text-[#8696a0] focus:outline-none transition-all disabled:opacity-50"
        />
      </div>

      <div className="w-12 flex justify-center">
        <AnimatePresence mode="wait">
          {(text.trim() || selectedImage) ? (
            <motion.button
              key="send"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              onClick={handleSend}
              disabled={isUploading}
              className="text-[#8696a0] hover:text-[#D1D7DB] focus:outline-none disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 className="w-[26px] h-[26px] animate-spin" />
              ) : (
                <Send className="w-[26px] h-[26px]" />
              )}
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
