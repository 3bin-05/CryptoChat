import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp, getDocs, where, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';
import { Room, Message, User } from '@/lib/mockData';

interface ChatContextType {
  user: User;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  rooms: Room[];
  activeRoomId: string | null;
  setActiveRoomId: (id: string | null) => void;
  messages: Record<string, Message[]>;
  sendMessage: (roomId: string, text: string) => void;
  sendImageMessage: (roomId: string, imageUrl: string, caption?: string) => Promise<void>;
  createRoom: (name: string, password: string) => Promise<void>;
  joinRoom: (name: string, password: string) => Promise<boolean>;
  updateUserProfile: (name: string, file?: File) => Promise<void>;
  leaveRoom: (roomId: string) => Promise<void>;
  updateRoom: (roomId: string, updates: any) => Promise<void>;
  deleteRoom: (roomId: string) => Promise<void>;
  uploadRoomImage: (roomId: string, file: File) => Promise<void>;
  uploadToCloudinary: (file: File, folder?: string) => Promise<string>;
  allUsers: User[];
  typingUsers: Record<string, string[]>;
}

const ChatContext = createContext<ChatContextType | null>(null);

const defaultUser: User = { uid: '', name: 'Guest', email: '', avatar: '', online: false };

// ☁️ CLOUDINARY CONFIGURATION
// Replace these with your values from Cloudinary Dashboard
const CLOUDINARY_CLOUD_NAME = 'dtf90tq2w'; // Placeholder: Please replace with your actual Cloud Name
const CLOUDINARY_UPLOAD_PRESET = 'cryptochat'; // Placeholder: Please replace with your actual Unsigned Preset

