import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import axios from 'axios';
import { Camera, Loader2, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/auth-slice';
import { API_BASE_URL } from '@/lib/api';

const EditProfile = () => {
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture,
    bio: user?.bio || '',
    gender: user?.gender || '',
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, profilePhoto: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };

  const editProfileHandler = async () => {
    const formData = new FormData();
    formData.append('bio', input.bio);
    formData.append('gender', input.gender);
    if (input.profilePhoto && typeof input.profilePhoto !== 'string') {
      formData.append('profilePhoto', input.profilePhoto);
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/profile/edit`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res.data.user?.bio,
          profilePicture: res.data.user?.profilePicture,
          gender: res.data.user?.gender,
        };
        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${user?._id}`);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl md:max-w-3xl px-4 py-6 md:px-8 md:py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

      {/* Avatar Section */}
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-muted/30 p-5 mb-6">
        <div className="relative group cursor-pointer" onClick={() => imageRef?.current.click()}>
          <Avatar className="h-16 w-16 border-2 border-border">
            <AvatarImage
              src={previewUrl || user?.profilePicture}
              alt={user?.username}
            />
            <AvatarFallback className="text-lg font-bold">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold leading-none">{user?.username}</p>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {user?.email}
          </p>
          <button
            type="button"
            onClick={() => imageRef?.current.click()}
            className="mt-1.5 text-xs text-primary font-semibold hover:underline underline-offset-2 cursor-pointer"
          >
            Change profile photo
          </button>
        </div>
        <input
          ref={imageRef}
          onChange={fileChangeHandler}
          type="file"
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Bio */}
      <div className="space-y-2 mb-5">
        <label className="text-sm font-bold">Bio</label>
        <div className="relative">
          <Textarea
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            name="bio"
            maxLength={150}
            placeholder="Write something about yourself..."
            className="resize-none rounded-xl bg-muted/30 border-border focus-visible:ring-primary/30 placeholder:text-muted-foreground text-sm min-h-[80px]"
          />
          <span className="absolute right-3 bottom-2.5 text-[10px] text-muted-foreground">
            {input.bio.length}/150
          </span>
        </div>
      </div>

      {/* Gender */}
      <div className="space-y-2 mb-8">
        <label className="text-sm font-bold">Gender</label>
        <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
          <SelectTrigger className="w-full rounded-xl bg-muted/30 border-border text-sm">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={loading}
          onClick={() => navigate(`/profile/${user?._id}`)}
          className="text-sm"
        >
          Cancel
        </Button>
        <Button
          onClick={editProfileHandler}
          disabled={loading}
          size="sm"
          className="text-sm gap-1.5 px-5"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default EditProfile;



