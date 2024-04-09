import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const AwardThreat = ({ campaignId }) => {
  const [threatToAdd, setThreatToAdd] = useState(0);

  const awardThreat = async () => {
    const campaignRef = doc(db, "campaigns", campaignId);
    try {
      const campaignSnap = await getDoc(campaignRef);
      if (campaignSnap.exists()) {
        const currentThreat = campaignSnap.data().threat || 0;
        const newThreat = currentThreat + Number(threatToAdd);
        await updateDoc(campaignRef, { threat: newThreat });
        console.log(`Threat updated: ${newThreat}`);
      } else {
        console.log("No such campaign!");
      }
    } catch (err) {
      console.error("Error updating threat:", err);
    }
  };

  return (
    <div>
      <input
        type="number"
        placeholder="Enter Threat Amount"
        value={threatToAdd}
        onChange={(e) => setThreatToAdd(e.target.value)}
      />
      <button onClick={awardThreat}>Add Threat</button>
    </div>
  );
};

export default AwardThreat;
