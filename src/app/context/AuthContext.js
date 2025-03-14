"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase/config"; 
import { onAuthStateChanged } from "firebase/auth"; 
import { logIn, signUp, logOut } from "../firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
  }, []);

  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //     setUser(currentUser); 
  //     setLoading(false); 
  //   });

  //   return () => unsubscribe(); 
  // }, []);

  const login = async (email, password) => {
    try {
      const user = await logIn(email, password);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user)); 
    } catch (error) {
      throw error;
    }
  };

  // const signup = async (email, password) => {
  //   try {
  //     return await signUp(email, password); 
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  const logout = async () => {
    try {
      await logOut(); 
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
