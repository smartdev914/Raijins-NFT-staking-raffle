import React, { useState, useEffect } from "react";
import RaffleCard from "../RaffleCard";
import cx from "classnames";
import Combobox from '../Combobox/Combobox';

// ================================================
const RAFFLE_OPTIONS = [
  { value: 0, label: 'ACTIVE RAFFLES' },
  { value: 1, label: 'RECENT RAFFLES' },
]

const ActiveRaffles = ({
  activeRaffles,
  isWalletConnected,
  connectWallet,
  onBuyRaffleBtn,
}) => {

  const regInputForCollectionId = React.useRef();
  const [selectedCollection, setSelectedCollection] = useState(RAFFLE_OPTIONS[0]);
  const liveRaffles = activeRaffles.filter((item) => !item.ended);
  const recentRaffles = activeRaffles.filter((item) => item.ended)

  useEffect(() => {

  }, [selectedCollection]);

  return (
    <div className="active-raffles">
      <div className="active-raffles-combo">
        <Combobox ref={regInputForCollectionId} options={RAFFLE_OPTIONS} value={selectedCollection} onChange={(selectedOption) => setSelectedCollection(selectedOption)} />
      </div>
      <h4
        className={cx("active-raffles-title", "italic", "text-primary", "mb-2")}
      >
        {
          selectedCollection.value === 0 ? 
            !liveRaffles.length ? <p className="text-center text-danger">No active raffles</p> : null
          :
            !recentRaffles.length ? <p className="text-center text-danger">No recent raffles</p> : null
        }
      </h4>
      <div className={cx("cards-row")}>
        {(selectedCollection.value === 0 ? liveRaffles : recentRaffles).map(
          (raffle) => (
            <RaffleCard
              raffle={raffle}
              key={raffle.id}
              isWalletConnected={isWalletConnected}
              connectWallet={connectWallet}
              onActionBtn={onBuyRaffleBtn}
            />
          )
        )}
      </div>
    </div>
  );
};

export default ActiveRaffles;
