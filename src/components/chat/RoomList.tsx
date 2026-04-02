import { motion } from 'framer-motion';
import { Room, formatDate, getInitials } from '@/lib/mockData';

interface RoomListProps {
  rooms: Room[];
  activeRoomId: string | null;
  onSelectRoom: (id: string) => void;
}

export function RoomList({ rooms, activeRoomId, onSelectRoom }: RoomListProps) {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin bg-[#111B21]">
      {rooms.map((room, i) => (
        <motion.button
          key={room.roomId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.03 }}
          onClick={() => onSelectRoom(room.roomId)}
          className={`w-full flex items-center gap-3 px-3 py-3 text-left border-b border-[#222D34]/50 transition-all hover:bg-[#202C33] ${
            activeRoomId === room.roomId ? 'bg-[#2A3942] hover:bg-[#2A3942]' : ''
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-[#6a7175] flex items-center justify-center flex-shrink-0 overflow-hidden text-white/90">
            {room.roomImage ? (
              <img src={room.roomImage} alt={room.roomName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-medium">{getInitials(room.roomName)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[16px] font-normal text-[#E9EDEF] truncate flex-1">
                {room.roomName}
              </h3>
              {room.lastMessageTime && (
                <span className={`text-[12px] flex-shrink-0 ${room.unreadCount > 0 ? 'text-[#25D366]' : 'text-[#8696a0]'}`}>
                  {formatDate(room.lastMessageTime)}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between mt-0.5 gap-2">
              <p className="text-[14px] text-[#8696a0] truncate flex-1 leading-5">
                {room.lastMessage || 'No messages yet'}
              </p>
              {room.unreadCount > 0 && (
                <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-[#25D366] text-[#0B141A] text-[12px] font-bold flex items-center justify-center shadow-sm">
                  {room.unreadCount > 99 ? '99+' : room.unreadCount}
                </span>
              )}
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
