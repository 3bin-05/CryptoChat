export function TypingIndicator({ users }: { users: string[] }) {
  if (!users.length) return null;
  const label = users.length === 1
    ? `${users[0]} is typing`
    : `${users.slice(0, 2).join(', ')} are typing`;

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <div className="flex items-center gap-1 bg-chat-received rounded-2xl rounded-bl-md px-4 py-3">
        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-typing-dot-1" />
        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-typing-dot-2" />
        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-typing-dot-3" />
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
