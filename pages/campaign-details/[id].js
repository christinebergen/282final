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
    <div className="w-3/4 md:w-2/3 flex flex-col justify-center items-center">
      <div className="bg-gray-200 p-10 mb-10 rounded-lg flex flex-col justify-center items-center">
        <h1>Campaign Start Date: {campaign.date}</h1>
        <p>Campaign: {campaign.campaign}</p>
        <p>Status: {campaignStatus}</p>
        <button
          className="bg-[#416477] p-2 m-2 rounded-lg"
          onClick={toggleCampaignStatus}
        >
          {campaignStatus === "In Progress"
            ? "Complete Campaign"
            : "Revert to In Progress"}
        </button>
      </div>
      <div className="flex flex-row justify-center items-center">
        {campaign.characters && campaign.characters.length > 0 ? (
          campaign.characters.map((characterName, index) => (
            <p
              className="bg-[#0FBDDB] mx-4 my-4 p-4 rounded-lg hover:font-bold"
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

      {selectedCharacterDetails && (
        <div className="bg-gray-200">
          <h2>{selectedCharacterDetails.name}</h2>
          <p>Starting Weapon: {selectedCharacterDetails.startingWeapon}</p>
          <button onClick={handleBuyAttachments} className="bg-lime-100">
            Click here to buy Attachments
          </button>
          {selectedCharacterDetails.attachments && (
            <ul>
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
  );
}
