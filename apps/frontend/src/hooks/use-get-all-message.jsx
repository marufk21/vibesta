import { setMessages } from '@/redux/chat-slice';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { API_BASE_URL } from '@/lib/api';

const useGetAllMessage = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.auth);
  useEffect(() => {
    const controller = new AbortController();
    const fetchAllMessage = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/message/all/${selectedUser?._id}`,
          { withCredentials: true, signal: controller.signal }
        );
        if (res.data.success) {
          dispatch(setMessages(res.data.messages));
        }
      } catch (error) {
        if (axios.isCancel(error)) return;
      }
    };
    fetchAllMessage();
    return () => controller.abort();
  }, [selectedUser, dispatch]);
};
export default useGetAllMessage;
