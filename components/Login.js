import React from "react";
import { signInWithGoogle } from "../firebase/auth"; // Adjusted path
import useAuth from "../hooks/useAuth";
import { useRouter } from "next/router";

const LoginComponent = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignIn = () => {
    signInWithGoogle(() => router.push("/all-campaigns"));
  };
  return (
    <div>
      {user ? (
        <p>Welcome, {user.displayName}</p>
      ) : (
        <button onClick={handleSignIn}>Sign in with Google</button>
      )}
    </div>
  );
};

export default LoginComponent;
