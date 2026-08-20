import {
  Compass,
  Heart,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  PlusSquare,
  Search,
  Settings,
  User as UserIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner';
import axios from 'axios';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/auth-slice';
import CreatePost from './create-post';
import { setPosts, setSelectedPost } from '@/redux/post-slice';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { API_BASE_URL } from '@/lib/api';
import SuggestionsDialog from './suggestions-dialog';
import { cn } from '@/lib/utils';

const LeftSidebar = ({ onNavigate = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/user/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate('/login');
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Logout failed');
    }
  };

  const isActive = (path) => {
    if (!path) return false;
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    {
      id: 'home',
      text: 'Home',
      path: '/',
      action: () => navigate('/'),
      icon: (active) => (
        <Home
          className={cn(
            'h-6 w-6 transition-transform duration-150',
            active ? 'stroke-[2.5px] text-foreground' : 'stroke-[1.8px] text-foreground'
          )}
        />
      ),
    },
    {
      id: 'search',
      text: 'Search',
      path: null,
      action: () => setSuggestionsOpen(true),
      icon: () => <Search className="h-6 w-6 stroke-[1.8px] text-foreground" />,
    },
    {
      id: 'explore',
      text: 'Explore',
      path: null,
      action: () => setSuggestionsOpen(true),
      icon: () => <Compass className="h-6 w-6 stroke-[1.8px] text-foreground" />,
    },
    {
      id: 'messages',
      text: 'Messages',
      path: '/chat',
      action: () => navigate('/chat'),
      icon: (active) => (
        <MessageCircle
          className={cn(
            'h-6 w-6 transition-transform duration-150',
            active ? 'stroke-[2.5px] text-foreground' : 'stroke-[1.8px] text-foreground'
          )}
        />
      ),
    },
    {
      id: 'notifications',
      text: 'Notifications',
      path: null,
      icon: () => (
        <div className="relative">
          <Heart className="h-6 w-6 stroke-[1.8px] text-foreground" />
          {likeNotification.length > 0 && (
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-background" />
          )}
        </div>
      ),
    },
    {
      id: 'create',
      text: 'Create',
      path: null,
      action: () => setOpen(true),
      icon: () => <PlusSquare className="h-6 w-6 stroke-[1.8px] text-foreground" />,
    },
    {
      id: 'profile',
      text: 'Profile',
      path: user?._id ? `/profile/${user._id}` : null,
      action: () => user?._id && navigate(`/profile/${user._id}`),
      icon: (active) => (
        <Avatar
          className={cn(
            'h-6 w-6 transition-all',
            active ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background' : ''
          )}
        >
          <AvatarImage src={user?.profilePicture} alt={user?.username} />
          <AvatarFallback className="text-[10px] font-semibold">
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
      ),
    },
  ];

  return (
    <div className="flex h-full flex-col justify-between px-3 py-6">
      {/* Top section: Logo + Nav */}
      <div className="flex flex-col">
        {/* Clean Wordmark Logo */}
        <Link
          to="/"
          className="mb-8 px-3 tracking-tight transition-opacity hover:opacity-80"
        >
          <span className="font-bold text-2xl tracking-tight text-foreground">
            Vibesta
          </span>
        </Link>

        {/* Navigation list */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = isActive(item.path);

            if (item.id === 'notifications') {
              return (
                <Popover key={item.id}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      onClick={() => onNavigate()}
                      className="flex w-full cursor-pointer items-center gap-4 rounded-lg p-3 text-sm transition-colors hover:bg-muted/60"
                    >
                      {item.icon(false)}
                      <span className="font-normal text-foreground">{item.text}</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-80 p-3 rounded-2xl shadow-lg border border-border bg-popover"
                    side="right"
                    align="start"
                  >
                    <div className="flex items-center justify-between mb-2 px-1">
                      <p className="text-sm font-semibold text-foreground">Notifications</p>
                      {likeNotification.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {likeNotification.length} new
                        </span>
                      )}
                    </div>
                    {likeNotification.length === 0 ? (
                      <div className="py-6 text-center">
                        <p className="text-xs text-muted-foreground">
                          No notifications yet
                        </p>
                      </div>
                    ) : (
                      <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                        {likeNotification.map((notification) => (
                          <div
                            key={notification.userId}
                            className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={notification.userDetails?.profilePicture}
                              />
                              <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <p className="text-xs text-foreground leading-snug">
                              <span className="font-bold">
                                {notification.userDetails?.username}
                              </span>{' '}
                              liked your post
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  item.action?.();
                  onNavigate();
                }}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-4 rounded-lg p-3 text-sm transition-colors hover:bg-muted/60',
                  active ? 'font-bold' : 'font-normal'
                )}
              >
                {item.icon(active)}
                <span className="text-foreground">{item.text}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom section: More / Menu */}
      <div className="mt-auto pt-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full cursor-pointer items-center gap-4 rounded-lg p-3 text-sm font-normal text-foreground transition-colors hover:bg-muted/60"
            >
              <Menu className="h-6 w-6 stroke-[1.8px]" />
              <span>More</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            side="top"
            className="w-56 p-1.5 rounded-2xl shadow-xl border border-border bg-popover mb-2"
          >
            <DropdownMenuItem
              onClick={() => navigate(`/profile/${user?._id}`)}
              className="cursor-pointer text-xs py-2.5 rounded-lg"
            >
              <UserIcon className="h-4 w-4 mr-2.5 text-muted-foreground" />
              Your Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate('/account/edit')}
              className="cursor-pointer text-xs py-2.5 rounded-lg"
            >
              <Settings className="h-4 w-4 mr-2.5 text-muted-foreground" />
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              onClick={logoutHandler}
              className="cursor-pointer text-xs py-2.5 text-destructive focus:text-destructive rounded-lg"
            >
              <LogOut className="h-4 w-4 mr-2.5" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CreatePost open={open} setOpen={setOpen} />
      <SuggestionsDialog
        isOpen={suggestionsOpen}
        onClose={() => setSuggestionsOpen(false)}
      />
    </div>
  );
};

export default LeftSidebar;
