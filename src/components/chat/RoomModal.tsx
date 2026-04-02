import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, KeyRound } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface RoomModalProps {
  type: 'create' | 'join';
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (name: string, password: string) => Promise<void>;
  onJoin?: (name: string, password: string) => Promise<boolean>;
}

export function RoomModal({ type, isOpen, onClose, onCreate, onJoin }: RoomModalProps) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setError('');
    if (!name.trim() || !password.trim()) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    try {
      if (type === 'create') {
        await onCreate?.(name.trim(), password.trim());
        onClose();
      } else {
        const success = await onJoin?.(name.trim(), password.trim());
        if (!success) {
          setError('Room not found or incorrect password');
          setLoading(false);
          return;
        }
        onClose();
      }
      setName('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md mx-4 glass-panel rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  {type === 'create' ? (
                    <Plus className="w-5 h-5 text-primary" />
                  ) : (
                    <KeyRound className="w-5 h-5 text-primary" />
                  )}
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  {type === 'create' ? 'Create Room' : 'Join Room'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Room name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="bg-secondary border-border/50 h-12"
              />
              <Input
                type="password"
                placeholder="Room password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-secondary border-border/50 h-12"
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                    {type === 'create' ? 'Creating...' : 'Joining...'}
                  </span>
                ) : (
                  type === 'create' ? 'Create Room' : 'Join Room'
                )}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
