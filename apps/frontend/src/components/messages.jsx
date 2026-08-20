import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetAllMessage from '@/hooks/use-get-all-message';
import useGetRTM from '@/hooks/use-get-rtm';
import { ScrollArea } from './ui/scroll-area';

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessage();
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-muted/40">
      <div className="flex justify-center px-4 pt-4">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="h-16 w-16">
            <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
            <AvatarFallback>
              {selectedUser?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="mt-2 text-sm font-medium">
            {selectedUser?.username}
          </span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button size="sm" variant="secondary" className="my-2">
              View profile
            </Button>
          </Link>
        </div>
      </div>
      <ScrollArea className="flex-1 px-4 pb-2">
        <div className="flex flex-col gap-3">
          {messages &&
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] break-words rounded-lg p-3 text-sm shadow-sm ${
                    msg.senderId === user?._id
                      ? 'rounded-br-none bg-primary text-primary-foreground'
                      : 'rounded-bl-none bg-secondary text-secondary-foreground'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Messages;
