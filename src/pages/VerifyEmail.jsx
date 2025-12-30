import React from 'react';
import { useAuth } from '../context/AuthContext';

const VerifyEmail = () => {
  const { user, resendVerificationEmail } = useAuth();  

  const handleVerify = async () => {
    if (user && !user.emailVerified) {
      await resendVerificationEmail(); 
      alert('Verification email has been sent. Please check your inbox.');
    } else {
      alert('Your email is already verified or you are not logged in.');
    }
  };

  return (
    <div>
      {user && !user.emailVerified ? (
        <>
          <p>Your email is not verified. Please check your inbox and verify your email.</p>
          <button onClick={handleVerify}>Resend Verification Email</button>
        </>
      ) : (
        <p>Your email is already verified!</p>
      )}
    </div>
  );
};

export default VerifyEmail;
