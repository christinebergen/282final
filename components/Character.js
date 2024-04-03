import React, { useState, useEffect } from "react";
import { doc, updateDoc, setDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import CharacterAttachments from "./CharacterAttachments";

function Character({
  characterData,
  onCharacterClick,
  selectedCharacterDetails,
  id,
}) {
  const [characters, setCharacters] = useState(characterData);
  const [characterXP, setCharacterXP] = useState(
    selectedCharacterDetails?.xp || 0
  );

  useEffect(() => {
    // Directly use the xp from selectedCharacterDetails
    if (selectedCharacterDetails?.xp !== undefined) {
      setCharacterXP(selectedCharacterDetails.xp);
    }
  }, [selectedCharacterDetails]);

  const updateCharacterInFirebase = async (updatedCharacters) => {
    const campaignDocRef = doc(db, "campaigns", id);
    try {
      await updateDoc(campaignDocRef, {
        characters: updatedCharacters,
      });
    } catch (error) {
      console.error("Error updating character in Firestore:", error);
    }
  };

  const addXpForTesting = async (campaignId) => {
    if (!selectedCharacterDetails || !selectedCharacterDetails.name) {
      console.error("Selected character details or name is missing.");
      return;
    }

    const characterName = selectedCharacterDetails.name;

    if (typeof selectedCharacterDetails.xp !== "number") {
      console.error("Invalid XP value:", selectedCharacterDetails.xp);
      return;
    }

    const updatedXP = selectedCharacterDetails.xp + 5;

    // Adjust the path to point to the character within a campaign
    const characterDocRef = doc(
      db,
      `campaigns/${id}/characters`,
      characterName
    );

    try {
      await setDoc(characterDocRef, { xp: updatedXP }, { merge: true });
      console.log(
        `XP updated successfully for ${characterName} in campaign ${id}`
      );
    } catch (error) {
      console.error(
        `Error updating XP for ${characterName} in campaign ${id}:`,
        error
      );
    }
  };

  const [showAttachments, setShowAttachments] = useState(false);

  const handleViewClassCardsClick = () => {
    setShowAttachments(!showAttachments);
  };
  const purchaseAttachment = (characterName, attachmentName, cost) => {
    // Update logic for character's attachments
    setCharacters((prevCharacters) =>
      prevCharacters.map((character) => {
        if (character.name === characterName) {
          const newAvailableAttachments = character.attachments.filter(
            (att) => att.name !== attachmentName
          );
          const ownedAttachment = { name: attachmentName, cost };
          const newOwnedAttachments = [
            ...(character.ownedAttachments || []),
            ownedAttachment,
          ];

          return {
            ...character,
            attachments: newAvailableAttachments,
            ownedAttachments: newOwnedAttachments,
          };
        }
        return character;
      })
    );
  };

  useEffect(() => {
    console.log("Characters:", characters);
  }, [characters]);
  useEffect(() => {
    console.log("selectedCharacterDetails:", selectedCharacterDetails);
  }, [selectedCharacterDetails]);

  return (
    <div>
      {/* Render characters */}
      <h2 className="font-bold underline text-center text-xl">
        Characters in play:
      </h2>
      <div className="grid md:flex md:flex-row justify-center items-center">
        {characterData && characterData.length > 0 ? (
          characterData.map((characterName, index) => (
            <button
              className="bg-[#0FBDDB] mx-2 my-2 md:mx-4 md:my-4 md:p-4 rounded-lg font-bold hover:bg-teal-600 focus:outline-none"
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
        <div className="bg-gray-200 rounded-lg p-8 flex flex-col md:flex-row">
          <div>
            <h2 className="text-xl font-bold">
              {selectedCharacterDetails?.name}
            </h2>
            <h3>Available xp: {selectedCharacterDetails.xp}</h3>
            <button
              className="bg-green-500 text-white p-2 rounded"
              onClick={addXpForTesting}
            >
              Add 5xp (Test)
            </button>

            <button
              className="bg-[#0FBDDB] mx-2 my-2 md:mx-4 md:my-4 md:p-4 rounded-lg font-bold hover:bg-teal-600 focus:outline-none"
              onClick={handleViewClassCardsClick}
            >
              View Class Cards
            </button>
            {showAttachments && (
              <CharacterAttachments
                selectedCharacterDetails={selectedCharacterDetails}
                purchaseAttachment={purchaseAttachment}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Character;
