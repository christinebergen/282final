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
    <div className="bg-[#06436B] flex flex-col items-center justify-center">
      <h1 className="w-2/3 rounded-lg mt-20  bg-[#CCDCE4] text-2xl ">
        An app for tracking progress during a Star Wars Imperial Assault
        Campaign
      </h1>
      <p className="font-bold text-xl ">Please log in to continue.</p>
    </div>
  );
};

export default Home;
