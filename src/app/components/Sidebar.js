"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut, faHome, faHamburger, faGear, faQuestionCircle, faContactBook, faCreditCard, faBullhorn, faUser, faTag } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
    const { user } = useAuth();
    const router = useRouter();
    const { logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);

      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);
    
    return (
        <div className='relative'>
            {isMobile ? (
                <>
                    <button
                        className="md:hidden p-2 rounded-br-lg absolute text-lg left-0 top-0 bg-gray-400 text-white"
                        onClick={() => setIsOpen(!isOpen)}
                     >
                        <FontAwesomeIcon icon={faHamburger} className='text-sm' />
                    </button>

                        <div className={`fixed inset-0 z-50 flex transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                            <button
                                className="md:hidden p-2 rounded-br-lg absolute text-lg left-0 top-0 bg-primary text-white"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <FontAwesomeIcon icon={faHamburger} />
                            </button>
                            <aside className="bg-gradient-to-b from-secondary via-[#4C8BCA] to-[#1976D2] text-white w-80 flex flex-col justify-between p-6 h-full">
                                <div className="flex items-center justify-center mb-8">
                                    <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
                                </div>

                                <nav className="flex-grow">
                                    <ul className="space-y-4 text-white">
                                        <a href={`/dashboard`} className='flex items-center p-2 rounded-3xl hover:bg-[#DFD9F1] hover:text-primary'>
                                            <li className='flex gap-1 items-center'>
                                                <FontAwesomeIcon icon={faHome} className='text-xl ml-2' />
                                                <button className="flex justify-between items-center w-full py-2 px-4 transition duration-300">
                                                    Dashboard
                                                </button>
                                            </li>
                                        </a>

                                        <a href={`/dashboard/campaigns`} className='flex items-center  p-2 rounded-3xl hover:bg-[#DFD9F1] hover:text-primary'>
                                            <li className='flex gap-1 items-center'>
                                                <FontAwesomeIcon icon={faBullhorn} className='text-xl ml-2' />
                                                <button className="flex justify-between items-center w-full py-2 px-4 transition duration-300">
                                                    Campaigns
                                                </button>
                                            </li>
                                        </a>

                                            <a href={`/dashboard/products`} className='flex items-center  p-2 rounded-3xl hover:bg-[#DFD9F1] hover:text-primary'>
                                            <li className='flex gap-1 items-center'>
                                                <FontAwesomeIcon icon={faTag} className='text-xl ml-2' />
                                                <button className="flex justify-between items-center w-full py-2 px-4 transition duration-300">
                                                    Products
                                                </button>
                                            </li>
                                        </a>


                                        <a href={`/dashboard/payments`} className='flex items-center  p-2 rounded-3xl hover:bg-[#DFD9F1] hover:text-primary'>
                                            <li className='flex gap-1 items-center'>
                                                <FontAwesomeIcon icon={faCreditCard} className='text-xl ml-2' />
                                                <button className="flex justify-between items-center w-full py-2 px-4 transition duration-300">
                                                    Payment
                                                </button>
                                            </li>
                                        </a>

                                        <a href={`/contact`} className='flex items-center  p-2 rounded-3xl hover:bg-[#DFD9F1] hover:text-primary'>
                                            <li className='flex gap-1 items-center'>
                                                <FontAwesomeIcon icon={faContactBook} className='text-xl ml-2' />
                                                <button className="flex justify-between items-center w-full py-2 px-4 transition duration-300">
                                                    Contact Us
                                                </button>
                                            </li>
                                        </a>

                                        <a href={`/dashboard/settings`} className='flex items-center  p-2 rounded-3xl hover:bg-[#DFD9F1] hover:text-primary'>
                                            <li className='flex gap-1 items-center'>
                                                <FontAwesomeIcon icon={faGear} className='text-xl ml-2' />
                                                <button className="flex justify-between items-center w-full py-2 px-4 transition duration-300">
                                                    Settings
                                                </button>
                                            </li>
                                        </a>

                                        <a href={`/dashboard/help`} className='flex items-center  p-2 rounded-3xl hover:bg-[#DFD9F1] hover:text-primary'>
                                            <li className='flex gap-1 items-center'>
                                                <FontAwesomeIcon icon={faQuestionCircle} className='text-xl ml-2' />
                                                <button className="flex justify-between items-center w-full py-2 px-4 transition duration-300">
                                                    Help
                                                </button>
                                            </li>
                                        </a>
                                    </ul>
                                </nav>

                                <div className="mt-auto text-xl">
                                    <a
                                        href={`/dashboard/profile`}
                                        className="flex items-center w-full py-2 px-4 rounded transition duration-300"
                                    >
                                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                                        Profile
                                    </a>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full py-2 px-4 rounded transition duration-300"
                                    >
                                        <FontAwesomeIcon icon={faSignOut} className="mr-2" />
                                        Logout
                                    </button>
                                </div>
                            </aside>
                        </div>
                </>
            ) : (
                <aside className="bg-gradient-to-b from-secondary via-[#4C8BCA] to-[#1976D2] text-white w-64 md:w-80 flex flex-col justify-between p-6 min-h-screen h-full">
                    <div className="flex items-center justify-center mb-8">
                        <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
                    </div>

                    <nav className="flex-grow">
                        <ul className="space-y-4 text-white">
                        <a href={`/dashboard`} className='flex items-center p-2 rounded-3xl hover:bg-[#DFD9F1] hover:text-primary'>
                                <li className='flex gap-1 items-center'>
                                    <FontAwesomeIcon icon={faHome} className='text-xl ml-2' />
                                    <button className="flex justify-between items-center w-full py-2 px-4 transition duration-300">
                                    Dashboard
                                    </button>
                                </li>
                            </a>

                            <a href={`/dashboard/campaigns`} className='flex items-center  p-2 rounded-3xl hover:bg-[#DFD9F1] hover:text-primary'>
                                <li className='flex gap-1 items-center'>
                                    <FontAwesomeIcon icon={faBullhorn} className='text-xl ml-2' />
                                    <button className="flex justify-between items-center w-full py-2 px-4 transition duration-300">
                                    Campaigns
                                    </button>
                                </li>
                            </a>

                                            <a href={`/dashboard/products`} className='flex items-center  p-2 rounded-3xl hover:bg-[#DFD9F1] hover:text-primary'>
                                            <li className='flex gap-1 items-center'>
                                                <FontAwesomeIcon icon={faTag} className='text-xl ml-2' />
                                                <button className="flex justify-between items-center w-full py-2 px-4 transition duration-300">
                                                    Products
                                                </button>
                                            </li>
                                        </a>

                            <a href={`/dashboard/payments`} className='flex items-center  p-2 rounded-3xl hover:bg-[#DFD9F1] hover:text-primary'>
                                <li className='flex gap-1 items-center'>
                                    <FontAwesomeIcon icon={faCreditCard} className='text-xl ml-2' />
                                    <button className="flex justify-between items-center w-full py-2 px-4 transition duration-300">
                                    Payment
                                    </button>
                                </li>
                            </a>

                            <a href='/contact' className='flex items-center  p-2 rounded-3xl hover:bg-[#DFD9F1] hover:text-primary'>
                                <li className='flex gap-1 items-center'>
                                    <FontAwesomeIcon icon={faContactBook} className='text-xl ml-2' />
                                    <button className="flex justify-between items-center w-full py-2 px-4 transition duration-300">
                                    Contact Us
                                    </button>
                                </li>
                            </a>

                            <a href='/dashboard/settings' className='flex items-center  p-2 rounded-3xl hover:bg-[#DFD9F1] hover:text-primary'>
                                <li className='flex gap-1 items-center'>
                                    <FontAwesomeIcon icon={faGear} className='text-xl ml-2' />
                                    <button className="flex justify-between items-center w-full py-2 px-4 transition duration-300">
                                    Settings
                                    </button>
                                </li>
                            </a>

                            <a href='/dashboard/help' className='flex items-center  p-2 rounded-3xl hover:bg-[#DFD9F1] hover:text-primary'>
                                <li className='flex gap-1 items-center'>
                                    <FontAwesomeIcon icon={faQuestionCircle} className='text-xl ml-2' />
                                    <button className="flex justify-between items-center w-full py-2 px-4 transition duration-300">
                                    Help
                                    </button>
                                </li>
                            </a>
                        </ul>
                    </nav>

                    <div className="mt-auto text-xl">
                        <a
                                        href='/dashboard/profile'
                                        className="flex items-center w-full py-2 px-4 rounded transition duration-300"
                                    >
                                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                                        Profile
                                    </a>
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full py-2 px-4 rounded transition duration-300"
                        >
                            <FontAwesomeIcon icon={faSignOut} className="mr-2" />
                            Logout
                        </button>
                    </div>
                </aside>
            )}
        </div>
    );
};

export default Sidebar;