export function ChatProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<User>(defaultUser);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        setUser({
          uid: fbUser.uid,
          name: fbUser.displayName || 'User',
          email: fbUser.email || '',
          avatar: fbUser.photoURL || '',
          online: true,
        });
      } else {
        setUser(defaultUser);
      }
      setAuthLoading(false);
    });

    const usersUnsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      const fetchedUsers: User[] = [];
      snapshot.forEach(doc => {
        fetchedUsers.push(doc.data() as User);
      });
      setAllUsers(fetchedUsers);
    });

    return () => {
      unsub();
      usersUnsub();
    };
  }, []);

  // Fetch Rooms via Snapshot
  useEffect(() => {
    if (!firebaseUser) return;
    const q = query(collection(db, 'rooms'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const fetchedRooms: Room[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        
        // Enforce visibility: only populate state with rooms the user is actively a member of
        const members = data.members || [];
        if (members.includes(firebaseUser.uid)) {
          fetchedRooms.push({
            roomId: doc.id,
            roomName: data.roomName,
            createdBy: data.createdBy,
            createdAt: data.createdAt?.toDate() || new Date(),
            lastMessage: data.lastMessage,
            lastMessageTime: data.lastMessageTime?.toDate(),
            unreadCount: 0,
            members: members,
            activeUsers: members.length,
            password: data.password,
            roomImage: data.roomImage
          });
        }
      });
      setRooms(fetchedRooms);
    });
    return unsub;
  }, [firebaseUser]);

  // Fetch Messages for activeRoom
  useEffect(() => {
    if (!activeRoomId || !firebaseUser) return;
    const q = query(
      collection(db, `rooms/${activeRoomId}/messages`),
      orderBy('timestamp', 'asc')
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const fetchedMessages: Message[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedMessages.push({
          id: doc.id,
          senderId: data.senderId,
          senderName: data.senderName,
          text: data.text,
          timestamp: data.timestamp?.toDate() || new Date(),
          status: data.status || 'delivered',
          type: data.type || 'text',
          imageUrl: data.imageUrl,
        });
      });
      setMessages((prev) => ({
        ...prev,
        [activeRoomId]: fetchedMessages,
      }));
    });
    return unsub;
  }, [activeRoomId, firebaseUser]);

  const isAuthenticated = !!firebaseUser;

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (name: string, email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = {
      uid: cred.user.uid,
      name,
      email,
      avatar: '',
      online: true,
    };
    await updateProfile(cred.user, { displayName: name });
    await setDoc(doc(db, 'users', cred.user.uid), newUser);
  };

  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    const user = cred.user;
    const userDoc = {
      uid: user.uid,
      name: user.displayName || 'User',
      email: user.email || '',
      avatar: user.photoURL || '',
      online: true,
    };
    await setDoc(doc(db, 'users', user.uid), userDoc, { merge: true });
  };

  const logout = async () => {
    await signOut(auth);
    setActiveRoomId(null);
  };

  const sendMessage = async (roomId: string, text: string) => {
    if (!firebaseUser) return;
    
    await addDoc(collection(db, `rooms/${roomId}/messages`), {
      senderId: user.uid,
      senderName: user.name,
      text,
      timestamp: serverTimestamp(),
      status: 'delivered', 
      type: 'text'
    });

    await updateDoc(doc(db, 'rooms', roomId), {
      lastMessage: text,
      lastMessageTime: serverTimestamp()
    });
  };

  const sendImageMessage = async (roomId: string, imageUrl: string, caption?: string) => {
    if (!firebaseUser) return;
    
    await addDoc(collection(db, `rooms/${roomId}/messages`), {
      senderId: user.uid,
      senderName: user.name,
      text: caption || '',
      imageUrl,
      timestamp: serverTimestamp(),
      status: 'delivered',
      type: 'image'
    });

    await updateDoc(doc(db, 'rooms', roomId), {
      lastMessage: '📷 Image',
      lastMessageTime: serverTimestamp()
    });
  };

  const createRoom = async (name: string, password: string) => {
    if (!firebaseUser) return;
    const roomRef = await addDoc(collection(db, 'rooms'), {
      roomName: name,
      password: password,
      createdBy: user.uid,
      createdAt: serverTimestamp(),
      members: [user.uid],
    });
    setActiveRoomId(roomRef.id);
  };

  const joinRoom = async (name: string, password: string) => {
    if (!firebaseUser) return false;
    
    // Security note: In a true production app, password check must be done via a cloud function.
    const q = query(collection(db, 'rooms'), where('roomName', '==', name));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return false;
    
    let joined = false;
    const docs = snapshot.docs;
    
    // We expect roomName to be unique or just join the first one that matches
    for (const document of docs) {
      const data = document.data();
      if (data.password === password || (!data.password && password === '')) {
        const roomRef = doc(db, 'rooms', document.id);
        const members = data.members || [];
        if (!members.includes(user.uid)) {
          await updateDoc(roomRef, {
            members: [...members, user.uid]
          });
        }
        joined = true;
        setActiveRoomId(document.id);
        break; 
      }
    }

    return joined;
  };

  const uploadToCloudinary = async (file: File, folder?: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    if (folder) {
      formData.append('folder', folder);
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Cloudinary upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  };

  const updateUserProfile = async (name: string, file?: File) => {
    if (!firebaseUser) return;
    let photoURL = firebaseUser.photoURL;

    try {
      if (file) {
        photoURL = await uploadToCloudinary(file);
      }

      await updateProfile(firebaseUser, { displayName: name, photoURL });
      setUser((prev) => ({ ...prev, name, avatar: photoURL || prev.avatar }));
      
      // Sync with Firestore users collection safely
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        uid: firebaseUser.uid,
        name,
        avatar: photoURL,
        email: firebaseUser.email
      }, { merge: true });
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  const leaveRoom = async (roomId: string) => {
    if (!firebaseUser) return;
    const roomRef = doc(db, 'rooms', roomId);
    const roomDoc = rooms.find(r => r.roomId === roomId);
    if (!roomDoc) return;

    const newMembers = roomDoc.members.filter(uid => uid !== firebaseUser.uid);
    await updateDoc(roomRef, {
      members: newMembers
    });
    
    if (activeRoomId === roomId) {
      setActiveRoomId(null);
    }
  };

  const updateRoom = async (roomId: string, updates: any) => {
    if (!firebaseUser) return;
    const roomRef = doc(db, 'rooms', roomId);
    await updateDoc(roomRef, updates);
  };

  const deleteRoom = async (roomId: string) => {
    if (!firebaseUser) return;
    
    // Safety check: is creator?
    const room = rooms.find(r => r.roomId === roomId);
    if (!room || room.createdBy !== firebaseUser.uid) {
      throw new Error("Only the creator can delete this room.");
    }

    const roomRef = doc(db, 'rooms', roomId);
    await deleteDoc(roomRef); // Delete room doc
    
    // Also cleanup active room if it was this one
    if (activeRoomId === roomId) {
      setActiveRoomId(null);
    }
  };

  const uploadRoomImage = async (roomId: string, file: File) => {
    if (!firebaseUser) return;
    try {
      const photoURL = await uploadToCloudinary(file);
      
      const roomRef = doc(db, 'rooms', roomId);
      await updateDoc(roomRef, {
        roomImage: photoURL
      });
    } catch (error) {
      console.error("Error uploading room image:", error);
      throw error;
    }
  };

  return (
    <ChatContext.Provider
      value={{
        user, firebaseUser, isAuthenticated, authLoading,
        login, signup, loginWithGoogle, logout,
        rooms, activeRoomId, setActiveRoomId,
        messages, sendMessage, sendImageMessage, createRoom, joinRoom, updateUserProfile, leaveRoom,
        updateRoom, deleteRoom, uploadRoomImage, uploadToCloudinary,
        allUsers, typingUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}
