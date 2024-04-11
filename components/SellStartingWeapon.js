import React, { useState } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const SellStartingWeapon = ({ selectedCharacterDetails, id }) => {
  const [successMessage, setSuccessMessage] = useState("");

  const sellStartWeapon = async () => {
    const weaponValue = selectedCharacterDetails.Value;
    const sellValue = weaponValue / 2;

    const campaignRef = doc(db, "campaigns", id);
    try {
      const campaignSnap = await getDoc(campaignRef);
      if (campaignSnap.exists()) {
        const currentFunds = campaignSnap.data().availableFunds || 0;
        const newFunds = currentFunds + sellValue;
        await updateDoc(campaignRef, { availableFunds: newFunds });
        setSuccessMessage(
          `Sold weapon for $${sellValue}. New funds: ${newFunds}`
        );
      } else {
        console.log("No such campaign!");
      }
    } catch (error) {
      console.error("Error selling weapon:", error);
    }

    // Additional logic to update character details, if needed
  };

  if (!selectedCharacterDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Starting Weapon: {selectedCharacterDetails.startingWeapon}</h2>
      <p>Value: ${selectedCharacterDetails.startingWeaponValue}</p>
      {/* <button onClick={sellStartWeapon}>Sell Weapon</button> */}
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};

export default SellStartingWeapon;
