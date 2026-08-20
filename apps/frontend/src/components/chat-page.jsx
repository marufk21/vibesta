import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/auth-slice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ArrowLeft, MessageCircleCode } from 'lucide-react';
import Messages from './messages';
import { ScrollArea } from './ui/scroll-area';
import axios from 'axios';
import { setMessages } from '@/redux/chat-slice';
import { API_BASE_URL } from '@/lib/api';

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState('');
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] w-full lg:h-screen">
      {/* User list */}
      <section
        className={`${selectedUser ? 'hidden md:block md:w-1/4' : 'w-full md:w-1/4'} border-r border-border`}
      >
        <div className="flex h-full flex-col">
          <h1 className="border-b border-border px-4 py-4 text-lg font-bold">
            {user?.username}
          </h1>
          <ScrollArea className="flex-1">
            {suggestedUsers.map((suggestedUser) => {
              const isOnline = onlineUsers.includes(suggestedUser?._id);
              return (
                <div
                  key={suggestedUser?._id}
                  onClick={() => dispatch(setSelectedUser(suggestedUser))}
                  className="flex cursor-pointer items-center gap-3 p-3 transition-colors hover:bg-accent"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={suggestedUser?.profilePicture}
                      alt="profile"
                    />
                    <AvatarFallback>
                      {suggestedUser?.username?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {suggestedUser?.username}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        isOnline ? 'text-green-600' : 'text-muted-foreground'
                      }`}
                    >
                      {isOnline ? 'online' : 'offline'}
                    </span>
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        </div>
      </section>

      {/* Conversation / empty state */}
      {selectedUser ? (
        <section className="flex h-full w-full flex-1 flex-col">
          <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background px-3 py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(setSelectedUser(null))}
              className="md:hidden"
              aria-label="Back to chats"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
              <AvatarFallback>
                {selectedUser?.username?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold">
              {selectedUser?.username}
            </span>
          </div>
          <Messages selectedUser={selectedUser} />
          <div className="flex items-center gap-2 border-t border-border p-3">
            <Input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && sendMessageHandler(selectedUser?._id)
              }
              type="text"
              className="flex-1"
              placeholder="Messages..."
            />
            <Button onClick={() => sendMessageHandler(selectedUser?._id)}>
              Send
            </Button>
          </div>
        </section>
      ) : (
        <div className="hidden flex-1 flex-col items-center justify-center md:flex">
          <MessageCircleCode className="my-4 h-32 w-32 text-muted-foreground" />
          <h1 className="font-medium">Your messages</h1>
          <span className="text-sm text-muted-foreground">
            Send a message to start a chat.
          </span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
