import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import CommentDialog from './comment-dialog';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { setPosts, setSelectedPost } from '@/redux/post-slice';
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
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : '');
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
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/post/${post._id}/comment`,
        { text },
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
      console.log(error);
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
      console.log(error);
      toast.error(error.response.data.message);
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openComments = () => {
    dispatch(setSelectedPost(post));
    setOpen(true);
  };

  return (
    <div className="mb-8 w-full max-w-[470px] rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={post.author?.profilePicture} alt="post_image" />
            <AvatarFallback>
              {post.author?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold">{post.author?.username}</h1>
            {user?._id === post.author._id && (
              <Badge variant="secondary">Author</Badge>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Post options">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {post?.author?._id !== user?._id && (
              <DropdownMenuItem className="cursor-pointer font-semibold text-destructive">
                Unfollow
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="cursor-pointer">
              Add to favorites
            </DropdownMenuItem>
            {user && user?._id === post?.author._id && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={deletePostHandler}
                  className="cursor-pointer font-semibold text-destructive"
                >
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <img
        className="aspect-square w-full object-cover"
        src={post.image}
        alt="post_img"
      />

      <div className="flex items-center justify-between px-3 pt-3">
        <div className="flex items-center gap-3">
          <button
            onClick={likeOrDislikeHandler}
            aria-label="Like"
            className="transition-colors"
          >
            <Heart
              className={`h-6 w-6 ${liked ? 'fill-destructive text-destructive' : 'hover:text-muted-foreground'}`}
            />
          </button>
          <button
            onClick={openComments}
            aria-label="Comment"
            className="transition-colors hover:text-muted-foreground"
          >
            <MessageCircle className="h-6 w-6" />
          </button>
          <Send className="h-6 w-6 cursor-pointer hover:text-muted-foreground" />
        </div>
        <button
          onClick={bookmarkHandler}
          aria-label="Save"
          className="transition-colors hover:text-muted-foreground"
        >
          <Bookmark className="h-6 w-6" />
        </button>
      </div>

      <div className="px-3 pb-3 pt-1">
        <span className="block pb-1 text-sm font-semibold">
          {postLike} likes
        </span>
        <p className="text-sm">
          <span className="mr-2 font-semibold">{post.author?.username}</span>
          {post.caption}
        </p>
        {comment.length > 0 && (
          <span
            onClick={openComments}
            className="cursor-pointer text-sm text-muted-foreground"
          >
            View all {comment.length} comments
          </span>
        )}
      </div>

      <CommentDialog open={open} setOpen={setOpen} />

      <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-3">
        <Input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHandler}
          className="border-none px-0 shadow-none focus-visible:ring-0"
        />
        {text && (
          <button
            onClick={commentHandler}
            className="cursor-pointer text-sm font-semibold text-primary"
          >
            Post
          </button>
        )}
      </div>
    </div>
  );
};

export default Post;
