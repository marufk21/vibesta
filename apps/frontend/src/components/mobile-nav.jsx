import { Heart, Home, PlusSquare, Search } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import CreatePost from './create-post';
import { cn } from '@/lib/utils';

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((store) => store.auth);
  const [createOpen, setCreateOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const items = [
    { icon: <Home className="h-6 w-6" />, text: 'Home', path: '/' },
    { icon: <Search className="h-6 w-6" />, text: 'Search', path: null },
  ];

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-border bg-background/95 backdrop-blur lg:hidden">
        {items.map((item) => (
          <button
            key={item.text}
            onClick={() => item.path && navigate(item.path)}
            className={cn(
              'rounded-lg p-2 text-foreground transition-colors',
              isActive(item.path) && 'text-primary'
            )}
            aria-label={item.text}
          >
            {item.icon}
          </button>
        ))}
        <button
          onClick={() => setCreateOpen(true)}
          className="rounded-lg p-2 text-foreground transition-colors hover:text-primary"
          aria-label="Create"
        >
          <PlusSquare className="h-6 w-6" />
        </button>
        <button
          className="rounded-lg p-2 text-foreground"
          aria-label="Notifications"
        >
          <Heart className="h-6 w-6" />
        </button>
        <button
          onClick={() => navigate(`/profile/${user?._id}`)}
          className="rounded-lg p-2"
          aria-label="Profile"
        >
          <Avatar className="h-6 w-6">
            <AvatarImage src={user?.profilePicture} alt="profile" />
            <AvatarFallback>
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </button>
      </nav>
      <CreatePost open={createOpen} setOpen={setCreateOpen} />
    </>
  );
};

export default MobileNav;
