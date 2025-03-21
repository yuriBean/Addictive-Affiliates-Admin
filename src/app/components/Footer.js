"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhoneVolume } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-accent text-[#05182AE5] py-16 px-6 sm:px-12 overflow-hidden">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="text-center md:text-left">
          <h2 className="text-3xl mb-4">Unlock the path to success with affiliate marketing.</h2>
        </div>
        <div className="text-center md:text-left">
        <div className='w-full h-1 bg-black mb-10'></div>

          <p className="text-sm">
          Affiliate Marketing Program offers you a comprehensive and robust platform to maximize your earning potential through high-quality affiliate products, cutting-edge marketing tools, and dedicated support to ensure your success.          </p>
          <div className='font-semibold  mt-4'>© 2023</div>
        </div>

        <div className="text-center md:text-left">
            <div className='w-full h-1 bg-black mb-10'></div>
          <ul className="space-y-4 font-semibold">
            <li><a href="/about" className="hover:text-purple-400 transition-colors">Home</a></li>
            <li><a href="/services" className="hover:text-purple-400 transition-colors">About</a></li>
            <li><a href="/contact" className="hover:text-purple-400 transition-colors">Contact</a></li>
          </ul>
        </div>

        <div className="text-center md:text-left">
        <div className='w-full h-1 bg-black mb-10'></div>

        <div className='flex flex-col mx-auto'>
          <div className="flex space-x-4 items-center justify-center sm:justify-start mb-4">
            <FontAwesomeIcon icon={faPhoneVolume} size="2x" className="text-secondary" />
            <p className="text-md">+1 7325038255</p>
          </div>
          <div className="flex space-x-4 items-center justify-center sm:justify-start mb-4">
            <FontAwesomeIcon icon={faEnvelope} size="2x" className="text-secondary" />
            <p className="text-md break-all overflow-hidden">admin@addictiveaffiliates.com</p>
          </div>
          </div>
        </div>
      </div>

      <div className=" py-6 px-6 sm:px-12 mt-12">
      
        <div className="container mx-auto flex items-center justify-between">
        <div>
            <Image src="/logo.png" alt="Logo" width={100} height={100} />
          </div>
          <div className="flex justify-end space-x-4 md:space-x-0 md:justify-between w-80">
            <FontAwesomeIcon icon={faFacebook} size="2x" className=" hover:text-purple-400 transition-colors" />
            <FontAwesomeIcon icon={faTwitter} size="2x" className=" hover:text-purple-400 transition-colors" />
            <FontAwesomeIcon icon={faInstagram} size="2x" className=" hover:text-purple-400 transition-colors" />
            <FontAwesomeIcon icon={faLinkedin} size="2x" className=" hover:text-purple-400 transition-colors" />
          </div>

          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
