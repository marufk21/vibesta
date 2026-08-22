import { Suspense, lazy, useEffect, useRef } from 'react';
import MainLayout from './components/main-layout';
import ProtectedRoutes from './components/protected-routes';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from './redux/socket-slice';
import { setOnlineUsers } from './redux/chat-slice';
import { setLikeNotification } from './redux/rtn-slice';
import { SOCKET_URL } from './lib/api';

// Route-level code splitting. Heavy pages are lazy-loaded so they only
// download their JS chunk when the route is actually visited.
const Login = lazy(() => import('./components/login'));
const Signup = lazy(() => import('./components/signup'));
const Home = lazy(() => import('./components/home'));
const Profile = lazy(() => import('./components/profile'));
const EditProfile = lazy(() => import('./components/edit-profile'));
const ChatPage = lazy(() => import('./components/chat-page'));

// Loading fallback shown while a lazy chunk is being fetched.
const PageLoader = () => (
  <div className="flex min-h-screen w-full items-center justify-center">
    <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

// Wraps a route element with Suspense + a lightweight spinner fallback.
const lazyRoute = (node) => (
  <Suspense fallback={<PageLoader />}>{node}</Suspense>
);

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
        element: <ProtectedRoutes>{lazyRoute(<Home />)}</ProtectedRoutes>,
      },
      {
        path: '/profile/:id',
        element: (
          <ProtectedRoutes>
            {' '}
            {lazyRoute(<Profile />)}
          </ProtectedRoutes>
        ),
      },
      {
        path: '/account/edit',
        element: (
          <ProtectedRoutes>
            {lazyRoute(<EditProfile />)}
          </ProtectedRoutes>
        ),
      },
      {
        path: '/chat',
        element: (
          <ProtectedRoutes>
            {lazyRoute(<ChatPage />)}
          </ProtectedRoutes>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: lazyRoute(<Login />),
  },
  {
    path: '/signup',
    element: lazyRoute(<Signup />),
  },
]);

function App() {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  // Track the live socket locally so we can close the previous instance when the
  // user changes, WITHOUT subscribing to the socket in this effect. Putting
  // `socket` in the dependency array caused an infinite reconnect loop (create →
  // close → set null → re-run), spamming WebSocket errors and "Maximum update
  // depth" crashes.
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user?._id) {
      // No logged-in user: tear down any existing socket.
      socketRef.current?.close();
      socketRef.current = null;
      dispatch(setSocket(null));
      return;
    }

    const socketio = io(SOCKET_URL, {
      query: {
        userId: user?._id,
      },
      transports: ['websocket'],
    });
    socketRef.current = socketio;
    dispatch(setSocket(socketio));

    // listen all the events
    socketio.on('getOnlineUsers', (onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers));
    });

    socketio.on('notification', (notification) => {
      dispatch(setLikeNotification(notification));
    });

    // Cleanup only the socket this effect created.
    return () => {
      socketio.close();
      if (socketRef.current === socketio) socketRef.current = null;
      dispatch(setSocket(null));
    };
    // Depend on the primitive user id (not the user object reference) so the
    // socket isn't torn down & reconnected when auth state is updated with a
    // new object (e.g. bookmark / profile edits). The socket itself is NOT a
    // dependency — tracking it via ref avoids the reconnect feedback loop.
  }, [user?._id, dispatch]);

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
