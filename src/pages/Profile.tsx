import { useState, useRef, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Camera, Save, Loader2 } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getInitials } from '@/lib/mockData';
import { toast } from 'sonner';

const Profile = () => {
  const { user, updateUserProfile } = useChat();
  const [name, setName] = useState(user.name);
  const [email] = useState(user.email);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUserProfile(name, file || undefined);
      toast.success('Profile updated successfully!');
      setFile(null); // Clear pending file 
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const previewUrl = file ? URL.createObjectURL(file) : user.avatar;

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-sm"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Profile Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your account details and public presence.</p>
          </div>

          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div 
                className="w-24 h-24 rounded-full bg-secondary border-2 border-border flex items-center justify-center overflow-hidden"
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-foreground">{getInitials(name || 'User')}</span>
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all border-2 border-card shadow-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 scale-100 md:scale-95 md:group-hover:scale-100"
                disabled={loading}
              >
                <Camera className="w-4 h-4" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground block">Display Name</label>
              <Input 
                value={name} 
                onChange={e => setName(e.target.value)} 
                disabled={loading} 
                className="bg-background border-border h-11 focus-visible:ring-1 focus-visible:ring-primary" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground block">Email Address</label>
              <Input 
                value={email} 
                disabled 
                className="bg-secondary border-transparent h-11 opacity-60 cursor-not-allowed" 
              />
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={handleSave} 
                disabled={loading || (!file && name === user.name)} 
                className="w-full h-11 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Profile;
