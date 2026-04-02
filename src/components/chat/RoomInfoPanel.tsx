import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Camera, Edit2, Shield, Eye, EyeOff, 
  Trash2, LogOut, Check, User as UserIcon
} from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { getInitials, Room } from '@/lib/mockData';
import { toast } from 'sonner';

interface RoomInfoPanelProps {
  room: Room;
  isOpen: boolean;
  onClose: () => void;
}

export function RoomInfoPanel({ room, isOpen, onClose }: RoomInfoPanelProps) {
  const { user, allUsers, updateRoom, deleteRoom, uploadRoomImage, leaveRoom } = useChat();
  const isAdmin = room.createdBy === user.uid;
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(room.roomName);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState(room.password || '');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const roomMembers = allUsers.filter(u => room.members.includes(u.uid));

  const handleUpdateName = async () => {
    if (!newName.trim() || newName === room.roomName) {
      setIsEditingName(false);
      return;
    }
    try {
      await updateRoom(room.roomId, { roomName: newName.trim() });
      setIsEditingName(false);
      toast.success('Room name updated');
    } catch (error) {
      toast.error('Failed to update room name');
    }
  };

  const handleUpdatePassword = async () => {
    try {
      await updateRoom(room.roomId, { password: newPassword });
      setIsEditingPassword(false);
      toast.success('Password updated');
    } catch (error) {
      toast.error('Failed to update password');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      toast.loading('Uploading image...');
      await uploadRoomImage(room.roomId, file);
      toast.dismiss();
      toast.success('Room image updated');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to upload image');
    }
  };

  const handleDeleteRoom = async () => {
    if (!confirm('Are you absolutely sure? This will delete all messages and remove the room for everyone.')) return;
    try {
      await deleteRoom(room.roomId);
      onClose();
      toast.success('Room deleted');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete room');
    }
  };

  const handleLeaveRoom = async () => {
    if (!confirm('Are you sure you want to leave this room?')) return;
    try {
      await leaveRoom(room.roomId);
      onClose();
      toast.success('You left the room');
    } catch (error) {
      toast.error('Failed to leave room');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#111B21] border-l border-[#222D34] z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="h-16 flex items-center px-4 gap-6 bg-[#202C33]">
              <button 
                onClick={onClose}
                className="p-1 rounded-full text-[#8696a0] hover:text-[#D1D7DB] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-[17px] font-medium text-[#E9EDEF]">Room info</h2>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {/* Profile Image & Name Section */}
              <div className="flex flex-col items-center py-6 px-4 bg-[#111B21] shadow-sm">
                <div className="relative group mb-6">
                  <div className="w-40 h-40 rounded-full bg-[#6a7175] flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-[#25D366]/50 transition-all shadow-xl">
                    {room.roomImage ? (
                      <img src={room.roomImage} alt={room.roomName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl font-medium text-white/90">{getInitials(room.roomName)}</span>
                    )}
                  </div>
                  
                  {isAdmin && (
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                    >
                      <Camera className="w-8 h-8 mb-1" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">Change photo</span>
                    </button>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                  />
                </div>

                {isEditingName ? (
                  <div className="flex items-center w-full gap-2 border-b-2 border-[#25D366] pb-1 animate-in slide-in-from-bottom-2 duration-200">
                    <input
                      autoFocus
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleUpdateName()}
                      className="bg-transparent text-xl font-normal text-[#E9EDEF] outline-none flex-1"
                    />
                    <button onClick={handleUpdateName} className="text-[#25D366]">
                      <Check className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group">
                    <h3 className="text-xl font-normal text-[#E9EDEF]">{room.roomName}</h3>
                    {isAdmin && (
                      <button 
                        onClick={() => setIsEditingName(true)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-[#8696a0] hover:text-[#D1D7DB] transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
                
                <p className="text-[13px] text-[#8696a0] mt-1 uppercase tracking-tight">
                  Group • {room.members.length} members
                </p>
              </div>

              {/* Security Section (Admin Only) */}
              {isAdmin && (
                <div className="mt-2 py-4 bg-[#111B21] border-t border-b border-[#222D34]/30">
                  <div className="px-6 flex items-center gap-6 text-[#8696a0] mb-3">
                    <Shield className="w-5 h-5" />
                    <span className="text-[14px] font-medium tracking-wide">Security</span>
                  </div>
                  
                  <div className="px-6 space-y-4">
                    <div className="flex flex-col gap-1 ml-11">
                      <p className="text-[13px] text-[#8696a0]">Room Password</p>
                      
                      {isEditingPassword ? (
                        <div className="flex items-center gap-2 border-b border-[#25D366] pb-1 mt-1">
                          <input
                            autoFocus
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="bg-transparent text-[15px] text-[#E9EDEF] outline-none flex-1"
                          />
                          <button onClick={handleUpdatePassword} className="text-[#25D366]">
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between group">
                          <div className="flex items-center gap-2">
                             <span className="text-[16px] text-[#E9EDEF] font-mono">
                               {showPassword ? (room.password || 'None') : '••••••••'}
                             </span>
                             <button 
                               onClick={() => setShowPassword(!showPassword)}
                               className="p-1 px-2 text-[10px] uppercase font-bold text-[#25D366] hover:bg-[#25D366]/10 rounded-md transition-colors"
                             >
                               {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                             </button>
                          </div>
                          <button 
                            onClick={() => setIsEditingPassword(true)}
                            className="text-[#8696a0] hover:text-[#D1D7DB] transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Members Section */}
              <div className="mt-2 py-4 bg-[#111B21]">
                <div className="px-6 text-[#8696a0] text-[14px] font-medium mb-4 flex justify-between items-center">
                  <span>{room.members.length} members</span>
                </div>
                
                <div className="space-y-0.5">
                  {roomMembers.map(m => (
                    <div key={m.uid} className="flex items-center gap-4 px-6 py-2.5 hover:bg-[#202C33] cursor-default transition-colors">
                      <div className="w-10 h-10 rounded-full bg-[#6a7175] flex items-center justify-center overflow-hidden text-xs">
                        {m.avatar ? <img src={m.avatar} className="w-full h-full object-cover" /> : <UserIcon className="w-5 h-5 text-white/50" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] text-[#E9EDEF] truncate">
                          {m.name} {m.uid === user.uid && <span className="text-[11px] text-[#8696a0] ml-1">(You)</span>}
                        </p>
                        {m.uid === room.createdBy && (
                          <span className="text-[10px] bg-[#25D366]/10 text-[#25D366] px-1.5 py-0.5 rounded border border-[#25D366]/20 uppercase font-bold tracking-wider">Group Admin</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Section */}
              <div className="mt-2 py-2 mb-10">
                <button 
                  onClick={handleLeaveRoom}
                  className="w-full flex items-center gap-6 px-6 py-4 text-[#EA5656] hover:bg-[#202C33] transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-[16px]">Exit group</span>
                </button>
                
                {isAdmin && (
                  <button 
                    onClick={handleDeleteRoom}
                    className="w-full flex items-center gap-6 px-6 py-4 text-[#EA5656] hover:bg-[#202C33] transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="text-[16px]">Delete group</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
