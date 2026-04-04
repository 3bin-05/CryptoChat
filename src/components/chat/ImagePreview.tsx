import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ImagePreviewProps {
  imageFile: File;
  onRemove: () => void;
  caption: string;
  onCaptionChange: (caption: string) => void;
  isSending?: boolean;
}

export function ImagePreview({ imageFile, onRemove, caption, onCaptionChange, isSending }: ImagePreviewProps) {
  const imageUrl = React.useMemo(() => URL.createObjectURL(imageFile), [imageFile]);

  // Clean up object URL on unmount
  React.useEffect(() => {
    return () => URL.revokeObjectURL(imageUrl);
  }, [imageUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute bottom-full left-0 right-0 p-4 bg-[#111B21] border-t border-[#222D34] z-10"
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#222D34] bg-[#202C33]">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[#E9EDEF] truncate max-w-[200px]">
                {imageFile.name}
              </span>
              <span className="text-xs text-[#8696a0]">
                {(imageFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          </div>
          <button
            onClick={onRemove}
            className="p-1.5 text-[#8696a0] hover:text-[#D1D7DB] hover:bg-[#202C33] rounded-full transition-all"
            disabled={isSending}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
