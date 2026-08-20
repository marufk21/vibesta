import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import FollowButton from './follow-button';
import SuggestionsDialog from './suggestions-dialog';

const VISIBLE_COUNT = 5;

const SuggestedUsers = () => {
  const { suggestedUsers, user: authUser } = useSelector((store) => store.auth);
  const [suggestionsModalOpen, setSuggestionsModalOpen] = useState(false);

  const filteredUsers = (suggestedUsers || []).filter(
    (u) => String(u._id) !== String(authUser?._id)
  );

  const visibleUsers = filteredUsers.slice(0, VISIBLE_COUNT);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between text-sm mb-3">
        <span className="font-semibold text-muted-foreground text-xs tracking-tight">
          Suggested for you
        </span>
        {filteredUsers.length > VISIBLE_COUNT && (
          <button
            type="button"
            onClick={() => setSuggestionsModalOpen(true)}
            className="text-xs font-semibold text-foreground hover:text-muted-foreground cursor-pointer transition-colors"
          >
            See all
          </button>
        )}
      </div>

      <div className="space-y-3.5">
        {visibleUsers.map((user) => {
          return (
            <div
              key={user._id}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <Link to={`/profile/${user?._id}`} className="shrink-0">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage
                      src={user?.profilePicture}
                      alt={user?.username}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-xs font-semibold">
                      {user?.username?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-xs font-semibold leading-tight text-foreground hover:underline">
                    <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                  </h4>
                  <span className="block truncate text-[11px] leading-tight text-muted-foreground mt-0.5">
                    Suggested for you
                  </span>
                </div>
              </div>
              <div className="shrink-0">
                <FollowButton targetUser={user} variant="link" />
              </div>
            </div>
          );
        })}
      </div>

      {visibleUsers.length === 0 && (
        <p className="py-3 text-xs text-muted-foreground">
          No suggestions available right now.
        </p>
      )}

      <SuggestionsDialog
        isOpen={suggestionsModalOpen}
        onClose={() => setSuggestionsModalOpen(false)}
      />
    </div>
  );
};

export default SuggestedUsers;
