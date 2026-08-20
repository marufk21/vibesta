import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetAllMessage from '@/hooks/use-get-all-message';
import useGetRTM from '@/hooks/use-get-rtm';

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessage();
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4 space-y-4">
      {/* Conversation Top Header / Intro Card */}
      <div className="flex flex-col items-center justify-center py-6 text-center border-b border-border/40">
        <Avatar className="h-20 w-20 border-2 border-border shadow-xs">
          <AvatarImage
            src={selectedUser?.profilePicture}
            alt={selectedUser?.username}
            className="object-cover"
          />
          <AvatarFallback className="text-xl font-bold">
            {selectedUser?.username?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <h3 className="mt-3 text-sm font-bold text-foreground">
          {selectedUser?.username}
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Connected on Vibesta
        </p>
        <Link to={`/profile/${selectedUser?._id}`} className="mt-3">
          <Button size="sm" variant="outline" className="h-7 text-xs px-3 rounded-lg font-medium">
            View profile
          </Button>
        </Link>
      </div>

      {/* Message Bubbles */}
      <div className="flex flex-col gap-2.5 flex-1">
        {messages && messages.length > 0 ? (
          messages.map((msg) => {
            const isMe = String(msg.senderId) === String(user?._id);

            return (
              <div
                key={msg._id}
                className={`flex items-end gap-2 ${
                  isMe ? 'justify-end' : 'justify-start'
                }`}
              >
                {!isMe && (
                  <Avatar className="h-6 w-6 shrink-0 border border-border mb-0.5">
                    <AvatarImage
                      src={selectedUser?.profilePicture}
                      alt={selectedUser?.username}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-[10px]">
                      {selectedUser?.username?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-[78%] sm:max-w-[65%] break-words px-3.5 py-2 text-xs leading-relaxed shadow-2xs ${
                    isMe
                      ? 'rounded-2xl rounded-br-xs bg-primary text-primary-foreground font-normal'
                      : 'rounded-2xl rounded-bl-xs bg-muted text-foreground border border-border/50 font-normal'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-xs text-muted-foreground">
              No messages yet. Say hello to @{selectedUser?.username}! 👋
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

Messages.propTypes = {
  selectedUser: PropTypes.object,
};

export default Messages;
