"use client";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faClock, faDollar, faCircleDollarToSlot} from "@fortawesome/free-solid-svg-icons";
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

const RoleSelection = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false, 
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section
      className="p-4 sm:p-16 md:p-24 min-h-80 my-20 bg-cover bg-center "
      style={{ backgroundImage: "url(/rolebg.png)" }}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-8">How we do it?</h2>
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 lg:gap-x-48 text-black justify-center items-center px-4 sm:px-16 lg:px-32">
          <div className="w-full sm:w-1/2">
            <Slider {...settings}>
              <div className="bg-[#e0c4ec] p-6 md:p-10 rounded-lg flex justify-center ">
                <div className="bg-white p-4 sm:p-6 rounded-lg flex justify-center h-full md:h-full min-h-[400px] md:min-h-[300px]">
                  <Link
                    href="/signup"
                    className="p-4 rounded-lg shadow-lg flex flex-col items-center justify-center transition-all duration-300"
                  >
                    <Image
                      src="/afficon.png"
                      width={100}
                      height={100}
                      alt="Affiliate Icon"
                    />
                    <h3 className="text-xl sm:text-2xl font-semibold mb-4">AFFILIATE</h3>
                  </Link>
                </div>
              </div>

              <div className="bg-[#e0c4ec] p-6 md:p-10 rounded-lg flex justify-center">
                <div className="bg-white p-4 sm:p-6 rounded-lg flex justify-center h-full md:h-full min-h-[400px] md:min-h-[300px]">
                  <div
                    className="p-4 rounded-lg shadow-lg flex flex-col items-center justify-center transition-all duration-300"
                  >
                    <div className="p-4 bg-secondary rounded-xl my-2">
                    <FontAwesomeIcon icon={faUserPlus} className=" text-xl text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold mb-4">Register</h3>
                    <p>Join the platform by creating a free affiliate account. Provide basic details like your name, email, and preferred payout method.</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#e0c4ec] p-6 md:p-10 rounded-lg flex justify-center">
                <div className="bg-white p-4 sm:p-6 rounded-lg flex justify-center h-full md:h-full min-h-[400px] md:min-h-[300px]">
                  <div
                    className="p-4 rounded-lg shadow-lg flex flex-col items-center justify-center transition-all duration-300"
                  >
                    <div className="p-4 bg-secondary rounded-xl my-2">
                    <FontAwesomeIcon icon={faClock} className=" text-xl text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold mb-4">Choose Campaigns</h3>
                    <p>Browse available campaigns from businesses. Select the products or services you want to promote based on your audience.</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#e0c4ec] p-6 md:p-10 rounded-lg flex justify-center">
                <div className="bg-white p-4 sm:p-6 rounded-lg flex justify-center h-full md:h-full min-h-[400px] md:min-h-[300px]">
                  <div
                    className="p-4 rounded-lg shadow-lg flex flex-col items-center justify-center transition-all duration-300"
                  >
                    <div className="p-4 bg-secondary rounded-xl my-2">
                    <FontAwesomeIcon icon={faCalendarAlt} className=" text-xl text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold mb-4">Share Your Affiliate Links</h3>
                    <p>Get a unique affiliate link for each campaign. Share the links across your social media, blog, website, or other platforms.</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#e0c4ec] p-6 md:p-10 rounded-lg flex justify-center">
                <div className="bg-white p-4 sm:p-6 rounded-lg flex justify-center h-full md:h-full min-h-[400px] md:min-h-[300px]">
                  <div
                    className="p-4 rounded-lg shadow-lg flex flex-col items-center justify-center transition-all duration-300"
                  >
                    <div className="p-4 bg-secondary rounded-xl my-2">
                    <FontAwesomeIcon icon={faCircleDollarToSlot} className=" text-xl text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold mb-4">Track and Earn</h3>
                    <p>Monitor your performance through your dashboard. Track clicks, conversions, and earnings in real-time. Withdraw your earnings once the threshold is met.</p>
                  </div>
                </div>
              </div>
            </Slider>
          </div>

          <div className="w-full sm:w-1/2 my-5 md:my-0">
            <Slider {...settings}>
            <div className="bg-[#e0c4ec] p-6 md:p-10 rounded-lg flex justify-center ">
                <div className="bg-white p-4 sm:p-6 rounded-lg flex justify-center h-full md:h-full min-h-[400px] md:min-h-[300px]">
                <Link
                    href="/business-signup"
                    className="p-4 rounded-lg shadow-lg flex flex-col items-center justify-center transition-all duration-300"
                  >
                    <Image
                      src="/busicon.png"
                      width={100}
                      height={100}
                      alt="Business Icon"
                    />
                    <h3 className="text-xl sm:text-2xl font-semibold mb-4">BUSINESS</h3>
                  </Link>
                </div>
              </div>

              <div className="bg-[#e0c4ec] p-6 md:p-10 rounded-lg flex justify-center">
                <div className="bg-white p-4 sm:p-6 rounded-lg flex justify-center h-full md:h-full min-h-[400px] md:min-h-[300px]">
                  <div
                    className="p-4 rounded-lg shadow-lg flex flex-col items-center justify-center transition-all duration-300"
                  >
                    <div className="p-4 bg-secondary rounded-xl my-2">
                    <FontAwesomeIcon icon={faUserPlus} className=" text-xl text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold mb-4">Register</h3>
                    <p>Create a free business account by providing your company details, product information, and preferred payout method.</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#e0c4ec] p-6 md:p-10 rounded-lg flex justify-center">
                <div className="bg-white p-4 sm:p-6 rounded-lg flex justify-center h-full md:h-full min-h-[400px] md:min-h-[300px]">
                  <div
                    className="p-4 rounded-lg shadow-lg flex flex-col items-center justify-center transition-all duration-300"
                  >
                    <div className="p-4 bg-secondary rounded-xl my-2">
                    <FontAwesomeIcon icon={faClock} className=" text-xl text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold mb-4">Create Campaigns</h3>
                    <p>Define your campaign goals, set commission structures and assign affiliate links to your products or services.</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#e0c4ec] p-6 md:p-10 rounded-lg flex justify-center">
                <div className="bg-white p-4 sm:p-6 rounded-lg flex justify-center h-full md:h-full min-h-[400px] md:min-h-[300px]">
                  <div
                    className="p-4 rounded-lg shadow-lg flex flex-col items-center justify-center transition-all duration-300"
                  >
                    <div className="p-4 bg-secondary rounded-xl my-2">
                    <FontAwesomeIcon icon={faCalendarAlt} className=" text-xl text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold mb-4">Attract Affiliates</h3>
                    <p>Showcase your campaigns to a pool of skilled affiliates. The platform automatically matches affiliates to your campaigns based on their audience and preferences.</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#e0c4ec] p-6 md:p-10 rounded-lg flex justify-center">
                <div className="bg-white p-4 sm:p-6 rounded-lg flex justify-center h-full md:h-full min-h-[400px] md:min-h-[300px]">
                  <div
                    className="p-4 rounded-lg shadow-lg flex flex-col items-center justify-center transition-all duration-300"
                  >
                    <div className="p-4 bg-secondary rounded-xl my-2">
                    <FontAwesomeIcon icon={faCircleDollarToSlot} className=" text-xl text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold mb-4">Track and Pay</h3>
                    <p>Monitor campaign performance through real-time analytics, including clicks, conversions, and sales. Easily manage payouts to affiliates directly through the platform.</p>
                  </div>
                </div>
              </div>

            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoleSelection;
