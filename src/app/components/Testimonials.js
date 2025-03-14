"use client"
import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonials = [
    {
        name: "John Doe",
        designation: "Marine Biologist",
        feedback: "Jellyfish are beautiful sea creatures with a mesmerizing movement.",
        image: "https://via.placeholder.com/150",
    },
    {
        name: "Jane Smith",
        designation: "Oceanographer",
        feedback: "Seahorses are unique and fascinating to watch in the ocean.",
        image: "https://via.placeholder.com/150",
    },
    {
        name: "Mike Johnson",
        designation: "Diver",
        feedback: "Octopuses are highly intelligent and adaptable sea animals.",
        image: "https://via.placeholder.com/150",
    },
    {
        name: "Emily Davis",
        designation: "Marine Researcher",
        feedback: "Sharks are powerful and often misunderstood predators.",
        image: "https://via.placeholder.com/150",
    },
];

const backgroundStyles = {
    left: {
        backgroundImage: "url('/Vector 9.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
    },
    center: {
        backgroundImage: "url('/Vector 5.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
    },
    right: {
        backgroundImage: "url('/Vector 11.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
    },
};

const TestimonialCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: "0",
        autoplay: true,
        autoplaySpeed: 3000,
        beforeChange: (current, next) => {
            setCurrentSlide(next);
        },
    };

    const getBackgroundStyle = (index) => {
        if (index === currentSlide) return backgroundStyles.center;
        if (index === currentSlide - 1 || (currentSlide === 0 && index === testimonials.length - 1)) return backgroundStyles.left;
        return backgroundStyles.right; 
    };

    return (
        <div className="testimonial-container max-w-6xl mx-auto px-4 py-8 text-black">
            <Slider {...settings}>
                {testimonials.map((testimonial, index) => (
                    <div key={index} className={`testimonial-slide`}>
                        <div
                            className="testimonial-card p-6 rounded-lg shadow-lg text-white"
                            style={getBackgroundStyle(index)}
                        >
                            <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="mx-auto rounded-full object-cover w-20 h-20 lg:w-32 lg:h-32"
                            />
                            <h2 className="text-lg lg:text-xl font-bold">{testimonial.name}</h2>
                            <p className="text-sm lg:text-base">{testimonial.designation}</p>
                            <p className="text-sm lg:text-base italic">
                                "{testimonial.feedback}"
                            </p>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default TestimonialCarousel;
