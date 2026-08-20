import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/auth-slice';
import CreatePost from './create-post';
import { setPosts, setSelectedPost } from '@/redux/post-slice';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { API_BASE_URL } from '@/lib/api';
import { Separator } from './ui/separator';

const LeftSidebar = ({ onNavigate = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

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
      toast.error(error.response.data.message);
    }
  };

  const isActive = (path) => location.pathname === path;

  const sidebarHandler = (textType) => {
    if (textType === 'Logout') {
      logoutHandler();
    } else if (textType === 'Create') {
      setOpen(true);
    } else if (textType === 'Profile') {
      navigate(`/profile/${user?._id}`);
    } else if (textType === 'Home') {
      navigate('/');
    } else if (textType === 'Messages') {
      navigate('/chat');
    }
    onNavigate();
  };

  const sidebarItems = [
    { icon: <Home />, text: 'Home', path: '/' },
    { icon: <Search />, text: 'Search', path: null },
    { icon: <TrendingUp />, text: 'Explore', path: null },
    { icon: <MessageCircle />, text: 'Messages', path: '/chat' },
    { icon: <Heart />, text: 'Notifications', path: null },
    { icon: <PlusSquare />, text: 'Create', path: null },
    {
      icon: (
        <Avatar className="h-6 w-6">
          <AvatarImage src={user?.profilePicture} alt="profile" />
          <AvatarFallback>
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
      ),
      text: 'Profile',
      path: `/profile/${user?._id}`,
    },
  ];

  return (
    <div className="flex h-full flex-col px-3 py-6">
      <h1 className="text-brand-gradient mb-6 px-3 text-2xl font-bold tracking-tight">
        Vibesta
      </h1>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {sidebarItems.map((item, index) => {
          const active = item.path && isActive(item.path);
          return (
            <div key={index}>
              {item.text === 'Notifications' ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <div
                      onClick={() => onNavigate()}
                      className="flex cursor-pointer items-center gap-3 rounded-lg p-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      {item.icon}
                      <span className="hidden md:inline">{item.text}</span>
                      {likeNotification.length > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                          {likeNotification.length}
                        </span>
                      )}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-72">
                    <p className="mb-2 text-sm font-semibold">Notifications</p>
                    {likeNotification.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No new notifications
                      </p>
                    ) : (
                      likeNotification.map((notification) => (
                        <div
                          key={notification.userId}
                          className="my-2 flex items-center gap-2"
                        >
                          <Avatar>
                            <AvatarImage
                              src={notification.userDetails?.profilePicture}
                            />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <p className="text-sm">
                            <span className="font-bold">
                              {notification.userDetails?.username}
                            </span>{' '}
                            liked your post
                          </p>
                        </div>
                      ))
                    )}
                  </PopoverContent>
                </Popover>
              ) : (
                <div
                  onClick={() => sidebarHandler(item.text)}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                    active
                      ? 'bg-accent font-semibold text-accent-foreground'
                      : 'font-medium'
                  }`}
                >
                  {item.icon}
                  <span className="hidden md:inline">{item.text}</span>
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <Separator className="my-3" />
      <div
        onClick={logoutHandler}
        className="flex cursor-pointer items-center gap-3 rounded-lg p-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <LogOut className="h-5 w-5" />
        <span className="hidden md:inline">Logout</span>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
