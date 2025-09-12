// Channel helpers
export const Channels = {
  user: (userId: string) => `private-user-${userId}`,
  presence: (userId: string) => `presence-user-${userId}`,
  chat: (chatId: string) => `private-chat-${chatId}`,

  PRESENCE_PREFIX: 'presence-user-',
  CHAT_PREFIX: 'private-chat-',
};
