import React from "react";

function CharacterAttachments({
  selectedCharacterDetails,
  purchaseAttachment,
  ownedAttachments
}) {
  const availableAttachments = selectedCharacterDetails.attachments.filter(
    (attachment) => !ownedAttachments.some((owned) => owned.name === attachment.name)
  );
  console.log("Selected Character Details:", selectedCharacterDetails);
  const attachments = selectedCharacterDetails.attachments;
  // Check if there are no attachments
  if (!attachments || attachments.length === 0) {
    return <div>No attachments available</div>;
  }

  return (
    <div className="mt-8 md:ml-4 p-2 md:p-4 bg-gray-300 rounded-lg">
      <h4 className="font-bold underline pb-2">Class Cards Available to Buy:</h4>
      <ul>
        {availableAttachments.map((attachment, index) => (
          <li className="text-xs md:text-base lg:text-lg" key={index}>
            {attachment && attachment.name && attachment.cost && (
              <>
                {attachment.name}, cost: {attachment.cost}xp
                <button
                  className="bg-[#0FBDDB] ml-4 pl-2 pr-2 rounded-lg"
                  onClick={() =>
                    purchaseAttachment(attachment.name, attachment.cost)
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
