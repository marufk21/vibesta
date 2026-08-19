import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Comment = ({ comment }) => {
  return (
    <div className="mb-3">
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment?.author?.profilePicture} alt="profile" />
          <AvatarFallback>
            {comment?.author?.username?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <p className="text-sm">
          <span className="font-semibold">{comment?.author.username}</span>{' '}
          <span className="pl-1 text-foreground/90">{comment?.text}</span>
        </p>
      </div>
    </div>
  );
};

export default Comment;
