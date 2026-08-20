import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Skeleton } from './ui/skeleton';
import { Search, X, Users } from 'lucide-react';
import FollowButton from './follow-button';
import useGetSuggestedUsers from '@/hooks/use-get-suggested-users';

const SuggestionsDialog = ({ isOpen, onClose }) => {
  useGetSuggestedUsers();
  const navigate = useNavigate();
  const { user: authUser, suggestedUsers } = useSelector((store) => store.auth);

  const [searchQuery, setSearchQuery] = useState('');

  const allSuggestions = useMemo(() => {
    return (suggestedUsers || []).filter(
      (u) => String(u._id) !== String(authUser?._id)
    );
  }, [suggestedUsers, authUser]);

  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return allSuggestions;
    const q = searchQuery.toLowerCase().trim();
    return allSuggestions.filter(
      (u) =>
        u.username?.toLowerCase().includes(q) ||
        u.bio?.toLowerCase().includes(q)
    );
  }, [allSuggestions, searchQuery]);

  const handleUserClick = (targetId) => {
    onClose();
    navigate(`/profile/${targetId}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden gap-0 rounded-2xl">
        <DialogHeader className="p-4 pb-3 border-b border-border">
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="text-base font-bold">
              Suggested for you
            </DialogTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            People you may know or want to follow
          </p>
        </DialogHeader>

        {/* Search input */}
        <div className="p-3 border-b border-border/50 bg-muted/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search suggestions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9 pr-8 text-xs bg-background"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="max-h-[380px] min-h-[220px] overflow-y-auto divide-y divide-border">
          {allSuggestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Users className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-xs font-semibold text-foreground">
                No suggestions right now
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[200px]">
                Check back later for new accounts to follow.
              </p>
            </div>
          ) : filteredSuggestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Users className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-xs font-semibold text-foreground">
                No matching users found
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[200px]">
                No user matches &quot;{searchQuery}&quot;
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 text-xs h-7"
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </Button>
            </div>
          ) : (
            filteredSuggestions.map((u) => {
              const isFollowing = authUser?.following?.some(
                (followingId) => String(followingId) === String(u._id)
              );

              return (
                <div
                  key={u._id}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-muted/30"
                >
                  <button
                    type="button"
                    onClick={() => handleUserClick(u._id)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <Avatar className="h-10 w-10 border border-border shrink-0">
                      <AvatarImage
                        src={u.profilePicture}
                        alt={u.username}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-xs font-semibold">
                        {u.username?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-xs font-semibold text-foreground hover:underline">
                          {u.username}
                        </span>
                        {isFollowing && (
                          <span className="shrink-0 rounded bg-muted px-1 py-0.2 text-[9px] text-muted-foreground">
                            Following
                          </span>
                        )}
                      </div>
                      <p className="truncate text-[11px] text-muted-foreground">
                        Suggested for you
                      </p>
                    </div>
                  </button>

                  <div className="shrink-0">
                    <FollowButton targetUser={u} variant="link" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

SuggestionsDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SuggestionsDialog;
