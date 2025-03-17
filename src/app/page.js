"use client"
import Image from "next/image";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import RoleSelection from "./components/RoleSelection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import Testimonials from "./components/Testimonials";

export default function Home() {
  return (

    <>
     <div
        className="relative min-h-screen"
      >
        <div
          className="absolute top-0 left-0 w-full h-full bg-no-repeat z-[-1] bg-left bg-fixed md:bg-contain md:bg-scroll"
          style={{ backgroundImage: 'url(/Vector.png)' }}
        ></div>
        
        <Navbar />
        <Hero />
      </div>
    <RoleSelection />
    {/* <Testimonials /> */}
    <ContactSection />
    <Footer /> 
  </>

   
  );
}
