import React from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig"; // Update with correct path
import characterData from "../../public/data/characters.json";
import Character from "../../components/Character";
import Equipment from "../../components/Equipment";
import Mission from "../../components/Mission";
import campaignsData from "../../public/data/campaigns.json";
import Imperial from "../../components/Imperial";
//import Character from "../../components/Newchars";

export default function CampaignDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [campaign, setCampaign] = useState(null);
  const [selectedCharacterDetails, setSelectedCharacterDetails] =
    useState(null);
  const [campaignStatus, setCampaignStatus] = useState("In Progress");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [selectedTab, setSelectedTab] = useState("characters");
  const [characters, setCharacters] = useState([]);
  const [showAttachments, setShowAttachments] = useState(false);
  const [ownedEquipment, setOwnedEquipment] = useState([]);
  const [soldEquipment, setSoldEquipment] = useState([]);
  const [missions, setMissions] = useState([]);

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

  const handleCharacterClick = async (characterName) => {
    // First, find the static details of the character
    const characterDetails = characterData.find(
      (char) => char.name === characterName
    );
  
    if (characterDetails) {
      console.log("Character details: ", characterDetails);
  
      // Fetch the Firebase document ID for the character
      const charactersRef = collection(db, `campaigns/${id}/characters`);
      const querySnapshot = await getDocs(charactersRef);
      let firebaseId = null;
  
      querySnapshot.forEach((doc) => {
        if (doc.data().name === characterName) {
          firebaseId = doc.id;
        }
      });
  
      // Update the state with the character details and the Firebase ID
      setSelectedCharacterDetails({
        name: characterName,
        startingWeapon: characterDetails["Starting weapon"],
        startingWeaponValue: characterDetails.Value,
        xp: characterDetails.startingXp,
        attachments: characterDetails.Attachments || [],
        firebaseId: firebaseId,
        // Include other properties as needed
      });
      setShowAttachments(false);
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
      <div className="w-full lg:w-3/4 bg-[#416477] flex flex-col justify-center items-center">
        <div className="flex flex-col mt-4 md:mt-10 items-center justify-center">
          <div className="flex flex-col md:flex-row w-full justify-center bg-gray-200">
            {/* Sidebar with Options */}
            <div className="md:w-1/4 flex flex-row md:flex-col bg-gray-200 p-4">
              <button
                className="bg-[#416477] text-gray-200 text-md md:text-xl font-bold px-1 md:p-2 my-2 rounded-lg hover:bg-slate-600"
                onClick={() => setSelectedTab("characters")}
              >
                Characters
              </button>
              <button
                className="bg-[#416477] text-gray-200 text-md md:text-xl font-bold px-1 md:p-2 m-2 rounded-lg hover:bg-slate-600"
                onClick={() => setSelectedTab("equipment")}
              >
                Equipment
              </button>
              <button
                className="bg-[#416477] text-gray-200 text-md md:text-xl font-bold px-1 md:p-2 m-2 rounded-lg hover:bg-slate-600"
                onClick={() => setSelectedTab("missions")}
              >
                Missions
              </button>
              <button
                className="bg-[#416477] text-gray-200 text-md md:text-xl font-bold px-1 md:p-2 m-2 rounded-lg hover:bg-slate-600"
                onClick={() => setSelectedTab("imperial")}
              >
                Imperial Player
              </button>
            </div>

            {/* Content Area */}
            <div className="w-3/4 max-w-4xl mx-auto overflow-auto min-h-[300px] flex flex-col justify-center bg-gray-100 p-4">
              <div className="w-full bg-gray-200 p-4 mt-4 mb-4 rounded-lg text-center flex flex-col md:flex-row justify-center items-center">
                <div className="">
                  {campaignsData[campaign.campaign] && (
                    <img
                      src={campaignsData[campaign.campaign].image}
                      alt={campaign.campaign}
                      className="w-24 md:w-32 h-auto rounded-lg md:mr-20"
                    />
                  )}
                </div>
                <div className="text-md md:text-xl">
                  <h1 className="font-bold mt-2">Campaign: {campaign.campaign}</h1>

                  <p>Campaign Start Date: {campaign.date}</p>

                  <p>Status: {campaignStatus}</p>
                  <p>Winner: </p>

                  <button
                    className="bg-[#416477] text-gray-200 font-bold p-2 m-2 rounded-lg hover:bg-slate-600"
                    onClick={toggleCampaignStatus}
                  >
                    {campaignStatus === "In Progress"
                      ? "Complete Campaign"
                      : "Revert to In Progress"}
                  </button>
                </div>
              </div>

              {selectedTab === "characters" && (
                <Character
                  characterData={characters}
                  onCharacterClick={handleCharacterClick}
                  selectedCharacterDetails={selectedCharacterDetails}
                  id={id}
                  showAttachments={showAttachments} // Pass the state and setter
                  setShowAttachments={setShowAttachments}
                 
                />
              )}
              {selectedTab === "equipment" && (
                <Equipment
                  id={id}
                  selectedTier={selectedTier}
                  ownedEquipment={ownedEquipment}
                  onUpdateOwnedEquipment={handleUpdateOwnedEquipment}
                  onSellEquipment={handleSellEquipment}
                  soldEquipment={soldEquipment}
                />
              )}

              {selectedTab === "missions" && (
                <Mission id={id} missions={missions} />
              )}
              {selectedTab === "imperial" && <Imperial id={id} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
