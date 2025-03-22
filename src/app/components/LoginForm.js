"use client";
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import AuthLayout from './AuthLayout';
import { faApple, faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { login } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const {user} = useAuth();

    useEffect (() => {
        if (user) {
          router.push ("/dashboard");
        }
        setLoading(false);
    
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const loggedUser = await login(formData.email, formData.password);
            console.log("User logged in successfully:", loggedUser);
            router.push('/dashboard');

        } catch (error) {
            console.error("Error during login:", error);
            setError(error.message || "Error during login, please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <AuthLayout width={'max-w-xl'}>
            <h1 className="text-2xl md:text-3xl font-bold text-center text-primary mb-4">LOGIN</h1>
            <p className="text-center mb-6 text-sm text-gray-600">Enter your credentials to access your account.</p>
            
            <form onSubmit={handleSubmit} className='text-black'>

                <div className="mb-4">
                    <label className="block text-sm font-medium " htmlFor="email">
                        Email Address
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        className="w-full mt-1 p-2 text-sm md:text-md border border-secondary rounded"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium " htmlFor="password">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            id="password"
                            className="w-full mt-1 p-2 text-sm md:text-md border border-secondary rounded"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <FontAwesomeIcon icon={faEyeSlash} />
                            ) : (
                                <FontAwesomeIcon icon={faEye} />
                            )}
                        </button>
                    </div>

                </div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                    <input
                        type="checkbox"
                        name="rememberMe"
                        id="rememberMe"
                        className="h-4 w-4 text-secondary border-secondary rounded"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                    />
                    <label htmlFor="rememberMe" className="ml-2 text-sm ">
                        Remember Me
                    </label>
                    </div>
                    <div >
                        <a href="/forgot-password" className="text-sm text-secondary font-bold">
                            Forgot Password?
                        </a>
            </div>
                </div>
                <button
                    type="submit"
                    className="w-full py-2 mt-4 bg-secondary text-white rounded hover:bg-purple-800"
                >
                    
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            {error && <p className='text-red-500'>{error}</p>}

            <div className="mt-4 text-center">
                <p className="text-sm text-black ">
                    Don't have an account? <a href="/signup" className="text-secondary font-bold">Sign Up</a>
                </p>
            </div>

            <div className="my-6 flex items-center justify-center space-x-4">
                <hr className="border-t-2 border-secondary flex-grow" />
                <p className="text-sm text-gray-600">Or Login With</p>
                <hr className="border-t-2 border-secondary flex-grow" />
            </div>

            <div className="flex flex-col md:flex-row justify-center space-x-0 md:space-x-4 space-y-3 md:space-y-0 mb-4">
                <div className='border-2 border-secondary px-12 py-2 rounded flex items-center justify-center'>
                    <button className="w-8 h-8 rounded-full bg-blue-600 text-white">
                        <FontAwesomeIcon icon={faFacebook} />
                    </button>
                </div>
                <div className='flex items-center justify-center border-2 border-secondary px-12 py-2 rounded'>
                    <button className="w-8 h-8 rounded-full bg-indigo-600 text-white">
                        <FontAwesomeIcon icon={faGoogle} />
                    </button>
                </div>
                <div className='flex items-center justify-center border-2 border-secondary px-12 py-2 rounded'>
                    <button className="w-8 h-8 rounded-full bg-black text-white">
                        <FontAwesomeIcon icon={faApple} />
                    </button>
                </div>
            </div>
        </AuthLayout>
    );
};

export default LoginForm;
