import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader } from './ui/card';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Zap, ArrowRight, Lock, Mail } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/auth-slice';
import { API_BASE_URL } from '@/lib/api';
import AuthLayout from './auth-layout';

const Login = () => {
  const [input, setInput] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    if (loading || testLoading) return;
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
    if (loading || testLoading) return;
    try {
      setTestLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/v1/user/test-login`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate('/');
        toast.success(res.data.message || `Signed in as @${res.data.user?.username}`);
      }
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.message ||
        'Unable to sign in as test user. Please try again.';
      toast.error(errorMessage);
    } finally {
      setTestLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const isBusy = loading || testLoading;

  return (
    <AuthLayout
      title="Happening now."
      subtitle="Sign in to connect, share & explore."
    >
      <div className="w-full max-w-sm flex flex-col gap-2.5 sm:gap-3">
        {/* Instant Demo / Test User 1-Click Button */}
        <Button
          type="button"
          onClick={loginAsTestUser}
          disabled={isBusy}
          className="h-10 sm:h-11 w-full rounded-full border border-rose-200 dark:border-rose-900/60 bg-rose-500/10 text-rose-700 dark:text-rose-300 font-semibold text-xs sm:text-sm hover:bg-rose-500/15 hover:border-rose-300 dark:hover:border-rose-700 transition-all flex items-center justify-center gap-2 active:scale-[0.99] shadow-sm shadow-rose-500/5"
        >
          {testLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-rose-600 dark:text-rose-400" />
              <span>Signing in demo user...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>Sign in as Test User (1-Click Demo)</span>
            </>
          )}
        </Button>

        {/* 'or sign in with email' divider */}
        <div className="flex items-center gap-3 my-0.5">
          <div className="h-px flex-1 bg-rose-200/70 dark:bg-rose-900/50" />
          <span className="text-[11px] sm:text-xs text-rose-900/60 dark:text-rose-300/60 font-semibold uppercase tracking-wider">
            or with email
          </span>
          <div className="h-px flex-1 bg-rose-200/70 dark:bg-rose-900/50" />
        </div>

        {/* Direct Login Form */}
        <form onSubmit={signupHandler} className="flex flex-col gap-2.5 sm:gap-3">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs font-semibold text-rose-950/70 dark:text-rose-200/70">
              Email
            </Label>
            <div className="relative">
              <Mail className="w-4 h-4 text-rose-400 dark:text-rose-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="email"
                id="email"
                name="email"
                required
                placeholder="you@example.com"
                value={input.email}
                onChange={changeEventHandler}
                disabled={isBusy}
                className="h-9.5 sm:h-10 pl-10 text-sm rounded-xl bg-card/80 border-rose-200/70 dark:border-rose-900/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-rose-500/30 focus-visible:border-rose-500 transition shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" className="text-xs font-semibold text-rose-950/70 dark:text-rose-200/70">
              Password
            </Label>
            <div className="relative">
              <Lock className="w-4 h-4 text-rose-400 dark:text-rose-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="password"
                id="password"
                name="password"
                required
                placeholder="••••••••"
                value={input.password}
                onChange={changeEventHandler}
                disabled={isBusy}
                className="h-9.5 sm:h-10 pl-10 text-sm rounded-xl bg-card/80 border-rose-200/70 dark:border-rose-900/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-rose-500/30 focus-visible:border-rose-500 transition shadow-sm"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isBusy || !input.email || !input.password}
            className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:from-rose-700 hover:via-pink-700 hover:to-rose-600 text-white h-10 sm:h-10.5 mt-1 rounded-full font-bold shadow-md shadow-rose-500/30 hover:shadow-lg hover:shadow-rose-500/40 transition-all active:scale-[0.99] flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        {/* Legal disclaimer */}
        <p className="text-[11px] leading-tight text-muted-foreground text-center mt-0.5">
          By signing in, you agree to our{' '}
          <span className="text-rose-600 dark:text-rose-400 font-semibold underline underline-offset-2 hover:text-rose-700 cursor-pointer">
            Terms of Service
          </span>{' '}
          and{' '}
          <span className="text-rose-600 dark:text-rose-400 font-semibold underline underline-offset-2 hover:text-rose-700 cursor-pointer">
            Privacy Policy
          </span>
          .
        </p>

        {/* Switch to Signup */}
        <div className="mt-1 pt-2.5 border-t border-rose-200/60 dark:border-rose-900/40 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              className="font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:underline ml-1"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
