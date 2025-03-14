"use client";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faLocationDot, faPhoneVolume } from "@fortawesome/free-solid-svg-icons";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    pnumber: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <section className="py-16 px-6 sm:px-12 text-black">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between gap-12">

        <div className="flex-1 items-center justify-center bg-white p-8 lg:p-24 rounded-lg shadow-lg">
          <h2 className="text-3xl sm:text-4xl text-secondary font-bold mb-8 text-center sm:text-left">Let's get in touch!</h2>
          <p className="text-lg mb-6 text-center sm:text-left">
            Questions, comments, or suggestions? Simply fill in the form and we’ll be in touch shortly.
          </p>
          <div className="font-bold">
          <div className="flex space-x-4 items-center my-4 justify-center sm:justify-start">
            <FontAwesomeIcon icon={faLocationDot} size="2x" className="text-secondary" />
            <p className="text-lg">1055 Arthur ave Elk Groot, 67. New Palmas South Carolina.</p>
          </div>
          <div className="flex space-x-4 items-center my-4 justify-center sm:justify-start">
            <FontAwesomeIcon icon={faPhoneVolume} size="2x" className="text-secondary" />
            <p className="text-lg">+1 234 678 9108 99</p>
          </div>
          <div className="flex space-x-4 items-center my-4 justify-center sm:justify-start">
            <FontAwesomeIcon icon={faEnvelope} size="2x" className="text-secondary" />
            <p className="text-lg">Contact@moralizer.com</p>
          </div>
          </div>
        </div>

        <div className="flex-1 bg-white p-6 lg:p-12 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6 border border-gray-400 p-6 md:p-12 rounded-xl">
            <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-6 md:space-y-0">
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name*"
                className="w-full sm:w-1/2 p-3 border border-gray-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-secondary"
                required
              />
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name*"
                className="w-full sm:w-1/2 p-3 border border-gray-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-secondary"
                required
              />
            </div>

            <div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email*"
                className="w-full p-3 border border-gray-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-secondary"
                required
              />
            </div>

            <div>
              <input
                type="text"
                id="pnumber"
                name="pnumber"
                value={formData.pnumber}
                onChange={handleChange}
                placeholder="Phone Number*"
                className="w-full p-3 border border-gray-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-secondary"
                required
              />
            </div>

            <div>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message..."
                className="w-full p-3 border border-gray-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-secondary"
                rows="5"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-secondary text-white rounded-full hover:bg-purple-500 transition-all duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
