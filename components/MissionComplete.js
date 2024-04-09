import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
// import AwardXp from "./AwardXp";
// import AwardFunds from "./AwardFunds";
// import AwardThreat from "./AwardThreat";

const MissionComplete = ({ id, missionId, imperialId }) => {
  const [mission, setMission] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [xpAmount, setXpAmount] = useState(0);
  const [fundsToAdd, setFundsToAdd] = useState(0);
  const [threatToAdd, setThreatToAdd] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Fetch Mission Details
        const missionRef = doc(db, `campaigns/${id}/missions`, missionId);
        const missionSnap = await getDoc(missionRef);
        if (missionSnap.exists()) {
          setMission({ id: missionSnap.id, ...missionSnap.data() });
        } else {
          console.log("No such mission!");
        }

        // Fetch Characters
        const charactersRef = collection(db, `campaigns/${id}/characters`);
        const charactersSnapshot = await getDocs(charactersRef);
        const charactersData = charactersSnapshot.docs.map((doc) => doc.data());
        setCharacters(charactersData);
      } catch (err) {
        console.error("Error:", err);
        setError(err);
      }

      setLoading(false);
    };

    fetchData();
  }, [id, missionId]);

  const awardXP = async (xpAmount) => {
    console.log("onSave called with XP amount:", xpAmount);
    try {
      const charactersRef = collection(db, `campaigns/${id}/characters`);
      const charactersSnapshot = await getDocs(charactersRef);

      const updates = charactersSnapshot.docs.map(async (characterDoc) => {
        const characterDocRef = doc(
          db,
          `campaigns/${id}/characters`,
          characterDoc.id
        );
        const newXP = (characterDoc.data().xp || 0) + Number(xpAmount);

        // Update the document and then catch any errors
        return updateDoc(characterDocRef, { xp: newXP }).catch((error) =>
          console.error(
            "Error updating character XP for",
            characterDoc.id,
            ":",
            error
          )
        );
      });
      await Promise.all(updates);
    } catch (err) {
      console.error("Error updating XP:", err);
    }
  };

  const awardFunds = async () => {
    const campaignRef = doc(db, "campaigns", id);
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
  const awardThreat = async () => {
    const imperialRef = doc(db, `campaigns/${id}/imperial/${imperialId}`);
    try {
      const imperialSnap = await getDoc(imperialRef);
      if (imperialSnap.exists()) {
        const currentThreat = imperialSnap.data().threat || 0;
        const newThreat = currentThreat + Number(threatToAdd);
        await updateDoc(imperialRef, { threat: newThreat });
        console.log(`Threat updated: ${newThreat}`);
      } else {
        console.log("Imperial player not found!");
      }
    } catch (err) {
      console.error("Error updating threat:", err);
    }
  };
  

  const saveMissionRewards = async () => {
    // Call functions to update XP, funds, and threat
    await awardXP(xpAmount);
    await awardFunds(fundsToAdd);
    await awardThreat(threatToAdd);
    // You may want to add additional logic here for post-save actions
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {mission && (
        <>
          <h2>Mark Mission as Complete: {mission.id}</h2>
          <p>Rewards: {mission.rewards}</p>
          <div>
            <div>
              <label>XP Amount:</label>
              <input
                className="bg-gray-200 rounded-lg p-2 flex flex-col md:flex-row"
                type="number"
                placeholder="Enter XP amount"
                value={xpAmount}
                onChange={(e) => setXpAmount(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Funds Amount:</label>
              <input
                className="bg-gray-200 rounded-lg p-2 flex flex-col md:flex-row"
                type="number"
                placeholder="Enter Funds Amount"
                value={fundsToAdd}
                onChange={(e) => setFundsToAdd(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Threat Amount:</label>
              <input
                className="bg-gray-200 rounded-lg p-2 flex flex-col md:flex-row"
                type="number"
                placeholder="Enter Threat Amount"
                value={threatToAdd}
                onChange={(e) => setThreatToAdd(Number(e.target.value))}
              />
            </div>
            <button
              onClick={saveMissionRewards}
              className="bg-blue-600 p-4 rounded-md"
            >
              Save All Rewards
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MissionComplete;
