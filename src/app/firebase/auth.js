//TODO - reauthentication needs to be figured out


import { auth } from "./config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, reauthenticateWithCredential, EmailAuthProvider, updateEmail, verifyBeforeUpdateEmail, updatePassword } from "firebase/auth";
import { createUser, updateFirestoreUserEmail } from "./firestoreService";

export const signUp = async (email, password, additionalData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await createUser(user.uid, { email: user.email, ...additionalData });
    return user; 
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      throw new Error("The email is already in use. Please log in instead.");
    } else if (error.code === "auth/weak-password") {
      throw new Error("The password is too weak. Please choose a stronger one.");
    }

    throw new Error(error.message);
  }
};

export const logIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user; 
  } catch (error) {
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const reauthenticateUser = async (user, currentPassword) => {
  if (!user) throw new Error("No user logged in.");
  if (!currentPassword) throw new Error("Password is required for reauthentication.");

  const credential = EmailAuthProvider.credential(user.email, currentPassword);

  try {
    await reauthenticateWithCredential(user, credential);
  } catch (error) {
    throw new Error("Reauthentication failed. Please check your password.");
  }
};

export const updateUserEmail = async (user, newEmail, currentPassword) => {
  if (!user) throw new Error("No user logged in.");
  if (!newEmail) throw new Error("New email is required.");
  if (!currentPassword) throw new Error("Current password is required for security reasons.");

  try {
    await reauthenticateUser(user, currentPassword);

    await verifyBeforeUpdateEmail(user, newEmail);
    await updateEmail(user, newEmail);
    // await sendEmailVerification(user);

    await updateFirestoreUserEmail(user.uid, newEmail);
  } catch (error) {
    throw error;
  }
};

export const updateUserPassword = async (user, currentPassword, newPassword) => {
  if (!user) throw new Error("No user logged in.");
  if (!currentPassword) throw new Error("Current password is required.");
  if (!newPassword) throw new Error("New password is required.");

  try {
    await reauthenticateUser(user, currentPassword);

    await updatePassword(user, newPassword);
  } catch (error) {
    throw error;
  }
};
