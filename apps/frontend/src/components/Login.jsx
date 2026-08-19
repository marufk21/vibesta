import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const signupHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post('//vibesta.onrender.com/api/v1/user/login', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
                setInput({
                    email: "",
                    password: ""
                });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [])
    return (
        <div className="flex items-center w-screen h-screen justify-center bg-gray-100">
            <form
                onSubmit={signupHandler}
                className="shadow-lg flex flex-col gap-5 p-6 sm:p-8 border border-gray-200 rounded-md w-full max-w-sm bg-white"
            >
                <div className="my-4">
                    <h1 className="text-center font-bold text-xl">Vibesta</h1>
                    <p className="text-sm text-center text-gray-600">
                        Login to see photos & videos from your friends
                    </p>
                </div>
                <div>
                    <label htmlFor="email" className="font-medium">Email</label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2 w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="font-medium">Password</label>
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2 w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>
                {loading ? (
                    <Button>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                    </Button>
                ) : (
                    <Button type="submit">Login</Button>
                )}
                <span className="text-center text-sm text-gray-600">
                    Don't have an account?
                    <Link to="/signup" className="text-blue-600"> Signup</Link>
                </span>
            </form>
        </div>




    )
}

export default Login