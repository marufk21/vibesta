import { setUserProfile } from '@/redux/auth-slice';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { API_BASE_URL } from '@/lib/api';

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const controller = new AbortController();
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/user/${userId}/profile`,
          { withCredentials: true, signal: controller.signal }
        );
        if (res.data.success) {
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        if (axios.isCancel(error)) return;
      }
    };
    fetchUserProfile();
    return () => controller.abort();
  }, [userId, dispatch]);
};
export default useGetUserProfile;
