import React from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig"; // Update with correct path
import characterData from "../../public/data/characters.json";

export default function CampaignDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [campaign, setCampaign] = useState(null);
  const [selectedCharacterDetails, setSelectedCharacterDetails] =
    useState(null);
  const [campaignStatus, setCampaignStatus] = useState("In Progress");

  useEffect(() => {
    if (id) {
      const fetchCampaign = async () => {
        const docRef = doc(db, "campaigns", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCampaign(docSnap.data());
          setCampaignStatus(docSnap.data().status || "In Progress"); // Set status from Firestore or default to 'In Progress'
        }
      };

      fetchCampaign();
    }
  }, [id]);

  const toggleCampaignStatus = async () => {
    const newStatus =
      campaignStatus === "In Progress" ? "Completed" : "In Progress";
    setCampaignStatus(newStatus);
    // Optional: Update the status in Firestore
    const docRef = doc(db, "campaigns", id);
    await updateDoc(docRef, { status: newStatus });
  };

  useEffect(() => {
    console.log(campaign);
  }, [campaign]);

  const handleCharacterClick = (characterName) => {
    const characterDetails = characterData[characterName];
    setSelectedCharacterDetails({
      name: characterName,
      startingWeapon: characterDetails?.["Starting weapon"],
      attachments: null,
    });
  };

  const handleBuyAttachments = () => {
    if (selectedCharacterDetails && selectedCharacterDetails.name) {
      const characterDetails = characterData[selectedCharacterDetails.name];
      setSelectedCharacterDetails({
        ...selectedCharacterDetails,
        attachments: characterDetails?.Attachments,
      });
    }
  };

  if (!campaign) {
    return <div>Loading...</div>; // Or any other loading state representation
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full md:w-3/4 bg-[#416477] flex flex-col justify-center items-center">
        <div className="flex flex-col md:flex-row mt-10 items-center justify-center">
          <div className="w-3/4 md:w-2/3 bg-gray-200 p-10 mt-10 mb-10 rounded-lg text-center">
            <h1>Campaign Start Date: {campaign.date}</h1>
            <p>Campaign: {campaign.campaign}</p>
            <p>Status: {campaignStatus}</p>
            <button
              className="bg-[#416477] text-gray-200 font-bold p-2 m-2 rounded-lg hover:bg-slate-600"
              onClick={toggleCampaignStatus}
            >
              {campaignStatus === "In Progress"
                ? "Complete Campaign"
                : "Revert to In Progress"}
            </button>
          </div>
          <div>
            <button className="bg-gray-200 p-4 rounded-lg flex flex-row ml-4 underline hover:bg-gray-300 hover:italic font-bold">
              Purchase Equipment:
            </button>
          </div>
        </div>
        <h2 className="font-bold underline">Characters in play:</h2>
        <div className="grid grid-cols-2 md:flex md:flex-row justify-center items-center">
          {campaign.characters && campaign.characters.length > 0 ? (
            campaign.characters.map((characterName, index) => (
              <p
                className="bg-[#0FBDDB] mx-2 my-2 md:mx-4 md:my-4 p-4 rounded-lg font-bold hover:bg-teal-600"
                key={`character-${index}`}
                onClick={() => handleCharacterClick(characterName)}
              >
                <a href="#" style={{ textDecoration: "underline" }}>
                  {characterName}
                </a>
              </p>
            ))
          ) : (
            <p>No characters found</p>
          )}
        </div>
        <hr className="w-3/4 border-2 rounded-md border-gray-200 my-4"></hr>

        {selectedCharacterDetails && (
          <div className="bg-gray-200 rounded-lg p-8 flex flex-row ">
            <div>
              <h2 className="text-xl font-bold">
                {selectedCharacterDetails.name}
              </h2>
              <div className="flex flex-row justify-center items-center">
                <p className="font-bold">
                  Starting Weapon: {selectedCharacterDetails.startingWeapon}
                </p>
                <button className="bg-[#416477] text-gray-200 font-bold ml-4 p-2 rounded-lg hover:bg-slate-600">
                  Sell
                </button>
              </div>
              <button
                onClick={handleBuyAttachments}
                className="bg-[#0FBDDB] m-8 p-4 rounded-lg underline font-bold hover:italic hover:bg-teal-600"
              >
                Click here to buy Attachments
              </button>
            </div>
            {selectedCharacterDetails.attachments && (
              <ul className="">
                {Object.entries(selectedCharacterDetails.attachments).map(
                  ([attachment, value]) => (
                    <li key={attachment}>
                      {attachment}: {value}xp
                    </li>
                  )
                )}
              </ul>
            )}
            {/* Additional character details can be displayed here */}
          </div>
        )}
      </div>
    </div>
  );
}
