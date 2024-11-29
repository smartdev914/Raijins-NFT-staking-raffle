import cx from "classnames";
import RaffleCard from "../RaffleCard";

// ================================================

const TopActiveRaffles = ({ activeRaffles, isWalletConnected }) => {
  return (
    <div className={cx("top-active-raffles-container")}>
      <h4 className={cx("top-active-raffles-title", "italic", "mb-3")}>
        {/* <span>{activeRaffles.length} top</span> active raffles */}
      </h4>
      {activeRaffles && activeRaffles.length ? (
        <div className={cx("cards-container")}>
          {activeRaffles.map((raffle) => (
            <RaffleCard raffle={raffle} key={raffle.id} isTopRaffles="true" isWalletConnected={isWalletConnected} />
          ))}
        </div>
      ) : (
        <div className="no-raffles-container">
          <p className={cx("text-center")}>No active raffles</p>
        </div>
      )}
    </div>
  );
};

export default TopActiveRaffles;
