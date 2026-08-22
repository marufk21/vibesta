import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import useGetUserProfile from '@/hooks/use-get-user-profile';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser, setAuthUser } from '@/redux/auth-slice';
import { setPosts, setSelectedPost } from '@/redux/post-slice';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import FollowButton from './follow-button';
import FollowDialog from './follow-dialog';
import CommentDialog from './comment-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  AtSign,
  Grid,
  Bookmark,
  MoreHorizontal,
  MessageCircle,
  Share2,
  Copy,
  Image as ImageIcon,
  LogOut,
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/lib/api';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState('posts');
  const [followModalOpen, setFollowModalOpen] = useState(false);
  const [followModalTab, setFollowModalTab] = useState('followers');
  const [commentModalOpen, setCommentModalOpen] = useState(false);

  const { userProfile, user } = useSelector((store) => store.auth);

  const isLoggedInUserProfile = String(user?._id) === String(userProfile?._id);

  const displayedPost =
    activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

  const copyProfileLink = () => {
    const link = `${window.location.origin}/profile/${userProfile?._id}`;
    navigator.clipboard
      ?.writeText(link)
      .then(() => toast.success('Profile link copied!'))
      .catch(() => toast.error('Could not copy link.'));
  };

  const handleMessage = () => {
    if (userProfile) {
      dispatch(setSelectedUser(userProfile));
      navigate('/chat');
    }
  };

  const handlePostClick = (post) => {
    dispatch(setSelectedPost(post));
    setCommentModalOpen(true);
  };

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

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-10 lg:max-w-6xl">
      {/* Profile header */}
      <div className="flex flex-col gap-6 pb-8 md:flex-row md:items-start md:gap-12 lg:gap-16 border-b border-border">
        {/* Avatar with Story Ring style */}
        <div className="flex justify-center md:justify-start shrink-0">
          <div className="p-1 rounded-full avatar-story-ring shadow-sm">
            <Avatar className="h-24 w-24 md:h-36 md:w-36 border-4 border-background shadow-xs">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt={userProfile?.username || 'Profile picture'}
                className="object-cover"
              />
              <AvatarFallback className="text-3xl font-bold bg-muted text-foreground">
                {userProfile?.username?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex flex-1 flex-col gap-4 text-center md:text-left">
          {/* Username */}
          <div className="flex items-center justify-center md:justify-start">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              {userProfile?.username}
            </h1>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            {isLoggedInUserProfile ? (
              <>
                <Link to="/account/edit">
                  <Button variant="secondary" size="sm" className="h-9 px-4 font-medium">
                    Edit profile
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={copyProfileLink}
                  className="h-9 px-3 font-medium"
                >
                  <Share2 className="h-4 w-4 mr-1.5" />
                  Share
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={copyProfileLink} className="cursor-pointer">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy profile link
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {isLoggedInUserProfile && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={logoutHandler}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Log out
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <FollowButton targetUser={userProfile} />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleMessage}
                  className="h-9 px-3.5 font-medium"
                >
                  <MessageCircle className="h-4 w-4 mr-1.5" />
                  Message
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onClick={copyProfileLink} className="cursor-pointer">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy profile link
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-6 text-sm md:justify-start md:gap-8">
            <div>
              <span className="font-bold text-foreground">
                {userProfile?.posts?.length ?? 0}{' '}
              </span>
              <span className="text-muted-foreground">posts</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setFollowModalTab('followers');
                setFollowModalOpen(true);
              }}
              className="group text-left transition-colors hover:text-foreground focus:outline-none"
            >
              <span className="font-bold text-foreground group-hover:underline">
                {userProfile?.followers?.length ?? 0}{' '}
              </span>
              <span className="text-muted-foreground">followers</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setFollowModalTab('following');
                setFollowModalOpen(true);
              }}
              className="group text-left transition-colors hover:text-foreground focus:outline-none"
            >
              <span className="font-bold text-foreground group-hover:underline">
                {userProfile?.following?.length ?? 0}{' '}
              </span>
              <span className="text-muted-foreground">following</span>
            </button>
          </div>

          {/* Bio & Handle */}
          <div className="flex flex-col items-center gap-1.5 md:items-start">
            {userProfile?.bio && (
              <p className="text-sm text-foreground whitespace-pre-wrap max-w-xl">
                {userProfile.bio}
              </p>
            )}
            <Badge variant="secondary" className="w-fit gap-1 text-xs font-normal">
              <AtSign className="h-3 w-3" />
              <span>{userProfile?.username}</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="pt-2">
        <div className="flex items-center justify-center gap-8 text-xs font-semibold tracking-wider">
          <button
            type="button"
            onClick={() => setActiveTab('posts')}
            className={cn(
              'flex items-center gap-2 border-t-2 py-3 uppercase transition-colors',
              activeTab === 'posts'
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <Grid className="h-4 w-4" />
            <span>Posts</span>
          </button>

          {isLoggedInUserProfile && (
            <button
              type="button"
              onClick={() => setActiveTab('saved')}
              className={cn(
                'flex items-center gap-2 border-t-2 py-3 uppercase transition-colors',
                activeTab === 'saved'
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <Bookmark className="h-4 w-4" />
              <span>Saved</span>
            </button>
          )}
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-3 gap-2 py-4 md:gap-4 lg:gap-5">
          {displayedPost?.map((post) => (
            <div
              key={post?._id}
              onClick={() => handlePostClick(post)}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-muted shadow-xs transition-transform hover:scale-[1.01]"
            >
              <img
                src={post.image}
                alt="post"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <div className="flex items-center gap-5 text-white">
                  <span className="flex items-center gap-1.5 font-bold text-sm">
                    <HeartSolid className="h-5 w-5" />
                    {post?.likes?.length ?? 0}
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-sm">
                    <MessageCircleSolid className="h-5 w-5" />
                    {post?.comments?.length ?? 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {(!displayedPost || displayedPost.length === 0) && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted mb-3 text-muted-foreground">
              {activeTab === 'saved' ? (
                <Bookmark className="h-6 w-6" />
              ) : (
                <ImageIcon className="h-6 w-6" />
              )}
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              {activeTab === 'saved' ? 'No saved posts' : 'No posts yet'}
            </h3>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              {activeTab === 'saved'
                ? 'Save photos and videos that you want to see again.'
                : 'When photos or posts are shared, they will appear here.'}
            </p>
          </div>
        )}
      </div>

      <FollowDialog
        isOpen={followModalOpen}
        onClose={() => setFollowModalOpen(false)}
        initialTab={followModalTab}
        userId={userProfile?._id || userId}
        username={userProfile?.username}
      />

      <CommentDialog
        open={commentModalOpen}
        setOpen={setCommentModalOpen}
      />
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
