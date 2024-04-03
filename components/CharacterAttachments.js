import React from "react";

function CharacterAttachments({
  selectedCharacterDetails,
  purchaseAttachment,
  
}) {
  console.log("Selected Character Details:", selectedCharacterDetails);
  const attachments = selectedCharacterDetails.attachments;
  // Check if there are no attachments
  if (!attachments || attachments.length === 0) {
    return <div>No attachments available</div>;
  }

  return (
    <div>
      <h4>Attachments:</h4>
      <ul>
        {attachments.map((attachment, index) => (
          <li key={index}>
            {attachment && attachment.name && attachment.cost && (
              <>
                {attachment.name}, cost: {attachment.cost}xp
                <button
                  className="bg-[#0FBDDB] ml-4 pl-2 pr-2 rounded-lg"
                  onClick={() =>
                    purchaseAttachment(
                      selectedCharacterDetails.name,
                      attachment.name,
                      attachment.cost
                    )
                  }
                >
                  Buy
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default CharacterAttachments;
