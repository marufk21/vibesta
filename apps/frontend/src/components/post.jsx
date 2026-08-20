import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
  Trash2,
  UserX,
  Copy,
  Sparkles,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import CommentDialog from './comment-dialog';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { setPosts, setSelectedPost } from '@/redux/post-slice';
import { setAuthUser } from '@/redux/auth-slice';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { API_BASE_URL } from '@/lib/api';

const Post = ({ post }) => {
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const lastTapRef = useRef(0);

  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post?.likes?.length || 0);
  const [comment, setComment] = useState(post?.comments || []);
  const dispatch = useDispatch();

  const isBookmarked = (user?.bookmarks || []).some(
    (b) => (typeof b === 'string' ? b : b?._id) === post?._id
  );

  const changeEventHandler = (e) => {
    setText(e.target.value);
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? 'dislike' : 'like';
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Trigger double tap
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 800);
      if (!liked) {
        likeOrDislikeHandler();
      }
    }
    lastTapRef.current = now;
  };

  const commentHandler = async (e) => {
    if (e) e.preventDefault();
    if (!text.trim() || isSubmittingComment) return;

    try {
      setIsSubmittingComment(true);
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/post/${post._id}/comment`,
        { text: text.trim() },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);
        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText('');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `${API_BASE_URL}/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to delete post');
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/post/${post?._id}/bookmark`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        if (user) {
          const currentBookmarks = user.bookmarks || [];
          const updatedBookmarks =
            res.data.type === 'saved'
              ? [...currentBookmarks, post._id]
              : currentBookmarks.filter(
                  (b) => (typeof b === 'string' ? b : b?._id) !== post._id
                );
          dispatch(setAuthUser({ ...user, bookmarks: updatedBookmarks }));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/profile/${post?.author?._id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by ${post?.author?.username}`,
          text: post?.caption || 'Check out this post on Vibesta',
          url: postUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          navigator.clipboard.writeText(postUrl);
          toast.success('Post link copied to clipboard!');
        }
      }
    } else {
      navigator.clipboard.writeText(postUrl);
      toast.success('Post link copied to clipboard!');
    }
  };

  const openComments = () => {
    dispatch(setSelectedPost(post));
    setOpen(true);
  };

  return (
    <article className="mb-6 w-full max-w-[540px] overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-shadow hover:shadow-md">
      {/* Post Header */}
      <div className="flex items-center justify-between px-3.5 py-3">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.author?._id}`} className="shrink-0">
            <Avatar className="h-9 w-9 border border-border transition-transform hover:scale-105">
              <AvatarImage
                src={post.author?.profilePicture}
                alt={post.author?.username}
                className="object-cover"
              />
              <AvatarFallback className="text-xs font-semibold">
                {post.author?.username?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to={`/profile/${post.author?._id}`}
              className="text-xs font-semibold text-foreground hover:underline"
            >
              {post.author?.username}
            </Link>
            {user?._id === post.author?._id && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Author
              </span>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label="Post options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg">
            <DropdownMenuItem onClick={handleShare} className="cursor-pointer text-xs">
              <Copy className="h-4 w-4 mr-2" />
              Copy link
            </DropdownMenuItem>
            <DropdownMenuItem onClick={bookmarkHandler} className="cursor-pointer text-xs">
              <Bookmark className="h-4 w-4 mr-2" />
              {isBookmarked ? 'Remove from saved' : 'Save post'}
            </DropdownMenuItem>
            {user && user?._id === post?.author?._id && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={deletePostHandler}
                  className="cursor-pointer text-xs font-semibold text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete post
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Post Image with Double-Tap to Like */}
      <div
        onClick={handleImageDoubleTap}
        className="relative aspect-square w-full cursor-pointer select-none overflow-hidden bg-muted/40"
      >
        <img
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.01]"
          src={post.image}
          alt={post.caption || 'post image'}
          loading="lazy"
        />

        {/* Double-Tap Heart Burst Animation */}
        {showHeartBurst && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Heart className="h-24 w-24 fill-white text-white drop-shadow-2xl animate-heart-burst" />
          </div>
        )}
      </div>

      {/* Post Action Buttons */}
      <div className="flex items-center justify-between px-3.5 pt-3">
        <div className="flex items-center gap-4 sm:gap-5">
          <button
            onClick={likeOrDislikeHandler}
            aria-label="Like"
            className="cursor-pointer transition-transform active:scale-90"
          >
            <Heart
              className={`h-6 w-6 transition-all duration-200 ${
                liked
                  ? 'fill-rose-500 text-rose-500 animate-like-bounce'
                  : 'text-foreground hover:text-muted-foreground'
              }`}
            />
          </button>
          <button
            onClick={openComments}
            aria-label="Comment"
            className="cursor-pointer text-foreground transition-transform hover:text-muted-foreground active:scale-90"
          >
            <MessageCircle className="h-6 w-6" />
          </button>
          <button
            onClick={handleShare}
            aria-label="Share"
            className="cursor-pointer text-foreground transition-all hover:text-muted-foreground hover:scale-105 active:scale-90"
            title="Share post"
          >
            <svg
              aria-label="Share Post"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <button
          onClick={bookmarkHandler}
          aria-label="Bookmark"
          className="cursor-pointer transition-transform active:scale-90"
        >
          <Bookmark
            className={`h-6 w-6 transition-colors ${
              isBookmarked
                ? 'fill-foreground text-foreground'
                : 'text-foreground hover:text-muted-foreground'
            }`}
          />
        </button>
      </div>

      {/* Likes & Caption */}
      <div className="px-3.5 pb-2 pt-1.5 space-y-1">
        <span className="block text-xs font-bold text-foreground">
          {postLike.toLocaleString()} {postLike === 1 ? 'like' : 'likes'}
        </span>
        {post.caption && (
          <p className="text-xs text-foreground leading-relaxed">
            <Link
              to={`/profile/${post.author?._id}`}
              className="mr-1.5 font-bold hover:underline"
            >
              {post.author?.username}
            </Link>
            {post.caption}
          </p>
        )}
        {comment.length > 0 && (
          <button
            type="button"
            onClick={openComments}
            className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground transition-colors block pt-0.5"
          >
            View all {comment.length} {comment.length === 1 ? 'comment' : 'comments'}
          </button>
        )}
      </div>

      <CommentDialog open={open} setOpen={setOpen} />

      {/* Inline Comment Bar */}
      <form
        onSubmit={commentHandler}
        className="flex items-center justify-between gap-2 border-t border-border px-3.5 py-2.5 bg-card"
      >
        <Input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHandler}
          className="h-8 border-none bg-transparent px-0 text-xs shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
        />
        {text.trim() && (
          <button
            type="submit"
            disabled={isSubmittingComment}
            className="cursor-pointer text-xs font-bold text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
          >
            {isSubmittingComment ? 'Posting...' : 'Post'}
          </button>
        )}
      </form>
    </article>
  );
};

export default Post;
