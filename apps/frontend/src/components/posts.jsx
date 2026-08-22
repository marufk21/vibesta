import Post from './post';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Sparkles, Camera } from 'lucide-react';
import CreatePost from './create-post';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import useGetAllPost from '@/hooks/use-get-all-post';

const FeedSkeleton = () => (
  <div className="w-full max-w-[540px]">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="mb-6 w-full max-w-[540px] overflow-hidden rounded-2xl border border-border bg-card shadow-xs"
      >
        <div className="flex items-center gap-3 px-3.5 py-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-2.5 w-16" />
          </div>
        </div>
        <Skeleton className="aspect-square w-full rounded-none" />
        <div className="space-y-2 p-4">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-2.5 w-3/4" />
        </div>
      </div>
    ))}
  </div>
);

const Posts = () => {
  const { posts } = useSelector((store) => store.post);
  const [createOpen, setCreateOpen] = useState(false);
  const { loading, loadingMore, hasMore, loadMore } = useGetAllPost();

  // Infinite scroll: load the next page when the sentinel enters the viewport.
  const sentinelRef = useRef(null);
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: '400px 0px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center">
        <FeedSkeleton />
      </div>
    );
  }

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

      {/* Infinite scroll sentinel */}
      {hasMore && (
        <div
          ref={sentinelRef}
          className="w-full flex items-center justify-center py-6"
        >
          {loadingMore ? (
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Loading more...
            </span>
          ) : (
            <span className="h-8 w-full" />
          )}
        </div>
      )}
    </div>
  );
};

export default Posts;
