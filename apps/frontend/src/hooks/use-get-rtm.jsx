import { addMessage } from '@/redux/chat-slice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useGetRTM = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.socketio);

  // Register the "newMessage" listener exactly once per socket connection.
  // Uses the addMessage reducer (immutable push) so we never capture the whole
  // messages array in the closure — avoids stale data and listener churn.
  useEffect(() => {
    if (!socket) return undefined;

    const handleNewMessage = (newMessage) => {
      dispatch(addMessage(newMessage));
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, dispatch]);
};
export default useGetRTM;
