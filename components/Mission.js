import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import MissionComplete from "./MissionComplete";

const Mission = ({ id }) => {
  const [fetchedMissions, setFetchedMissions] = useState([]); // Only need one state for missions
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMissionId, setSelectedMissionId] = useState(null);

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
        setFetchedMissions(missionsData); // Update this to setFetchedMissions
      } catch (error) {
        console.error("Error fetching missions:", error);
        setError(error);
      }
      setLoading(false);
    };

    fetchMissions();
  }, [id]);

  if (loading) {
    return <p>Loading missions...</p>;
  }

  if (error) {
    return <p>Error loading missions: {error}</p>;
  }

  const handleCompleteClick = (missionId) => {
    setSelectedMissionId(missionId);
  };

  return (
    <div>
      <h2 className="text-center">Selected Missions:</h2>
      {fetchedMissions.map((mission) => (
  <div className="flex flex-row" key={mission.id}>
    <h3>{mission.id}</h3>
    <button
      className="bg-[#0FBDDB] ml-4 pl-2 pr-2 rounded-lg"
      onClick={() => handleCompleteClick(mission.id)}
    >
      Mark as Complete
    </button>
    {/* Add other mission details here */}
  </div>
))}

      {/* Conditional rendering for MissionComplete */}
      {selectedMissionId && (
        <MissionComplete id={id} missionId={selectedMissionId}  />
      )}
    </div>
  );
};

export default Mission;
