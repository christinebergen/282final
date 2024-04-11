import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const AwardFunds = ({ campaignId }) => {
  const [fundsToAdd, setFundsToAdd] = useState(0);

  const awardFunds = async () => {
    const campaignRef = doc(db, "campaigns", campaignId);
    try {
      const campaignSnap = await getDoc(campaignRef);
      if (campaignSnap.exists()) {
        const currentFunds = campaignSnap.data().availableFunds || 0;
        const newFunds = currentFunds + Number(fundsToAdd);
        await updateDoc(campaignRef, { availableFunds: newFunds });
        console.log(`Funds updated: ${newFunds}`);
      } else {
        console.log("No such campaign!");
      }
    } catch (err) {
      console.error("Error updating funds:", err);
    }
  };

  return (
    <div>
      <input
        type="number"
        placeholder="Enter Funds Amount"
        value={fundsToAdd}
        onChange={(e) => setFundsToAdd(e.target.value)}
      />
      
    </div>
  );
};

export default AwardFunds;
