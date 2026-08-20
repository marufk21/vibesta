import { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2, ImagePlus, X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/post-slice';
import { API_BASE_URL } from '@/lib/api';

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const handleFile = async (selectedFile) => {
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        toast.error('Please select a valid image file.');
        return;
      }
      setFile(selectedFile);
      const dataUrl = await readFileAsDataURL(selectedFile);
      setImagePreview(dataUrl);
    }
  };

  const fileChangeHandler = async (e) => {
    const selectedFile = e.target.files?.[0];
    await handleFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    await handleFile(droppedFile);
  };

  const clearImage = () => {
    setFile(null);
    setImagePreview('');
    if (imageRef.current) imageRef.current.value = '';
  };

  const handleClose = () => {
    if (loading) return;
    setOpen(false);
    clearImage();
    setCaption('');
  };

  const createPostHandler = async () => {
    if (!imagePreview) {
      toast.error('Please select an image to share.');
      return;
    }

    const formData = new FormData();
    formData.append('caption', caption);
    if (file) formData.append('image', file);

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/post/addpost`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success('Post shared successfully!');
        handleClose();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent
        onInteractOutside={(e) => {
          if (loading) e.preventDefault();
        }}
        className="max-w-lg p-0 overflow-hidden gap-0 rounded-2xl shadow-xl"
      >
        <DialogHeader className="p-4 border-b border-border text-center relative">
          <DialogTitle className="text-sm font-bold tracking-tight">
            Create new post
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4">
          {/* User Header */}
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarImage src={user?.profilePicture} alt={user?.username} />
              <AvatarFallback className="text-xs font-semibold">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-bold leading-none">{user?.username}</p>
              <span className="text-[11px] text-muted-foreground">
                Public post
              </span>
            </div>
          </div>

          {/* Caption */}
          <div className="relative">
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={500}
              placeholder="Write a caption..."
              className="resize-none min-h-[70px] text-xs rounded-xl border-border bg-muted/30 focus-visible:ring-primary/30 placeholder:text-muted-foreground"
            />
            <span className="absolute right-2.5 bottom-2 text-[10px] text-muted-foreground">
              {caption.length}/500
            </span>
          </div>

          {/* Upload Dropzone or Preview */}
          {!imagePreview ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => imageRef.current?.click()}
              className={`flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed transition-colors cursor-pointer text-center ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground/50 bg-muted/20'
              }`}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                <ImagePlus className="h-6 w-6" />
              </div>
              <p className="text-xs font-semibold text-foreground">
                Drag photos here or click to browse
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Supports JPG, PNG, WEBP, GIF
              </p>
            </div>
          ) : (
            <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-border bg-muted/40 group">
              <img
                src={imagePreview}
                alt="Upload preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors shadow-md cursor-pointer"
                title="Remove photo"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <input
            ref={imageRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={fileChangeHandler}
          />
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-border bg-muted/20 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={loading}
            onClick={handleClose}
            className="text-xs h-8"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!imagePreview || loading}
            onClick={createPostHandler}
            className="text-xs font-semibold h-8 gap-1.5 px-4"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Sharing...
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                Share Post
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
