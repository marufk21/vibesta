import Post from './post';
import { useSelector } from 'react-redux';
import { Sparkles, Camera } from 'lucide-react';
import { useState } from 'react';
import CreatePost from './create-post';
import { Button } from './ui/button';

const Posts = () => {
  const { posts } = useSelector((store) => store.post);
  const [createOpen, setCreateOpen] = useState(false);

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center max-w-[540px] w-full my-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
          <Camera className="h-7 w-7" />
        </div>
        <h3 className="text-base font-bold text-foreground">Welcome to your Feed</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
          Follow new creators or share your own photos to get started on Vibesta.
        </p>
        <Button
          size="sm"
          onClick={() => setCreateOpen(true)}
          className="mt-4 text-xs font-semibold gap-1.5"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Create First Post
        </Button>
        <CreatePost open={createOpen} setOpen={setCreateOpen} />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
