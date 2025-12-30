import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginWithEmailPassword = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  };

  const signupWithEmailPassword = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      alert("Verification email sent to: " + email); 
      console.log("Verification email sent to:", email);
      
      return user;
    } catch (error) {
      console.error("Error signing up: ", error);
    }
  };
  const resendVerificationEmail = async () => {
    if (user && !user.emailVerified) {
      try {
        await sendEmailVerification(user); 
        alert("Verification email resent! Please check your inbox.");
        console.log("Verification email resent to:", user.email);
      } catch (error) {
        console.error("Error resending verification email: ", error);
        alert("Error resending verification email.");
      }
    } else {
      console.log("No need to resend: Email is already verified or no user logged in.");
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout, loginWithEmailPassword, signupWithEmailPassword, resendVerificationEmail }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
