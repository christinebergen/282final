import Link from "next/link";
import Head from "next/head";
import Layout from "../components/layout";
import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, setDoc, collection } from "firebase/firestore";
import { useRouter } from "next/router";
import useAuth from "../hooks/useAuth";
import characterData from "../public/data/characters.json";
import missionsData from "../public/data/agenda-missions.json";
import campaignsData from "../public/data/campaigns.json"; // Import campaigns data

const allCharacters = characterData.map((character) => character.name);

export default function AddCampaign() {
  const [formData, setFormData] = useState({
    date: "",
    campaign: "",
    characters: [],
    // ... any other fields you need
  });

  const campaigns = Object.keys(campaignsData).map((key) => ({
    name: key,
    ...campaignsData[key],
  }));

  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [availableMissions, setAvailableMissions] = useState([]);
  const [selectedMissions, setSelectedMissions] = useState([]);

  useEffect(() => {
    const missionsArray = Object.keys(missionsData).map((key) => ({
      name: key,
      ...missionsData[key],
    }));
    setAvailableMissions(missionsArray);
  }, []);

  const handleMissionSelect = (missionName) => {
    if (selectedMissions.includes(missionName)) {
      setSelectedMissions(
        selectedMissions.filter((name) => name !== missionName)
      );
    } else if (selectedMissions.length < 6) {
      setSelectedMissions([...selectedMissions, missionName]);
      setAvailableMissions(
        availableMissions.filter((mission) => mission.name !== missionName)
      ); // Remove the selected mission from availableMissions
    } else {
      alert("You can only select up to 6 missions.");
    }
  };

  const handleMissionClick = (missionName) => {
    if (
      selectedMissions.length < 6 &&
      !selectedMissions.includes(missionName)
    ) {
      setSelectedMissions([...selectedMissions, missionName]);
    } else {
      alert("You can select up to 6 missions.");
    }
  };

  const handleRemoveMission = (missionName) => {
    setSelectedMissions(
      selectedMissions.filter((name) => name !== missionName)
    );
  };

  const { user: currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setFormData((formData) => ({
      ...formData,
      characters: selectedCharacters,
    }));
  }, [selectedCharacters]);

  const handleCharacterClick = (character) => {
    setSelectedCharacters((prevCharacters) => {
      const updatedCharacters = prevCharacters.includes(character)
        ? prevCharacters.filter((c) => c !== character)
        : [...prevCharacters, character];

      console.log("Updated Selected Characters:", updatedCharacters);
      return updatedCharacters;
    });
  };

  // Before return statement in your component
  console.log("Rendering Selected Characters:", selectedCharacters);

  const handleRemoveCharacter = (character) => {
    setSelectedCharacters(selectedCharacters.filter((c) => c !== character));
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!currentUser) {
      console.error("User is not authenticated");
      return;
    }
    if (formData.characters.length !== 4) {
      alert("You must select exactly 4 characters.");
      return;
    }
    if (selectedMissions.length !== 6) {
      alert("You must select exactly 6 missions.");
      return;
    }

    const campaignData = {
      ...formData,
      userId: currentUser.uid,
      date: formData.date,
      campaign: formData.campaign,
    };

    try {
      console.log("Creating campaign document...");
      const campaignDocRef = doc(collection(db, "campaigns"));
      await setDoc(campaignDocRef, campaignData);
      console.log("Campaign document created:", campaignDocRef.id);

      console.log("Adding characters to the campaign's subcollection...");
      const charactersToAdd = [...formData.characters, "Imperial Player"];
      for (const characterName of charactersToAdd) {
        // Create a reference to the characters subcollection of the campaign
        const charactersCollectionRef = collection(
          db,
          `campaigns/${campaignDocRef.id}/characters`
        );

        // Create a new document in the characters subcollection
        const characterDocRef = doc(charactersCollectionRef);
        await setDoc(characterDocRef, { name: characterName });
        console.log(`Character added: ${characterName}`);
      }
      console.log("Adding missions to the campaign's subcollection...");
      for (const missionName of selectedMissions) {
        try {
          const mission = missionsData[missionName]; // Get the entire mission object using the mission name
          console.log("Mission Object:", mission);
          const missionDocRef = doc(
            db,
            `campaigns/${campaignDocRef.id}/missions`,
            missionName // Set the document ID to the mission name
          );
          await setDoc(missionDocRef, mission); // Pass the entire mission object
          console.log(`Mission added: ${mission.name}`);
        } catch (error) {
          console.error("Error adding mission:", error);
        }
      }

      console.log("Campaign added successfully");
      alert("Campaign added successfully");
      router.push(`/campaign-details/${campaignDocRef.id}`);
    } catch (error) {
      console.error("Error adding campaign: ", error);
      alert("Error adding campaign: " + error.message);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center mt-10">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:rounded-lg bg-gray-200">
          <h1 className="text-center pt-4 text-xl md:text-4xl">Add New Campaign</h1>
          <form
            onSubmit={handleSubmit}
            className="p-4 rounded-lg text-md md:text-lg"
          >
            <div className="mb-4">
              <label className="pr-20">Start Date:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="border-2 border-black ml-4 p-2 rounded-md"
              />
            </div>
            <div>
              <label>Campaign Name:</label>
              <select
                name="campaign"
                value={formData.campaign}
                onChange={handleChange}
                className="border-2 border-black ml-4 p-2 rounded-md"
              >
                <option value="">Select Campaign</option>
                {campaigns.map((campaign) => (
                  <option key={campaign.name} value={campaign.name}>
                    {campaign.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-row mt-10">
              <div className="text-center p-4 bg-gray-100 border-2 rounded-lg border-black mr-2">
                <label className="text-sm md:text-xl font-bold underline">
                  Add 4 Rebel Characters:
                </label>
                <div className="character-selection">
                  {allCharacters.map(
                    (characterName) =>
                      !selectedCharacters.includes(characterName) && (
                        <div
                          className="hover:underline"
                          key={characterName}
                          onClick={() => handleCharacterClick(characterName)}
                          style={{ cursor: "pointer" }}
                        >
                          {characterName}
                        </div>
                      )
                  )}
                </div>
              </div>
              <div className="text-center p-4 bg-gray-100 border-2 rounded-lg border-black">
                <label className="text-sm md:text-xl font-bold underline">
                  Selected Characters:
                </label>
                <div className="selected-characters">
                  <p>Imperial Player</p>
                  {selectedCharacters.map((character) => (
                    <div
                      className="hover:underline"
                      key={character}
                      style={{ cursor: "pointer" }}
                    >
                      {character}
                      <img
                        onClick={() => handleRemoveCharacter(character)}
                        src="/images/xicon.png"
                        style={{
                          cursor: "pointer",
                          width: "10px",
                          height: "10px",
                          display: "inline",
                          marginLeft: "10px",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Mission selection UI */}
            <div className="flex flex-row mt-10">
              <div className="text-center p-4 bg-gray-100 border-2 rounded-lg border-black mr-2">
                <label className="text-sm md:text-xl font-bold underline">
                  Add 6 Missions:
                </label>
                <div className="mission-selection">
                  {availableMissions.map((mission, index) => (
                    <div
                    
                      key={index} // Use index as the key for unique identification
                      className="mission-item hover:underline"
                      onClick={() => handleMissionSelect(mission.name)}
                      style={{ cursor: "pointer" }}
                    >
                      {mission.name}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center p-4 bg-gray-100 border-2 rounded-lg border-black">
                <label className="text-sm md:text-xl font-bold underline">
                  Selected Missions:
                </label>
                <div className="selected-missions">
                  {selectedMissions.map((missionName) => (
                    <div
                      className="hover:underline"
                      key={missionName}
                      style={{ cursor: "pointer" }}
                    >
                      {missionName}
                      <span
                        onClick={() => handleRemoveMission(missionName)}
                        style={{
                          cursor: "pointer",
                          marginLeft: "10px",
                        }}
                      >
                        &#10005; {/* This is a simple 'X' symbol */}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-gray-800 mt-10 mb-10 rounded-md text-white font-semi text-xl p-4"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
