import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { useDispatch, useSelector } from 'react-redux';
import Comment from './Comment';
import axios from 'axios';
import { toast } from 'sonner';
import { setPosts } from '@/redux/postSlice';
import { API_BASE_URL } from '@/lib/api';

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState('');
  const { selectedPost, posts } = useSelector((store) => store.post);
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText('');
    }
  };

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/post/${selectedPost?._id}/comment`,
        { text },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, comments: updatedCommentData }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl gap-0 overflow-hidden p-0 sm:flex sm:flex-row"
      >
        {/* Image - full width on mobile, half on desktop */}
        <div className="h-56 w-full shrink-0 sm:h-auto sm:w-1/2">
          <img
            src={selectedPost?.image}
            alt="post_img"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Comments column */}
        <div className="flex w-full flex-col justify-between sm:w-1/2">
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-3">
              <Link to={`/profile/${selectedPost?.author?._id}`}>
                <Avatar>
                  <AvatarImage
                    src={selectedPost?.author?.profilePicture}
                    alt="profile"
                  />
                  <AvatarFallback>
                    {selectedPost?.author?.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <Link
                to={`/profile/${selectedPost?.author?._id}`}
                className="text-sm font-semibold"
              >
                {selectedPost?.author?.username}
              </Link>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Options">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="flex w-fit flex-col items-center gap-2 text-center text-sm">
                <span className="cursor-pointer font-bold text-destructive">
                  Unfollow
                </span>
                <span className="cursor-pointer">Add to favorites</span>
              </DialogContent>
            </Dialog>
          </div>

          <ScrollArea className="h-56 flex-1 p-4 sm:h-80">
            {comment.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No comments yet. Be the first!
              </p>
            ) : (
              comment.map((c) => <Comment key={c._id} comment={c} />)
            )}
          </ScrollArea>

          <div className="border-t border-border p-4">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={text}
                onChange={changeEventHandler}
                placeholder="Add a comment..."
                className="focus-visible:ring-0"
              />
              <Button
                disabled={!text.trim()}
                onClick={sendMessageHandler}
                variant="outline"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
