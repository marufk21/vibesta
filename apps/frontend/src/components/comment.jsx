import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const Comment = ({ comment }) => {
  const timeAgo = comment?.createdAt
    ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
    : '';

  return (
    <div className="group flex items-start gap-2.5 py-2">
      <Link to={`/profile/${comment?.author?._id}`} className="shrink-0">
        <Avatar className="h-7 w-7 border border-border">
          <AvatarImage src={comment?.author?.profilePicture} alt="profile" />
          <AvatarFallback className="text-[10px] font-semibold">
            {comment?.author?.username?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] leading-snug">
          <Link
            to={`/profile/${comment?.author?._id}`}
            className="font-bold hover:underline underline-offset-2 mr-1"
          >
            {comment?.author?.username}
          </Link>
          <span className="text-foreground/90 break-words">{comment?.text}</span>
        </p>
        {timeAgo && (
          <span className="mt-0.5 block text-[10px] text-muted-foreground">
            {timeAgo}
          </span>
        )}
      </div>
    </div>
  );
};

export default Comment;

