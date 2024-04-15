import React, { useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  setDoc,
  arrayUnion,
  getDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import CharacterAttachments from "./CharacterAttachments";
import SellStartingWeapon from "./SellStartingWeapon";

function Character({
  characterData,
  onCharacterClick,
  selectedCharacterDetails,
  id,
}) {
  const [characters, setCharacters] = useState(characterData);
  const [characterXP, setCharacterXP] = useState(0);
  const [characterDetails, setSelectedCharacterDetails] = useState();
  const [ownedAttachments, setOwnedAttachments] = useState([]);

  useEffect(() => {
    if (selectedCharacterDetails?.ownedAttachments) {
      setOwnedAttachments(selectedCharacterDetails.ownedAttachments);
    }
  }, [selectedCharacterDetails]);

  useEffect(() => {
    const fetchCharacterDetails = async () => {
      if (selectedCharacterDetails?.firebaseId && id) {
        console.log(
          `Fetching details for character with ID: ${selectedCharacterDetails.firebaseId}`
        );
        const characterRef = doc(
          db,
          `campaigns/${id}/characters`,
          selectedCharacterDetails.firebaseId
        );

        const docSnap = await getDoc(characterRef);
        if (docSnap.exists()) {
          const characterDataFromFirebase = docSnap.data();
          setCharacterXP(characterDataFromFirebase.xp || 0);
          setOwnedAttachments(characterDataFromFirebase.ownedAttachments || []);
        } else {
          console.log("No such character in Firebase!");
        }
      }
    };

    fetchCharacterDetails();
  }, [selectedCharacterDetails, id]);

  const purchaseAttachment = async (attachmentName, cost) => {
    const numericCost = Number(cost); // Convert cost to number
    const currentXP = Number(characterXP); // Convert characterXP to number

    console.log(
      "Attempting to purchase:",
      attachmentName,
      "Cost:",
      numericCost,
      "Available XP:",
      currentXP
    );

    if (currentXP >= numericCost) {
      // Subtract the cost from the character's XP
      const newXP = currentXP - numericCost;

      setCharacterXP(newXP);

      // Add attachment to the owned attachments list
      const newOwnedAttachments = [
        ...(selectedCharacterDetails.ownedAttachments || []),
        { name: attachmentName, cost },
      ];

      // Update the selectedCharacterDetails with the new XP and owned attachments
      const updatedCharacter = {
        ...selectedCharacterDetails,
        xp: newXP,
        ownedAttachments: newOwnedAttachments,
      };

      // Update characters array (for local state)
      const updatedCharacters = characters.map((character) =>
        character.name === selectedCharacterDetails.name
          ? updatedCharacter
          : character
      );
      setCharacters(updatedCharacters);

      // Update character in Firebase
      const characterRef = doc(
        db,
        `campaigns/${id}/characters`,
        selectedCharacterDetails.firebaseId
      );

      try {
        await updateDoc(characterRef, {
          xp: newXP,
          ownedAttachments: arrayUnion({ name: attachmentName, cost }),
        });
      } catch (error) {
        console.error("Error updating character in Firebase:", error);
      }

      console.log("Attachment purchased and saved to Firebase");
    } else {
      console.log(
        "Not enough XP. Required:",
        numericCost,
        "Available:",
        currentXP
      );
      alert("Not enough XP to purchase this attachment!");
    }
  };

  useEffect(() => {
    // Assuming selectedCharacterDetails includes 'firebaseId'
    if (selectedCharacterDetails?.firebaseId) {
      const fetchCharacterDetails = async () => {
        const characterRef = doc(
          db,
          `campaigns/${id}/characters`,
          selectedCharacterDetails.firebaseId
        );

        const docSnap = await getDoc(characterRef);
        if (docSnap.exists()) {
          setSelectedCharacterDetails(docSnap.data());
        } else {
          console.log("No such character in Firebase!");
        }
      };

      fetchCharacterDetails();
    }
  }, [selectedCharacterDetails, id]);

  useEffect(() => {
    console.log("Characters:", characters);
  }, [characters]);
  useEffect(() => {
    console.log(
      "Selected character details in Character.js:",
      selectedCharacterDetails
    );
  }, [selectedCharacterDetails]);

  useEffect(() => {
    console.log("Owned Attachments:", ownedAttachments);
  }, [ownedAttachments]);
  useEffect(() => {
    console.log("Selected Character Details:", selectedCharacterDetails);
  }, [selectedCharacterDetails]);

  useEffect(() => {
    setOwnedAttachments([{ name: "Test Attachment" }]);
  }, []);

  useEffect(() => {
    console.log("Updated characterXP state:", characterXP);
  }, [characterXP]);

  return (
    <div>
      {/* Render characters */}
      <h2 className="font-bold underline text-center text-md md:text-xl">
        Characters in play:
      </h2>
      <div className="flex flex-wrap justify-between">
        {characterData && characterData.length > 0 ? (
          characterData.map((characterName, index) => (
            <button
            className="bg-[#416477] text-white m-1 md:m-4 p-2 rounded-md text-sm font-medium flex-1 min-w-0"
              key={`character-${index}`}
              onClick={() => onCharacterClick(characterName)}
            >
              {characterName}
            </button>
          ))
        ) : (
          <p>No characters found</p>
        )}
      </div>

      {/* Render selected character details */}
      {selectedCharacterDetails && (
        <div className="bg-gray-200 rounded-lg md:p-8 flex flex-col md:flex-row">
          <div className="text-sm md:text-xl">
            <h2 className="font-bold text-center md:text-left">
              {selectedCharacterDetails.name}
            </h2>
            <h3>Available xp: {characterXP}</h3>
            <SellStartingWeapon
              selectedCharacterDetails={selectedCharacterDetails}
              id={id}
            />
          </div>
          <div className="w-full md:w-2/3">
            <div className="bg-gray-300 md:ml-4 p-2 md:p-4 rounded-lg">
              <h3 className="font-bold underline pb-2">Owned Attachments:</h3>
              <ul>
                {ownedAttachments.map((attachment, index) => (
                  <li key={index}>{attachment.name}</li>
                ))}
              </ul>
            </div>

            <CharacterAttachments
              selectedCharacterDetails={selectedCharacterDetails}
              purchaseAttachment={(attachmentName, cost) =>
                purchaseAttachment(attachmentName, cost)
              }
              ownedAttachments={ownedAttachments}
            />

            {/* Display owned attachments */}
          </div>
        </div>
      )}
    </div>
  );
}

export default Character;
