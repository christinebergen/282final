function Equipment({ selectedTier, equipment, onTierSelection }) {
    return (
      <div>
        <button onClick={() => onTierSelection(1)}>Tier 1</button>
        <button onClick={() => onTierSelection(2)}>Tier 2</button>
        <button onClick={() => onTierSelection(3)}>Tier 3</button>
  
        {selectedTier && (
          <div>
            <h3>Equipment for Tier {selectedTier}</h3>
            {equipment.map((item, index) => (
              <p key={index}>{item.item} - {item.cost}</p>
            ))}
          </div>
        )}
      </div>
    );
  }
  