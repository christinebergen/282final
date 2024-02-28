import React from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig"; // Update with correct path

export default function CampaignDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchCampaign = async () => {
        const docRef = doc(db, "campaigns", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCampaign(docSnap.data());
        }
      };

      fetchCampaign();
    }
  }, [id]);

  if (!campaign) {
    return <div>Loading...</div>; // Or any other loading state representation
  }

  return (
    <div>
      <h1>{campaign.date}</h1>
      <p>{campaign.campaign}</p>
      <p>{campaign.characters}</p>
    </div>
  );
}
