import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useAuth from "../hooks/useAuth";

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
        <div className="bg-gray-200 rounded-lg w-3/4 md:w-2/3 mt-20 p-10 flex flex-col justify-center items-center text-center">
          <img
            src="/images/profile.jpg"
            className="border-4 border-gray-400 mt-10"
          />
          <h1 className="w-full md:w-2/3 mt-10 text-md md:text-2xl font-bold text-center">
            Currently in Development / Testing Mode!!!
          </h1>
          <h2>
            An app for tracking progress during a Star Wars Imperial Assault
            Campaign. For testing purposes only.
          </h2>
          <p><strong>Please Note:</strong> some features may not work as intended.</p>
          <p className="font-bold text-md md:text-xl mb-10 mt-10">Please log in if you'd like to test our web app!.</p>
          <a href='mailto:christine.bergen@itas.ca?subject=Re:%20Imperial%20Assault%20Tracker' className="underline font-bold text-blue-800">Contact Developer</a>
        </div>
      </div>
    </div>
  );
};

export default Home;
