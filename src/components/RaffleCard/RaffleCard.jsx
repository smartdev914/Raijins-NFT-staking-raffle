import cx from "classnames";
import RoundButton from "../RoundButton";
import "./RaffleCard.scss";
import { Link } from "react-router-dom";
import { formatAddress } from "../../utils/strings";
import { useMemo } from "react";
import CopyBtn from "../CopyBtn";

// ================================================

const RaffleCard = ({
  raffle,
  isWalletConnected,
  connectWallet,
  onActionBtn,
  isTopRaffles,
}) => {
  const formattedAddress = useMemo(() => {
    return formatAddress(raffle.winner);
  }, [raffle.winner]);

  return (
    <div className={cx("raffle-card")}>
      <div className={cx("card-media")}>
        <img src={`${raffle.image}`} alt={raffle.image} width="100%" />
      </div>
      <div className={cx("card-content")}>
        <h5 className={cx("title")} title={raffle.title}>
          {/* {formatRaffleCardTitle(raffle.title)} */}
          {raffle.title}
        </h5>
        <div className={cx("content")}>
          <p className={cx("value")}>
            value: {raffle.value ? raffle.value : "Not set!"}
          </p>
          {raffle.ended ? (
            <>
              {raffle.decided ? (
                <>
                  <p className={cx("winner", "text-center")}>
                    🏆 winner: {formattedAddress}
                    <CopyBtn text={raffle.winner} classes="ml-05" />
                  </p>
                  <p className={cx("remaining-time", "text-center")}>
                    next raffle: <br />
                    {raffle.remainingTimeNextRaffle.days}D{" "}
                    {raffle.remainingTimeNextRaffle.hours}
                    {"H "}
                    {raffle.remainingTimeNextRaffle.minutes}M
                  </p>
                </>
              ) : (
                <p className={cx("winner", "text-center")}>
                  🏆 winner: waiting result...
                </p>
              )}
            </>
          ) : (
            <>
              {
                isWalletConnected ?
                  <>
                    <p className={cx("winning-rate")}>1x ticket winning rate: <span className={cx("winning-rate-percentage")}>{raffle.winningRate1x}%</span></p>
                    
                    <p className={cx("winning-rate")}>your winning rate: <span className={cx("winning-rate-percentage")}>{raffle.winningRate}%</span></p>
                    
                  </>
                  :
                  <>
                    <p className={cx("winning-rate")}>1x ticket winning rate: <span className={cx("winning-rate-percentage")}>{raffle.winningRate1x}%</span></p>
                    
                  </>
              }
              <p className={cx("winner")}>🏆 winner: 1</p>
              <p className={cx("remaining-time")}>
                {raffle.remainingTime.days}D {raffle.remainingTime.hours}
                {"H "}
                {raffle.remainingTime.minutes}M left
              </p>
            </>
          )}
        </div>
      </div>
      {isTopRaffles ? (
        <>
          <div className={cx("card-action")}>
            <Link to="/raffles" className="round-btn primary">
              View
            </Link>
          </div>
        </>
      ) : (
        <>
          {!raffle.ended ? (
            isWalletConnected ? (
              <div className={cx("card-action")}>
                <RoundButton
                  variant="danger"
                  text="buy raffle"
                  onBtnClick={() => onActionBtn(raffle.id)}
                />
              </div>
            ) : (
              <div className={cx("card-action")}>
                <RoundButton
                  variant="danger"
                  text="connect wallet"
                  onBtnClick={connectWallet}
                />
              </div>
            )
          ) : null}
        </>
      )}
    </div>
  );
};

export default RaffleCard;
