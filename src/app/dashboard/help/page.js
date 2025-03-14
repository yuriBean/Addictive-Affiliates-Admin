"use client";
import { faAngleDown, faAngleUp, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function HelpPage() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "To reset your password, go to the settings page, click on 'Change Password' and follow the instructions."
    },
    {
      question: "How can I update my email address?",
      answer: "You can update your email address in the settings page under 'Email Configurations'."
    },
    {
      question: "What should I do if I encounter an error?",
      answer: "If you encounter an error, please contact our support team via the 'Contact Us' page with details about the error."
    },
    {
      question: "How can I delete my account?",
      answer: "To delete your account, please contact support, and we will help you with the process."
    }
  ];

  const handleToggle = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="text-black">
      <h1 className="text-3xl text-headings font-bold mt-4">Help</h1>

      <div className="space-y-2 my-5">
        <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
        <p className="text-lg mb-4">Stuck on something? We are here to help you answer your questions</p>
      </div>

      <div className="space-y-4 mt-10">
        {faqs.map((faq, index) => (
          <div key={index} className=" space-y-6 p-4 sm:p-6 bg-accent rounded-md pb-4">
            <div 
              onClick={() => handleToggle(index)} 
              className="cursor-pointer flex justify-between items-center text-xl font-semibold hover:text-primary"
            >
              <p>{faq.question}</p>
              <FontAwesomeIcon 
                icon={expandedIndex === index ? faAngleUp : faAngleDown} 
                className="text-xl"
              />
            </div>
            {expandedIndex === index && (
              <p className="text-md mt-2 text-gray-700">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
