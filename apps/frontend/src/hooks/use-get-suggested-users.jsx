import { setSuggestedUsers } from '@/redux/auth-slice';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { API_BASE_URL } from '@/lib/api';

const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const controller = new AbortController();
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/v1/user/suggested`, {
          withCredentials: true,
          signal: controller.signal,
        });
        if (res.data.success) {
          dispatch(setSuggestedUsers(res.data.users));
        }
      } catch (error) {
        if (axios.isCancel(error)) return;
      }
    };
    fetchSuggestedUsers();
    return () => controller.abort();
  }, [dispatch]);
};
export default useGetSuggestedUsers;
