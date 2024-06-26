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

  const [selectedTier, setSelectedTier] = useState(1);
  const [selectedEquipmentData, setSelectedEquipmentData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("characters");
  const [characters, setCharacters] = useState([]);
  const [showAttachments, setShowAttachments] = useState(false);
  const [ownedEquipment, setOwnedEquipment] = useState([]);
  const [soldEquipment, setSoldEquipment] = useState([]);
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    if (id) {
      const fetchCampaignAndEquipmentData = async () => {
        // Fetch campaign data
        const docRef = doc(db, "campaigns", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const campaignData = docSnap.data();
          setCampaign(campaignData);
          setCampaignStatus(campaignData.status || "In Progress");
          const campaignCharacters = campaignData.characters || [];
          setCharacters(campaignCharacters);
          const ownedEquipment = campaignData.ownedEquipment || [];
          setOwnedEquipment(ownedEquipment);
          const campaignSoldEquipment = campaignData.soldEquipment || [];
          setSoldEquipment(campaignSoldEquipment);
        }

        // Fetch equipment data based on selectedTier
        try {
          const response = await import(
            `../../public/data/equip_t${selectedTier}.json`
          );
          setSelectedEquipmentData(response.default);
          console.log("Equipment Data:", response.default); // Debugging line
        } catch (error) {
          console.error("Error loading equipment data:", error);
        }
      };

      fetchCampaignAndEquipmentData();
    }
  }, [id, selectedTier]);

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
  const handleUpdateOwnedEquipment = async (newItem) => {
    const updatedOwnedEquipment = [...ownedEquipment, newItem];
    setOwnedEquipment(updatedOwnedEquipment);

    const campaignDocRef = doc(db, "campaigns", id);
    try {
      await updateDoc(campaignDocRef, {
        ownedEquipment: arrayUnion(newItem),
      });
    } catch (error) {
      console.error("Error updating campaign equipment in Firebase:", error);
    }
  };
  const handleSellEquipment = async (item) => {
    const newOwnedEquipment = ownedEquipment.filter((e) => e !== item);
    const newSoldEquipment = [...soldEquipment, item]; // Define the new sold equipment
    console.log("Selling item:", item);
    console.log("New Owned Equipment:", newOwnedEquipment);
    console.log("New Sold Equipment:", newSoldEquipment);

    setOwnedEquipment(newOwnedEquipment);
    setSoldEquipment(newSoldEquipment); // Update the state with the new list

    // Update Firestore
    const campaignDocRef = doc(db, "campaigns", id);
    try {
      await updateDoc(campaignDocRef, {
        ownedEquipment: newOwnedEquipment,
        soldEquipment: arrayUnion(item),
      });
      console.log("Equipment sold and updated in Firestore");
    } catch (error) {
      console.error("Error updating equipment in Firestore:", error);
    }
  };

  if (!campaign) {
    return <div>Loading...</div>; // Or any other loading state representation
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full lg:w-3/4 bg-[#416477] flex flex-col justify-center items-center">
        <div className="flex flex-col mt-4 md:mt-10 items-center justify-center">
          <div className="flex flex-col md:flex-row w-full justify-center bg-gray-200">
            {/* Sidebar with Options */}
            <div className="md:w-80 flex flex-wrap justify-between md:flex-col bg-gray-200 ">
              <button
                className="bg-[#416477] m-1 md:m-4 text-white font-bold p-2 rounded-md text-sm md:text-xl flex-1 min-w-0 hover:bg-slate-600"
                onClick={() => setSelectedTab("characters")}
              >
                Characters
              </button>
              <button
                className="bg-[#416477] m-1 md:m-4 text-white font-bold p-2 rounded-md text-sm md:text-xl flex-1 min-w-0 hover:bg-slate-600"
                onClick={() => setSelectedTab("equipment")}
              >
                Equipment
              </button>
              <button
                className="bg-[#416477] m-1 md:m-4 text-white font-bold p-2 rounded-md text-sm md:text-xl flex-1 min-w-0 hover:bg-slate-600"
                onClick={() => setSelectedTab("missions")}
              >
                Missions
              </button>
              <button
                className="bg-[#416477] m-1 md:m-4 text-white font-bold p-2 rounded-md text-sm md:text-xl flex-1 min-w-0 hover:bg-slate-600"
                onClick={() => setSelectedTab("imperial")}
              >
                Imperial Player
              </button>
            </div>

            {/* Content Area */}
            <div className="w-full md:w-3/4 max-w-4xl mx-auto overflow-auto min-h-[300px] flex flex-col justify-center bg-gray-100 p-4">
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
                <div className="text-xs md:text-xl">
                  <h1 className="font-bold mt-2">Campaign: {campaign.campaign}</h1>

                  <p>Campaign Start Date: {campaign.date}</p>

                  <p>Status: {campaignStatus}</p>
                  <p>Winner: </p>

                  <button
                    className="bg-[#416477] text-gray-200 p-2 rounded-md text-sm font-medium flex-1 min-w-0"
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
