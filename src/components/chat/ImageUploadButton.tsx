import React, { useRef, useState } from 'react';
import { Camera, Image, MoreHorizontal, Camera as CameraIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CameraCaptureModal } from './CameraCaptureModal';

interface ImageUploadButtonProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function ImageUploadButton({ onFileSelect, disabled }: ImageUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

  const handleSelectGallery = () => {
    fileInputRef.current?.click();
  };

  const handleSelectCamera = () => {
    setIsCameraModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    // Reset input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            disabled={disabled}
            className={`p-2 text-[#8696a0] hover:text-[#D1D7DB] transition-colors focus:outline-none ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Attach Image"
          >
            <Camera className="w-[26px] h-[26px]" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-[#233138] border-[#222D34] text-[#E9EDEF] w-40">
          <DropdownMenuItem 
            onClick={handleSelectGallery}
            className="focus:bg-[#182229] focus:text-[#E9EDEF] cursor-pointer"
          >
            <Image className="w-4 h-4 mr-2" />
            Gallery
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleSelectCamera}
            className="focus:bg-[#182229] focus:text-[#E9EDEF] cursor-pointer"
          >
            <CameraIcon className="w-4 h-4 mr-2" />
            Camera
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={onFileSelect}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
