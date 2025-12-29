import { auth, googleProvider } from "../firebase";
import { signInWithRedirect, getRedirectResult } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function GoogleAuth({ content }) {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error(error );
    }
  };

  useEffect(() => {
    // Check if user just came back from redirect
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [navigate]);

  return (
    <button
      style={{
        all: "unset",
      }}
      onClick={signInWithGoogle}
    >
      {content}
    </button>
  );
}

export default GoogleAuth;
