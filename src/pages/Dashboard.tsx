import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Plus, KeyRound, MessageSquare, User as UserIcon,
  Settings, LogOut, Shield, Users, ArrowLeft, MoreVertical, Info,
} from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { RoomList } from '@/components/chat/RoomList';
import { ChatMessages } from '@/components/chat/ChatMessages';
import { ChatInput } from '@/components/chat/ChatInput';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { EmptyState } from '@/components/chat/EmptyState';
import { RoomModal } from '@/components/chat/RoomModal';
import { RoomInfoPanel } from '@/components/chat/RoomInfoPanel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from '@/lib/mockData';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    user, rooms, activeRoomId, setActiveRoomId,
    messages, sendMessage, createRoom, joinRoom, leaveRoom, typingUsers, logout,
  } = useChat();

  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | 'joined' | 'created'>('all');
  const [modalType, setModalType] = useState<'create' | 'join' | null>(null);
  const [isRoomInfoOpen, setIsRoomInfoOpen] = useState(false);

  const activeRoom = rooms.find(r => r.roomId === activeRoomId);
  const activeMessages = activeRoomId ? messages[activeRoomId] || [] : [];
  const activeTyping = activeRoomId ? typingUsers[activeRoomId] || [] : [];

  const filteredRooms = rooms.filter(r => {
    if (search && !r.roomName.toLowerCase().includes(search.toLowerCase())) return false;
    if (tab === 'created') return r.createdBy === user.uid;
    if (tab === 'joined') return r.createdBy !== user.uid;
    return true;
  });

  const tabs = [
    { key: 'all' as const, label: 'All' },
    { key: 'joined' as const, label: 'Joined' },
    { key: 'created' as const, label: 'Created' },
  ];

  const handleLeaveRoom = async () => {
    if (!activeRoomId) return;
    try {
      await leaveRoom(activeRoomId);
      toast.success('You have left the room');
    } catch (error: any) {
      toast.error(error.message || 'Failed to leave room');
    }
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Narrow icon sidebar */}
      <div className="w-16 bg-[#111B21] border-r border-[#222D34] flex flex-col items-center py-4 gap-2">
        <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 flex items-center justify-center mb-4">
          <Shield className="w-5 h-5 text-[#25D366]" />
        </div>
        <NavIcon icon={<MessageSquare className="w-5 h-5" />} active onClick={() => setActiveRoomId(null)} />
        <NavIcon icon={<UserIcon className="w-5 h-5" />} onClick={() => navigate('/profile')} />
        <NavIcon icon={<Settings className="w-5 h-5" />} onClick={() => navigate('/settings')} />
        <div className="flex-1" />
        <NavIcon icon={<LogOut className="w-5 h-5" />} onClick={logout} />
      </div>

      {/* Room list panel */}
      <div className={`w-80 bg-[#111B21] border-r border-[#222D34] flex flex-col ${activeRoomId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-3 bg-[#111B21]">
          <div className="flex items-center justify-between mb-4 mt-1 px-1">
            <h1 className="text-xl font-bold text-[#E9EDEF]">Chats</h1>
            <div className="flex gap-2">
              <button 
                className="p-1.5 text-[#8696a0] hover:bg-[#202C33] rounded-full transition-colors"
                title="Join Room"
                onClick={() => setModalType('join')}
              >
                <KeyRound className="w-5 h-5" />
              </button>
              <button 
                className="p-1.5 text-[#8696a0] hover:bg-[#202C33] rounded-full transition-colors"
                title="Create Room"
                onClick={() => setModalType('create')}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8696a0]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search or start new chat"
              className="w-full bg-[#202C33] rounded-lg pl-10 pr-4 py-1.5 text-[14px] text-[#D1D7DB] placeholder:text-[#8696a0] focus:outline-none transition-colors border-none"
            />
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 mb-2 px-1">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-3 py-1 rounded-full text-[13px] font-medium transition-all ${
                  tab === t.key
                    ? 'bg-[#005C4B] text-[#E9EDEF]'
                    : 'bg-[#202C33] text-[#8696a0] hover:bg-[#2A3942]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <RoomList rooms={filteredRooms} activeRoomId={activeRoomId} onSelectRoom={setActiveRoomId} />
      </div>

      {/* Chat area */}
      <div className={`flex-1 flex flex-col relative ${!activeRoomId ? 'hidden md:flex' : 'flex'}`}>
        {activeRoom ? (
          <>
            {/* Background Layering: Doodle -> Logo -> Messages */}
            <div className="absolute inset-0 chat-bg-pattern pointer-events-none z-0 opacity-[0.3] contrast-[1.4] brightness-[0.7]" />
            
            {/* Centered Logo Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5]">
               <img src="/cryptochat.png" alt="" className="w-1/2 max-w-lg grayscale brightness-200 opacity-[0.05]" />
            </div>
            
            {/* Chat header */}
            <div className="h-16 px-4 flex items-center justify-between bg-card border-b border-border/50 relative z-10">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveRoomId(null)}
                  className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsRoomInfoOpen(true)}
                  className="w-10 h-10 rounded-full bg-[#6a7175] flex items-center justify-center overflow-hidden border border-[#222D34]/50 hover:opacity-80 transition-opacity"
                >
                  {activeRoom.roomImage ? (
                    <img src={activeRoom.roomImage} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-semibold text-white/90">{getInitials(activeRoom.roomName)}</span>
                  )}
                </button>
                <div 
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setIsRoomInfoOpen(true)}
                >
                  <h2 className="text-[15px] font-semibold text-foreground leading-tight">{activeRoom.roomName}</h2>
                  <p className="text-[12px] text-muted-foreground">
                    {activeRoom.members.length} members
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                  <Search className="w-5 h-5" />
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus:outline-none">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem 
                      onClick={handleLeaveRoom}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Exit Room
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex-1 relative z-10 flex flex-col">
              <ChatMessages messages={activeMessages} />
              <TypingIndicator users={activeTyping} />
              <ChatInput onSend={text => sendMessage(activeRoom.roomId, text)} />
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Modals */}
      <RoomModal
        type="create"
        isOpen={modalType === 'create'}
        onClose={() => setModalType(null)}
        onCreate={createRoom}
      />
      <RoomModal
        type="join"
        isOpen={modalType === 'join'}
        onClose={() => setModalType(null)}
        onJoin={joinRoom}
      />

      {activeRoom && (
        <RoomInfoPanel 
          room={activeRoom}
          isOpen={isRoomInfoOpen}
          onClose={() => setIsRoomInfoOpen(false)}
        />
      )}
    </div>
  );
};

function NavIcon({ icon, active, onClick }: { icon: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
        active
          ? 'bg-[#25D366]/10 text-[#25D366]'
          : 'text-[#8696a0] hover:text-[#D1D7DB] hover:bg-[#202C33]'
      }`}
    >
      {icon}
    </button>
  );
}

export default Dashboard;
