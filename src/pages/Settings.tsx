import { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Bell, LogOut, Shield } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Switch } from '@/components/ui/switch';

const Settings = () => {
  const { logout } = useChat();
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-sm"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Preferences</h1>
            <p className="text-sm text-muted-foreground mt-1">Customize your application experience.</p>
          </div>

          <div className="space-y-2">
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
              action={<span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">Soon</span>}
            />
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <button
              onClick={logout}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-xl text-destructive hover:bg-destructive/10 transition-colors font-medium text-base"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

function SettingRow({
  icon, label, description, action,
}: {
  icon: React.ReactNode; label: string; description: string; action: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-4 px-4 rounded-xl hover:bg-secondary transition-colors group">
      <div className="flex items-center gap-4">
        <div className="text-muted-foreground group-hover:text-primary transition-colors">{icon}</div>
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-[13px] text-muted-foreground">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

export default Settings;
