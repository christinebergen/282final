import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import MissionComplete from "./MissionComplete";

const Mission = ({ id }) => {
  const [fetchedMissions, setFetchedMissions] = useState([]); // Only need one state for missions
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMissionId, setSelectedMissionId] = useState(null);
  const [activeMissions, setActiveMissions] = useState([]);
  const [completedMissions, setCompletedMissions] = useState([]);

  useEffect(() => {
    const fetchMissions = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const missionsRef = collection(db, `campaigns/${id}/missions`);
        const missionSnapshot = await getDocs(missionsRef);
        const missionsData = missionSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Now filter the missionsData
        const activeMissions = missionsData.filter(
          (mission) => mission.status !== "completed"
        );
        const completedMissions = missionsData.filter(
          (mission) => mission.status === "completed"
        );

        // Update state with the filtered data
        setActiveMissions(activeMissions);
        setCompletedMissions(completedMissions);
      } catch (error) {
        console.error("Error fetching missions:", error);
        setError(error);
      }

      setLoading(false);
    };

    fetchMissions();
  }, [id]); // Dependencies array

  if (loading) {
    return <p>Loading missions...</p>;
  }

  if (error) {
    return <p>Error loading missions: {error}</p>;
  }

  const handleCompleteClick = (missionId) => {
    setSelectedMissionId(missionId);
  };
  const handleMissionComplete = () => {
    setSelectedMissionId(null); // Or setSelectedMissionId('');
  };

  return (
    <div className="flex flex-col space-between mb-8">
      <h2 className="text-center font-bold text-xl underline mb-4">
        Active Missions:
      </h2>
      {activeMissions.map((mission) => (
        <div className="flex flex-row" key={mission.id}>
          <h3 className="font-bold">{mission.id}</h3>
          <button
            className="bg-[#0FBDDB] ml-4 pl-2 pr-2 rounded-lg right-0"
            onClick={() => handleCompleteClick(mission.id)}
          >
            Mark as Complete
          </button>
          {/* Add other mission details here */}
        </div>
      ))}
      {selectedMissionId && (
        <MissionComplete
          id={id}
          missionId={selectedMissionId}
          onMissionComplete={handleMissionComplete}
        />
      )}
      <h2 className="text-center font-bold text-xl underline mt-8 mb-4">
        Completed Missions:
      </h2>
      {completedMissions.map((mission) => (
        <div className="flex flex-col" key={mission.id}>
          <h3 className="font-bold">{mission.id}</h3>

          <p> Won by: {mission.winner}</p>
          <br />

          {/* Display completed mission details */}
        </div>
      ))}

      {/* Conditional rendering for MissionComplete */}
    </div>
  );
};

export default Mission;
