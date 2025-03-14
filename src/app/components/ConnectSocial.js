"use client";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faApple, faFacebook, faGoogle, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import AuthLayout from './AuthLayout';

const ConnectSocialMedia = ({ onNext, onBack }) => {
    const socialOptions = [
        { name: 'Facebook', icon: faFacebook, color: 'bg-blue-600' },
        { name: 'Google', icon: faGoogle, color: 'bg-indigo-600' },
        { name: 'Apple', icon: faApple, color: 'bg-black' },
        { name: 'Twitter', icon: faTwitter, color: 'bg-sky-400' },
        { name: 'LinkedIn', icon: faLinkedin, color: 'bg-blue-800' },
    ];

    const handleConnect = (platform) => {
        alert(`Connecting to ${platform}`);
        onNext();
    };

    return (
        <AuthLayout width={'max-w-2xl'}>
            <h1 className="text-3xl font-bold text-center text-primary mb-4">CONNECT YOUR SOCIAL MEDIA</h1>
            <p className="text-center mb-6 text-sm text-gray-600">
            Link your social media accounts to showcase your reach.
            </p>

            <div className="flex flex-col space-y-4">
                {socialOptions.map(({ name, icon, color }) => (
                    <div
                        key={name}
                        className="flex items-center justify-between bg-white p-4 border border-secondary rounded"
                    >
                        <div className="flex items-center space-x-4">
                            <div
                                className={`w-10 h-10 flex items-center justify-center text-secondary text-xl`}
                            >
                                <FontAwesomeIcon icon={icon} />
                            </div>
                            <span className="font-medium text-gray-800">{name}</span>
                        </div>
                        <button
                            className="py-2 px-6 bg-secondary text-white rounded hover:bg-purple-800"
                            onClick={() => handleConnect(name)}
                        >
                            Connect
                        </button>
                    </div>
                ))}
            </div>
        </AuthLayout>
    );
};

export default ConnectSocialMedia;
