import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader } from './ui/card';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/auth-slice';
import { API_BASE_URL } from '@/lib/api';

const Login = () => {
  const [input, setInput] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const TEST_EMAIL = 'Marufkhan111@gmail.com';
  const TEST_PASSWORD = '123456';

  const signupHandler = async (e) => {
    e.preventDefault();
    if (loading) return;
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/api/v1/user/login`, input, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate('/');
        toast.success(res.data.message);
        setInput({
          email: '',
          password: '',
        });
      }
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.message || 'Unable to login. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loginAsTestUser = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/login`,
        { email: TEST_EMAIL, password: TEST_PASSWORD },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate('/');
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.message ||
        'Unable to sign in as test user. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted p-4">
      <form onSubmit={signupHandler} className="w-full max-w-sm">
        <Card className="w-full">
          <CardHeader className="items-center gap-1 text-center">
            <h1 className="text-xl font-bold">Vibesta</h1>
            <p className="text-sm text-muted-foreground">
              Login to see photos &amp; videos from your friends
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={input.password}
                onChange={changeEventHandler}
              />
            </div>
            {loading ? (
              <Button type="button" disabled className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full">
                Login
              </Button>
            )}
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-semibold text-primary">
                Signup
              </Link>
            </p>
            <div className="flex items-center gap-2 pt-1">
              <div className="h-px flex-1 bg-muted" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-muted" />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={loginAsTestUser}
              disabled={loading}
              className="w-full border-dashed text-muted-foreground"
            >
              Sign in as Test User
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default Login;
