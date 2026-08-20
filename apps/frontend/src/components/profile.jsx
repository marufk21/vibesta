import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import useGetUserProfile from '@/hooks/use-get-user-profile';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { AtSign, Grid, Bookmark, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState('posts');

  const { userProfile, user } = useSelector((store) => store.auth);

  const isLoggedInUserProfile = user?._id === userProfile?._id;

  const displayedPost =
    activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

  const copyProfileLink = () => {
    const link = `${window.location.origin}/profile/${userProfile?._id}`;
    navigator.clipboard
      ?.writeText(link)
      .then(() => toast.success('Profile link copied!'))
      .catch(() => toast.error('Could not copy link.'));
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-8">
      {/* Profile header */}
      <div className="flex flex-col items-center gap-6 pb-8 md:flex-row md:items-center">
        <Avatar className="h-24 w-24 md:h-32 md:w-32">
          <AvatarImage
            src={userProfile?.profilePicture}
            alt="profilephoto"
            className="object-cover"
          />
          <AvatarFallback className="text-2xl">
            {userProfile?.username?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>

        <div className="flex w-full flex-col gap-4 md:flex-1">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 md:justify-start">
              <h1 className="text-xl font-semibold">{userProfile?.username}</h1>
            </div>

            {isLoggedInUserProfile ? (
              <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                <Link to="/account/edit">
                  <Button variant="secondary" size="sm">
                    Edit profile
                  </Button>
                </Link>
                <Button variant="secondary" size="sm">
                  View archive
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  Ad tools
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="px-2.5">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={copyProfileLink}>
                      Share profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={copyProfileLink}>
                      Copy link
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View archive</DropdownMenuItem>
                    <DropdownMenuItem>Ad tools</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Follow
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="px-2.5">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={copyProfileLink}>
                      Share profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={copyProfileLink}>
                      Copy link
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-8 text-sm md:justify-start">
            <p>
              <span className="font-semibold">
                {userProfile?.posts?.length ?? 0}{' '}
              </span>
              posts
            </p>
            <p>
              <span className="font-semibold">
                {userProfile?.followers?.length ?? 0}{' '}
              </span>
              followers
            </p>
            <p>
              <span className="font-semibold">
                {userProfile?.following?.length ?? 0}{' '}
              </span>
              following
            </p>
          </div>

          <div className="flex flex-col items-center gap-1 md:items-start">
            <span className="text-center text-sm font-semibold md:text-left">
              {userProfile?.bio || 'bio here...'}
            </span>
            <Badge variant="secondary" className="w-fit">
              <AtSign className="h-3 w-3" />
              <span className="pl-1">{userProfile?.username}</span>
            </Badge>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="border-t border-border">
        <div className="flex items-center justify-center gap-6 text-sm">
          {[
            {
              key: 'posts',
              label: 'POSTS',
              icon: <Grid className="h-4 w-4" />,
            },
            {
              key: 'saved',
              label: 'SAVED',
              icon: <Bookmark className="h-4 w-4" />,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-1.5 border-t-2 py-3 uppercase tracking-wide transition-colors',
                activeTab === tab.key
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-1 pb-8 md:gap-2">
          {displayedPost?.map((post) => (
            <div
              key={post?._id}
              className="group relative aspect-square cursor-pointer overflow-hidden"
            >
              <img
                src={post.image}
                alt="postimage"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex items-center gap-4 text-white">
                  <span className="flex items-center gap-1.5">
                    <HeartSolid className="h-5 w-5" />
                    <span className="text-sm font-semibold">
                      {post?.likes?.length ?? 0}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageCircleSolid className="h-5 w-5" />
                    <span className="text-sm font-semibold">
                      {post?.comments?.length ?? 0}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
          {(!displayedPost || displayedPost.length === 0) && (
            <p className="col-span-3 py-8 text-center text-sm text-muted-foreground">
              No posts yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const HeartSolid = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const MessageCircleSolid = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
  </svg>
);

export default Profile;
