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

const MissionComplete = ({ id, missionId, imperialId, onMissionComplete }) => {
  const [mission, setMission] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [xpAmount, setXpAmount] = useState();
  const [fundsToAdd, setFundsToAdd] = useState();
  const [threatToAdd, setThreatToAdd] = useState();
  const [winner, setWinner] = useState(""); // 'Imperial' or 'Rebel'

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
    const imperialRef = doc(db, `campaigns/${id}/imperial`, "imperialPlayer"); // Fixed ID 'player'
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
    try {
      // Call functions to update XP, funds, and threat
      await awardXP(xpAmount);
      await awardFunds(fundsToAdd);
      await awardThreat(threatToAdd);
      // You may want to add additional logic here for post-save actions
      const missionRef = doc(db, `campaigns/${id}/missions`, missionId);
      await updateDoc(missionRef, { status: "completed", winner: winner });
      console.log(
        `Mission ${missionId} marked as completed. Winner: ${winner}`
      );
      if (!winner) {
        alert("Please select a winner.");
        return;
      }
      if (onMissionComplete) {
        onMissionComplete();
      }
    } catch (err) {
      console.error("Error in saveMissionRewards:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {mission && (
        <>
          <div className="flex flex-col justify-center items-center">
            <hr className="w-3/4 border-2 rounded-md border-gray-200 my-4"></hr>
            <h2 className="text-xl font-bold">
              Mark Mission as Complete: {mission.id}
            </h2>
            <div className="bg-gray-400 rounded-lg text-center">
              <p className="text-xl font-bold mt-4 mb-4 underline">
                Rewards: {mission.rewards}
              </p>
              <div className="flex flex-col justify-center items-center text-center">
                <div>
                  <label>XP Amount:</label>
                  <input
                    className="bg-gray-200 rounded-lg p-2 flex flex-col md:flex-row"
                    type="number"
                    placeholder="XP per player"
                    value={xpAmount}
                    onChange={(e) => setXpAmount(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Funds Amount:</label>
                  <input
                    className="bg-gray-200 rounded-lg p-2 flex flex-col md:flex-row"
                    type="number"
                    placeholder="Total Funds"
                    value={fundsToAdd}
                    onChange={(e) => setFundsToAdd(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Threat Amount:</label>
                  <input
                    className="bg-gray-200 rounded-lg p-2 flex flex-col md:flex-row"
                    type="number"
                    placeholder="Threat Amount"
                    value={threatToAdd}
                    onChange={(e) => setThreatToAdd(Number(e.target.value))}
                  />
                </div>

                <h3 className="text-xl underline font-bold mt-4">Winner:</h3>
                <div className="flex flex-row">
                  <label className="text-xl mr-4">
                    <input
                      type="radio"
                      value="Imperial"
                      checked={winner === "Imperial"}
                      onChange={() => setWinner("Imperial")}
                      className="mr-2 ml-2"
                    />
                    Imperial
                  </label>
                  <p className="text-xl font-bold">|</p>
                  <label className="text-xl mr-4">
                    <input
                      type="radio"
                      value="Rebel"
                      checked={winner === "Rebels"}
                      onChange={() => setWinner("Rebels")}
                      className="mr-2 ml-2"
                    />
                    Rebels
                  </label>
                </div>
                <button
                  onClick={saveMissionRewards}
                  className="bg-[#0FBDDB] p-2 rounded-md font-bold w-2/3 mt-4"
                >
                  Mark Mission as Complete and Save All Rewards
                </button>
                <hr className="w-3/4 border-2 rounded-md border-gray-200 my-4"></hr>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MissionComplete;
