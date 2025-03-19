"use client"
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faApple, faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import AuthLayout from './AuthLayout';
import { signUp } from '../firebase/auth';
import { useAuth } from '../context/AuthContext';

const AffiliateSignUpForm = ({ onNext }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        termsAccepted: false,
    });
    
    const { login } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (!formData.termsAccepted) {
            alert("You must accept the terms and conditions to proceed.");
            return;
        }

        try {
            const additionalData = {
                firstName:formData.firstName,
                lastName:formData.lastName,
                phone:formData.phone,
                role: 'advertiser',
            }
            const user = await signUp(formData.email, formData.password, additionalData);
            await login(email, password);
            console.log("User created successfully!", user);
            onNext(); 
        } catch (error) {
            console.error("Error during signup:", error);
            alert("Error during signup, please try again.");
        }
    };

    return (
        <AuthLayout width={'max-w-2xl'}>
            <h1 className="text-2xl md:text-3xl font-bold text-center text-primary mb-4">SIGN UP</h1>
            <p className="text-center mb-6 text-sm text-gray-600">Let’s get you all set up so you can access your account.</p>
            
            <form onSubmit={handleSubmit} className='text-black'>

            <div className="grid grid-cols-1 md:grid-cols-2 space-y-4 md:space-y-0 md:gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium " htmlFor="firstName">
                            First Name
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            className="w-full mt-1 p-2 border border-secondary rounded"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium " htmlFor="lastName">
                            Last Name
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            className="w-full mt-1 p-2 border border-secondary rounded"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 space-y-4 md:space-y-0 md:gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium " htmlFor="email">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="w-full mt-1 p-2 border border-secondary rounded"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium " htmlFor="phone">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            className="w-full mt-1 p-2 border border-secondary rounded"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
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
                            className="w-full mt-1 p-2 border border-secondary rounded"
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
                                <FontAwesomeIcon icon={faEyeSlash}  />
                            ) : (
                                <FontAwesomeIcon icon={faEye}  />
                            )}
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium " htmlFor="confirmPassword">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            id="confirmPassword"
                            className="w-full mt-1 p-2 border border-secondary rounded"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? (
                                <FontAwesomeIcon icon={faEyeSlash}  />
                            ) : (
                                <FontAwesomeIcon icon={faEye}  />
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        name="termsAccepted"
                        id="termsAccepted"
                        className="h-4 w-4 text-secondary border-secondary rounded"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="termsAccepted" className="ml-2 text-sm ">
                        I agree to the <a href="#" className="text-secondary font-bold">Terms and Policy</a>
                    </label>
                </div>

                <button
                    type="submit"
                    className="w-full py-2 mt-4 bg-secondary text-white rounded hover:bg-purple-800"
                >
                    Create Account
                </button>
            </form>

            <div className="mt-10 space-y-2 text-center">
                <p className="text-sm text-black ">
                    Already have an account? <a href="/login" className="text-secondary font-bold">Login</a>
                </p>
                <p className="text-sm text-black ">
                    Are you a business? <a href="/business-signup" className="text-secondary font-bold">Sign up here.</a>
                </p>
            </div>

            <div className="my-6 flex items-center justify-center space-x-4">
    <hr className="border-t-2 border-secondary flex-grow" />
    <p className="text-sm text-gray-600">Or Sign Up With</p>
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

export default AffiliateSignUpForm;
