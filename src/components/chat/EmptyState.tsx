import { motion } from 'framer-motion';
import { Shield, Lock, MessageSquare } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <div className="relative inline-flex mb-6">
          <div className="w-24 h-24 rounded-3xl bg-primary/5 border border-primary/10 flex items-center justify-center">
            <MessageSquare className="w-10 h-10 text-primary/40" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Lock className="w-4 h-4 text-primary/60" />
          </div>
          <div className="absolute -bottom-2 -left-2 w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary/60" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">CryptaChat</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Start chatting by joining a secure room. Your conversations are private and encrypted.
        </p>
      </motion.div>
    </div>
  );
}
