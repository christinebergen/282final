import Link from "next/link";
import Head from "next/head";
import Layout from "../components/layout";
import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, setDoc, collection } from "firebase/firestore";
import { useRouter } from "next/router";
import useAuth from "../hooks/useAuth";

export default function AddCampaign() {
  const [formData, setFormData] = useState({
    date: "",
    campaign: "",
    characters: [],
    // ... any other fields you need
  });
  const campaigns = [
    "Base Campaign",
    "Twin Shadows",
    "Return to Hoth",
    "Bespin Gambit",
    "Jabba's Realm",
    "Heart of the Empire",
    "Tyrants of Lothal",
  ];

  const [allCharacters] = useState([
    "Diala Passil",
    "Gideon Argus",
    "Fenn Signis",
    "Gaarkan",
    "Jyn Odan",
    "Biv Bodhrik",
    "Saska Teft",
    "Loku Kanoloa",
    "MHD-19",
    "Verena Talos",
    "Mak Eshka'rey",
    "Davith Elso",
    "Murne Rin",
    "Onar Koma",
    "Shyla Varad",
    "Vinto Hreeda",
    "Drokkatta",
    "Jarrod Kelvin",
    "Ko-Tun Feralo",
    "",
  ]);
  const [selectedCharacters, setSelectedCharacters] = useState([]);

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
      if (prevCharacters.includes(character)) {
        return prevCharacters.filter((c) => c !== character);
      } else {
        return [...prevCharacters, character];
      }
    });
  };

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

    const campaignData = {
      ...formData,
      userId: currentUser.uid, // Assuming currentUser has the UID
      date: formData.date,
      campaign: formData.campaign,
      characters: formData.characters,
    };

    try {
      const docRef = doc(collection(db, "campaigns"));
      await setDoc(docRef, campaignData);
      alert("Campaign added successfully");
      // Reset the form or redirect the user
      router.push(`/campaign-details/${docRef.id}`);
      console.log(campaignData);
    } catch (error) {
      console.error("Error adding campaign: ", error);
    }
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center mt-10">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:rounded-lg bg-gray-200">
          <h1 className="text-center pt-4 text-4xl">Add New Campaign</h1>
          <form
            onSubmit={handleSubmit}
            className="p-4 rounded-lg text-lg md:text-2xl"
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
                  <option key={campaign} value={campaign}>
                    {campaign}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-row mt-10">
              <div className="text-center p-4 bg-gray-100 border-2 rounded-lg border-black mr-2">
                <label className="text-xl font-bold underline">
                  Add Rebel Characters:
                </label>
                <div className="character-selection">
                  {allCharacters.map(
                    (character) =>
                      !selectedCharacters.includes(character) && (
                        <div
                          className="hover:underline"
                          key={character}
                          onClick={() => handleCharacterClick(character)}
                          style={{ cursor: "pointer" }}
                        >
                          {character}
                        </div>
                      )
                  )}
                </div>
              </div>
              <div className="text-center p-4 bg-gray-100 border-2 rounded-lg border-black">
                <label className="text-xl font-bold underline">
                  Selected Characters:
                </label>
                <div className="selected-characters">
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
