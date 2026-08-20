import { Heart, Home, PlusSquare, Search } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import CreatePost from './create-post';
import SuggestionsDialog from './suggestions-dialog';
import { cn } from '@/lib/utils';

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-border bg-background/95 backdrop-blur-md px-2 lg:hidden">
        <button
          onClick={() => navigate('/')}
          className={cn(
            'flex flex-col items-center justify-center rounded-xl p-2.5 transition-all duration-200 active:scale-95',
            isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          )}
          aria-label="Home"
        >
          <Home className={cn('h-6 w-6', isActive('/') ? 'stroke-[2.5px]' : 'stroke-[1.8px]')} />
        </button>

        <button
          onClick={() => setSuggestionsOpen(true)}
          className="flex flex-col items-center justify-center rounded-xl p-2.5 text-muted-foreground transition-all duration-200 hover:text-foreground active:scale-95"
          aria-label="Search"
        >
          <Search className="h-6 w-6 stroke-[1.8px]" />
        </button>

        <button
          onClick={() => setCreateOpen(true)}
          className="flex flex-col items-center justify-center rounded-xl p-2.5 text-foreground transition-all duration-150 active:scale-90"
          aria-label="Create"
        >
          <PlusSquare className="h-6 w-6 stroke-[1.8px]" />
        </button>

        <button
          onClick={() => setSuggestionsOpen(true)}
          className="relative flex flex-col items-center justify-center rounded-xl p-2.5 text-muted-foreground transition-all duration-200 hover:text-foreground active:scale-95"
          aria-label="Notifications"
        >
          <Heart className="h-6 w-6 stroke-[1.8px]" />
          {likeNotification?.length > 0 && (
            <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-destructive ring-2 ring-background animate-pulse" />
          )}
        </button>

        <button
          onClick={() => navigate(`/profile/${user?._id}`)}
          className="flex flex-col items-center justify-center rounded-xl p-2 transition-all duration-200 active:scale-95"
          aria-label="Profile"
        >
          <div
            className={cn(
              'p-0.5 rounded-full transition-all duration-200',
              isActive(`/profile/${user?._id}`) ? 'avatar-story-ring' : 'border border-transparent'
            )}
          >
            <Avatar className="h-6 w-6 border border-background">
              <AvatarImage src={user?.profilePicture} alt="profile" />
              <AvatarFallback className="text-[10px] font-bold">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </button>
      </nav>
      <CreatePost open={createOpen} setOpen={setCreateOpen} />
      <SuggestionsDialog
        isOpen={suggestionsOpen}
        onClose={() => setSuggestionsOpen(false)}
      />
    </>
  );
};

export default MobileNav;
