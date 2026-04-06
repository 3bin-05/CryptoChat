import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, User, Settings, LogOut } from 'lucide-react';
import { useChat } from '@/context/ChatContext';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, setActiveRoomId } = useChat();

  const handleNavClick = (path: string) => {
    setActiveRoomId(null);
    navigate(path);
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Primary Navigation Rail (Leftmost) */}
      <nav className="w-16 flex-shrink-0 bg-card border-r border-border flex flex-col items-center py-6 gap-6 z-30">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
          <img src="/cryptochatlogo.png" alt="Logo" className="w-6 h-6 object-contain" />
        </div>

        <div className="flex-1 flex flex-col gap-3 w-full px-2">
          <NavItem 
            icon={<MessageSquare className="w-5 h-5" />} 
            isActive={location.pathname === '/'} 
            onClick={() => handleNavClick('/')}
            label="Chats"
          />
          <NavItem 
            icon={<User className="w-5 h-5" />} 
            isActive={location.pathname === '/profile'} 
            onClick={() => handleNavClick('/profile')}
            label="Profile"
          />
          <NavItem 
            icon={<Settings className="w-5 h-5" />} 
            isActive={location.pathname === '/settings'} 
            onClick={() => handleNavClick('/settings')}
            label="Settings"
          />
        </div>

        <button 
          onClick={logout}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          title="Log out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex min-w-0 bg-background relative">
        {children}
      </main>
    </div>
  );
}

function NavItem({ icon, isActive, onClick, label }: { icon: ReactNode; isActive: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`relative w-full aspect-square flex items-center justify-center rounded-xl transition-colors ${
        isActive 
          ? 'text-primary' 
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
      }`}
    >
      <AnimatePresence>
        {isActive && (
          <motion.div
            layoutId="activeNavIndicator"
            className="absolute inset-0 bg-primary/10 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        )}
      </AnimatePresence>
      <div className="relative z-10">{icon}</div>
    </button>
  );
}
