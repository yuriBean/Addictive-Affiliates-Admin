"use client";
import Link from "next/link";

const Hero = () => {
    return (
      <section className=" py-20 px-6 text-center text-primary sm:text-left">
        <div className="max-w-screen-xl mx-auto flex flex-col items-center sm:flex-row sm:items-start">
          <div className="sm:w-1/2 space-y-6">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Unleash Growth Through Collaboration: Empowering Businesses and Creators.
            </h1>
            <p className="text-lg">
              Connect, create, and earn with our affiliate marketing platform designed for growth and impact.
            </p>
            <div className="mt-6 space-x-0 md:space-x-4 flex flex-col md:flex-row space-y-5 md:space-y-0">
            <Link href='/signup'>
              <button className="bg-[#7B35C5] font-bold py-2 px-6 rounded-lg hover:bg-purple-600 transition duration-300">
                Join as Affiliate
              </button>
              </Link>
              <Link href='/business-signup'>
              <button className="bg-[#1976D2] font-bold py-2 px-6 rounded-lg hover:bg-blue-500 transition duration-300">
                Start as Business
              </button>
              </Link>
            </div>
          </div>
          <div className="sm:w-1/2 mt-10 sm:mt-0">
            <img src="/hero.png" alt="Hero" className="w-full h-auto rounded-lg shadow-lg" />
          </div>
        </div>
      </section>
    );
  };
  
  export default Hero;
  