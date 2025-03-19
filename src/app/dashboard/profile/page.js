"use client";
import { useEffect, useState } from "react";
import { updateUserPassword } from "@/app/firebase/auth";
import { useAuth } from "@/app/context/AuthContext";
import { updateUser, getUser, getUserPreferences } from "@/app/firebase/firestoreService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faTiktok, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    businessName: "",
    email: "",
    phone: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchUser = async() =>{
      try
      {
        setLoading(true);
        const fetchedUser = await getUser(user.uid);
        setUsername(fetchedUser.firstName + " " + fetchedUser.lastName);
        setFormData((prev) => ({
          ...prev,
          firstName: fetchedUser.firstName || "",
          lastName: fetchedUser.lastName || "",
          businessName: fetchedUser.businessName || "",
          email: fetchedUser.email || "",
          phone: fetchedUser.phone || "",
        }));
        setUserRole(fetchedUser.role);  
    } catch(error){
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const fetchPreferences = async () => {
    try {
      const existingPreferences = await getUserPreferences(user.uid);
      if (existingPreferences) {
        setSelectedPreferences(existingPreferences);
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
  fetchPreferences();
  }, [user]);
  
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("New password and confirm password do not match.");
      return;
    }

    try {
      if (formData.newPassword){
      await updateUserPassword(user, formData.oldPassword, formData.newPassword);}
      await updateUser(user.uid, formData);
      setSuccessMessage("Password updated successfully!");
    } catch (error) {
      setErrorMessage(error.message);
    }
    console.log("Form submitted", formData);

    alert("Profile updated successfully!");
  };

  const getFirstLetter = (name) => {
    return name.charAt(0).toUpperCase();
  };

  if (loading) return <p className="text-black text-center">Loading...</p>;

  return (
    <div className="text-black">
      <h1 className="text-2xl md:text-3xl text-headings font-bold mt-4">Profile</h1>

      <div className="flex justify-center flex-col items-center space-y-3 my-6">
        <div
          className="w-32 h-32 rounded-full bg-cover bg-center text-white flex items-center justify-center text-7xl font-bold bg-secondary"
        >
          {formData.firstName && getFirstLetter(formData.firstName)}
        </div>
        {userRole === "business" ? (<p>{formData.businessName}</p>) : (<p>{username}</p>)}
        </div>

      <div className="flex flex-col space-y-6 justify-center">
        <form onSubmit={handleSubmit} className="space-y-4">
          {userRole === "business" ? (
        <div className="grid grid-cols-1 mb-4">
          <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
              placeholder="Business Name"
            />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 space-y-4 md:space-y-0 md:gap-4 mb-4">
          <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
              placeholder="First Name"
              
            />
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
              placeholder="Last Name"
            />
            </div>
          )}

          <div className="flex flex-col space-y-2">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
              placeholder="Email Address"
              
              disabled
            />
          </div>

          <div>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
              placeholder="Phone No."
              
            />
          </div>

          <div className="flex flex-col space-y-2">
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              placeholder="Old Password"
              className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
              
            />
          </div>

          <div className="flex flex-col space-y-2">
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="New Password"
              className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
              
            />
          </div>

          <div className="flex flex-col space-y-2">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full p-4 sm:p-6 bg-accent rounded-md placeholder-gray-700"
              
            />
          </div>

          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

          <div className="flex justify-start">
            <button
              type="submit"
              className="bg-secondary text-white py-2 px-6 text-md md:text-xl rounded mt-4"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>

      {/* <div className="my-10"> */}
        {/* <h2 className="text-xl font-semibold">Social Media Accounts</h2> */}
        {/* <div className="flex flex-col space-y-5 p-5 text-4xl justify-start items-start"> */}
          {/* TODO - add social media logic */}
          {/* <FontAwesomeIcon icon={faInstagram} /> */}
          {/* <FontAwesomeIcon icon={faFacebook} /> */}
          {/* <FontAwesomeIcon icon={faYoutube} /> */}
          {/* <FontAwesomeIcon icon={faTwitter} /> */}
          {/* <FontAwesomeIcon icon={faTiktok} /> */}
        {/* </div> */}


      {/* </div> */}

      <div className="my-10">
        <h2 className="text-xl font-semibold mb-5">Your Prefrences</h2>
        {selectedPreferences.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedPreferences.map((preference, index) => (
              <span
                key={index}
                className="bg-accent text-gray-800 px-3 py-1 rounded-md text-sm"
              >
                {preference}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">You haven't selected any preferences yet.</p>
        )}

        <div className="flex justify-start md:justify-end my-5">
          <Link href="/dashboard/edit-preferences">
          <button className="bg-secondary text-white py-2 px-4 rounded-lg">Edit Prefrences</button></Link>
        </div>

        <div className="flex justify-end my-12 space-x-0 md:space-x-3 md:space-y-0 space-y-3 flex-col md:flex-row">
        <button className="border-secondary bg-white text-secondary py-3 w-full md:w-1/6 text-md md:text-xl rounded-lg border">Cancel</button>
        <button className="bg-secondary text-white py-3 w-full md:w-1/6 text-md md:text-xl rounded-lg">Save</button>
        </div>
      </div>
    </div>
  );
}
