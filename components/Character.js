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
  const [characterXP, setCharacterXP] = useState(0);

  useEffect(() => {
    const fetchCharacterXP = async () => {
      if (selectedCharacterDetails && selectedCharacterDetails.id && id) {
        console.log(`Fetching XP for character ID: ${selectedCharacterDetails.id} in campaign ${id}`);
        const characterDocRef = doc(db, `campaigns/${id}/characters`, selectedCharacterDetails.id);
        try {
          const characterDocSnap = await getDoc(characterDocRef);
          console.log("Fetched character data:", characterDocSnap.data());
          if (characterDocSnap.exists()) {
            const characterData = characterDocSnap.data();
            setCharacterXP(characterData.xp || 0);
            console.log(`Updated XP state: ${characterData.xp || 0}`);
          } else {
            console.log(`Character not found in Firestore at path: campaigns/${id}/characters/${selectedCharacterDetails.id}`);
          }
        } catch (error) {
          console.error("Error fetching character data:", error);
        }
      }
    };
  
    fetchCharacterXP();
  }, [selectedCharacterDetails, id]);
  

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
            <h3>Available xp: {characterXP}</h3>
            {/* <button
              className="bg-green-500 text-white p-2 rounded"
              onClick={addXpForTesting}
            >
              Add 5xp (Test)
            </button> */}

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
