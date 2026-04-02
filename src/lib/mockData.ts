export interface User {
  uid: string;
  name: string;
  email: string;
  avatar: string;
  online: boolean;
  lastSeen?: Date;
}

export interface Room {
  roomId: string;
  roomName: string;
  roomImage?: string;
  password?: string;
  createdBy: string;
  createdAt: Date;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  members: string[];
  activeUsers: number;
}

export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  status: MessageStatus;
}

export const currentUser: User = {
  uid: 'user-1',
  name: 'You',
  email: 'you@cryptachat.io',
  avatar: '',
  online: true,
};

export const mockUsers: User[] = [
  { uid: 'user-2', name: 'Alice Chen', email: 'alice@example.com', avatar: '', online: true },
  { uid: 'user-3', name: 'Marcus Webb', email: 'marcus@example.com', avatar: '', online: false, lastSeen: new Date(Date.now() - 3600000) },
  { uid: 'user-4', name: 'Priya Sharma', email: 'priya@example.com', avatar: '', online: true },
  { uid: 'user-5', name: 'Jordan Lee', email: 'jordan@example.com', avatar: '', online: false, lastSeen: new Date(Date.now() - 7200000) },
];

export const mockRooms: Room[] = [
  {
    roomId: 'room-1',
    roomName: 'Dev Team Alpha',
    createdBy: 'user-1',
    createdAt: new Date('2024-01-15'),
    lastMessage: 'Just pushed the new build 🚀',
    lastMessageTime: new Date(Date.now() - 120000),
    unreadCount: 3,
    members: ['user-1', 'user-2', 'user-4'],
    activeUsers: 3,
  },
  {
    roomId: 'room-2',
    roomName: 'Design Sync',
    createdBy: 'user-2',
    createdAt: new Date('2024-02-10'),
    lastMessage: 'Updated the Figma file',
    lastMessageTime: new Date(Date.now() - 600000),
    unreadCount: 0,
    members: ['user-1', 'user-2', 'user-3'],
    activeUsers: 2,
  },
  {
    roomId: 'room-3',
    roomName: 'Crypto Traders',
    createdBy: 'user-3',
    createdAt: new Date('2024-03-01'),
    lastMessage: 'BTC looking bullish today 📈',
    lastMessageTime: new Date(Date.now() - 1800000),
    unreadCount: 12,
    members: ['user-1', 'user-3', 'user-5'],
    activeUsers: 1,
  },
  {
    roomId: 'room-4',
    roomName: 'Weekend Plans',
    createdBy: 'user-1',
    createdAt: new Date('2024-03-15'),
    lastMessage: 'Saturday works for me',
    lastMessageTime: new Date(Date.now() - 86400000),
    unreadCount: 0,
    members: ['user-1', 'user-4', 'user-5'],
    activeUsers: 0,
  },
];

export const mockMessages: Record<string, Message[]> = {
  'room-1': [
    { id: 'm1', senderId: 'user-2', senderName: 'Alice Chen', text: 'Hey team, how\'s the sprint going?', timestamp: new Date(Date.now() - 3600000), status: 'read' },
    { id: 'm2', senderId: 'user-1', senderName: 'You', text: 'Pretty good! Almost done with the auth module.', timestamp: new Date(Date.now() - 3500000), status: 'read' },
    { id: 'm3', senderId: 'user-4', senderName: 'Priya Sharma', text: 'I finished the API integration. Ready for review 👀', timestamp: new Date(Date.now() - 3000000), status: 'read' },
    { id: 'm4', senderId: 'user-2', senderName: 'Alice Chen', text: 'Nice work Priya! I\'ll review it after lunch.', timestamp: new Date(Date.now() - 2500000), status: 'read' },
    { id: 'm5', senderId: 'user-1', senderName: 'You', text: 'Can someone check the CI pipeline? It seems stuck.', timestamp: new Date(Date.now() - 1800000), status: 'delivered' },
    { id: 'm6', senderId: 'user-4', senderName: 'Priya Sharma', text: 'On it! Let me take a look.', timestamp: new Date(Date.now() - 1200000), status: 'read' },
    { id: 'm7', senderId: 'user-4', senderName: 'Priya Sharma', text: 'Fixed! It was a dependency conflict.', timestamp: new Date(Date.now() - 600000), status: 'read' },
    { id: 'm8', senderId: 'user-2', senderName: 'Alice Chen', text: 'Just pushed the new build 🚀', timestamp: new Date(Date.now() - 120000), status: 'sent' },
  ],
  'room-2': [
    { id: 'm9', senderId: 'user-2', senderName: 'Alice Chen', text: 'Updated the Figma file', timestamp: new Date(Date.now() - 600000), status: 'read' },
  ],
  'room-3': [
    { id: 'm10', senderId: 'user-3', senderName: 'Marcus Webb', text: 'BTC looking bullish today 📈', timestamp: new Date(Date.now() - 1800000), status: 'delivered' },
  ],
};

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return formatTime(date);
  if (days === 1) return 'Yesterday';
  if (days < 7) return date.toLocaleDateString([], { weekday: 'short' });
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}
