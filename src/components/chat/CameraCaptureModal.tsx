import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export function CameraCaptureModal({ isOpen, onClose, onCapture }: CameraCaptureModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const startCamera = useCallback(async () => {
    setIsInitializing(true);
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user', // Default to front camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setError(err.message || 'Could not access camera. Please check your browser permissions.');
      toast.error('Camera permission denied.');
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            onCapture(file);
            onClose();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
        >
          <div className="relative w-full max-w-2xl bg-[#111B21] rounded-2xl overflow-hidden border border-[#222D34] shadow-2xl">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/50 to-transparent">
              <h3 className="text-white font-medium">Take Photo</h3>
              <button 
                onClick={onClose}
                className="p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Viewfinder Area */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              {isInitializing && (
                <div className="flex flex-col items-center gap-4 text-white">
                  <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm font-medium">Starting camera...</p>
                </div>
              )}

              {error && (
                <div className="flex flex-col items-center gap-4 text-center px-10">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <p className="text-[#8696a0] text-sm max-w-xs">{error}</p>
                  <button 
                    onClick={startCamera}
                    className="px-6 py-2 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-all"
                  >
                    Retry
                  </button>
                </div>
              )}

              <video
                ref={videoRef}
                autoPlay
                playsInline
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  stream && !isInitializing ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>

            {/* Footer controls */}
            <div className="p-8 flex items-center justify-center">
              <button
                onClick={handleCapture}
                disabled={!stream || isInitializing}
                className="group relative w-16 h-16 rounded-full border-4 border-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-white transition-all group-hover:scale-90" />
              </button>
            </div>

            {/* Capture helper canvas (hidden) */}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
