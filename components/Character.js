function Character({
  characterData,
  onCharacterClick,
  selectedCharacterDetails,
  onBuyAttachments,
  showAttachments,
}) {
  return (
    <div>
      <h2 className="font-bold underline text-center text-xl">
        Characters in play:
      </h2>
      <div className="grid grid-cols-2 md:flex md:flex-row justify-center items-center">
        {characterData && characterData.length > 0 ? (
          characterData.map((characterName, index) => (
            <button
              className="bg-[#0FBDDB] mx-2 my-2 md:mx-4 md:my-4 p-4 rounded-lg font-bold hover:bg-teal-600 focus:outline-none"
              key={`character-${index}`}
              onClick={() => onCharacterClick(characterName)}
            >
              {characterName}
            </button>
          ))
        ) : (
          <p>No characters found</p>
        )}
      </div>
      <hr className="w-3/4 border-2 rounded-md border-gray-200 my-4"></hr>

      {selectedCharacterDetails && (
        <div className="bg-gray-200 rounded-lg p-8 flex flex-col md:flex-row ">
          <div>
            <h2 className="text-xl font-bold">
              {selectedCharacterDetails.name}
            </h2>
            <h3>Available xp: {selectedCharacterDetails.xp}</h3>
            <div>
              <div className="flex flex-col ">
                <h3 className="text-xl font-bold mt-4"> Owned Items:</h3>
                <div className="flex flex-row items-center">
                  <p className="font-bold">
                    Starting Weapon: {selectedCharacterDetails.startingWeapon}
                  </p>
                  <button className="bg-[#416477] text-gray-200 font-bold ml-4 p-2 rounded-lg hover:bg-slate-600">
                    Sell
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="md:ml-10">
            <button
              onClick={onBuyAttachments}
              className="bg-[#0FBDDB] m-8 p-4 rounded-lg underline font-bold md:text-xl hover:italic hover:bg-teal-600"
            >
              View Class Cards
            </button>

            {showAttachments && selectedCharacterDetails.attachments && (
              <ul>
                {Object.entries(selectedCharacterDetails.attachments).map(
                  ([attachment, value]) => (
                    <li key={attachment}>
                      {attachment}, cost: {value}xp
                    </li>
                  )
                )}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default Character;
