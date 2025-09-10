import { initializePrivateChat } from '@/features/chat/actions/chat.actions';
import { AppRoute } from '@/features/common/constants/routes';
import { redirect } from 'next/navigation';
import { useCallback, useState } from 'react';

function useStartChatAction() {
  const [loading, setLoading] = useState(false);
  const [chatIds, setChatIds] = useState<Record<string, string>>({});

  const fetchChat = useCallback(
    async (user: PublicUser) => {
      if (chatIds[user.id]) return chatIds[user.id];
      const [chat, error] = await initializePrivateChat({ participantId: user.id });
      if (error) {
        return null;
      }
      setChatIds((prev) => ({ ...prev, [user.id]: chat.id }));
      return chat.id;
    },
    [chatIds]
  );

  const handleClick = useCallback(
    async (user: PublicUser) => {
      setLoading(true);
      try {
        const id = await fetchChat(user);
        redirect(AppRoute.DASHBOARD + AppRoute.DASH + id);
      } finally {
        setLoading(false);
      }
    },
    [fetchChat]
  );

  const handleMouseEnter = useCallback(
    (user: PublicUser) => {
      if (!chatIds[user.id] && !loading) {
        fetchChat(user);
      }
    },
    [fetchChat, chatIds, loading]
  );

  return {
    startChatOnClick: handleClick,
    prepareChatOnHover: handleMouseEnter,
    loading,
  };
}

export default useStartChatAction;
