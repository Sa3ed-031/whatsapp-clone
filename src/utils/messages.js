// Older messages have no senderId, so fall back to the "send" flag.
export function isOwnMessage(message, currentUserId) {
  return message.senderId
    ? message.senderId === currentUserId
    : Boolean(message.send);
}

// A message may only appear once per thread (older saved data could contain
// the same message twice: once as "sent" and once as "received").
export function dedupeMessages(messages, currentUserId) {
  const byId = new Map();
  for (const m of messages) {
    const existing = byId.get(m.id);
    if (
      !existing ||
      (!isOwnMessage(existing, currentUserId) && isOwnMessage(m, currentUserId))
    ) {
      byId.set(m.id, m);
    }
  }
  return messages.filter((m) => byId.get(m.id) === m);
}
