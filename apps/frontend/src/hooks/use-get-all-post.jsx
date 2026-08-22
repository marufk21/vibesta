import { setPosts, addPosts } from '@/redux/post-slice';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { API_BASE_URL } from '@/lib/api';

const PAGE_SIZE = 10;

const useGetAllPost = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);
  const activeControllerRef = useRef(null);

  const fetchPage = useCallback(
    async (page, isLoadMore) => {
      if (activeControllerRef.current) {
        activeControllerRef.current.abort();
      }
      const controller = new AbortController();
      activeControllerRef.current = controller;

      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);

      try {
        const res = await axios.get(`${API_BASE_URL}/api/v1/post/all`, {
          withCredentials: true,
          signal: controller.signal,
          params: { page, pageSize: PAGE_SIZE },
        });
        if (!res.data.success) return;
        if (page === 1) {
          dispatch(setPosts(res.data.posts));
        } else {
          dispatch(addPosts(res.data.posts));
        }
        setHasMore(Boolean(res.data.hasMore));
      } catch (error) {
        if (axios.isCancel(error)) return;
      } finally {
        if (isLoadMore) setLoadingMore(false);
        else setLoading(false);
        activeControllerRef.current = null;
      }
    },
    [dispatch]
  );

  useEffect(() => {
    pageRef.current = 1;
    fetchPage(1, false);
    return () => {
      if (activeControllerRef.current) {
        activeControllerRef.current.abort();
      }
    };
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    const next = pageRef.current + 1;
    pageRef.current = next;
    fetchPage(next, true);
  }, [fetchPage, loadingMore, hasMore]);

  return { loading, loadingMore, hasMore, loadMore };
};
export default useGetAllPost;
