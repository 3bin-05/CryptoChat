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
      className={`min-h-[62px] px-2 py-0 border-t border-border flex items-center gap-2 relative z-20 transition-colors bg-card ${
        isDragging ? 'bg-secondary' : ''
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
        <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary flex items-center justify-center pointer-events-none z-30">
          <p className="text-primary font-bold">Drop image here</p>
        </div>
      )}

      <div className="flex items-center">
        <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
          <PopoverTrigger asChild>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all focus:outline-none mb-2 mt-2">
              <Smile className="w-5 h-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent 
            side="top" 
            align="start" 
            className="p-0 border-none bg-transparent shadow-none w-auto mb-2"
          >
            <div className="shadow-lg rounded-xl overflow-hidden bg-card border border-border">
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                theme={Theme.DARK}
                lazyLoadEmojis={true}
                skinTonesDisabled
                searchPlaceHolder="Search emoji"
                width={350}
                height={450}
                style={{
                  '--epr-bg-color': 'hsl(var(--card))',
                  '--epr-category-label-bg-color': 'hsl(var(--card))',
                  '--epr-picker-border-color': 'transparent',
                  '--epr-search-input-bg-color': 'hsl(var(--secondary))',
                  '--epr-search-input-border-color': 'hsl(var(--border))',
                  '--epr-hover-bg-color': 'hsl(var(--secondary))',
                  '--epr-focus-bg-color': 'hsl(var(--secondary))',
                  '--epr-highlight-color': 'hsl(var(--primary))',
                  '--epr-search-input-bg-color-active': 'hsl(var(--secondary))',
                } as React.CSSProperties}
              />
            </div>
          </PopoverContent>
        </Popover>
        
        <ImageUploadButton onFileSelect={handleFileSelect} disabled={isUploading} />
      </div>

      <div className="flex-1 py-2">
        <input
          ref={inputRef}
          value={text}
          onChange={e => {
            setText(e.target.value);
            if (selectedImage) setCaption(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder={selectedImage ? "Add a caption..." : "Message"}
          disabled={isUploading}
          className="w-full bg-secondary border border-transparent rounded-xl px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all disabled:opacity-50"
        />
      </div>

      <div className="w-12 flex justify-center py-2">
        <AnimatePresence mode="wait">
          {(text.trim() || selectedImage) ? (
            <motion.button
              key="send"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              onClick={handleSend}
              disabled={isUploading}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none disabled:opacity-50 transition-all"
            >
              {isUploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-4 h-4 ml-1" />
              )}
            </motion.button>
          ) : (
            <motion.button
              key="mic"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground focus:outline-none transition-all"
            >
              <Mic className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
