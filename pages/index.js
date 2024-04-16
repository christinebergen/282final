import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useAuth from "../hooks/useAuth";
import { signInWithGoogle } from "../firebase/auth";

const Home = () => {
  const { user } = useAuth(); // This hook should return the user's authentication status
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // If the user is logged in, redirect to all-campaigns page
      router.push("/all-campaigns");
    } else {
      setIsLoading(false);
    }
  }, [user, router]);

  if (isLoading) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  return (
    <div className="bg-[#06436B] min-h-screen flex flex-col items-center">
      <div className="w-full md:w-3/4 bg-[#416477] min-h-screen flex flex-col items-center">
        <div className="bg-gray-200 rounded-lg w-full md:w-2/3 mt-4 md:mt-20 p-4 md:p-10 flex flex-col justify-center items-center text-center">
          <img
            src="/images/profile.jpg"
            className="border-4 border-gray-400 mt-4 md:mt-10 w-40 sm:w-auto"
          />
          <h1 className="w-full md:w-2/3 mt-4 md:mt-10 text-md md:text-2xl font-bold text-center">
            Currently in Development / Testing Mode!!!
          </h1>
          <h2 className="text-sm md:text-xl">
            An app for tracking progress during a Star Wars Imperial Assault
            Campaign. For testing purposes only.
          </h2>
          <p className="text-sm md:text-xl"><strong>Please Note:</strong> some features may not yet work as intended, but check back as more features are being added regularly.</p>
          <p className="font-bold text-md md:text-xl mb-4 mt-10">Please log in if you'd like to test our web app!</p>
          <button
              onClick={signInWithGoogle}
              className="text-gray-200 bg-[#06436B] md:text-xl rounded hover:text-white px-4 py-2 block whitespace-nowrap"
            >
              Login
            </button>
         
        </div>
      </div>
    </div>
  );
};

export default Home;
