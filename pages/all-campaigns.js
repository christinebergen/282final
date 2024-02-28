import React, { useEffect, useState } from "react";
import auth from "../firebase/firebaseConfig";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig"; // Adjust the path to your Firebase config
import Link from "next/link";

export default function AllCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      console.log("User not logged in");
      return;
    }

    console.log("Fetching campaigns...");

    const fetchCampaigns = async () => {
      try {
        const q = query(
          collection(db, "campaigns"),
          where("userId", "==", currentUser.uid),
          orderBy("date", "desc")
        );
        const querySnapshot = await getDocs(q);
        const campaignsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCampaigns(campaignsData);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };

    fetchCampaigns();
  }, [currentUser]);

  if (!currentUser) {
    return <div>Please log in to view campaigns.</div>;
  }

  return (
    <div className="w-2/3 flex flex-col items-center justify-center">
      <Link
        href="/add-campaign"
        className="button-class text-xl font-bold bg-[#2DC3EB] p-4 rounded-lg mt-10 mb-10"
      >
        Add New Campaign
      </Link>
      <h1 className="mt-10 text-2xl">All Campaigns:</h1>
      {campaigns.length > 0 ? (
        <div className="mb-20 ">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-gray-400 mt-10 p-4 rounded-lg">
              <Link href={`/campaign-details/${campaign.id}`} className=" ">
                <p>{campaign.campaign}</p>
                <p>Date Started: {campaign.date}</p>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>No campaigns found.</p>
      )}
    </div>
  );
}
