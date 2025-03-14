"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-transparent text-[#05182A99] font-semibold p-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/">
          <Image 
            src="/logo.png" 
            alt="Addictive Affiliates Logo" 
            width={100} 
            height={50} 
          />
        </Link>

        <div className="hidden sm:flex space-x-8">
          <Link href="/">
            <p className="hover:underline">Home</p>
          </Link>
          <Link href="/about">
            <p className="hover:underline">About</p>
          </Link>
          <Link href="/contact">
            <p className="hover:underline">Contact</p>
          </Link>

          <Link href="/signup" className='flex space-x-8'>
            <span>|</span>
            <p className="hover:underline">Signup</p>
          </Link>
        </div>

        <div className="sm:hidden">
          <button onClick={toggleMenu} className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden mt-4 space-y-4">
          <Link href="/">
            <p className="block hover:underline">Home</p>
          </Link>
          <Link href="/about">
            <p className="block hover:underline">About</p>
          </Link>
          <Link href="/contact">
            <p className="block hover:underline">Contact</p>
          </Link>
          <Link href="/signup">
            <p className="hover:underline border-t-2 border-gray-500 mt-3">Signup</p>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
