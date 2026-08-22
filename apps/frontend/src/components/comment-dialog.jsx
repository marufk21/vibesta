import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import { Heart, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { useDispatch, useSelector } from 'react-redux';
import Comment from './comment';
import axios from 'axios';
import { toast } from 'sonner';
import { addCommentToPost } from '@/redux/post-slice';
import { API_BASE_URL } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const { selectedPost } = useSelector((store) => store.post);
  const { user } = useSelector((store) => store.auth);
  const [comment, setComment] = useState([]);
  const scrollRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  // Auto-scroll to bottom when new comment arrives
  useEffect(() => {
    if (scrollRef.current) {
      const el = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (el) el.scrollTop = el.scrollHeight;
    }
  }, [comment]);

  const changeEventHandler = (e) => {
    setText(e.target.value);
  };

  const sendMessageHandler = async () => {
    if (!text.trim() || sending) return;
    try {
      setSending(true);
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/post/${selectedPost?._id}/comment`,
        { text: text.trim() },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);
        dispatch(
          addCommentToPost({
            postId: selectedPost._id,
            comment: res.data.comment,
          })
        );
        setText('');
      }
    } catch (error) {
      toast.error('Failed to post comment');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessageHandler();
    }
  };

  const postAge = selectedPost?.createdAt
    ? formatDistanceToNow(new Date(selectedPost.createdAt), { addSuffix: true })
    : '';

  const likeCount = selectedPost?.likes?.length ?? 0;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && setOpen(false)}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-4xl gap-0 overflow-hidden p-0 rounded-2xl shadow-2xl sm:flex sm:flex-row"
      >
        {/* Image Panel */}
        <div className="relative h-64 w-full shrink-0 bg-black sm:h-auto sm:w-1/2">
          <img
            src={selectedPost?.image}
            alt="post"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Panel */}
        <div className="flex w-full flex-col sm:w-1/2">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Link
              to={`/profile/${selectedPost?.author?._id}`}
              onClick={() => setOpen(false)}
            >
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage
                  src={selectedPost?.author?.profilePicture}
                  alt="profile"
                />
                <AvatarFallback className="text-xs font-semibold">
                  {selectedPost?.author?.username?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                to={`/profile/${selectedPost?.author?._id}`}
                onClick={() => setOpen(false)}
                className="text-xs font-bold hover:underline underline-offset-2 leading-none block"
              >
                {selectedPost?.author?.username}
              </Link>
              {postAge && (
                <span className="text-[10px] text-muted-foreground">{postAge}</span>
              )}
            </div>
          </div>

          {/* Caption */}
          {selectedPost?.caption && (
            <div className="border-b border-border px-4 py-3">
              <p className="text-[13px] leading-snug">
                <span className="font-bold mr-1.5">
                  {selectedPost?.author?.username}
                </span>
                <span className="text-foreground/90">{selectedPost.caption}</span>
              </p>
            </div>
          )}

          {/* Comments */}
          <ScrollArea ref={scrollRef} className="flex-1 px-4 py-2 min-h-0 max-h-[240px] sm:max-h-none">
            {comment.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <p className="text-xs font-semibold">No comments yet</p>
                <p className="text-[11px] mt-0.5">Be the first to comment.</p>
              </div>
            ) : (
              comment.map((c) => <Comment key={c._id} comment={c} />)
            )}
          </ScrollArea>

          {/* Likes + Timestamp */}
          <div className="border-t border-border px-4 py-2 flex items-center gap-2">
            <Heart className="h-4 w-4 text-muted-foreground" />
            <span className="text-[12px] font-semibold">
              {likeCount} {likeCount === 1 ? 'like' : 'likes'}
            </span>
          </div>

          {/* Comment Input */}
          <div className="border-t border-border px-3 py-2.5">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7 shrink-0 border border-border">
                <AvatarImage src={user?.profilePicture} alt="me" />
                <AvatarFallback className="text-[10px] font-semibold">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <Input
                type="text"
                value={text}
                onChange={changeEventHandler}
                onKeyDown={handleKeyDown}
                placeholder="Add a comment..."
                className="flex-1 h-8 rounded-full bg-muted/40 border-border text-xs px-3 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
              />
              <Button
                disabled={!text.trim() || sending}
                onClick={sendMessageHandler}
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-primary hover:text-primary/80 disabled:opacity-30"
                aria-label="Send comment"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;


