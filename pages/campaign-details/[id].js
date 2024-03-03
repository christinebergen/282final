import React from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig"; // Update with correct path
import characterData from "../../public/data/characters.json";
import Character from "../../components/Character";
import Equipment from "../../components/Equipment";
import Mission from "../../components/Mission";

export default function CampaignDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [campaign, setCampaign] = useState(null);
  const [selectedCharacterDetails, setSelectedCharacterDetails] = useState([]);
  const [campaignStatus, setCampaignStatus] = useState("In Progress");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [selectedTab, setSelectedTab] = useState("characters");
  const [characters, setCharacters] = useState([]);
  const [showAttachments, setShowAttachments] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchCampaign = async () => {
        const docRef = doc(db, "campaigns", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const campaignData = docSnap.data();
          setCampaign(campaignData);
          setCampaignStatus(campaignData.status || "In Progress");
          const campaignCharacters = campaignData.characters || [];
          setCharacters(campaignCharacters);
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
    if (characterDetails) {
      console.log("Character details: ", characterDetails),
        setSelectedCharacterDetails({
          name: characterName,
          startingWeapon: characterDetails["Starting weapon"],
          attachments: characterDetails.Attachments || {}, // Ensure this line correctly references the structure of your data
          // Include other properties as needed
        });
    }
  };

  console.log(characterData);
  console.log("Show Attachments", showAttachments);
  console.log("Attachments data", selectedCharacterDetails.attachments);

  const handleBuyAttachments = () => {
    setShowAttachments(!showAttachments);
  };

  const purchaseAttachment = (characterName, attachmentCost) => {
    if (
      selectedCharacterDetails &&
      selectedCharacterDetails.name === characterName
    ) {
      setSelectedCharacterDetails((prevDetails) => ({
        ...prevDetails,
        xp: Math.max(prevDetails.xp - attachmentCost, 0), // Update XP
        attachments: (prevDetails.attachments || []).concat({
          /* attachment details here */
        }),
      }));
    }
  };
  const fetchEquipmentData = async (tier) => {
    try {
      const response = await fetch(`/data/equip_t${tier}.json`);
      const data = await response.json();
      setEquipment(data);
    } catch (error) {
      console.error("Error fetching equipment data:", error);
    }
  };

  const handleTierSelection = (tier) => {
    setSelectedTier(tier);
    fetchEquipmentData(tier);
    setShowDropdown(false); // Close the dropdown after selection
  };

  useEffect(() => {
    fetchEquipmentData(1);
  }, []);

  if (!campaign) {
    return <div>Loading...</div>; // Or any other loading state representation
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full md:w-3/4 bg-[#416477] flex flex-col justify-center items-center">
        <div className="flex flex-col mt-10 items-center justify-center">
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
          <div className="flex flex-col md:flex-row w-full justify-center items-center bg-gray-200">
            {/* Sidebar with Options */}
            <div className="md:w-1/4 flex flex-row md:flex-col bg-gray-200 p-4">
              <button
                className="bg-[#416477] text-gray-200 text-xl font-bold p-2 m-2 rounded-lg hover:bg-slate-600"
                onClick={() => setSelectedTab("characters")}
              >
                Characters
              </button>
              <button
                className="bg-[#416477] text-gray-200 text-xl font-bold p-2 m-2 rounded-lg hover:bg-slate-600"
                onClick={() => setSelectedTab("equipment")}
              >
                Equipment
              </button>
              <button
                className="bg-[#416477] text-gray-200 text-xl font-bold p-2 m-2 rounded-lg hover:bg-slate-600"
                onClick={() => setSelectedTab("missions")}
              >
                Missions
              </button>
            </div>

            {/* Content Area */}
            <div className="w-3/4 bg-gray-100 p-4">
              {selectedTab === "characters" && (
                <Character
                  characterData={characters}
                  onCharacterClick={handleCharacterClick}
                  selectedCharacterDetails={selectedCharacterDetails}
                  onBuyAttachments={handleBuyAttachments}
                  showAttachments={showAttachments}
                  onPurchaseAttachment={purchaseAttachment}
                />
              )}
              {selectedTab === "equipment" && <Equipment />}
              {selectedTab === "missions" && <Mission />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
