import { Check, CheckCheck } from 'lucide-react';
import type { MessageStatus as Status } from '@/lib/mockData';

export function MessageStatus({ status }: { status: Status }) {
  if (status === 'sent') {
    return <Check className="w-3.5 h-3.5 text-[#8696a0] shrink-0" />;
  }

  const isRead = status === 'read';

  return (
    <CheckCheck 
      className={`w-3.5 h-3.5 shrink-0 ${isRead ? 'text-[#34B7F1]' : 'text-[#8696a0]'}`} 
    />
  );
}
