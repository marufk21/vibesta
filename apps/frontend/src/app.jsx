import { useEffect } from 'react';
import ChatPage from './components/chat-page';
import EditProfile from './components/edit-profile';
import Home from './components/home';
import Login from './components/login';
import MainLayout from './components/main-layout';
import Profile from './components/profile';
import Signup from './components/signup';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from './redux/socket-slice';
import { setOnlineUsers } from './redux/chat-slice';
import { setLikeNotification } from './redux/rtn-slice';
import ProtectedRoutes from './components/protected-routes';
import { SOCKET_URL } from './lib/api';

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        ),
      },
      {
        path: '/profile/:id',
        element: (
          <ProtectedRoutes>
            {' '}
            <Profile />
          </ProtectedRoutes>
        ),
      },
      {
        path: '/account/edit',
        element: (
          <ProtectedRoutes>
            <EditProfile />
          </ProtectedRoutes>
        ),
      },
      {
        path: '/chat',
        element: (
          <ProtectedRoutes>
            <ChatPage />
          </ProtectedRoutes>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
]);

function App() {
  const { user } = useSelector((store) => store.auth);
  const { socket } = useSelector((store) => store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io(SOCKET_URL, {
        query: {
          userId: user?._id,
        },
        transports: ['websocket'],
      });
      dispatch(setSocket(socketio));

      // listen all the events
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return (
    <>
      <RouterProvider
        router={browserRouter}
        future={{ v7_startTransition: true }}
      />
    </>
  );
}

export default App;
