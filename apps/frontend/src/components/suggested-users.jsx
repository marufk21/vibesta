import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

const VISIBLE_COUNT = 5;

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);
  const [showAll, setShowAll] = useState(false);

  const visibleUsers = showAll
    ? suggestedUsers
    : suggestedUsers.slice(0, VISIBLE_COUNT);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-muted-foreground">
          Suggested for you
        </h1>
        {suggestedUsers.length > VISIBLE_COUNT && (
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="cursor-pointer font-medium text-primary hover:underline"
          >
            {showAll ? 'See Less' : 'See All'}
          </button>
        )}
      </div>
      {visibleUsers.map((user) => {
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
      {visibleUsers.length === 0 && (
        <p className="py-4 text-sm text-muted-foreground">
          No suggestions right now.
        </p>
      )}
    </div>
  );
};

export default SuggestedUsers;
