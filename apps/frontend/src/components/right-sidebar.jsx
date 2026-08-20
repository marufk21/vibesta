import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SuggestedUsers from './suggested-users';

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="my-10 px-2">
      <div className="flex items-center gap-3">
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="post_image" />
            <AvatarFallback>
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-semibold truncate leading-tight">
            <Link to={`/profile/${user?._id}`} className="hover:underline">
              {user?.username}
            </Link>
          </h1>
          {user?.bio && (
            <span className="text-xs text-muted-foreground block truncate max-w-[160px] mt-0.5">
              {user.bio}
            </span>
          )}
        </div>
      </div>
      <SuggestedUsers />
    </div>
  );
};

export default RightSidebar;
