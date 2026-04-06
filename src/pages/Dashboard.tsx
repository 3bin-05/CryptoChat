import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, KeyRound, ArrowLeft, MoreVertical } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { AppLayout } from '@/components/layout/AppLayout';
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
  const {
    user, rooms, activeRoomId, setActiveRoomId,
    messages, sendMessage, sendImageMessage, createRoom, joinRoom, leaveRoom, typingUsers,
    uploadToCloudinary
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
    <AppLayout>
      <div className="flex w-full h-full divide-x divide-border">
        {/* Room list panel (Middle panel in 3-pane layout) */}
        <div className={`w-full md:w-80 lg:w-96 flex-shrink-0 bg-card overflow-hidden flex flex-col ${activeRoomId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold tracking-tight text-foreground">Messages</h1>
              <div className="flex items-center gap-1">
                <button 
                  className="p-2 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                  title="Join Room"
                  onClick={() => setModalType('join')}
                >
                  <KeyRound className="w-4 h-4" />
                </button>
                <button 
                  className="p-2 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                  title="Create Room"
                  onClick={() => setModalType('create')}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-secondary border border-transparent focus:border-primary/50 rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>
            
            {/* Tabs */}
            <div className="flex gap-1.5 p-1 bg-secondary/50 rounded-lg">
              {tabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                    tab === t.key
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <RoomList rooms={filteredRooms} activeRoomId={activeRoomId} onSelectRoom={setActiveRoomId} />
          </div>
        </div>

        {/* Main Chat area (Right panel) */}
        <div className={`flex-1 flex flex-col bg-background relative min-w-0 ${!activeRoomId ? 'hidden md:flex' : 'flex'}`}>
          {activeRoom ? (
            <>
              {/* Chat header */}
              <div className="h-16 px-6 flex-shrink-0 flex items-center justify-between bg-card border-b border-border shadow-sm">
                <div className="flex items-center gap-3 w-full pr-4 overflow-hidden">
                  <button
                    onClick={() => setActiveRoomId(null)}
                    className="md:hidden mr-1 p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsRoomInfoOpen(true)}
                    className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden hover:opacity-80 transition-opacity"
                  >
                    {activeRoom.roomImage ? (
                      <img src={activeRoom.roomImage} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-semibold text-foreground">{getInitials(activeRoom.roomName)}</span>
                    )}
                  </button>
                  <div 
                    className="cursor-pointer hover:opacity-80 transition-opacity min-w-0"
                    onClick={() => setIsRoomInfoOpen(true)}
                  >
                    <h2 className="text-[15px] font-semibold text-foreground truncate">{activeRoom.roomName}</h2>
                    <p className="text-[13px] text-muted-foreground truncate">
                      {activeRoom.members.length} member{activeRoom.members.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus:outline-none">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-popover border-border shadow-md">
                      <DropdownMenuItem 
                        onClick={handleLeaveRoom}
                        className="text-destructive focus:text-destructive cursor-pointer"
                      >
                        Exit Conversation
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex-1 overflow-hidden relative flex flex-col min-h-0 bg-background">
                <div className="flex-1 overflow-y-auto">
                  <ChatMessages messages={activeMessages} />
                </div>
                <div className="flex-shrink-0">
                  <TypingIndicator users={activeTyping} />
                  <div className="p-4 bg-background">
                    <ChatInput 
                      onSend={text => sendMessage(activeRoom.roomId, text)}
                      onSendImage={async (file, caption) => {
                        const imageUrl = await uploadToCloudinary(file, 'chat-images');
                        await sendImageMessage(activeRoom.roomId, imageUrl, caption);
                      }}
                    />
                  </div>
                </div>
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
    </AppLayout>
  );
};

export default Dashboard;
