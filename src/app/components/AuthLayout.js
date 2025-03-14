"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const AuthLayout = ({ children, width }) => {
    return (
        <div className="bg-cover no-repeat pb-10 min-h-screen" style={{ backgroundImage: 'url(/bg.png)' }}>
            <div className='p-8 flex justify-between items-center'>
                <Link href="/">
                <Image 
                    src="/logo.png" 
                    alt="Addictive Affiliates Logo" 
                    width={100} 
                    height={50} 
                />
                </Link>
                <div>
                    <Link href="/contact">
                    <button 
                    className='text-black p-3 px-6 text-lg rounded-xl font-medium' style={{ backgroundColor: 'rgba(255, 255, 255, 0.46)'}}>
                        Contact Us
                    </button>
                    </Link>
                </div>
      
    </div>
            <div className={`${width} md:mx-auto mx-5 p-6 md:p-12 shadow-md rounded-3xl`} style={{ backgroundColor: 'rgba(255, 255, 255, 0.46)' }}>
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
