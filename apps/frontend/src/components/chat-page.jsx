import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/auth-slice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  ArrowLeft,
  MessageCircle,
  Search,
  Send,
  User,
  X,
} from 'lucide-react';
import Messages from './messages';
import { ScrollArea } from './ui/scroll-area';
import axios from 'axios';
import { addMessage } from '@/redux/chat-slice';
import { API_BASE_URL } from '@/lib/api';
import SuggestionsDialog from './suggestions-dialog';

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState('');
  const [contacts, setContacts] = useState([]);
  const [contactSearch, setContactSearch] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  const { user, selectedUser } = useSelector((store) => store.auth);
  const { onlineUsers } = useSelector((store) => store.chat);
  const dispatch = useDispatch();

  // Message list shows friends the current user follows
  useEffect(() => {
    const fetchContacts = async () => {
      if (!user?._id) return;
      try {
        setLoadingContacts(true);
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/user/following/${user._id}`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setContacts(res.data.users || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingContacts(false);
      }
    };
    fetchContacts();
  }, [user?._id]);

  const filteredContacts = useMemo(() => {
    if (!contactSearch.trim()) return contacts;
    const q = contactSearch.toLowerCase().trim();
    return contacts.filter(
      (c) =>
        c.username?.toLowerCase().includes(q) ||
        c.bio?.toLowerCase().includes(q)
    );
  }, [contacts, contactSearch]);

  const sendMessageHandler = async (receiverId) => {
    if (!textMessage.trim() || !receiverId) return;

    const messageToSend = textMessage;
    setTextMessage('');

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/message/send/${receiverId}`,
        { textMessage: messageToSend },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(addMessage(res.data.newMessage));
      }
    } catch (error) {
      console.error(error);
      // Restore message text on error
      setTextMessage(messageToSend);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, [dispatch]);

  const isSelectedUserOnline = selectedUser && onlineUsers.includes(selectedUser?._id);

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] w-full overflow-hidden lg:h-screen bg-background">
      {/* Sidebar: Contacts List */}
      <section
        className={`${
          selectedUser ? 'hidden md:flex md:w-80 lg:w-96' : 'flex w-full md:w-80 lg:w-96'
        } flex-col border-r border-border bg-card shrink-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-foreground">
              {user?.username}
            </h1>
          </div>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {contacts.length} chats
          </span>
        </div>

        {/* Search Contacts */}
        <div className="p-3 border-b border-border/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={contactSearch}
              onChange={(e) => setContactSearch(e.target.value)}
              className="h-8.5 pl-8 pr-7 text-xs rounded-lg"
            />
            {contactSearch && (
              <button
                type="button"
                onClick={() => setContactSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Contacts Scroll list */}
        <ScrollArea className="flex-1">
          {loadingContacts ? (
            <div className="p-3 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-muted animate-pulse shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3.5 w-24 bg-muted animate-pulse rounded" />
                    <div className="h-2.5 w-36 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : contacts.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <MessageCircle className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-xs font-semibold text-foreground">No conversations yet</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Follow users to start direct messaging with them.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 text-xs h-8"
                onClick={() => setSuggestionsOpen(true)}
              >
                Find people
              </Button>
            </div>
          ) : filteredContacts.length === 0 ? (
            <p className="px-4 py-8 text-center text-xs text-muted-foreground">
              No matching conversation found
            </p>
          ) : (
            <div className="divide-y divide-border/30">
              {filteredContacts.map((contact) => {
                const isOnline = onlineUsers.includes(contact?._id);
                const isSelected = selectedUser?._id === contact?._id;

                return (
                  <div
                    key={contact?._id}
                    onClick={() => dispatch(setSelectedUser(contact))}
                    className={`flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors ${
                      isSelected
                        ? 'bg-muted font-medium'
                        : 'hover:bg-muted/40'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-11 w-11 border border-border">
                        <AvatarImage
                          src={contact?.profilePicture}
                          alt={contact?.username}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-xs font-semibold">
                          {contact?.username?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      {isOnline && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-emerald-500 ring-1 ring-background" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="truncate text-xs font-semibold text-foreground">
                          {contact?.username}
                        </span>
                        <span
                          className={`text-[10px] ${
                            isOnline ? 'text-emerald-500 font-medium' : 'text-muted-foreground'
                          }`}
                        >
                          {isOnline ? 'Active now' : 'Offline'}
                        </span>
                      </div>
                      <p className="truncate text-[11px] text-muted-foreground mt-0.5">
                        Tap to chat
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </section>

      {/* Chat Area */}
      {selectedUser ? (
        <section className="flex h-full w-full flex-1 flex-col overflow-hidden bg-background">
          {/* Chat Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-4 py-2.5">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => dispatch(setSelectedUser(null))}
                className="h-8 w-8 md:hidden"
                aria-label="Back to chats"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="relative">
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarImage
                    src={selectedUser?.profilePicture}
                    alt={selectedUser?.username}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-xs font-semibold">
                    {selectedUser?.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                {isSelectedUserOnline && (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
                )}
              </div>

              <div>
                <Link
                  to={`/profile/${selectedUser?._id}`}
                  className="text-xs font-semibold text-foreground hover:underline"
                >
                  {selectedUser?.username}
                </Link>
                <p className="text-[10px] text-muted-foreground">
                  {isSelectedUserOnline ? (
                    <span className="text-emerald-500 font-medium">Active now</span>
                  ) : (
                    'Offline'
                  )}
                </p>
              </div>
            </div>

            <Link to={`/profile/${selectedUser?._id}`}>
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                <User className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
            </Link>
          </div>

          {/* Messages Feed */}
          <Messages selectedUser={selectedUser} />

          {/* Composer Input */}
          <div className="border-t border-border bg-card p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessageHandler(selectedUser?._id);
              }}
              className="flex items-center gap-2"
            >
              <Input
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                type="text"
                className="flex-1 rounded-xl h-10 px-3.5 text-xs bg-muted/40 border-border focus-visible:ring-1"
                placeholder={`Message @${selectedUser?.username}...`}
              />
              <Button
                type="submit"
                disabled={!textMessage.trim()}
                size="sm"
                className="h-10 px-4 rounded-xl gap-1.5 font-medium shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Send</span>
              </Button>
            </form>
          </div>
        </section>
      ) : (
        /* Empty Chat State on Desktop */
        <div className="hidden flex-1 flex-col items-center justify-center p-8 text-center md:flex bg-background">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-muted/50 mb-4 text-muted-foreground">
            <MessageCircle className="h-8 w-8" />
          </div>
          <h2 className="text-base font-bold text-foreground">Your messages</h2>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            Send private messages, share posts, and connect directly with friends.
          </p>
        </div>
      )}
      <SuggestionsDialog
        isOpen={suggestionsOpen}
        onClose={() => setSuggestionsOpen(false)}
      />
    </div>
  );
};

export default ChatPage;
