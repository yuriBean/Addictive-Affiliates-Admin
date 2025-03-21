"use client";
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faApple, faFacebook, faGoogle, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import AuthLayout from './AuthLayout';
import { useAuth } from '../context/AuthContext';
import { saveSocialLink } from '../firebase/firestoreService';

const ConnectSocialMedia = ({ onNext, onBack }) => {
    const { user } = useAuth();
    const [socialLinks, setSocialLinks] = useState({
        Facebook: "",
        Google: "",
        Apple: "",
        Twitter: "",
        LinkedIn: "",
    });
    const [inputVisible, setInputVisible] = useState({});

    const socialOptions = [
        { name: 'Facebook', icon: faFacebook, color: 'bg-blue-600' },
        { name: 'Google', icon: faGoogle, color: 'bg-indigo-600' },
        { name: 'Apple', icon: faApple, color: 'bg-black' },
        { name: 'Twitter', icon: faTwitter, color: 'bg-sky-400' },
        { name: 'LinkedIn', icon: faLinkedin, color: 'bg-blue-800' },
    ];

    const handleChange = (platform, value) => {
        setSocialLinks((prev) => ({ ...prev, [platform]: value }));
    };

    const handleSave = async (platform) => {
        if (!user || !user.uid) {
            alert("You must be logged in to save social links.");
            return;
        }

        if (!socialLinks[platform]) {
            alert(`Please enter your ${platform} link.`);
            return;
        }
        const success = await saveSocialLink(user.uid, platform, socialLinks[platform]);
        setInputVisible((prev) => ({ ...prev, [platform]: false }));
        if (success) onNext();
    };

    const handleConnectClick = (platform) => {
        setInputVisible((prev) => ({ ...prev, [platform]: true })); 
    };

    const handleSkip = () => {
        onNext();
    }

    return (
        <AuthLayout width={'max-w-2xl'}>
            <h1 className="text-2xl md:text-3xl font-bold text-center text-primary mb-4">
                CONNECT YOUR SOCIAL MEDIA
            </h1>
            <p className="text-center mb-6 text-sm text-gray-600">
                Link your social media accounts to showcase your reach.
            </p>

            <div className="space-y-4">
                {socialOptions.map(({ name, icon }) => (
                    <div key={name} className="w-full flex items-center bg-white p-4 border border-secondary rounded-md">
                        <div className={`w-10 h-10 flex items-center justify-start text-secondary text-xl`}>
                            <FontAwesomeIcon icon={icon} />
                        </div>

                        <div className="flex-1 overflow-hidden ml-4">
                            {inputVisible[name] ? (
                                <div className="flex flex-col gap-2 w-full">
                                    <input
                                        type="url"
                                        placeholder={`Enter profile link`}
                                        className="p-2 border border-gray-300 rounded-md text-black text-sm md:text-lg outline-none"
                                        value={socialLinks[name] || ""}
                                        onChange={(e) => handleChange(name, e.target.value)}
                                    />
                                    <button
                                        className=" p-2 bg-secondary text-white text-sm rounded-md hover:bg-purple-800"
                                        onClick={() => handleSave(name)}
                                    >
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center w-full">
                                    <span className="font-medium text-gray-800 text-sm md:text-lg">{name}</span>
                                    <button
                                        className="p-2 bg-secondary text-white text-sm rounded-md hover:bg-purple-800"
                                        onClick={() => handleConnectClick(name)}
                                    >
                                        Connect
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div className='flex justify-end'>
                <button
                    className="px-4 py-2 text-secondary text-md rounded-md"
                    onClick={() => handleSkip()}
                >
                    Do it later
                </button>
                </div>
            </div>
        </AuthLayout>
    );
};

export default ConnectSocialMedia;
