import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [second, setSecond] = useState(25 * 60);
  const [started, setStarted] = useState(false);
  const [sessionactive, setSessionactive] = useState(0);

  useEffect(() => {
    if (!started) {
      return;
    }
    const sAtive = setInterval(() => {
      setSessionactive((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(sAtive);
    };
  }, [started]);

  const loginWithEmailPassword = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  };

  const signupWithEmailPassword = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await sendEmailVerification(userCredential.user);
    alert("Verification email sent to: " + email);

    return userCredential.user;
  };

  const resendVerificationEmail = async () => {
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
      alert("Verification email resent!");
    }
  };

  // ✅ IMPORTANT FUNCTION
  const reloadUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setUser({ ...auth.currentUser }); // force React update
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
    <AuthContext.Provider
      value={{
        user,
        loading,
        logout,
        loginWithEmailPassword,
        signupWithEmailPassword,
        resendVerificationEmail,
        reloadUser,
        second,
        setSecond,
        sessionactive,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
