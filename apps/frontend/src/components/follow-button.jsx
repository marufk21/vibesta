import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, UserCheck, UserPlus } from 'lucide-react';
import { setAuthUser, setUserProfile } from '@/redux/auth-slice';
import { API_BASE_URL } from '@/lib/api';
import { Button } from './ui/button';

const FollowButton = ({ targetUser, size = 'sm', variant = 'default' }) => {
  const { user, userProfile } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const isFollowing = user?.following?.some(
    (id) => String(id) === String(targetUser?._id)
  );

  if (String(user?._id) === String(targetUser?._id)) {
    return null;
  }

  const handleFollow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading || !targetUser?._id) return;
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/followorunfollow/${targetUser._id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        const newFollowing = isFollowing
          ? (user?.following || []).filter(
              (id) => String(id) !== String(targetUser._id)
            )
          : [...(user?.following || []), targetUser._id];
        dispatch(setAuthUser({ ...user, following: newFollowing }));

        // Keep the own-profile counts in sync without a page reload.
        const isOwnProfile =
          userProfile && String(userProfile._id) === String(user?._id);
        if (isOwnProfile && userProfile) {
          const targetIdStr = String(targetUser._id);
          if (isFollowing) {
            dispatch(
              setUserProfile({
                ...userProfile,
                following: (userProfile.following || []).filter(
                  (id) => String(id) !== targetIdStr
                ),
              })
            );
          } else {
            dispatch(
              setUserProfile({
                ...userProfile,
                following: [...(userProfile.following || []), targetUser._id],
              })
            );
          }
        }

        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    if (variant === 'link' || variant === 'text') {
      return (
        <span className="inline-flex items-center text-xs text-muted-foreground px-2 py-1">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        </span>
      );
    }
    return (
      <Button size={size} variant="secondary" disabled>
        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
      </Button>
    );
  }

  if (variant === 'link' || variant === 'text') {
    return (
      <button
        type="button"
        onClick={handleFollow}
        className={`text-xs font-semibold cursor-pointer transition-colors ${
          isFollowing
            ? 'text-muted-foreground hover:text-foreground'
            : 'text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300'
        }`}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </button>
    );
  }

  return (
    <Button
      size={size}
      variant={isFollowing ? 'secondary' : 'default'}
      onClick={handleFollow}
      className={
        isFollowing
          ? 'bg-muted text-muted-foreground hover:bg-muted'
          : 'bg-primary hover:bg-primary/90'
      }
    >
      {isFollowing ? (
        <>
          <UserCheck className="mr-1 h-4 w-4" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="mr-1 h-4 w-4" />
          Follow
        </>
      )}
    </Button>
  );
};

FollowButton.propTypes = {
  targetUser: PropTypes.object.isRequired,
  size: PropTypes.string,
  variant: PropTypes.string,
};

export default FollowButton;
