import { motion } from 'framer-motion';
import { Room, formatDate, getInitials } from '@/lib/mockData';

interface RoomListProps {
  rooms: Room[];
  activeRoomId: string | null;
  onSelectRoom: (id: string) => void;
}

export function RoomList({ rooms, activeRoomId, onSelectRoom }: RoomListProps) {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin bg-card">
      {rooms.map((room, i) => (
        <motion.button
          key={room.roomId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.03 }}
          onClick={() => onSelectRoom(room.roomId)}
          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors group relative ${
            activeRoomId === room.roomId ? 'bg-secondary' : 'hover:bg-secondary/50'
          }`}
        >
          {activeRoomId === room.roomId && (
            <motion.div 
              layoutId="activeRoomHighlight"
              className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-r-full"
            />
          )}
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 overflow-hidden text-foreground">
            {room.roomImage ? (
              <img src={room.roomImage} alt={room.roomName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-medium">{getInitials(room.roomName)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0 pr-1 border-b border-transparent group-hover:border-transparent pb-0.5">
            <div className="flex items-center justify-between gap-2">
              <h3 className={`text-[15px] font-semibold truncate flex-1 transition-colors ${activeRoomId === room.roomId ? 'text-primary' : 'text-foreground'}`}>
                {room.roomName}
              </h3>
              {room.lastMessageTime && (
                <span className={`text-[12px] flex-shrink-0 ${room.unreadCount > 0 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  {formatDate(room.lastMessageTime)}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between mt-1 gap-2">
              <p className="text-[13px] text-muted-foreground truncate flex-1 leading-tight">
                {room.lastMessage || 'No messages yet'}
              </p>
              {room.unreadCount > 0 && (
                <span className="flex-shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center">
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
