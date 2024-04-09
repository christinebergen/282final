import React, { useState } from "react";

const AwardXp = ({ onSave }) => {
  
  const [xpAmount, setXPAmount] = useState("");

console.log("AwardXp Component Rendered. Current XP Amount:", xpAmount);

  const handleSaveClick = () => {
    if (xpAmount.trim() === "") {
      console.log("No XP amount entered.");
      alert("Please enter a valid XP amount.");
      return;
    }
    const xpToSave = Number(xpAmount);
    console.log("Saving XP Amount:", xpToSave); // Log the amount being saved

    onSave(xpToSave); // Pass the numeric XP amount to onSave
    setXPAmount(""); // Clear the input field after saving
  };
  return (
    <div>
      <input
        type="number"
        placeholder="Enter XP amount"
        value={xpAmount}
        onChange={(e) => setXPAmount(e.target.value)}
      />
      <button onClick={handleSaveClick}>Save</button>
    </div>
  );
};

export default AwardXp;
