import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-muted-foreground">
          Suggested for you
        </h1>
        <span className="cursor-pointer font-medium">See All</span>
      </div>
      {suggestedUsers.map((user) => {
        return (
          <div
            key={user._id}
            className="my-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Link to={`/profile/${user?._id}`}>
                <Avatar>
                  <AvatarImage src={user?.profilePicture} alt="post_image" />
                  <AvatarFallback>
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1 className="text-sm font-semibold">
                  <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                </h1>
                <span className="text-sm text-muted-foreground">
                  {user?.bio || 'Bio here...'}
                </span>
              </div>
            </div>
            <Button variant="link" size="sm" className="px-0 font-bold">
              Follow
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestedUsers;
