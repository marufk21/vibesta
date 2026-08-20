import { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
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
import { API_BASE_URL } from '@/lib/api';

const FollowDialog = ({ isOpen, onClose, initialTab = 'followers', userId, username }) => {
  const navigate = useNavigate();
  const { user: authUser } = useSelector((store) => store.auth);

  const [activeTab, setActiveTab] = useState(initialTab);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync activeTab when initialTab changes on dialog open
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setSearchQuery('');
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (!isOpen || !userId) return;

    let isMounted = true;
    const fetchList = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/user/${activeTab}/${userId}`,
          { withCredentials: true }
        );
        if (res.data.success && isMounted) {
          setUsers(res.data.users || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchList();

    return () => {
      isMounted = false;
    };
  }, [isOpen, userId, activeTab]);

  const filteredUsers = useMemo(() => {
    const validUsers = (users || []).filter(
      (u) => u && typeof u === 'object' && u._id && u.username
    );
    if (!searchQuery.trim()) return validUsers;
    const q = searchQuery.toLowerCase().trim();
    return validUsers.filter(
      (u) =>
        u.username?.toLowerCase().includes(q) ||
        u.bio?.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

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
              {username ? `@${username}` : 'Network'}
            </DialogTitle>
          </div>

          {/* Segmented Tabs */}
          <div className="grid grid-cols-2 gap-1 rounded-lg border border-border bg-muted/50 p-1 text-sm font-medium mt-2">
            <button
              type="button"
              onClick={() => setActiveTab('followers')}
              className={`rounded-md py-1.5 transition-colors text-center text-xs font-semibold ${
                activeTab === 'followers'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Followers
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('following')}
              className={`rounded-md py-1.5 transition-colors text-center text-xs font-semibold ${
                activeTab === 'following'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Following
            </button>
          </div>
        </DialogHeader>

        {/* Search input */}
        <div className="p-3 border-b border-border/50 bg-muted/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder={`Search ${activeTab}...`}
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

        {/* User list */}
        <div className="max-h-[380px] min-h-[220px] overflow-y-auto divide-y divide-border">
          {loading ? (
            <div className="p-3 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3.5 w-24" />
                      <Skeleton className="h-2.5 w-36" />
                    </div>
                  </div>
                  <Skeleton className="h-7 w-16 rounded-md" />
                </div>
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Users className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-xs font-semibold text-foreground">
                {searchQuery ? 'No matching users found' : `No ${activeTab} yet`}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[200px]">
                {searchQuery
                  ? `No user matches "${searchQuery}"`
                  : activeTab === 'followers'
                    ? 'No one is following this account yet.'
                    : 'This account is not following anyone yet.'}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 text-xs h-7"
                  onClick={() => setSearchQuery('')}
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            filteredUsers.map((u) => {
              const isCurrentUser = String(authUser?._id) === String(u._id);
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
                        {isCurrentUser && (
                          <span className="shrink-0 rounded bg-primary/10 px-1 py-0.2 text-[9px] text-primary font-medium">
                            You
                          </span>
                        )}
                        {!isCurrentUser && isFollowing && (
                          <span className="shrink-0 rounded bg-muted px-1 py-0.2 text-[9px] text-muted-foreground">
                            Following
                          </span>
                        )}
                      </div>
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

FollowDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialTab: PropTypes.oneOf(['followers', 'following']),
  userId: PropTypes.string,
  username: PropTypes.string,
};

export default FollowDialog;
