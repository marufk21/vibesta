import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader } from './ui/card';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '@/lib/api';
import AuthLayout from './auth-layout';

const Signup = () => {
  const [input, setInput] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    if (loading) return;
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/register`,
        input,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (res.data && res.data.success) {
        toast.success(res.data.message);
        setInput({ username: '', email: '', password: '' });
        navigate('/login');
      } else {
        toast.error('Unexpected response from server.');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      const errorMessage =
        error?.response?.data?.message ||
        'An error occurred. Please try again.';
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
    <AuthLayout>
      <form onSubmit={signupHandler} className="w-full">
        <Card className="rounded-2xl border-border/60 bg-card/95 shadow-xl shadow-rose-100/50 backdrop-blur-sm">
          <CardHeader className="items-center gap-1 pb-2 pt-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
            <p className="text-sm text-muted-foreground">
              Signup to see photos &amp; videos from your friends
            </p>
          </CardHeader>
          <CardContent className="space-y-4 px-7 pb-8">
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                type="text"
                id="username"
                name="username"
                placeholder="username"
                value={input.username}
                onChange={changeEventHandler}
                className="h-11 rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={input.email}
                onChange={changeEventHandler}
                className="h-11 rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={input.password}
                onChange={changeEventHandler}
                className="h-11 rounded-lg"
              />
            </div>
            {loading ? (
              <Button type="button" disabled className="h-11 w-full rounded-lg">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-brand-gradient h-11 w-full rounded-lg font-semibold shadow-md shadow-rose-200 transition-all hover:shadow-lg hover:shadow-rose-200"
              >
                Signup
              </Button>
            )}
            <p className="pt-1 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-primary hover:underline"
              >
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </form>
    </AuthLayout>
  );
};

export default Signup;
