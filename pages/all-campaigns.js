import React, { useEffect, useState } from "react";
import auth from "../firebase/firebaseConfig";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig"; // Adjust the path to your Firebase config
import Link from "next/link";
import campaignsData from "../public/data/campaigns.json"; // Import campaigns data

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
    <div className="flex flex-col justify-center items-center mt-8">
      <div className="w-full lg:w-3/4 bg-[#416477] rounded-lg pb-20 mb-8 flex flex-col justify-center items-center">
        <div className="flex flex-col mt-4 md:mt-10 items-center justify-center">
          <div className="w-full md:w-full px-10 md:px-20 rounded-lg flex flex-col justify-center items-center bg-gray-200">
            {campaigns.length === 0 && (
              <p className="mt-4 md:mt-10 text-md md:text-2xl font-bold underline">
                No campaigns created yet, click below to add one!
              </p>
            )}{" "}
            <Link
              href="/add-campaign"
              className="button-class text-center md:w-3/4 text-md md:text-xl font-bold bg-[#2DC3EB] p-4 rounded-lg mt-10 mb-4"
            >
              Add New Campaign
            </Link>
            <h1 className="mt-4 md:mt-10 text-md md:text-2xl font-bold underline">
              All Campaigns:
            </h1>
            <div>
              {campaigns.length > 0 ? (
                <div className="flex justify-center pb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                    {campaigns.map((campaign) => (
                      <div
                        key={campaign.id}
                        className="bg-gray-400 mt-4 p-4 rounded-lg flex flex-col items-center text-center text-sm md:texl-xl"
                      >
                        <Link
                          href={`/campaign-details/${campaign.id}`}
                          className="w-full "
                        >
                          {campaignsData[campaign.campaign] && (
                            <img
                              src={campaignsData[campaign.campaign].image}
                              alt={campaign.campaign}
                              className="h-24 md:w-32 md:h-auto rounded-lg mx-auto"
                            />
                          )}
                          <p>{campaign.campaign}</p>
                          <p>Date Started: {campaign.date}</p>
                          <p>Status: {campaign.status}</p>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p>No campaigns found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
