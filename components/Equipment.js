import React, { useState, useEffect } from "react";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

function Equipment({
  id,
  selectedTier,
  ownedEquipment,
  onUpdateOwnedEquipment,
  onSellEquipment,
  soldEquipment,
}) {
  console.log("Received sold equipment:", soldEquipment);
  const [availableEquipment, setAvailableEquipment] = useState([]);

  const [currentTier, setCurrentTier] = useState(selectedTier);

  useEffect(() => {
    setCurrentTier(selectedTier);
  }, [selectedTier]);

  useEffect(() => {
    async function fetchData() {
      if (currentTier !== undefined) {
        try {
          const response = await import(
            `../public/data/equip_t${currentTier}.json`
          );
          const filteredEquipment = response.default.filter(
            (item) =>
              !ownedEquipment.some(
                (ownedItem) => ownedItem.item === item.item
              ) &&
              !soldEquipment.some((soldItem) => soldItem.item === item.item)
          );
          setAvailableEquipment(filteredEquipment);
          console.log("Sold Equipment in Equipment component:", soldEquipment);
        } catch (error) {
          console.error("Error loading equipment data:", error);
        }
      }
    }
    fetchData();
  }, [currentTier, ownedEquipment, soldEquipment]);
  const [availableFunds, setAvailableFunds] = useState(0);

  useEffect(() => {
    const fetchAvailableFunds = async () => {
      const userDocRef = doc(db, "campaigns", id);
      try {
        const docSnap = await getDoc(userDocRef);
  
        if (docSnap.exists()) {
          console.log("Fetched document data:", docSnap.data()); // Log the fetched data
          setAvailableFunds(docSnap.data().availableFunds);
        } else {
          console.log("No such document at path:", `campaigns/${id}`);
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };
  
    fetchAvailableFunds();
  }, [id]);

  const addFundsForTesting = () => {
    setAvailableFunds((prevFunds) => prevFunds + 1000);
  };

  const handleSellEquipment = async (item) => {
    const sellValue = item.cost / 2;
    setAvailableFunds((prevFunds) => prevFunds + sellValue);

    // Call the prop function to update parent component state
    onSellEquipment(item);
  };
  console.log("Available Funds: " + availableFunds)

  // Update Firebase whenever availableFunds changes
  useEffect(() => {
    const saveAvailableFunds = async () => {
      const userDocRef = doc(db, "campaigns", id);
      try {
        await updateDoc(userDocRef, {
          availableFunds: availableFunds,
        });
      } catch (error) {
        console.error("Error updating funds in Firebase:", error);
      }
    };

    saveAvailableFunds();
  }, [availableFunds, id]);

  const handleBuyEquipment = async (item) => {
    if (availableFunds >= item.cost) {
      setAvailableFunds((prevFunds) => prevFunds - item.cost);
      onUpdateOwnedEquipment(item);
      setAvailableEquipment((prevEquipment) =>
        prevEquipment.filter((e) => e !== item)
      );

      const userDocRef = doc(db, "campaigns", id);
      try {
        await updateDoc(userDocRef, {
          ownedEquipment: arrayUnion(item),
          availableFunds: availableFunds - item.cost,
        });
        console.log("Equipment purchased and saved to Firebase");
      } catch (error) {
        console.error("Error updating equipment in Firebase:", error);
      }
    } else {
      alert("Not enough funds to purchase this equipment!");
    }
  };
  return (
    <div className="">
      <div className="text-center my-4">
        <h2 className="font-bold text-xl">Available $: {availableFunds}</h2>
        <button
          className="bg-green-500 text-white p-2 rounded"
          onClick={addFundsForTesting}
        >
          Add $1000 (Test)
        </button>
      </div>
      <h2 className="font-bold underline text-center text-xl mt-6">
        Owned Equipment:
      </h2>
      {ownedEquipment && ownedEquipment.length > 0 ? (
        <ul className="w-full bg-gray-200 rounded-lg p-2">
          {ownedEquipment.map((item, index) => (
            <li
              key={`owned-${index}`}
              className="flex justify-between items-center p-2"
            >
              {item.item} - Cost: ${item.cost} - Sell For: ${item.cost / 2}
              <button
                className="bg-[#0FBDDB] ml-4 pl-2 pr-2 rounded-lg"
                onClick={() => handleSellEquipment(item)}
              >
                Sell
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">
          No equipment currently owned! Buy some equipment.
        </p>
      )}
      <h2 className="font-bold underline text-center text-xl">
        Available Equipment:
      </h2>
      <div className="flex justify-center my-4">
        {[1, 2, 3].map((tier) => (
          <button
            key={tier}
            className={`bg-[#416477] text-gray-200 text-xl font-bold p-2 m-2 rounded-lg hover:bg-slate-600 ${
              currentTier === tier ? "font-bold" : ""
            }`}
            onClick={() => setCurrentTier(tier)}
          >
            Tier {tier}
          </button>
        ))}
      </div>
      <div className="justify-center items-center">
        {availableEquipment && availableEquipment.length > 0 ? (
          <ul className="w-full bg-gray-200 rounded-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            {availableEquipment.map((item, index) => (
              <li
                className="mx-2 my-2 hover:underline hover:font-bold md:mx-4"
                key={`equipment-${index}`}
              >
                {item.item} - Cost: ${item.cost}
                <button
                  className="bg-[#0FBDDB] ml-4 pl-2 pr-2 rounded-lg"
                  onClick={() => handleBuyEquipment(item)}
                >
                  Buy
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No equipment found</p>
        )}
      </div>
      <h2 className="font-bold underline text-center text-xl mt-6">
        Sold Equipment:
      </h2>
      {soldEquipment && soldEquipment.length > 0 ? (
        <ul className="w-full bg-gray-200 rounded-lg p-2">
          {soldEquipment.map((item, index) => (
            <li
              key={`sold-${index}`}
              className="flex justify-between items-center p-2"
            >
              {item.item} - Cost: {item.cost}
            </li>
          ))}
        </ul>
      ) : (
        <p>No equipment sold yet.</p>
      )}
      <hr className="w-3/4 border-2 rounded-md border-gray-200 my-4"></hr>
      {/* Additional details or features for selected equipment can go here */}
    </div>
  );
}
export default Equipment;
