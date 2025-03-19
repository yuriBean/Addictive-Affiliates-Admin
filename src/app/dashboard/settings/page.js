//reauthentication needs to be figured out


"use client";
import { useState, useEffect } from "react";
import { reauthenticateUser, updateUserEmail } from "@/app/firebase/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";

export default function SettingsPage() {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [reportEmails, setReportEmails] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleAuthentication = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!user) {
      setErrorMessage("User is not authenticated.");
      setLoading(false);
      return;
    }

    try {
        console.log(currentPassword);
      await reauthenticateUser(user, currentPassword);
      setIsAuthenticated(true);
    //   setCurrentPassword("");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailUpdate = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!user || !isAuthenticated) {
      setErrorMessage("Please authenticate first.");
      setLoading(false);
      return;
    }

    try {
        console.log("Curp", currentPassword);
      await updateUserEmail(user, newEmail, currentPassword);
      setNewEmail("");
      setIsAuthenticated(false);
      alert("Email updated successfully! Please verify your new email.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <p className="text-black text-lg">Loading user data...</p>;
  }

  const handleToggleChange = () => {
    setReportEmails(!reportEmails); 
  };

  return (
    <div className="text-black">
      <h1 className="text-2xl md:text-3xl text-headings font-bold mt-4">Settings</h1>
      <div className="my-6">
        <h2 className="text-xl font-semibold">Email Configurations</h2>
        <div className="flex items-center justify-between my-5">
        <p className="text-md">Reporting Emails</p>
        <FontAwesomeIcon
            icon={reportEmails ? faToggleOn : faToggleOff}
            onClick={handleToggleChange}
            className={`text-2xl md:text-3xl cursor-pointer ${reportEmails ? "text-secondary" : "text-gray-500"}`}
          />
            </div>
        {!isAuthenticated ? (
          <form onSubmit={handleAuthentication} className="space-y-4">
            <label className="text-md">Enter Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter Password to Confirm"
              className="w-full p-4 sm:p-6 text-sm md:text-lg bg-accent rounded-md"
              required
            />
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
            <div className="flex justify-end">
              <button type="submit" className="bg-secondary text-white py-2 px-6 text-md md:text-xl rounded-md mt-4" disabled={loading}>
                {loading ? "Authenticating..." : "Authenticate"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleEmailUpdate} className="space-y-4">
            <label className="text-md">New Email Address</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email"
              className="w-full p-4 sm:p-6 text-sm md:text-lg bg-accent rounded-md"
              required
            />
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
            <div className="flex justify-end">
              <button type="submit" className="bg-secondary text-white py-2 px-6 text-md md:text-xl rounded-md mt-4" disabled={loading}>
                {loading ? "Updating..." : "Update Email"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
