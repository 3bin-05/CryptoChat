import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Moon, Bell, LogOut, Shield } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { Switch } from '@/components/ui/switch';

const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useChat();
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to chats
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-8">
          <h1 className="text-xl font-bold text-foreground mb-6">Settings</h1>

          <div className="space-y-1">
            <SettingRow
              icon={<Moon className="w-5 h-5" />}
              label="Dark Mode"
              description="Use dark theme"
              action={<Switch checked={darkMode} onCheckedChange={setDarkMode} />}
            />
            <SettingRow
              icon={<Bell className="w-5 h-5" />}
              label="Notifications"
              description="Push notifications"
              action={<Switch checked={notifications} onCheckedChange={setNotifications} />}
            />
            <SettingRow
              icon={<Shield className="w-5 h-5" />}
              label="Privacy"
              description="Coming soon"
              action={<span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">Soon</span>}
            />
          </div>

          <div className="mt-8 pt-6 border-t border-border/50">
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

function SettingRow({
  icon, label, description, action,
}: {
  icon: React.ReactNode; label: string; description: string; action: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-4 px-2">
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground">{icon}</div>
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

export default Settings;
