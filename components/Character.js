import React, { useState, useEffect } from "react";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

function Character({
  characterData,
  onCharacterClick,
  selectedCharacterDetails,
  campaignId,
}) {
  const [characters, setCharacters] = useState(characterData);
  const [characterXP, setCharacterXP] = useState(
    selectedCharacterDetails?.xp || 0
  );
  const [showAttachments, setShowAttachments] = useState(false);

  useEffect(() => {
    setCharacterXP(selectedCharacterDetails?.xp || 0);
  }, [selectedCharacterDetails]);

  const addXpForTesting = async (xpToAdd = 5) => {
    const updatedCharacters = characters.map((character) => {
      if (character.name === selectedCharacterDetails.name) {
        console.log("Updated characters after adding XP:", updatedCharacters);
        return { ...character, xp: character.xp + xpToAdd };
      }
      return character;
    });

    setCharacters(updatedCharacters);
    updateCharacterInFirebase(updatedCharacters);
  };

  const purchaseAttachment = async (
    characterName,
    attachment,
    attachmentCost
  ) => {
    const updatedCharacters = characters.map((character) => {
      if (character.name === characterName && character.xp >= attachmentCost) {
        return {
          ...character,
          xp: character.xp - attachmentCost,
          ownedAttachments: [...(character.ownedAttachments || []), attachment],
        };
      }
      return character;
    });

    setCharacters(updatedCharacters);
    updateCharacterInFirebase(updatedCharacters);
  };

  const updateCharacterInFirebase = async (updatedCharacters) => {
    const campaignDocRef = doc(db, "campaigns", campaignId);
    try {
      await updateDoc(campaignDocRef, {
        characters: updatedCharacters,
      });
    } catch (error) {
      console.error("Error updating character in Firestore:", error);
    }
  };

  const handleBuyAttachments = () => {
    setShowAttachments(!showAttachments);
  };
  useEffect(() => {
    console.log("Selected Character Details:", selectedCharacterDetails);
    if (selectedCharacterDetails && selectedCharacterDetails.Attachments) {
      console.log("Attachments:", selectedCharacterDetails.Attachments);
    }
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
      {/* {selectedCharacterDetails && (
        <div className="bg-gray-200 rounded-lg p-8 flex flex-col md:flex-row">
          <div>
            <h2 className="text-xl font-bold">
              {selectedCharacterDetails?.name}
            </h2>
            <h3>Available xp: {characterXP}</h3>
            <button
              className="bg-[#0FBDDB] m-8 p-4 rounded-lg underline font-bold md:text-xl hover:italic hover:bg-teal-600"
              onClick={handleBuyAttachments}
            >
              Click here to buy Attachments
            </button>
            {selectedCharacterDetails &&
              selectedCharacterDetails.Attachments &&
              Array.isArray(selectedCharacterDetails.Attachments) && (
                <div>
                  <ul>
                    {selectedCharacterDetails.Attachments.map(
                      (attachment, index) => (
                        <li key={index}>
                          {attachment && attachment.name && attachment.cost && (
                            <>
                              {attachment.name}, cost: {attachment.cost}xp
                              <button
                                className="bg-[#0FBDDB] ml-4 pl-2 pr-2 rounded-lg"
                                onClick={() =>
                                  purchaseAttachment(
                                    selectedCharacterDetails.name,
                                    attachment.name,
                                    attachment.cost
                                  )
                                }
                              >
                                Buy
                              </button>
                            </>
                          )}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
          </div>
        </div> */}
      {/* )} */}
      {selectedCharacterDetails && (
        <button
          className="toggle-attachments-button"
          onClick={handleBuyAttachments}
        >
          {showAttachments ? 'Hide Class Cards' : 'View Class Cards'}
        </button>
      )}

      {/* Conditionally render attachments section */}
      {showAttachments && selectedCharacterDetails && Array.isArray(selectedCharacterDetails.Attachments) && (
        <div className="attachments-section">
          <h3 className="text-xl font-bold">Class Cards:</h3>
          {selectedCharacterDetails.Attachments.length > 0 ? (
            <ul>
              {selectedCharacterDetails.Attachments.map((attachment, index) => (
                <li key={index}>
                  {attachment.name} (Cost: {attachment.cost}xp)
                  <button
                    className="buy-attachment-button"
                    onClick={() =>
                      purchaseAttachment(
                        selectedCharacterDetails.name,
                        attachment.name,
                        attachment.cost
                      )
                    }
                  >
                    Buy
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No attachments available</p>
          )}
        </div>
      )}

      
    </div>
  );
}

export default Character;
